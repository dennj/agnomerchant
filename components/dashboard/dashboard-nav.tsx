'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { LogOut, PackageSearch, Plus, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '@/lib/contexts/auth-context';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface DashboardNavProps {
  user: User;
}

interface Account {
  id: string;
  name: string;
  users?: { id: string; email: string }[];
}

export function DashboardNav({ user }: DashboardNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/account');
      if (!response.ok) throw new Error('Failed to fetch accounts');

      const data = await response.json();
      setAccounts(data.accounts);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw error;
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchAccounts();
  }, []);

  const startCreating = () => {
    setIsCreating(true);
    setNewAccountName('');
  };

  const cancelCreating = () => {
    setIsCreating(false);
    setNewAccountName('');
  };

  const createAccount = async () => {
    if (!newAccountName.trim()) return;

    try {
      const response = await fetch('/api/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newAccountName })
      });
      if (response.ok) {
        toast.success('Account created');
        setIsCreating(false);
        setNewAccountName('');
        await fetchAccounts();
      } else {
        toast.error('Failed to create account');
      }
    } catch (error) {
      toast.error('Failed to create account');
      console.error('Error creating account:', error);
    }
  };

  const startEdit = (account: Account) => {
    setEditingId(account.id);
    setEditName(account.name);
  };

  const saveEdit = async (accountId: string) => {
    if (!editName.trim()) return;

    try {
      const response = await fetch(`/api/account/${accountId}/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName })
      });
      if (response.ok) {
        toast.success('Account updated');
        setEditingId(null);
        await fetchAccounts();
      } else {
        toast.error('Failed to update account');
      }
    } catch (error) {
      toast.error('Failed to update account');
      console.error('Error updating account:', error);
    }
  };

  const deleteAccount = async (accountId: string) => {
    try {
      const response = await fetch(`/api/account?id=${accountId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Account deleted');
        await fetchAccounts();
        router.push('/dashboard');
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to delete account');
      console.error('Error deleting account:', error);
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
          <div key={account.id} className="relative group">
            {editingId === account.id ? (
              <div className="flex items-center gap-1 px-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={() => saveEdit(account.id)}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit(account.id)}
                  className="flex-1 px-2 py-1 text-sm border rounded"
                  autoFocus
                />
              </div>
            ) : (
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start pr-8",
                  isAccountActive(account.id) && "bg-gray-100"
                )}
                asChild
              >
                <a href={`/dashboard/${account.id}`}>
                  <PackageSearch className="mr-2 h-4 w-4" />
                  {account.name}
                </a>
              </Button>
            )}
            {editingId !== account.id && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    startEdit(account);
                  }}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Pencil className="h-3 w-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    deleteAccount(account.id);
                  }}
                  className="p-1 hover:bg-red-100 rounded text-red-600"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        ))}
        {isCreating ? (
          <div className="flex items-center gap-1 px-2">
            <input
              type="text"
              value={newAccountName}
              onChange={(e) => setNewAccountName(e.target.value)}
              onBlur={cancelCreating}
              onKeyDown={(e) => {
                if (e.key === 'Enter') createAccount();
                if (e.key === 'Escape') cancelCreating();
              }}
              placeholder="Account name"
              className="flex-1 px-2 py-1 text-sm border rounded"
              autoFocus
            />
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={startCreating}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Account
          </Button>
        )}
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
