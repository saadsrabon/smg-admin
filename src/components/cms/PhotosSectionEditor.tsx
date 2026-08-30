import { Input, Textarea, Label } from '@/components/ui/input';

export type PhotoItemContent = {
  title: string;
  category: string;
};

type Props = {
  content: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
};

export function PhotosSectionEditor({ content, onChange }: Props) {
  const update = (key: string, value: string) => {
    onChange({ ...content, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-slate-800">Section heading</h4>
        <p className="text-xs text-muted mt-1">
          Main title and subtitle above the photo grid. Upload photos and edit captions in the Photos tab.
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
  );
}
