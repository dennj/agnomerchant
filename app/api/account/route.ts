import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAllAccounts } from '@/lib/utils/account';
import { getAllProducts } from '@/lib/qdrant/client';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const accounts = await getAllAccounts(user.id);
    return NextResponse.json({
      accounts,
      userId: user.id,
    });
  } catch (error) {
    console.error('Error fetching account:', error);
    return NextResponse.json(
      { error: 'Failed to fetch account' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name } = await request.json();

    // Create account
    const { data: account, error: accountError } = await supabase
      .schema('agnopay')
      .from('accounts')
      .insert({ name: name || 'New Account' })
      .select()
      .single();

    if (accountError) throw accountError;

    // Link user to account
    const { error: linkError } = await supabase
      .schema('agnopay')
      .from('accounts_users')
      .insert({ account_id: account.id, user_id: user.id });

    if (linkError) throw linkError;

    return NextResponse.json({ account });
  } catch (error) {
    console.error('Error creating account:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('id');

    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }

    // Check if account has products
    const products = await getAllProducts(accountId, 1);
    if (products.length > 0) {
      return NextResponse.json(
        { error: 'Account must have zero products to delete' },
        { status: 400 }
      );
    }

    // Check if prompt is empty
    const { data: account, error: promptError } = await supabase
      .schema('agnopay')
      .from('accounts')
      .select('ai_prompt')
      .eq('id', accountId)
      .single();

    if (promptError) throw promptError;

    if (account.ai_prompt && account.ai_prompt.trim() !== '') {
      return NextResponse.json(
        { error: 'Account prompt must be empty to delete' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .schema('agnopay')
      .from('accounts')
      .delete()
      .eq('id', accountId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}
