import { createClient } from '@/lib/supabase/server';

export async function getAccountId(userId: string): Promise<string | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .schema('agnopay')
    .from('accounts_users')
    .select('account_id')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data.account_id;
}
