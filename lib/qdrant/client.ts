import { QdrantClient } from '@qdrant/js-client-rest';
import { CreateProductInput } from '@/lib/types/product';

const COLLECTION_NAME = 'agnopay';
const VECTOR_NAME = 'text';
const VECTOR_SIZE = 384;

// Initialize Qdrant client
export function createQdrantClient() {
  const qdrantUrl = process.env.QDRANT_URL;
  const qdrantKey = process.env.QDRANT_API_KEY;

  if (!qdrantUrl || !qdrantKey) {
    throw new Error('QDRANT_URL and QDRANT_API_KEY must be configured');
  }

  return new QdrantClient({
    url: qdrantUrl,
    apiKey: qdrantKey,
  });
}

// Get collection info
export async function getCollectionInfo() {
  try {
    const qdrant = createQdrantClient();
    const collection = await qdrant.getCollection(COLLECTION_NAME);
    const vectors = collection.config.params.vectors as any;
    return {
      name: COLLECTION_NAME,
      pointsCount: collection.points_count,
      vectorSize: vectors?.[VECTOR_NAME]?.size || VECTOR_SIZE,
    };
  } catch (error) {
    console.error('Error getting collection info:', error);
    throw new Error('Failed to get collection info');
  }
}

// Get all products (scroll through collection)
export async function getAllProducts(merchantId: string, limit: number = 100) {
  try {
    const qdrant = createQdrantClient();

    const result = await qdrant.scroll(COLLECTION_NAME, {
      limit,
      with_payload: true,
      with_vector: false,
      filter: {
        must: [
          { key: 'merchant_id', match: { value: merchantId } }
        ]
      }
    });

    return result.points.map((point) => ({
      id: point.id as number,
      ...point.payload as Record<string, any>,
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products from Qdrant');
  }
}

// Upsert a product (create new or update existing)
export async function upsertProduct(
  merchantId: string,
  product: CreateProductInput,
  embedding: number[],
  productId?: number
) {
  try {
    const qdrant = createQdrantClient();

    // Generate a unique ID if not provided (timestamp-based)
    const id = productId || Date.now();

    // Upsert the product (creates if new, updates if exists)
    await qdrant.upsert(COLLECTION_NAME, {
      wait: true,
      points: [
        {
          id,
          vector: {
            [VECTOR_NAME]: embedding,
          },
          payload: {
            merchant_id: merchantId,
            product_name: product.product_name,
            price: product.price,
            description: product.description,
            image_url: product.image_url || '',
          },
        },
      ],
    });

    return { id, success: true };
  } catch (error) {
    console.error('Error upserting product:', error);
    throw new Error('Failed to upsert product to Qdrant');
  }
}

// Find product by ID
export async function findProductByID(merchantId: string, productId: number) {
  try {
    const qdrant = createQdrantClient();

    // Get the specific product by ID
    const result = await qdrant.retrieve(COLLECTION_NAME, {
      ids: [productId],
      with_payload: true,
      with_vector: false,
    });

    // Check if product exists and belongs to this merchant
    if (result.length === 0) {
      return null;
    }

    const point = result[0];
    const payload = point.payload as Record<string, unknown>;

    // Verify merchant ownership
    if (payload.merchant_id !== merchantId) {
      return null;
    }

    return {
      id: point.id as number,
      ...payload,
    };
  } catch (error) {
    console.error('Error finding product by ID:', error);
    return null;
  }
}


// Delete a product
export async function deleteProduct(productId: number) {
  try {
    const qdrant = createQdrantClient();

    await qdrant.delete(COLLECTION_NAME, {
      wait: true,
      points: [productId],
    });

    return { id: productId, success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product from Qdrant');
  }
}

// Search products (for testing)
export async function searchProducts(merchantId: string, query: string, embedding: number[], limit: number = 10) {
  try {
    const qdrant = createQdrantClient();

    const searchResult = await qdrant.search(COLLECTION_NAME, {
      vector: {
        name: VECTOR_NAME,
        vector: embedding,
      },
      limit,
      with_payload: true,
      filter: {
        must: [
          { key: 'merchant_id', match: { value: merchantId } }
        ]
      }
    });

    return searchResult.map((point) => ({
      id: point.id as number,
      score: point.score,
      ...point.payload as Record<string, any>,
    }));
  } catch (error) {
    console.error('Error searching products:', error);
    throw new Error('Failed to search products');
  }
}
