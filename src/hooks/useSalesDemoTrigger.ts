import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const DEMO_SEEN_KEY = 'medsight_sales_demo_seen';

export function useSalesDemoTrigger() {
  const { user, profile, session, roles } = useAuth();
  const [shouldShowDemo, setShouldShowDemo] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkDemoTrigger = async () => {
      if (!session?.user || !profile) {
        setIsChecking(false);
        return;
      }

      // Check if user has already seen the demo
      const demoSeen = localStorage.getItem(DEMO_SEEN_KEY);
      if (demoSeen) {
        setIsChecking(false);
        return;
      }

      // Check if this is a demo account type or first login
      // Trigger conditions:
      // 1. account.type = DEMO (check metadata)
      // 2. first_login = true (user created recently, e.g., within last 5 minutes)
      // 3. SuperAdmin toggle (check roles)

      const userMetadata = session.user.user_metadata;
      const isDemoAccount = userMetadata?.account_type === 'demo';
      
      // Check if this is a "first login" (user was created very recently)
      const createdAt = new Date(session.user.created_at);
      const now = new Date();
      const minutesSinceCreation = (now.getTime() - createdAt.getTime()) / 1000 / 60;
      const isFirstLogin = minutesSinceCreation < 5;

      // Check if user is a SuperAdmin who can manually trigger
      const isSuperAdmin = roles.some(r => r.role === 'hospital_admin');

      // Trigger demo mode
      if (isDemoAccount || isFirstLogin) {
        setShouldShowDemo(true);
      }

      setIsChecking(false);
    };

    checkDemoTrigger();
  }, [session, profile, roles]);

  const markDemoAsSeen = () => {
    localStorage.setItem(DEMO_SEEN_KEY, 'true');
    setShouldShowDemo(false);
  };

  const triggerDemoManually = () => {
    localStorage.removeItem(DEMO_SEEN_KEY);
    setShouldShowDemo(true);
  };

  const resetDemoStatus = () => {
    localStorage.removeItem(DEMO_SEEN_KEY);
  };

  return {
    shouldShowDemo,
    isChecking,
    markDemoAsSeen,
    triggerDemoManually,
    resetDemoStatus,
  };
}
