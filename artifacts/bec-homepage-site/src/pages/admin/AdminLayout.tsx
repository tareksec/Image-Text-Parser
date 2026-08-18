import { type ReactNode } from 'react';
import { useLocation, Link } from 'wouter';
import {
  LayoutDashboard,
  FileText,
  Star,
  CalendarDays,
  Users,
  UserCog,
  BarChart3,
  LogOut,
} from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import './admin.css';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/posts', label: 'Posts', icon: FileText },
  { path: '/admin/reviews', label: 'Reviews', icon: Star },
  { path: '/admin/events', label: 'Events', icon: CalendarDays },
  { path: '/admin/members', label: 'Members', icon: Users },
  { path: '/admin/team', label: 'Team', icon: UserCog },
  { path: '/admin/stats', label: 'Stats', icon: BarChart3 },
];

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const [location] = useLocation();
  const { user, logout } = useAdminAuth();
  const [, navigate] = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin') return location === '/admin';
    return location.startsWith(path);
  };

  const currentTitle =
    title || navItems.find((item) => isActive(item.path))?.label || 'Dashboard';

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-sidebar-brand">
          <div className="admin-sidebar-mark">BEC</div>
          <div>
            <div className="admin-sidebar-title">BEC Admin</div>
            <div className="admin-sidebar-subtitle">Management Panel</div>
          </div>
        </Link>

        <nav className="admin-sidebar-nav">
          <div className="admin-sidebar-section">Navigation</div>
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              href={path}
              className={`admin-nav-link${isActive(path) ? ' active' : ''}`}
            >
              <Icon />
              {label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div>
              <div className="admin-user-name">{user?.name || 'Admin'}</div>
              <div className="admin-user-email">{user?.email || ''}</div>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        <header className="admin-topbar">
          <h2>{currentTitle}</h2>
        </header>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
