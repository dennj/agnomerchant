'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

interface UserManagementProps {
  accountId: string;
  users: { id: string; email: string }[];
  currentUserId: string;
  onUpdate: () => void;
}

export function UserManagement({ accountId, users, currentUserId, onUpdate }: UserManagementProps) {
  const [newEmail, setNewEmail] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const addUser = async () => {
    if (!newEmail.trim()) return;

    setIsAdding(true);
    try {
      const response = await fetch(`/api/account/${accountId}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('User added');
        setNewEmail('');
        onUpdate();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to add user');
      console.error('Error adding user:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const removeUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/account/${accountId}/users?userId=${encodeURIComponent(userId)}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('User removed');
        onUpdate();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to remove user');
      console.error('Error removing user:', error);
    }
  };

  return (
    <div className="border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">User Management</h2>

      {/* Add User Form */}
      <div className="mb-6 flex gap-2">
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addUser()}
          placeholder="Enter email to add user"
          className="flex-1 px-3 py-2 border rounded-md"
          disabled={isAdding}
        />
        <Button
          onClick={addUser}
          disabled={isAdding || !newEmail.trim()}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Users Table */}
      <div className="border rounded-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-4 py-8 text-center text-gray-500">
                  No users with access
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{user.email}</td>
                  <td className="px-4 py-3 text-right">
                    {user.id !== currentUserId && (
                      <button
                        onClick={() => removeUser(user.id)}
                        className="p-1 hover:bg-red-100 rounded text-red-600"
                        title="Remove user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
