import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, type UserRole } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input, Label, Card, CardTitle } from '@/components/ui/input';

const ROLES: UserRole[] = ['super_admin', 'admin', 'manager', 'media_manager'];

export default function UsersPage() {
  const qc = useQueryClient();
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: api.getUsers,
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('manager');

  const createMutation = useMutation({
    mutationFn: () => api.createUser({ email, password, name, role }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      setEmail('');
      setPassword('');
      setName('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      <Card className="mb-6">
        <CardTitle>Create User</CardTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <div>
            <Label>Role</Label>
            <select className="flex h-10 w-full rounded-lg border border-border bg-white px-3 text-sm" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
        <Button className="mt-4" onClick={() => createMutation.mutate()}>Create User</Button>
      </Card>
      <div className="space-y-2">
        {users.map((u) => (
          <Card key={u.id} className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium">{u.name || u.email}</p>
              <p className="text-sm text-muted">{u.email} · {u.role}</p>
            </div>
            <Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate(u.id)}>Delete</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
