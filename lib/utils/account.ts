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
