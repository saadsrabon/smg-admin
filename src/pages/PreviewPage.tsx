import { useState } from 'react';
import { HomepagePreviewFrame } from '@/components/preview/HomepagePreviewFrame';
import { Button } from '@/components/ui/button';

export default function PreviewPage() {
  const [locale, setLocale] = useState<'en' | 'bn'>('en');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Homepage Preview</h1>
        <div className="flex gap-2">
          <Button variant={locale === 'en' ? 'default' : 'outline'} size="sm" onClick={() => setLocale('en')}>
            English
          </Button>
          <Button variant={locale === 'bn' ? 'default' : 'outline'} size="sm" onClick={() => setLocale('bn')}>
            Bengali
          </Button>
        </div>
      </div>
      <HomepagePreviewFrame locale={locale} />
    </div>
  );
}
