import { NextResponse } from 'next/server';
import { getAccountChatbotSettings } from '@/lib/utils/account';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ accountId: string }> }
) {
  try {
    const { accountId } = await params;
    const settings = await getAccountChatbotSettings(accountId);

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching account settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ accountId: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { accountId } = await params;
    const { name } = await request.json();

    const { error } = await supabase
      .schema('agnopay')
      .from('accounts')
      .update({ name })
      .eq('id', accountId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating account:', error);
    return NextResponse.json(
      { error: 'Failed to update account' },
      { status: 500 }
    );
  }
}
