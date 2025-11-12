'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EmailAuthFlow } from '@/components/auth/email-auth-flow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [showOTP, setShowOTP] = useState(false);

  const handleSendOTP = () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setShowOTP(true);
  };

  const handleAuthSuccess = () => {
    router.push('/dashboard');
  };

  if (showOTP) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Verify Your Email</CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to {email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EmailAuthFlow
              initialEmail={email}
              onSuccess={handleAuthSuccess}
            />
            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => setShowOTP(false)}
            >
              Change email address
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Merchant Dashboard Login</CardTitle>
          <CardDescription>
            Enter your email address to receive a verification code
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendOTP();
                }
              }}
            />
          </div>
          <Button
            onClick={handleSendOTP}
            className="w-full"
          >
            Send Verification Code
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
