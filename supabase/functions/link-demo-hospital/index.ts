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
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Linking user ${user.id} to demo hospital ${DEMO_HOSPITAL_ID}`);

    // Update user's profile with demo hospital
    const { error: profileError } = await supabase
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

    // Check if user already has a role
    const { data: existingRoles } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id);

    if (!existingRoles || existingRoles.length === 0) {
      // Assign hospital_admin role for demo purposes
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({ user_id: user.id, role: 'hospital_admin' });

      if (roleError) {
        console.error('Role assignment error:', roleError);
        return new Response(JSON.stringify({ error: 'Failed to assign role' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    console.log(`Successfully linked user ${user.id} to demo hospital`);

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
