import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { uploadToCloudinary } from '@/lib/cloudinary';
import type { PhotoItemContent } from '@/components/cms/PhotosSectionEditor';

const PHOTO_SLOTS = [
  { key: 'photo-0', label: 'Photo 1' },
  { key: 'photo-1', label: 'Photo 2' },
  { key: 'photo-2', label: 'Photo 3' },
  { key: 'photo-3', label: 'Photo 4' },
];

type SectionImage = {
  key: string;
  url: string;
  alt?: string;
  sortOrder: number;
};

function getItems(content: Record<string, unknown>): PhotoItemContent[] {
  const items = content.items as PhotoItemContent[] | undefined;
  if (Array.isArray(items) && items.length > 0) {
    return PHOTO_SLOTS.map((_, i) => ({
      title: String(items[i]?.title ?? ''),
      category: String(items[i]?.category ?? ''),
    }));
  }

  const images = content.images as { alt?: string; category?: string }[] | undefined;
  if (Array.isArray(images)) {
    return PHOTO_SLOTS.map((slot, i) => {
      const img = images.find((row) => (row as SectionImage).key === slot.key) ?? images[i];
      return {
        title: String(img?.alt ?? ''),
        category: String(img?.category ?? ''),
      };
    });
  }

  return PHOTO_SLOTS.map(() => ({ title: '', category: '' }));
}

function withUpdatedItem(
  content: Record<string, unknown>,
  index: number,
  patch: Partial<PhotoItemContent>
): Record<string, unknown> {
  const items = getItems(content);
  const next = items.map((item, i) => (i === index ? { ...item, ...patch } : item));
  return { ...content, items: next };
}

type Props = {
  contentEn: Record<string, unknown>;
  contentBn: Record<string, unknown>;
  onChangeEn: (content: Record<string, unknown>) => void;
  onChangeBn: (content: Record<string, unknown>) => void;
};

export function PhotosImageManager({ contentEn, contentBn, onChangeEn, onChangeBn }: Props) {
  const [uploading, setUploading] = useState<string | null>(null);

  const images = (contentEn.images as SectionImage[]) || [];

  const getImage = (key: string) => images.find((i) => i.key === key);

  const handleUpload = async (key: string, file: File) => {
    setUploading(key);
    try {
      const { url } = await uploadToCloudinary(file, 'smg-sections/photos');
      const existing = getImage(key);
      const sortOrder = PHOTO_SLOTS.findIndex((s) => s.key === key);
      const updated = existing
        ? images.map((i) => (i.key === key ? { ...i, url } : i))
        : [...images, { key, url, sortOrder }];

      onChangeEn({ ...contentEn, images: updated });
      onChangeBn({ ...contentBn, images: updated });
    } finally {
      setUploading(null);
    }
  };

  const itemsEn = getItems(contentEn);
  const itemsBn = getItems(contentBn);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        Upload images here and set each photo&apos;s title and subtitle. Image files are shared across EN and BN;
        captions are edited per language below each photo.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {PHOTO_SLOTS.map((slot, index) => {
          const img = getImage(slot.key);
          const en = itemsEn[index];
          const bn = itemsBn[index];

          return (
            <div key={slot.key} className="rounded-xl border border-border p-4 space-y-4">
              <p className="text-sm font-semibold">{slot.label}</p>

              {img?.url ? (
                <img src={img.url} alt={slot.label} className="w-full h-40 object-cover rounded-lg" />
              ) : (
                <div className="w-full h-40 bg-slate-100 rounded-lg flex items-center justify-center text-muted text-sm">
                  No image uploaded
                </div>
              )}

              <label>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUpload(slot.key, f);
                  }}
                />
                <Button variant="outline" size="sm" asChild disabled={uploading === slot.key}>
                  <span>
                    <Upload className="h-4 w-4" />
                    {uploading === slot.key ? 'Uploading...' : 'Upload image'}
                  </span>
                </Button>
              </label>

              <div className="space-y-3 pt-2 border-t border-border">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">English</p>
                <div>
                  <Label htmlFor={`${slot.key}-title-en`}>Photo title</Label>
                  <Input
                    id={`${slot.key}-title-en`}
                    value={en.title}
                    onChange={(e) => onChangeEn(withUpdatedItem(contentEn, index, { title: e.target.value }))}
                    placeholder="Education Program"
                  />
                </div>
                <div>
                  <Label htmlFor={`${slot.key}-subtitle-en`}>Photo subtitle</Label>
                  <Input
                    id={`${slot.key}-subtitle-en`}
                    value={en.category}
                    onChange={(e) => onChangeEn(withUpdatedItem(contentEn, index, { category: e.target.value }))}
                    placeholder="Education"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-border">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Bengali</p>
                <div>
                  <Label htmlFor={`${slot.key}-title-bn`}>Photo title</Label>
                  <Input
                    id={`${slot.key}-title-bn`}
                    value={bn.title}
                    onChange={(e) => onChangeBn(withUpdatedItem(contentBn, index, { title: e.target.value }))}
                    placeholder="শিক্ষা কার্যক্রম"
                  />
                </div>
                <div>
                  <Label htmlFor={`${slot.key}-subtitle-bn`}>Photo subtitle</Label>
                  <Input
                    id={`${slot.key}-subtitle-bn`}
                    value={bn.category}
                    onChange={(e) => onChangeBn(withUpdatedItem(contentBn, index, { category: e.target.value }))}
                    placeholder="শিক্ষা"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
