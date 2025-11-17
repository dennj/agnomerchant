import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAccountId } from '@/lib/utils/account';

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

    const accountId = await getAccountId(user.id);

    if (!accountId) {
      return NextResponse.json(
        { error: 'User not associated with any account' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      accountId,
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
