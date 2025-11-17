'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { LogOut, PackageSearch } from 'lucide-react';
import { useAuth } from '@/lib/contexts/auth-context';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface DashboardNavProps {
  user: User;
}

interface Account {
  id: string;
  name: string;
}

export function DashboardNav({ user }: DashboardNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/account');
      if (response.ok) {
        const data = await response.json();
        setAccounts(data.accounts || []);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

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

  const isAccountActive = (accountId: string) => {
    return pathname === `/dashboard/${accountId}`;
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

      <div className="space-y-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">
          Accounts
        </p>
        {accounts.map((account) => (
          <Button
            key={account.id}
            variant="ghost"
            className={cn(
              "w-full justify-start",
              isAccountActive(account.id) && "bg-gray-100"
            )}
            asChild
          >
            <a href={`/dashboard/${account.id}`}>
              <PackageSearch className="mr-2 h-4 w-4" />
              {account.name}
            </a>
          </Button>
        ))}
      </div>

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
