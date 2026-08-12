import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input, Label, Card, CardTitle } from '@/components/ui/input';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { Trash2, Upload } from 'lucide-react';

export default function GalleryPage() {
  const qc = useQueryClient();
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['gallery-items'],
    queryFn: api.getGalleryItems,
  });
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: api.getCategories,
  });

  const [categoryId, setCategoryId] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleBn, setTitleBn] = useState('');
  const [uploading, setUploading] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteGalleryItem(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gallery-items'] }),
  });

  const handleUpload = async (file: File) => {
    if (!categoryId) {
      alert('Select a category first');
      return;
    }
    setUploading(true);
    try {
      const { url, publicId } = await uploadToCloudinary(file, 'smg-gallery');
      await api.createGalleryItem({
        categoryId,
        type: 'photo',
        url,
        cloudinaryPublicId: publicId,
        titleEn: titleEn || file.name,
        titleBn: titleBn || titleEn || file.name,
        descriptionEn: '',
        descriptionBn: '',
        sortOrder: items.length,
        isPublished: true,
      });
      qc.invalidateQueries({ queryKey: ['gallery-items'] });
      setTitleEn('');
      setTitleBn('');
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gallery</h1>
      <Card className="mb-6">
        <CardTitle>Upload Image</CardTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <Label>Category</Label>
            <select
              className="flex h-10 w-full rounded-lg border border-border bg-white px-3 text-sm"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.nameEn}</option>
              ))}
            </select>
          </div>
          <div><Label>Title (EN)</Label><Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} /></div>
          <div><Label>Title (BN)</Label><Input value={titleBn} onChange={(e) => setTitleBn(e.target.value)} /></div>
        </div>
        <label className="mt-4 inline-block">
          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleUpload(f);
          }} />
          <Button variant="outline" disabled={uploading} asChild>
            <span><Upload className="h-4 w-4" />{uploading ? 'Uploading...' : 'Upload to Cloudinary'}</span>
          </Button>
        </label>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(({ item, category }) => (
          <Card key={item.id} className="p-0 overflow-hidden">
            <img src={item.url} alt={item.titleEn} className="w-full h-40 object-cover" />
            <div className="p-4">
              <p className="font-medium">{item.titleEn}</p>
              <p className="text-sm text-muted">{category.nameEn}</p>
              <Button variant="destructive" size="sm" className="mt-2" onClick={() => deleteMutation.mutate(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
