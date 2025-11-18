import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ accountId: string }> }
) {
  try {
    const supabase = await createClient();
    const serviceClient = createServiceClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { accountId } = await params;
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Find user by email
    const { data: { users }, error: userError } = await serviceClient.auth.admin.listUsers();

    if (userError) throw userError;

    const targetUser = users.find(u => u.email === email);

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Add user to account (unique constraint will prevent duplicates)
    const { error: insertError } = await supabase
      .schema('agnopay')
      .from('accounts_users')
      .insert({ account_id: accountId, user_id: targetUser.id });

    if (insertError) throw insertError;

    return NextResponse.json({ success: true, email });
  } catch (error) {
    console.error('Error adding user:', error);
    return NextResponse.json(
      { error: 'Failed to add user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Delete user from account
    const { error: deleteError } = await supabase
      .schema('agnopay')
      .from('accounts_users')
      .delete()
      .eq('account_id', accountId)
      .eq('user_id', userId);

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing user:', error);
    return NextResponse.json(
      { error: 'Failed to remove user' },
      { status: 500 }
    );
  }
}
