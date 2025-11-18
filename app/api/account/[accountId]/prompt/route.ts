import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAccountPrompt } from '@/lib/utils/account';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ accountId: string }> }
) {
  const { accountId } = await params;
  const ai_prompt = await getAccountPrompt(accountId);
  return NextResponse.json({ ai_prompt });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ accountId: string }> }
) {
  try {
    const { accountId } = await params;
    const { ai_prompt } = await req.json();

    if (typeof ai_prompt !== 'string') {
      return NextResponse.json(
        { error: 'ai_prompt must be a string' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify user has access to this account
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has access to this account
    const { data: accessCheck, error: accessError } = await supabase
      .schema('agnopay')
      .from('accounts_users')
      .select('account_id')
      .eq('user_id', user.id)
      .eq('account_id', accountId)
      .single();

    if (accessError || !accessCheck) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to this account' },
        { status: 403 }
      );
    }

    // Update the prompt
    const { error: updateError } = await supabase
      .schema('agnopay')
      .from('accounts')
      .update({ ai_prompt })
      .eq('id', accountId);

    if (updateError) {
      console.error('Error updating account prompt:', updateError);
      return NextResponse.json(
        { error: 'Failed to update account prompt' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, ai_prompt });
  } catch (error) {
    console.error('Error in PUT /api/account/[accountId]/prompt:', error);
    return NextResponse.json(
      { error: 'Failed to update account prompt' },
      { status: 500 }
    );
  }
}
