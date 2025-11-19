import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { upsertProduct, getAllProducts, getCollectionInfo, deleteProduct } from '@/lib/qdrant/client';
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

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const accountId = searchParams.get('accountId');

    if (!accountId) {
      return NextResponse.json(
        { error: 'accountId query parameter is required' },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await req.json();
    const productId = body.id as number | undefined;
    const product: CreateProductInput = body;

    // Validate required fields
    if (!product.product_name || !product.description || !product.price) {
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
    const embeddingText = `${product.product_name} ${product.description}`;
    const embeddingResult = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: embeddingText,
      dimensions: 384, // Match Qdrant collection's text vector size
    });

    const embedding = embeddingResult.data[0].embedding;

    // Upsert the product (create if new, update if ID provided)
    const result = await upsertProduct(accountId, product, embedding, productId);

    return NextResponse.json({
      success: true,
      id: result.id,
      updated: !!productId,
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
    const accountId = searchParams.get('accountId');

    if (!accountId) {
      return NextResponse.json(
        { error: 'accountId query parameter is required' },
        { status: 400 }
      );
    }

    // Get collection info
    const collectionInfo = await getCollectionInfo();

    // Get products for this account only
    const products = await getAllProducts(accountId, limit);

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
    const productIdStr = searchParams.get('id');

    if (!productIdStr) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const productId = Number(productIdStr);
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Product ID must be a valid number' },
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
