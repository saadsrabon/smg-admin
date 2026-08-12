import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Image,
  FolderOpen,
  FileText,
  MessageSquare,
  Eye,
  Users,
  LogOut,
} from 'lucide-react';
import { useAuth, hasRole } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', roles: ['super_admin', 'admin', 'manager', 'media_manager'] },
  { to: '/media/gallery', icon: Image, label: 'Gallery', roles: ['super_admin', 'admin', 'media_manager'] },
  { to: '/media/categories', icon: FolderOpen, label: 'Categories', roles: ['super_admin', 'admin', 'media_manager'] },
  { to: '/cms/homepage', icon: FileText, label: 'Homepage CMS', roles: ['super_admin', 'admin', 'manager', 'media_manager'] },
  { to: '/cms/founder-modal', icon: MessageSquare, label: 'Founder Modal', roles: ['super_admin', 'admin', 'manager'] },
  { to: '/cms/preview', icon: Eye, label: 'Preview', roles: ['super_admin', 'admin', 'manager', 'media_manager'] },
  { to: '/users', icon: Users, label: 'Users', roles: ['super_admin'] },
];

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r border-border bg-white flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-lg font-bold text-primary">SMG Admin</h1>
          <p className="text-xs text-muted mt-1">Shomajgori Foundation</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems
            .filter((item) => hasRole(user, item.roles))
            .map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive ? 'bg-emerald-50 text-primary' : 'text-slate-600 hover:bg-slate-50'
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
        </nav>
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted truncate mb-2">{user?.email}</p>
          <p className="text-xs font-medium capitalize mb-3">{user?.role?.replace('_', ' ')}</p>
          <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
