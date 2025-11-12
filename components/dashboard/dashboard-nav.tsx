'use client';

import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { LogOut, PackageSearch } from 'lucide-react';
import { useAuth } from '@/lib/contexts/auth-context';
import { toast } from 'sonner';

interface DashboardNavProps {
  user: User;
}

export function DashboardNav({ user }: DashboardNavProps) {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      router.push('/login');
    } catch (error) {
      toast.error('Failed to sign out');
      console.error('Sign out error:', error);
    }
  };

  return (
    <nav className="px-4 space-y-2">
      <div className="mb-6 px-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Signed in as
        </p>
        <p className="text-sm text-gray-700 mt-1 truncate">
          {user.phone || user.email || 'Merchant'}
        </p>
      </div>

      <Button
        variant="ghost"
        className="w-full justify-start"
        asChild
      >
        <a href="/dashboard">
          <PackageSearch className="mr-2 h-4 w-4" />
          Product Catalog
        </a>
      </Button>

      <div className="pt-4 mt-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </nav>
  );
}
