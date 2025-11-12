import { QdrantClient } from '@qdrant/js-client-rest';

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
      id: point.id.toString(),
      ...point.payload as Record<string, any>,
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products from Qdrant');
  }
}

// Add a new product to the collection
export async function addProduct(
  merchantId: string,
  product: {
    name: string;
    price: number;
    description: string;
    image_url?: string;
    sku?: string;
  },
  embedding: number[]
) {
  try {
    const qdrant = createQdrantClient();

    // Generate a unique ID (timestamp-based)
    const id = Date.now();

    // Insert the product
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
            Name: product.name,
            product_name: product.name,
            price: product.price,
            Short_description: product.description,
            Description: product.description,
            image_url: product.image_url || '',
            SKU: product.sku || `SKU-${id}`,
          },
        },
      ],
    });

    return { id: id.toString(), success: true };
  } catch (error) {
    console.error('Error adding product:', error);
    throw new Error('Failed to add product to Qdrant');
  }
}

// Find product by SKU
export async function findProductBySKU(merchantId: string, sku: string) {
  // If SKU is empty or invalid, return null immediately
  if (!sku || sku.trim() === '') {
    return null;
  }

  try {
    const qdrant = createQdrantClient();

    // Get all products for this merchant and filter manually
    // This is more reliable than using Qdrant's filter on optional fields
    const result = await qdrant.scroll(COLLECTION_NAME, {
      limit: 100,
      with_payload: true,
      with_vector: false,
      filter: {
        must: [
          { key: 'merchant_id', match: { value: merchantId } }
        ]
      }
    });

    // Find product with matching SKU
    const matchingPoint = result.points.find((point) => {
      const payload = point.payload as Record<string, any>;
      return payload.SKU === sku;
    });

    if (!matchingPoint) {
      return null;
    }

    return {
      id: matchingPoint.id.toString(),
      ...matchingPoint.payload as Record<string, any>,
    };
  } catch (error) {
    console.error('Error finding product by SKU:', error);
    // Return null instead of throwing to allow product creation to continue
    return null;
  }
}

// Update an existing product
export async function updateProduct(
  productId: string,
  merchantId: string,
  product: {
    name: string;
    price: number;
    description: string;
    image_url?: string;
    sku?: string;
  },
  embedding: number[]
) {
  try {
    const qdrant = createQdrantClient();

    // Update the product using upsert with the existing ID
    await qdrant.upsert(COLLECTION_NAME, {
      wait: true,
      points: [
        {
          id: parseInt(productId),
          vector: {
            [VECTOR_NAME]: embedding,
          },
          payload: {
            merchant_id: merchantId,
            Name: product.name,
            product_name: product.name,
            price: product.price,
            Short_description: product.description,
            Description: product.description,
            image_url: product.image_url || '',
            SKU: product.sku || `SKU-${productId}`,
          },
        },
      ],
    });

    return { id: productId, success: true };
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product in Qdrant');
  }
}

// Delete a product
export async function deleteProduct(productId: string) {
  try {
    const qdrant = createQdrantClient();

    await qdrant.delete(COLLECTION_NAME, {
      wait: true,
      points: [parseInt(productId)],
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
      id: point.id.toString(),
      score: point.score,
      ...point.payload as Record<string, any>,
    }));
  } catch (error) {
    console.error('Error searching products:', error);
    throw new Error('Failed to search products');
  }
}
