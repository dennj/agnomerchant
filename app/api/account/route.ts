import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAllAccounts } from '@/lib/utils/account';

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
