import { Input, Textarea, Label } from '@/components/ui/input';
import {
  ImpactTestimonialsEditor,
  resolveImpactTestimonials,
  type ImpactTestimonial,
} from './ImpactTestimonialsEditor';

const TEXTAREA_KEYS = new Set(['storyDescription', 'storyBody']);

const FIELD_LABELS: Record<string, string> = {
  eyebrow: 'Section eyebrow',
  title: 'Section title',
  subtitle: 'Section subtitle',
  storyTitle: 'Featured story title',
  storyDescription: 'Featured story description',
  storyBody: 'Featured story body',
  achievementsHeading: 'Achievements heading',
};

type Props = {
  content: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
};

function AchievementsEditor({
  items,
  onChange,
}: {
  items: string[];
  onChange: (items: string[]) => void;
}) {
  return (
    <div className="space-y-3 pt-4 border-t border-border">
      <div>
        <h4 className="text-sm font-semibold text-slate-800">Achievements</h4>
        <p className="text-xs text-muted mt-1">One bullet per line.</p>
      </div>
      <Textarea
        value={items.join('\n')}
        onChange={(e) =>
          onChange(
            e.target.value
              .split('\n')
              .map((line) => line.trim())
              .filter(Boolean)
          )
        }
        rows={6}
        placeholder={'Established a fully functional community center\nProvided digital literacy training...'}
      />
    </div>
  );
}

export function ImpactSectionEditor({ content, onChange }: Props) {
  const scalarEntries = Object.entries(content).filter(
    ([key]) => !['images', 'testimonials', 'testimonial', 'achievements'].includes(key)
  );

  const achievements = Array.isArray(content.achievements)
    ? (content.achievements as string[])
    : [];
  const testimonials = resolveImpactTestimonials(content);

  const updateScalar = (key: string, value: string) => {
    onChange({ ...content, [key]: value });
  };

  const updateAchievements = (items: string[]) => {
    onChange({ ...content, achievements: items });
  };

  const updateTestimonials = (items: ImpactTestimonial[]) => {
    const next: Record<string, unknown> = { ...content, testimonials: items };
    delete next.testimonial;
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {scalarEntries.map(([key, value]) => (
        <div key={key}>
          <Label htmlFor={`impact-${key}`}>{FIELD_LABELS[key] ?? key}</Label>
          {typeof value === 'string' && (value.length > 80 || TEXTAREA_KEYS.has(key)) ? (
            <Textarea
              id={`impact-${key}`}
              value={value}
              onChange={(e) => updateScalar(key, e.target.value)}
              rows={TEXTAREA_KEYS.has(key) ? 5 : 3}
            />
          ) : (
            <Input
              id={`impact-${key}`}
              value={String(value ?? '')}
              onChange={(e) => updateScalar(key, e.target.value)}
            />
          )}
        </div>
      ))}

      <AchievementsEditor items={achievements} onChange={updateAchievements} />

      <ImpactTestimonialsEditor testimonials={testimonials} onChange={updateTestimonials} />
    </div>
  );
}
