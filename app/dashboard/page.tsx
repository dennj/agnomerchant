'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function DashboardPage() {
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // Try to get name from user metadata, fallback to email or phone
          const name = user.user_metadata?.full_name ||
                      user.user_metadata?.name ||
                      user.email ||
                      user.phone ||
                      'User';
          setUserName(name);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Welcome, {userName}</h1>
    </div>
  );
}
