import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Textarea, Label } from '@/components/ui/input';

export type ImpactTestimonial = {
  quote: string;
  author: string;
  role?: string;
};

export function resolveImpactTestimonials(content: Record<string, unknown>): ImpactTestimonial[] {
  if (Array.isArray(content.testimonials)) {
    return (content.testimonials as ImpactTestimonial[]).map(normalizeTestimonial);
  }
  if (content.testimonial && typeof content.testimonial === 'object') {
    return [normalizeTestimonial(content.testimonial as ImpactTestimonial)];
  }
  return [];
}

function normalizeTestimonial(item: ImpactTestimonial): ImpactTestimonial {
  return {
    quote: String(item.quote ?? ''),
    author: String(item.author ?? ''),
    ...(item.role ? { role: String(item.role) } : {}),
  };
}

function emptyTestimonial(): ImpactTestimonial {
  return { quote: '', author: '', role: '' };
}

export function ImpactTestimonialsEditor({
  testimonials,
  onChange,
}: {
  testimonials: ImpactTestimonial[];
  onChange: (items: ImpactTestimonial[]) => void;
}) {
  const updateItem = (index: number, patch: Partial<ImpactTestimonial>) => {
    onChange(
      testimonials.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  };

  const removeItem = (index: number) => {
    onChange(testimonials.filter((_, i) => i !== index));
  };

  const addItem = () => {
    onChange([...testimonials, emptyTestimonial()]);
  };

  return (
    <div className="space-y-4 pt-4 border-t border-border">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-800">Testimonials</h4>
          <p className="text-xs text-muted mt-1">
            These rotate automatically on the homepage Impact section.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          <Plus className="h-4 w-4 mr-1" />
          Add testimonial
        </Button>
      </div>

      {testimonials.length === 0 ? (
        <p className="text-sm text-muted rounded-lg border border-dashed border-border p-4 text-center">
          No testimonials yet. Click &quot;Add testimonial&quot; to create one.
        </p>
      ) : (
        <div className="space-y-4">
          {testimonials.map((item, index) => (
            <div key={index} className="rounded-xl border border-border bg-slate-50/80 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Testimonial {index + 1}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeItem(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>

              <div>
                <Label htmlFor={`testimonial-quote-${index}`}>Quote</Label>
                <Textarea
                  id={`testimonial-quote-${index}`}
                  value={item.quote}
                  onChange={(e) => updateItem(index, { quote: e.target.value })}
                  rows={4}
                  placeholder="What the community member said..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`testimonial-author-${index}`}>Author</Label>
                  <Input
                    id={`testimonial-author-${index}`}
                    value={item.author}
                    onChange={(e) => updateItem(index, { author: e.target.value })}
                    placeholder="Community Member, Vogdaburi"
                  />
                </div>
                <div>
                  <Label htmlFor={`testimonial-role-${index}`}>Subtitle (optional)</Label>
                  <Input
                    id={`testimonial-role-${index}`}
                    value={item.role ?? ''}
                    onChange={(e) => updateItem(index, { role: e.target.value })}
                    placeholder="Community voice"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
