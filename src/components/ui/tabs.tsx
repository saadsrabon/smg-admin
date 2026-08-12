import * as Tabs from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

export function TabsRoot({ defaultValue, children, className }: { defaultValue: string; children: React.ReactNode; className?: string }) {
  return (
    <Tabs.Root defaultValue={defaultValue} className={className}>
      {children}
    </Tabs.Root>
  );
}

export function TabsList({ children }: { children: React.ReactNode }) {
  return (
    <Tabs.List className="inline-flex h-10 items-center rounded-lg bg-slate-100 p-1 gap-1">
      {children}
    </Tabs.List>
  );
}

export function TabsTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <Tabs.Trigger
      value={value}
      className={cn(
        'inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium text-slate-600',
        'data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm'
      )}
    >
      {children}
    </Tabs.Trigger>
  );
}

export function TabsContent({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  return (
    <Tabs.Content value={value} className={cn('mt-4 focus-visible:outline-none', className)}>
      {children}
    </Tabs.Content>
  );
}
