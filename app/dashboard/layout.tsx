import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">AgnoMerchant</h1>
            <p className="text-sm text-gray-500 mt-1">Dashboard</p>
          </div>
          <DashboardNav user={user} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
