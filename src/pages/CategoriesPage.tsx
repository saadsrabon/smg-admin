import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input, Label, Card, CardTitle } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';

const RESERVED_SLUGS = new Set(['all']);

export default function CategoriesPage() {
  const qc = useQueryClient();
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: api.getCategories,
  });

  const [slug, setSlug] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [error, setError] = useState('');

  const createMutation = useMutation({
    mutationFn: () => {
      const normalizedSlug = slug.trim().toLowerCase();
      if (RESERVED_SLUGS.has(normalizedSlug)) {
        throw new Error('Slug "all" is reserved for the gallery filter');
      }
      return api.createCategory({ slug: normalizedSlug, nameEn, nameBn, sortOrder: categories.length });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      setSlug('');
      setNameEn('');
      setNameBn('');
      setError('');
    },
    onError: (err: Error) => setError(err.message),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api.updateCategory(id, { isActive }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gallery Categories</h1>
      <p className="text-sm text-muted mb-4">
        &quot;All&quot; is automatic on the public gallery — create categories by name (Education, Health, etc.).
        Items are filtered by category slug.
      </p>
      <Card className="mb-6">
        <CardTitle>Add Category</CardTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div>
            <Label>Slug</Label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="education"
            />
          </div>
          <div>
            <Label>Name (EN)</Label>
            <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
          </div>
          <div>
            <Label>Name (BN)</Label>
            <Input value={nameBn} onChange={(e) => setNameBn(e.target.value)} />
          </div>
        </div>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        <Button
          className="mt-4"
          onClick={() => createMutation.mutate()}
          disabled={!slug.trim() || !nameEn.trim()}
        >
          Add Category
        </Button>
      </Card>
      <div className="space-y-2">
        {categories.map((c) => (
          <Card key={c.id} className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium">
                {c.nameEn} / {c.nameBn}
                {!c.isActive && <span className="ml-2 text-xs text-muted">(hidden)</span>}
              </p>
              <p className="text-sm text-muted">{c.slug}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleActiveMutation.mutate({ id: c.id, isActive: !c.isActive })}
              >
                {c.isActive ? 'Hide' : 'Show'}
              </Button>
              <Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate(c.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
