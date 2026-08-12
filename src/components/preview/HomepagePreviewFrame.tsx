import { PUBLIC_SITE } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { RefreshCw, ExternalLink } from 'lucide-react';

export function HomepagePreviewFrame({ locale = 'en', hash = '' }: { locale?: string; hash?: string }) {
  const [key, setKey] = useState(0);
  const src = `${PUBLIC_SITE}/preview/homepage?locale=${locale}${hash ? `#${hash}` : ''}`;

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => setKey((k) => k + 1)}>
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href={src} target="_blank" rel="noreferrer">
            <ExternalLink className="h-4 w-4" />
            Open in new tab
          </a>
        </Button>
      </div>
      <iframe
        key={key}
        src={src}
        title="Homepage Preview"
        className="w-full h-[80vh] border border-border rounded-xl bg-white"
      />
    </div>
  );
}
