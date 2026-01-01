import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Lightbulb, 
  FileText, 
  Settings,
  LogOut,
  Shield,
  Building2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import medsightLogo from '@/assets/medsight-logo.jpg';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['hospital_admin', 'clinician', 'operations'] },
  { name: 'Patient Insights', href: '/patients', icon: Users, roles: ['hospital_admin', 'clinician'] },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['hospital_admin', 'clinician', 'operations'] },
  { name: 'Recommendations', href: '/recommendations', icon: Lightbulb, roles: ['hospital_admin', 'clinician', 'operations'] },
  { name: 'Reports', href: '/reports', icon: FileText, roles: ['hospital_admin', 'operations'] },
];

const adminNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const { user, hospital, logout } = useAuth();
  const location = useLocation();

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role || 'operations')
  );

  const roleLabels = {
    hospital_admin: 'Hospital Admin',
    clinician: 'Clinician',
    operations: 'Operations',
  };

  return (
    <aside className="flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex h-20 items-center px-4 border-b border-sidebar-border">
        <img 
          src={medsightLogo} 
          alt="MedSight Analytics" 
          className="h-14 w-auto object-contain"
        />
      </div>

      {/* Hospital Info */}
      <div className="px-4 py-3 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-sidebar-foreground/60" />
          <span className="text-sm font-medium text-sidebar-foreground/80 truncate">
            {hospital?.name || 'Hospital'}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'nav-item',
                  isActive ? 'nav-item-active' : 'nav-item-inactive'
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </div>

        {user?.role === 'hospital_admin' && (
          <div className="pt-4 mt-4 border-t border-sidebar-border space-y-1">
            {adminNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'nav-item',
                    isActive ? 'nav-item-active' : 'nav-item-inactive'
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* User Profile */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground text-sm font-medium">
            {user?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
            <p className="text-xs text-sidebar-foreground/60">{roleLabels[user?.role || 'operations']}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-lg text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Compliance Badge */}
      <div className="px-4 py-3 border-t border-sidebar-border bg-sidebar-accent/30">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-sidebar-foreground/60" />
          <span className="text-xs text-sidebar-foreground/60">HIPAA-Aligned Security</span>
        </div>
      </div>
    </aside>
  );
}
