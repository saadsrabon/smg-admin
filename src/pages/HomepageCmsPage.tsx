import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input, Textarea, Label, Card, CardTitle } from '@/components/ui/input';
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SectionImageManager, SECTION_IMAGE_SLOTS } from '@/components/cms/SectionImageManager';
import { ImpactSectionEditor } from '@/components/cms/ImpactSectionEditor';
import { PhotosSectionEditor } from '@/components/cms/PhotosSectionEditor';

const SECTIONS = [
  { key: 'hero', label: 'Hero' },
  { key: 'about', label: 'About' },
  { key: 'programs', label: 'Programs' },
  { key: 'impact', label: 'Impact' },
  { key: 'photos', label: 'Photos' },
  { key: 'activities', label: 'Activities' },
  { key: 'contact', label: 'Contact' },
  { key: 'footer', label: 'Footer' },
];

function JsonFieldEditor({
  content,
  onChange,
}: {
  content: Record<string, unknown>;
  onChange: (c: Record<string, unknown>) => void;
}) {
  const entries = Object.entries(content).filter(([k]) => k !== 'images');

  const update = (key: string, value: string) => {
    onChange({ ...content, [key]: value });
  };

  return (
    <div className="space-y-4">
      {entries.map(([key, value]) => (
        <div key={key}>
          <Label>{key}</Label>
          {typeof value === 'string' && value.length > 80 ? (
            <Textarea
              value={value}
              onChange={(e) => update(key, e.target.value)}
              rows={4}
            />
          ) : typeof value === 'object' ? (
            <Textarea
              value={JSON.stringify(value, null, 2)}
              onChange={(e) => {
                try {
                  onChange({ ...content, [key]: JSON.parse(e.target.value) });
                } catch {
                  /* ignore invalid json while typing */
                }
              }}
              rows={6}
              className="font-mono text-xs"
            />
          ) : (
            <Input
              value={String(value ?? '')}
              onChange={(e) => update(key, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function SectionEditor({ sectionKey }: { sectionKey: string }) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['cms-section', sectionKey],
    queryFn: () => api.getCmsSection(sectionKey),
  });

  const [contentEn, setContentEn] = useState<Record<string, unknown>>({});
  const [contentBn, setContentBn] = useState<Record<string, unknown>>({});
  useEffect(() => {
    if (data) {
      setContentEn(data.contentEn || {});
      setContentBn(data.contentBn || {});
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => api.updateCmsSection(sectionKey, { contentEn, contentBn }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cms-section', sectionKey] });
      alert('Saved successfully');
    },
    onError: (e) => alert((e as Error).message),
  });

  if (isLoading) return <p>Loading...</p>;

  const imageSlots = SECTION_IMAGE_SLOTS[sectionKey];
  const imagesEn = (contentEn.images as { key: string; url: string; alt?: string; sortOrder: number }[]) || [];
  const imagesBn = (contentBn.images as { key: string; url: string; alt?: string; sortOrder: number }[]) || [];

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <CardTitle>{sectionKey}</CardTitle>
        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : 'Save Section'}
        </Button>
      </div>

      <TabsRoot defaultValue="en">
        <TabsList>
          <TabsTrigger value="en">Content (EN)</TabsTrigger>
          <TabsTrigger value="bn">Content (BN)</TabsTrigger>
          {imageSlots && <TabsTrigger value="images">Images</TabsTrigger>}
        </TabsList>
        <TabsContent value="en">
          {sectionKey === 'impact' ? (
            <ImpactSectionEditor content={contentEn} onChange={setContentEn} />
          ) : sectionKey === 'photos' ? (
            <PhotosSectionEditor content={contentEn} onChange={setContentEn} />
          ) : (
            <JsonFieldEditor content={contentEn} onChange={setContentEn} />
          )}
        </TabsContent>
        <TabsContent value="bn">
          {sectionKey === 'impact' ? (
            <ImpactSectionEditor content={contentBn} onChange={setContentBn} />
          ) : sectionKey === 'photos' ? (
            <PhotosSectionEditor content={contentBn} onChange={setContentBn} />
          ) : (
            <JsonFieldEditor content={contentBn} onChange={setContentBn} />
          )}
        </TabsContent>
        {imageSlots && (
          <TabsContent value="images">
            <p className="text-sm text-muted mb-4">Images are shared across locales (stored in EN content).</p>
            <SectionImageManager
              images={imagesEn}
              slots={imageSlots}
              folder={`smg-sections/${sectionKey}`}
              onChange={(imgs) => {
                setContentEn({ ...contentEn, images: imgs });
                setContentBn({ ...contentBn, images: imgs });
              }}
            />
          </TabsContent>
        )}
      </TabsRoot>
    </Card>
  );
}

export default function HomepageCmsPage() {
  const [active, setActive] = useState('hero');

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Homepage CMS</h1>
      <div className="flex flex-wrap gap-2 mb-6">
        {SECTIONS.map((s) => (
          <Button
            key={s.key}
            variant={active === s.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActive(s.key)}
          >
            {s.label}
          </Button>
        ))}
      </div>
      <SectionEditor key={active} sectionKey={active} />
    </div>
  );
}
