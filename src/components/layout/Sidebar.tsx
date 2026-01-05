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
  Building2,
  ClipboardList
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
  { name: 'Demo Requests', href: '/demo-requests', icon: ClipboardList },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
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

  const handleNavClick = () => {
    onNavigate?.();
  };

  return (
    <aside className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border shadow-sm">
      {/* Logo */}
      <div className="flex h-20 items-center px-5 border-b border-sidebar-border/50">
        <img 
          src={medsightLogo} 
          alt="MedSight Analytics" 
          className="h-14 w-auto object-contain"
        />
      </div>

      {/* Hospital Info */}
      <div className="px-4 py-4 border-b border-sidebar-border/50">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg bg-sidebar-accent/30">
          <Building2 className="h-4 w-4 text-sidebar-foreground/70 flex-shrink-0" />
          <span className="text-sm font-medium text-sidebar-foreground/90 truncate">
            {hospital?.name || 'Hospital'}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-5 overflow-y-auto">
        <p className="px-3 mb-3 text-[11px] font-semibold tracking-wider text-sidebar-foreground/50 uppercase">Menu</p>
        <div className="space-y-1">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={handleNavClick}
                className={cn(
                  'nav-item group',
                  isActive ? 'nav-item-active' : 'nav-item-inactive'
                )}
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0 transition-transform duration-150 group-hover:scale-110", isActive && "text-primary")} />
                {item.name}
              </Link>
            );
          })}
        </div>

        {user?.role === 'hospital_admin' && (
          <div className="pt-5 mt-5 border-t border-sidebar-border/50 space-y-1">
            <p className="px-3 mb-3 text-[11px] font-semibold tracking-wider text-sidebar-foreground/50 uppercase">Admin</p>
            {adminNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={handleNavClick}
                  className={cn(
                    'nav-item group',
                    isActive ? 'nav-item-active' : 'nav-item-inactive'
                  )}
                >
                  <item.icon className={cn("h-5 w-5 flex-shrink-0 transition-transform duration-150 group-hover:scale-110", isActive && "text-primary")} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* User Profile */}
      <div className="border-t border-sidebar-border/50 p-3">
        <div className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-sidebar-accent/30 transition-colors">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-sm font-semibold shadow-sm flex-shrink-0">
            {user?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-sidebar-foreground truncate">{user?.name}</p>
            <p className="text-xs text-sidebar-foreground/60">{roleLabels[user?.role || 'operations']}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-lg text-sidebar-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-all duration-150 flex-shrink-0"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Compliance Badge */}
      <div className="px-4 py-3 border-t border-sidebar-border/50 bg-sidebar-accent/20">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-success flex-shrink-0" />
          <span className="text-xs font-medium text-sidebar-foreground/70">HIPAA-Aligned Security</span>
        </div>
      </div>
    </aside>
  );
}
