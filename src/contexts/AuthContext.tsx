import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { DbProfile, DbHospital, DbUserRole, AppRole } from '@/types/database';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: AppRole;
  hospitalId: string | null;
  hospitalName: string | null;
  department?: string;
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  profile: DbProfile | null;
  hospital: DbHospital | null;
  roles: DbUserRole[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  selectRole: (role: AppRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<DbProfile | null>(null);
  const [hospital, setHospital] = useState<DbHospital | null>(null);
  const [roles, setRoles] = useState<DbUserRole[]>([]);
  const [activeRole, setActiveRole] = useState<AppRole>('hospital_admin');
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      setProfile(profileData);

      // Fetch roles
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId);
      
      setRoles(rolesData || []);

      // Set active role based on available roles
      if (rolesData && rolesData.length > 0) {
        if (rolesData.some(r => r.role === 'hospital_admin')) {
          setActiveRole('hospital_admin');
        } else if (rolesData.some(r => r.role === 'clinician')) {
          setActiveRole('clinician');
        } else {
          setActiveRole(rolesData[0].role as AppRole);
        }
      }

      // Fetch hospital if profile has hospital_id
      if (profileData?.hospital_id) {
        const { data: hospitalData } = await supabase
          .from('hospitals')
          .select('*')
          .eq('id', profileData.hospital_id)
          .maybeSingle();
        
        setHospital(hospitalData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, []);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Defer Supabase calls with setTimeout to avoid deadlock
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setHospital(null);
          setRoles([]);
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserData(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchUserData]);

  const login = useCallback(async (email: string, password: string): Promise<{ error: string | null }> => {
    setIsLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    setIsLoading(false);
    
    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        return { error: 'Invalid email or password. Please try again.' };
      }
      return { error: error.message };
    }
    
    return { error: null };
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string): Promise<{ error: string | null }> => {
    setIsLoading(true);
    
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });
    
    setIsLoading(false);
    
    if (error) {
      if (error.message.includes('User already registered')) {
        return { error: 'An account with this email already exists. Please sign in instead.' };
      }
      return { error: error.message };
    }
    
    return { error: null };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setHospital(null);
    setRoles([]);
  }, []);

  const selectRole = useCallback((role: AppRole) => {
    if (roles.some(r => r.role === role)) {
      setActiveRole(role);
    }
  }, [roles]);

  // Build the user object for compatibility
  const user: AuthUser | null = session?.user && profile ? {
    id: session.user.id,
    email: session.user.email || '',
    name: profile.full_name || session.user.email || '',
    role: activeRole,
    hospitalId: profile.hospital_id,
    hospitalName: hospital?.name || null,
    avatar: profile.avatar_url || undefined,
  } : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        hospital,
        roles,
        isAuthenticated: !!session?.user,
        isLoading,
        login,
        signUp,
        logout,
        selectRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
