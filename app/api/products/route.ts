import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { addProduct, getAllProducts, getCollectionInfo, findProductBySKU, updateProduct, deleteProduct } from '@/lib/qdrant/client';
import { CreateProductInput } from '@/lib/types/product';

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function POST(req: Request) {
  // Check if OpenAI is configured
  if (!openai) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured' },
      { status: 503 }
    );
  }

  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const product: CreateProductInput = await req.json();

    // Validate required fields
    if (!product.name || !product.description || !product.price) {
      return NextResponse.json(
        { error: 'Name, description, and price are required' },
        { status: 400 }
      );
    }

    if (product.price <= 0) {
      return NextResponse.json(
        { error: 'Price must be greater than 0' },
        { status: 400 }
      );
    }

    // Generate embedding for the product
    const embeddingText = `${product.name} ${product.description}`;
    const embeddingResult = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: embeddingText,
      dimensions: 384, // Match Qdrant collection's text vector size
    });

    const embedding = embeddingResult.data[0].embedding;

    // Add product to Qdrant with merchant_id
    const merchantId = user.id;

    // Check if a product with this SKU already exists
    let result;
    let isUpdate = false;

    if (product.sku) {
      const existingProduct = await findProductBySKU(merchantId, product.sku);

      if (existingProduct) {
        // Product with this SKU exists - update it
        result = await updateProduct(existingProduct.id, merchantId, product, embedding);
        isUpdate = true;
      } else {
        // No conflict - create new product
        result = await addProduct(merchantId, product, embedding);
      }
    } else {
      // No SKU provided - create new product
      result = await addProduct(merchantId, product, embedding);
    }

    return NextResponse.json({
      success: true,
      id: result.id,
      updated: isUpdate,
    });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to add product' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '100');

    // Get collection info
    const collectionInfo = await getCollectionInfo();

    // Get products for this merchant only
    const merchantId = user.id;
    const products = await getAllProducts(merchantId, limit);

    return NextResponse.json({
      success: true,
      products,
      collectionInfo,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse query parameters for product ID
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('id');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Delete the product
    await deleteProduct(productId);

    return NextResponse.json({
      success: true,
      id: productId,
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete product' },
      { status: 500 }
    );
  }
}
