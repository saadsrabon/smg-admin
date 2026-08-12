import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input, Label, Card, CardTitle } from '@/components/ui/input';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { Trash2, Upload } from 'lucide-react';

export default function CategoriesPage() {
  const qc = useQueryClient();
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: api.getCategories,
  });

  const [slug, setSlug] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [nameBn, setNameBn] = useState('');

  const createMutation = useMutation({
    mutationFn: () => api.createCategory({ slug, nameEn, nameBn, sortOrder: categories.length }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      setSlug('');
      setNameEn('');
      setNameBn('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gallery Categories</h1>
      <Card className="mb-6">
        <CardTitle>Add Category</CardTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div><Label>Slug</Label><Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="education" /></div>
          <div><Label>Name (EN)</Label><Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} /></div>
          <div><Label>Name (BN)</Label><Input value={nameBn} onChange={(e) => setNameBn(e.target.value)} /></div>
        </div>
        <Button className="mt-4" onClick={() => createMutation.mutate()} disabled={!slug || !nameEn}>
          Add Category
        </Button>
      </Card>
      <div className="space-y-2">
        {categories.map((c) => (
          <Card key={c.id} className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium">{c.nameEn} / {c.nameBn}</p>
              <p className="text-sm text-muted">{c.slug}</p>
            </div>
            <Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate(c.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
