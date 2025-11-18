import { NextResponse } from 'next/server';
import { getAccountChatbotSettings } from '@/lib/utils/account';

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
