import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { QdrantClient } from '@qdrant/js-client-rest';

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

async function searchProducts(query: string) {
  if (!openai || !qdrant) return null;

  try {
    // Generate embedding for the query with 384 dimensions to match Shulki5 text vector
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
      dimensions: 384, // Match the collection's text vector size
    });

    const vector = embedding.data[0].embedding;

    // Search Qdrant using named vector "text"
    const searchResult = await qdrant.search('Shulki5', {
      vector: {
        name: 'text',
        vector: vector,
      },
      limit: 4,
      with_payload: true,
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

export async function POST(req: Request) {
  // Fail fast: Check OpenAI client
  if (!openai) {
    return NextResponse.json(
      { error: 'ChatGPT is not configured. Please add OPENAI_API_KEY to .env' },
      { status: 503 }
    );
  }

  try {
    const { messages } = await req.json();

    // Fail fast: Validate input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1]?.content || '';

    // Check if this is a product search query
    const isProductSearch = /\b(show|find|search|looking for|recommend|shoes?|sneakers?|trainers?|adidas)\b/i.test(lastMessage);

    let products = null;
    if (isProductSearch && qdrant) {
      products = await searchProducts(lastMessage);
    }

    // Build context with products if found
    const systemMessage = products && products.length > 0
      ? `You are a helpful shopping assistant for an Adidas shoe store. I found ${products.length} relevant products for the user's query. Describe them briefly and mention that they can see the product cards below. Keep it concise (2-3 sentences).

Products found:
${products.map((p, i) => `${i + 1}. ${p.product_name} - $${p.price} - ${p.Short_description || p.Description?.substring(0, 100)}`).join('\n')}`
      : 'You are a helpful assistant for an Adidas shoe store. Help customers find shoes and answer questions. Keep responses concise and friendly.';

    // Call OpenAI with timeout
    const completion = await Promise.race([
      openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          ...messages
        ],
        max_tokens: 500,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 30000)
      )
    ]) as OpenAI.Chat.Completions.ChatCompletion;

    const reply = completion.choices[0]?.message?.content;

    // Fail fast: Check response
    if (!reply) {
      return NextResponse.json(
        { error: 'No response from ChatGPT' },
        { status: 500 }
      );
    }

    return NextResponse.json({ reply, products });
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
