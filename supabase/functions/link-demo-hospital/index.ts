import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DEMO_HOSPITAL_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Get user from auth header using anon key client (JWT verified by Supabase)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use anon key client with user's auth to get authenticated user
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });
    
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`User ${user.id} requesting to join demo hospital`);

    // Use service role only for the specific operations needed
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // SECURITY CHECK 1: Verify user doesn't already have a hospital assigned
    const { data: existingProfile, error: profileCheckError } = await adminClient
      .from('profiles')
      .select('hospital_id')
      .eq('id', user.id)
      .single();

    if (profileCheckError) {
      console.error('Profile check error:', profileCheckError);
      return new Response(JSON.stringify({ error: 'Failed to check user profile' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (existingProfile?.hospital_id) {
      console.warn(`User ${user.id} already has hospital ${existingProfile.hospital_id}`);
      return new Response(JSON.stringify({ 
        error: 'User already belongs to a hospital',
        hospital_id: existingProfile.hospital_id 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // SECURITY CHECK 2: Verify user doesn't already have any roles
    const { data: existingRoles, error: roleCheckError } = await adminClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    if (roleCheckError) {
      console.error('Role check error:', roleCheckError);
      return new Response(JSON.stringify({ error: 'Failed to check user roles' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (existingRoles && existingRoles.length > 0) {
      console.warn(`User ${user.id} already has roles: ${existingRoles.map(r => r.role).join(', ')}`);
      return new Response(JSON.stringify({ 
        error: 'User already has assigned roles',
        roles: existingRoles.map(r => r.role)
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Linking user ${user.id} to demo hospital ${DEMO_HOSPITAL_ID}`);

    // Update user's profile with demo hospital
    const { error: profileError } = await adminClient
      .from('profiles')
      .update({ hospital_id: DEMO_HOSPITAL_ID })
      .eq('id', user.id);

    if (profileError) {
      console.error('Profile update error:', profileError);
      return new Response(JSON.stringify({ error: 'Failed to update profile' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Assign hospital_admin role for demo purposes
    const { error: roleError } = await adminClient
      .from('user_roles')
      .insert({ user_id: user.id, role: 'hospital_admin' });

    if (roleError) {
      console.error('Role assignment error:', roleError);
      // Rollback profile update
      await adminClient
        .from('profiles')
        .update({ hospital_id: null })
        .eq('id', user.id);
      
      return new Response(JSON.stringify({ error: 'Failed to assign role' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Successfully linked user ${user.id} to demo hospital with hospital_admin role`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Linked to demo hospital',
      hospital_id: DEMO_HOSPITAL_ID 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
