import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadToCloudinary } from '@/lib/cloudinary';

type SectionImage = { key: string; url: string; alt?: string; sortOrder: number };

export function SectionImageManager({
  images,
  slots,
  folder,
  onChange,
}: {
  images: SectionImage[];
  slots: { key: string; label: string }[];
  folder: string;
  onChange: (images: SectionImage[]) => void;
}) {
  const [uploading, setUploading] = useState<string | null>(null);

  const getImage = (key: string) => images.find((i) => i.key === key);

  const handleUpload = async (key: string, file: File) => {
    setUploading(key);
    try {
      const { url } = await uploadToCloudinary(file, folder);
      const existing = getImage(key);
      const updated = existing
        ? images.map((i) => (i.key === key ? { ...i, url } : i))
        : [...images, { key, url, sortOrder: slots.findIndex((s) => s.key === key) }];
      onChange(updated);
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {slots.map((slot) => {
        const img = getImage(slot.key);
        return (
          <div key={slot.key} className="border border-border rounded-lg p-4">
            <p className="text-sm font-medium mb-2">{slot.label}</p>
            {img?.url ? (
              <img src={img.url} alt={slot.label} className="w-full h-32 object-cover rounded-lg mb-2" />
            ) : (
              <div className="w-full h-32 bg-slate-100 rounded-lg mb-2 flex items-center justify-center text-muted text-sm">
                No image
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
                  {uploading === slot.key ? 'Uploading...' : 'Upload'}
                </span>
              </Button>
            </label>
          </div>
        );
      })}
    </div>
  );
}

export const SECTION_IMAGE_SLOTS: Record<string, { key: string; label: string }[]> = {
  hero: [
    { key: 'slide-0', label: 'Slide 1' },
    { key: 'slide-1', label: 'Slide 2' },
    { key: 'slide-2', label: 'Slide 3' },
    { key: 'slide-3', label: 'Slide 4' },
  ],
  about: [{ key: 'video-preview', label: 'Video Preview' }],
  programs: [
    { key: 'education', label: 'Education' },
    { key: 'health', label: 'Health' },
    { key: 'social', label: 'Social' },
    { key: 'economic', label: 'Economic' },
  ],
  impact: [{ key: 'featured-story', label: 'Featured Story' }],
  photos: [
    { key: 'photo-0', label: 'Photo 1' },
    { key: 'photo-1', label: 'Photo 2' },
    { key: 'photo-2', label: 'Photo 3' },
    { key: 'photo-3', label: 'Photo 4' },
  ],
  activities: [
    { key: 'activity-0', label: 'Activity 1' },
    { key: 'activity-1', label: 'Activity 2' },
    { key: 'activity-2', label: 'Activity 3' },
    { key: 'activity-3', label: 'Activity 4' },
  ],
};
