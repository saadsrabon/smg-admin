import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardTitle } from '@/components/ui/input';

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: api.dashboardStats,
  });

  if (isLoading) return <p>Loading dashboard...</p>;

  const stats = [
    { label: 'Gallery Items', value: data?.galleryItems ?? 0 },
    { label: 'Categories', value: data?.categories ?? 0 },
    { label: 'CMS Sections', value: data?.cmsSections ?? 0 },
    { label: 'Users', value: data?.users ?? 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label}>
            <p className="text-sm text-muted">{s.label}</p>
            <CardTitle>{s.value}</CardTitle>
          </Card>
        ))}
      </div>
      {data?.lastCmsUpdate && (
        <Card>
          <p className="text-sm text-muted">Last CMS update</p>
          <p className="font-medium">{new Date(data.lastCmsUpdate).toLocaleString()}</p>
        </Card>
      )}
    </div>
  );
}
