import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input, Textarea, Label, Card, CardTitle } from '@/components/ui/input';
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function FounderModalPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['founder-modal'],
    queryFn: api.getFounderModal,
  });

  const [contentEn, setContentEn] = useState<Record<string, string>>({});
  const [contentBn, setContentBn] = useState<Record<string, string>>({});
  useEffect(() => {
    if (data) {
      setContentEn((data.contentEn || {}) as Record<string, string>);
      setContentBn((data.contentBn || {}) as Record<string, string>);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => api.updateFounderModal({ contentEn, contentBn }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['founder-modal'] });
      alert('Saved successfully');
    },
  });

  if (isLoading) return <p>Loading...</p>;

  const fields = ['title', 'content', 'signature', 'closeButtonText'] as const;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Founder Modal</h1>
      <Card>
        <div className="flex justify-between mb-4">
          <CardTitle>Founder Message</CardTitle>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            Save
          </Button>
        </div>
        <TabsRoot defaultValue="en">
          <TabsList>
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="bn">Bengali</TabsTrigger>
          </TabsList>
          <TabsContent value="en">
            <div className="space-y-4">
              {fields.map((f) => (
                <div key={f}>
                  <Label>{f}</Label>
                  {f === 'content' || f === 'signature' ? (
                    <Textarea
                      rows={f === 'content' ? 12 : 3}
                      value={contentEn[f] || ''}
                      onChange={(e) => setContentEn({ ...contentEn, [f]: e.target.value })}
                    />
                  ) : (
                    <Input
                      value={contentEn[f] || ''}
                      onChange={(e) => setContentEn({ ...contentEn, [f]: e.target.value })}
                    />
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="bn">
            <div className="space-y-4">
              {fields.map((f) => (
                <div key={f}>
                  <Label>{f}</Label>
                  {f === 'content' || f === 'signature' ? (
                    <Textarea
                      rows={f === 'content' ? 12 : 3}
                      value={contentBn[f] || ''}
                      onChange={(e) => setContentBn({ ...contentBn, [f]: e.target.value })}
                    />
                  ) : (
                    <Input
                      value={contentBn[f] || ''}
                      onChange={(e) => setContentBn({ ...contentBn, [f]: e.target.value })}
                    />
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </TabsRoot>
      </Card>
    </div>
  );
}
