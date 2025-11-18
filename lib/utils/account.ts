import { createClient } from '@/lib/supabase/server';

export async function getAllAccounts(userId: string): Promise<{ id: string; name: string }[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .schema('agnopay')
    .from('accounts_users')
    .select('account_id, accounts(name)')
    .eq('user_id', userId);

  if (error || !data) {
    return [];
  }

  return data.map((row: any) => ({
    id: row.account_id,
    name: row.accounts?.name || row.account_id,
  }));
}

export async function getAccountPrompt(accountId: string): Promise<string> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .schema('agnopay')
      .from('accounts')
      .select('ai_prompt')
      .eq('id', accountId)
      .single();

    if (error) {
      console.error('Error fetching account prompt:', error);
      return '';
    }

    return data?.ai_prompt || '';
  } catch (error) {
    console.error('Failed to fetch account prompt:', error);
    return '';
  }
}

export async function getAccountChatbotSettings(accountId: string): Promise<{ isFullscreen: boolean }> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .schema('agnopay')
      .from('accounts')
      .select('ai_fullscreen')
      .eq('id', accountId)
      .single();

    if (error) {
      console.error('Error fetching chatbot settings:', error);
      return { isFullscreen: false };
    }

    return { isFullscreen: data?.ai_fullscreen || false };
  } catch (error) {
    console.error('Failed to fetch chatbot settings:', error);
    return { isFullscreen: false };
  }
}
