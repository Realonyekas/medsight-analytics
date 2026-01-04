import { Bell, Search, ChevronDown } from 'lucide-react';
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

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { user, hospital } = useAuth();
  const { data: subscription } = useSubscription(hospital?.id);

  const subscriptionLabel = {
    starter: 'Starter',
    growth: 'Growth',
    enterprise: 'Enterprise',
  };

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm px-6 flex items-center justify-between sticky top-0 z-40">
      <div>
        <h1 className="text-xl font-semibold text-foreground tracking-tight">{title}</h1>
        <p className="text-[11px] font-medium tracking-[0.2em] text-primary/60 uppercase">Smarter Insights. Better Care.</p>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search patients, insights..."
            className="h-10 w-72 rounded-xl border border-input bg-background/80 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200 hover:bg-background"
          />
        </div>

        {/* Subscription Badge */}
        {subscription && (
          <Badge variant="outline" className="hidden sm:inline-flex">
            {subscriptionLabel[subscription.plan]} Plan
          </Badge>
        )}

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl hover:bg-accent">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-semibold text-destructive-foreground flex items-center justify-center animate-pulse">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 rounded-xl shadow-lg border-border/50 bg-popover">
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

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2 h-10 rounded-xl hover:bg-accent">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground text-sm font-semibold shadow-sm">
                {user?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
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
