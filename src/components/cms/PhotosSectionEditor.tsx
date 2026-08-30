import { Input, Textarea, Label } from '@/components/ui/input';

export type PhotoItemContent = {
  title: string;
  category: string;
};

type Props = {
  content: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
};

const PHOTO_SLOT_LABELS = ['Photo 1 (large)', 'Photo 2', 'Photo 3', 'Photo 4'];

function resolvePhotoItems(content: Record<string, unknown>): PhotoItemContent[] {
  if (Array.isArray(content.items)) {
    return (content.items as PhotoItemContent[]).map((item) => ({
      title: String(item.title ?? ''),
      category: String(item.category ?? ''),
    }));
  }

  const images = content.images;
  if (Array.isArray(images)) {
    return images.map((img) => {
      const row = img as { alt?: string; category?: string };
      return {
        title: String(row.alt ?? ''),
        category: String(row.category ?? ''),
      };
    });
  }

  return [];
}

export function PhotosSectionEditor({ content, onChange }: Props) {
  const items = PHOTO_SLOT_LABELS.map((_, index) => {
    const item = resolvePhotoItems(content)[index];
    return item ?? { title: '', category: '' };
  });

  const update = (key: string, value: string) => {
    onChange({ ...content, [key]: value });
  };

  const updateItem = (index: number, patch: Partial<PhotoItemContent>) => {
    const next = items.map((item, i) => (i === index ? { ...item, ...patch } : item));
    onChange({ ...content, items: next });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-800">Section heading</h4>
          <p className="text-xs text-muted mt-1">
            Main title and subtitle above the photo grid (&quot;Our Programs in Pictures&quot;).
          </p>
        </div>

        <div>
          <Label htmlFor="photos-eyebrow">Eyebrow</Label>
          <Input
            id="photos-eyebrow"
            value={String(content.eyebrow ?? '')}
            onChange={(e) => update('eyebrow', e.target.value)}
            placeholder="In the field"
          />
        </div>

        <div>
          <Label htmlFor="photos-title">Section title</Label>
          <Input
            id="photos-title"
            value={String(content.title ?? '')}
            onChange={(e) => update('title', e.target.value)}
            placeholder="Our Programs in Pictures"
          />
        </div>

        <div>
          <Label htmlFor="photos-subtitle">Section subtitle</Label>
          <Textarea
            id="photos-subtitle"
            value={String(content.subtitle ?? '')}
            onChange={(e) => update('subtitle', e.target.value)}
            rows={3}
            placeholder="Glimpses of our community development programs in Vogdaburi"
          />
        </div>

        <div>
          <Label htmlFor="photos-view-gallery">Gallery button text</Label>
          <Input
            id="photos-view-gallery"
            value={String(content.viewGalleryText ?? '')}
            onChange={(e) => update('viewGalleryText', e.target.value)}
            placeholder="View Full Gallery"
          />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-border">
        <div>
          <h4 className="text-sm font-semibold text-slate-800">Photo captions</h4>
          <p className="text-xs text-muted mt-1">
            Title and category on each photo card. Upload images in the Images tab.
          </p>
        </div>

        {PHOTO_SLOT_LABELS.map((label, index) => {
          const item = items[index];
          return (
            <div key={label} className="rounded-xl border border-border bg-slate-50/80 p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
              <div>
                <Label htmlFor={`photo-title-${index}`}>Photo title</Label>
                <Input
                  id={`photo-title-${index}`}
                  value={item.title}
                  onChange={(e) => updateItem(index, { title: e.target.value })}
                  placeholder="Education Program"
                />
              </div>
              <div>
                <Label htmlFor={`photo-category-${index}`}>Photo category / subtitle</Label>
                <Input
                  id={`photo-category-${index}`}
                  value={item.category}
                  onChange={(e) => updateItem(index, { category: e.target.value })}
                  placeholder="Education"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
