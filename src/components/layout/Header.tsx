import { Bell, Search, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useHospitalData';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { user, hospital, logout } = useAuth();
  const { data: subscription } = useSubscription(hospital?.id);
  const isMobile = useIsMobile();

  const subscriptionLabel = {
    starter: 'Starter',
    growth: 'Growth',
    enterprise: 'Enterprise',
  };

  return (
    <header className="h-auto min-h-16 border-b border-border bg-card/80 backdrop-blur-sm px-4 md:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between sticky top-0 z-40 gap-2">
      <div className={isMobile ? 'pl-12' : ''}>
        <h1 className="text-lg md:text-xl font-semibold text-foreground tracking-tight">{title}</h1>
        <p className="text-[10px] md:text-[11px] font-semibold tracking-[0.15em] md:tracking-[0.2em] bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent uppercase">
          Smarter Insights · Better Care
        </p>
      </div>

      <div className="flex items-center gap-2 justify-end">
        {/* Search - hidden on mobile */}
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search patients, insights..."
            className="h-10 w-72 rounded-xl border border-input bg-background/80 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200 hover:bg-background"
          />
        </div>

        {/* Subscription Badge */}
        {subscription && (
          <Badge variant="outline" className="hidden sm:inline-flex text-xs">
            {subscriptionLabel[subscription.plan]} Plan
          </Badge>
        )}

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9 md:h-10 md:w-10 rounded-xl hover:bg-accent">
              <Bell className="h-4 w-4 md:h-5 md:w-5" />
              <span className="absolute top-0.5 right-0.5 md:top-1 md:right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-semibold text-destructive-foreground flex items-center justify-center animate-pulse">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 md:w-80 rounded-xl shadow-lg border-border/50 bg-popover">
            <DropdownMenuLabel className="text-base font-semibold">Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1.5 py-3 px-3 cursor-pointer rounded-lg mx-1 focus:bg-accent">
              <span className="font-medium text-sm">High-risk patient alert</span>
              <span className="text-xs text-muted-foreground">2 patients require immediate attention</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1.5 py-3 px-3 cursor-pointer rounded-lg mx-1 focus:bg-accent">
              <span className="font-medium text-sm">Weekly report ready</span>
              <span className="text-xs text-muted-foreground">December performance summary available</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1.5 py-3 px-3 cursor-pointer rounded-lg mx-1 focus:bg-accent">
              <span className="font-medium text-sm">New recommendation</span>
              <span className="text-xs text-muted-foreground">Cost optimization opportunity identified</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Logout Button - visible on all screens */}
        <Button
          variant="ghost"
          size="icon"
          onClick={logout}
          className="h-9 w-9 md:h-10 md:w-10 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors"
          title="Sign out"
        >
          <LogOut className="h-4 w-4 md:h-5 md:w-5" />
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-1 md:gap-2 px-1.5 md:px-2 h-9 md:h-10 rounded-xl hover:bg-accent">
              <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground text-xs md:text-sm font-semibold shadow-sm">
                {user?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <ChevronDown className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border-border/50 bg-popover">
            <DropdownMenuLabel className="py-3">
              <div>
                <p className="font-semibold">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer rounded-lg mx-1 focus:bg-accent">Profile Settings</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-lg mx-1 focus:bg-accent">Subscription</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-lg mx-1 focus:bg-accent">Help & Support</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
