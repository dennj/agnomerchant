'use client';

import { useState, useEffect, useRef } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface EmailAuthFlowProps {
  onSuccess: () => void;
  initialEmail: string;
}

export function EmailAuthFlow({ onSuccess, initialEmail }: EmailAuthFlowProps) {
  const [otp, setOtp] = useState('');
  const hasSentOTP = useRef(false);

  useEffect(() => {
    if (!hasSentOTP.current) {
      hasSentOTP.current = true;
      sendOTP(initialEmail);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendOTP = async (emailToSend: string) => {
    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithOtp({
        email: emailToSend,
        options: { shouldCreateUser: true },
      });

      if (error) throw error;

      toast.success('Verification code sent', {
        description: `A 6-digit code was sent to ${emailToSend}`,
      });
    } catch (error) {
      console.error('Failed to send OTP:', error);
      toast.error('Failed to send code', {
        description: 'Please try again or check your email address.',
      });
    }
  };

  const handleVerifyOTP = async (otpValue: string) => {
    if (otpValue.length !== 6) return;

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.verifyOtp({
        email: initialEmail,
        token: otpValue,
        type: 'email',
      });

      if (error) throw error;

      toast.success('Authentication successful!');
      onSuccess();
    } catch (error) {
      console.error('Failed to verify OTP:', error);
      setOtp('');
      toast.error('Invalid code', {
        description: 'The code you entered is incorrect. Please try again.',
      });
    }
  };

  const handleOTPChange = (value: string) => {
    setOtp(value);
    if (value.length === 6) {
      handleVerifyOTP(value);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <InputOTP
          value={otp}
          onChange={handleOTPChange}
          maxLength={6}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="text-center text-sm">
        <button
          type="button"
          onClick={() => {
            setOtp('');
            sendOTP(initialEmail);
          }}
          className="text-muted-foreground hover:text-foreground transition-colors underline"
        >
          Didn't receive the code? Resend
        </button>
      </div>
    </div>
  );
}
