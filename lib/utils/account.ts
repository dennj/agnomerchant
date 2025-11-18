import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

export async function getAllAccounts(userId: string): Promise<{ id: string; name: string; users: { id: string; email: string }[] }[]> {
  const supabase = await createClient();
  const serviceClient = createServiceClient();

  // Get accounts with all their users in a single query using nested select
  const { data: userAccounts, error } = await supabase
    .schema('agnopay')
    .from('accounts_users')
    .select('account_id, accounts(name, accounts_users(user_id))')
    .eq('user_id', userId);

  if (error) throw error;

  // Collect all unique user IDs across all accounts
  const uniqueUserIds = new Set<string>();
  for (const row of userAccounts) {
    const accountUsers = (row.accounts as any).accounts_users;
    for (const au of accountUsers) {
      uniqueUserIds.add(au.user_id);
    }
  }

  // Fetch emails for all unique users
  const userEmailMap = new Map<string, string>();
  for (const uid of uniqueUserIds) {
    const { data: authUser, error: userError } = await serviceClient.auth.admin.getUserById(uid);
    if (userError) throw userError;
    userEmailMap.set(uid, authUser.user.email!);
  }

  // Build final result
  return userAccounts.map((row) => {
    const accountData = row.accounts as any;
    const accountUsers = accountData.accounts_users;
    const users = accountUsers.map((au: { user_id: string }) => ({
      id: au.user_id,
      email: userEmailMap.get(au.user_id)!
    }));

    return {
      id: row.account_id,
      name: accountData.name,
      users,
    };
  });
}

export async function getAccountPrompt(accountId: string): Promise<string> {
  // Use service client to allow anonymous users to fetch public AI prompts
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .schema('agnopay')
    .from('accounts')
    .select('ai_prompt')
    .eq('id', accountId)
    .single();

  if (error) throw error;

  return data.ai_prompt || '';
}

export async function getAccountChatbotSettings(accountId: string): Promise<{ isFullscreen: boolean }> {
  // Use service client to allow anonymous users to fetch public chatbot settings
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .schema('agnopay')
    .from('accounts')
    .select('ai_fullscreen')
    .eq('id', accountId)
    .single();

  if (error) throw error;

  return { isFullscreen: data.ai_fullscreen || false };
}
