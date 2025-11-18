'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export function PromptEditor({ accountId }: { accountId: string }) {
  const [prompt, setPrompt] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/account/${accountId}/prompt`)
      .then(res => res.json())
      .then(data => setPrompt(data.ai_prompt || ''))
      .catch(console.error);
  }, [accountId]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch(`/api/account/${accountId}/prompt`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ai_prompt: prompt }),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Prompt</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[150px]"
        />
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </CardContent>
    </Card>
  );
}
