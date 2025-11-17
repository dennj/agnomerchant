import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { QdrantClient } from '@qdrant/js-client-rest';
import { createClient } from '@/lib/supabase/server';
import { getAllProducts } from '@/lib/qdrant/client';
import { Product } from '@/lib/types/product';
import { getAccountId } from '@/lib/utils/account';

// Fail fast: Check API keys at module level
const openaiKey = process.env.OPENAI_API_KEY;
const qdrantUrl = process.env.QDRANT_URL;
const qdrantKey = process.env.QDRANT_API_KEY;

if (!openaiKey) console.error('OPENAI_API_KEY not configured');
if (!qdrantUrl) console.error('QDRANT_URL not configured');
if (!qdrantKey) console.error('QDRANT_API_KEY not configured');

const openai = openaiKey ? new OpenAI({ apiKey: openaiKey }) : null;
const qdrant = (qdrantUrl && qdrantKey)
  ? new QdrantClient({ url: qdrantUrl, apiKey: qdrantKey })
  : null;

async function searchProducts(accountId: string, query: string) {
  if (!openai || !qdrant) return null;

  try {
    // Generate embedding for the query with 384 dimensions to match agnopay text vector
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
      dimensions: 384, // Match the collection's text vector size
    });

    const vector = embedding.data[0].embedding;

    // Search Qdrant using named vector "text" with account filter
    const searchResult = await qdrant.search('agnopay', {
      vector: {
        name: 'text',
        vector: vector,
      },
      limit: 4,
      with_payload: true,
      filter: {
        must: [
          { key: 'merchant_id', match: { value: accountId } } //TODO merchant_id is saved in qdrant but should be replaced by account_id for consistency or accounts table shoud be renamed to merchants
        ]
      }
    });

    return searchResult.map((point) => ({
      id: point.id.toString(),
      score: point.score,
      ...point.payload as Record<string, any>,
    }));
  } catch (error) {
    console.error('Product search error:', error);
    return null;
  }
}

// Define the function tool for searching products
const searchProductsTool = {
  type: 'function' as const,
  function: {
    name: 'search_products',
    description: 'Search the product catalog for courses, events, or products based on a query. Use this when the user asks about specific items, wants to see available options, or needs product recommendations.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query describing what the user is looking for (e.g., "leadership courses", "events in São Paulo", "financial planning")',
        },
      },
      required: ['query'],
    },
  },
};

export async function POST(req: Request) {
  // Fail fast: Check OpenAI client
  if (!openai) {
    return NextResponse.json(
      { error: 'ChatGPT is not configured. Please add OPENAI_API_KEY to .env' },
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

    // Get account_id from pivot table
    const accountId = await getAccountId(user.id);
    if (!accountId) {
      return NextResponse.json(
        { error: 'User not associated with any account' },
        { status: 403 }
      );
    }

    const { messages } = await req.json();

    // Fail fast: Validate input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    // Fetch all products for catalog overview (once per conversation)
    let allProducts: Partial<Product>[] = [];
    try {
      allProducts = await getAllProducts(accountId, 100);
    } catch (error) {
      console.error('Failed to load catalog:', error);
    }

    // Create catalog overview for context
    const catalogOverview = allProducts.length > 0
      ? `\n\nAvailable Catalog (${allProducts.length} items):\n${allProducts.map((p) => `- ${p.product_name || p.Name}`).join('\n')}`
      : '';

    const systemMessage = `You are a helpful shopping assistant for a merchant selling courses, events, and products. Help customers find what they're looking for and answer their questions.
${catalogOverview}

When a user asks about specific products, courses, or events, use the search_products function to find relevant items. Keep responses concise and friendly.`;

    // Call OpenAI with function calling
    const completion = await Promise.race([
      openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          ...messages
        ],
        tools: [searchProductsTool],
        tool_choice: 'auto',
        max_tokens: 500,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 30000)
      )
    ]) as OpenAI.Chat.Completions.ChatCompletion;

    const message = completion.choices[0]?.message;

    // Check if the model wants to call a function
    if (message?.tool_calls && message.tool_calls.length > 0) {
      const toolCall = message.tool_calls[0];

      if (toolCall.type === 'function' && toolCall.function.name === 'search_products') {
        const args = JSON.parse(toolCall.function.arguments);
        const searchQuery = args.query;

        // Execute the search
        const products = await searchProducts(accountId, searchQuery);

        // Create function result message
        const functionResult = products && products.length > 0
          ? `Found ${products.length} relevant items:\n${products.map((p: Record<string, unknown>, i: number) => {
            const name = (p.product_name || p.Name) as string;
            const price = Number(p.price) / 100;
            const desc = (p.Short_description || (p.Description as string)?.substring(0, 100)) as string;
            return `${i + 1}. ${name} - R$ ${price.toFixed(2)} - ${desc}`;
          }).join('\n')}`
          : 'No matching products found in the catalog.';

        // Call LLM again with function result
        const secondCompletion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemMessage },
            ...messages,
            message,
            {
              role: 'tool',
              tool_call_id: toolCall.id,
              content: functionResult,
            },
          ],
          max_tokens: 500,
        });

        const reply = secondCompletion.choices[0]?.message?.content;

        if (!reply) {
          return NextResponse.json(
            { error: 'No response from ChatGPT' },
            { status: 500 }
          );
        }

        return NextResponse.json({ reply, products });
      }
    }

    // No function call - just return the reply
    const reply = message?.content;

    if (!reply) {
      return NextResponse.json(
        { error: 'No response from ChatGPT' },
        { status: 500 }
      );
    }

    return NextResponse.json({ reply, products: null });
  } catch (error) {
    // Fail fast: Handle errors
    console.error('Chat error:', error);

    if (error instanceof Error && error.message === 'Request timeout') {
      return NextResponse.json(
        { error: 'Request timed out. Please try again.' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to get response from ChatGPT' },
      { status: 500 }
    );
  }
}
