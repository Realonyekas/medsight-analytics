export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      demo_requests: {
        Row: {
          created_at: string
          email: string
          hospital: string
          id: string
          message: string | null
          name: string
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          hospital: string
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          hospital?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          created_at: string
          description: string | null
          hospital_id: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          hospital_id: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          hospital_id?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      hospitals: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          email: string | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          state: string | null
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name: string
          phone?: string | null
          state?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          state?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      insights: {
        Row: {
          action_label: string | null
          category: Database["public"]["Enums"]["insight_category"]
          created_at: string
          description: string
          hospital_id: string
          id: string
          is_actionable: boolean | null
          is_read: boolean | null
          metadata: Json | null
          patient_id: string | null
          priority: string | null
          title: string
          type: Database["public"]["Enums"]["insight_type"]
          updated_at: string
        }
        Insert: {
          action_label?: string | null
          category: Database["public"]["Enums"]["insight_category"]
          created_at?: string
          description: string
          hospital_id: string
          id?: string
          is_actionable?: boolean | null
          is_read?: boolean | null
          metadata?: Json | null
          patient_id?: string | null
          priority?: string | null
          title: string
          type: Database["public"]["Enums"]["insight_type"]
          updated_at?: string
        }
        Update: {
          action_label?: string | null
          category?: Database["public"]["Enums"]["insight_category"]
          created_at?: string
          description?: string
          hospital_id?: string
          id?: string
          is_actionable?: boolean | null
          is_read?: boolean | null
          metadata?: Json | null
          patient_id?: string | null
          priority?: string | null
          title?: string
          type?: Database["public"]["Enums"]["insight_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "insights_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insights_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      metrics: {
        Row: {
          category: string | null
          created_at: string
          hospital_id: string
          id: string
          name: string
          recorded_at: string
          trend: number | null
          trend_direction: string | null
          unit: string | null
          value: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          hospital_id: string
          id?: string
          name: string
          recorded_at?: string
          trend?: number | null
          trend_direction?: string | null
          unit?: string | null
          value: number
        }
        Update: {
          category?: string | null
          created_at?: string
          hospital_id?: string
          id?: string
          name?: string
          recorded_at?: string
          trend?: number | null
          trend_direction?: string | null
          unit?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "metrics_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          admission_date: string | null
          ai_flags: Json | null
          conditions: Json | null
          created_at: string
          date_of_birth: string | null
          department_id: string | null
          discharge_date: string | null
          first_name: string
          gender: string | null
          hospital_id: string
          id: string
          last_name: string
          los_prediction: number | null
          mrn: string
          primary_diagnosis: string | null
          readmission_risk: number | null
          risk_level: Database["public"]["Enums"]["risk_level"] | null
          risk_score: number | null
          updated_at: string
        }
        Insert: {
          admission_date?: string | null
          ai_flags?: Json | null
          conditions?: Json | null
          created_at?: string
          date_of_birth?: string | null
          department_id?: string | null
          discharge_date?: string | null
          first_name: string
          gender?: string | null
          hospital_id: string
          id?: string
          last_name: string
          los_prediction?: number | null
          mrn: string
          primary_diagnosis?: string | null
          readmission_risk?: number | null
          risk_level?: Database["public"]["Enums"]["risk_level"] | null
          risk_score?: number | null
          updated_at?: string
        }
        Update: {
          admission_date?: string | null
          ai_flags?: Json | null
          conditions?: Json | null
          created_at?: string
          date_of_birth?: string | null
          department_id?: string | null
          discharge_date?: string | null
          first_name?: string
          gender?: string | null
          hospital_id?: string
          id?: string
          last_name?: string
          los_prediction?: number | null
          mrn?: string
          primary_diagnosis?: string | null
          readmission_risk?: number | null
          risk_level?: Database["public"]["Enums"]["risk_level"] | null
          risk_score?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patients_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patients_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          hospital_id: string
          id: string
          metadata: Json | null
          payment_reference: string | null
          paystack_reference: string | null
          plan: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          hospital_id: string
          id?: string
          metadata?: Json | null
          payment_reference?: string | null
          paystack_reference?: string | null
          plan?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          hospital_id?: string
          id?: string
          metadata?: Json | null
          payment_reference?: string | null
          paystack_reference?: string | null
          plan?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department_id: string | null
          email: string
          full_name: string | null
          hospital_id: string | null
          id: string
          is_active: boolean
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department_id?: string | null
          email: string
          full_name?: string | null
          hospital_id?: string | null
          id: string
          is_active?: boolean
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department_id?: string | null
          email?: string
          full_name?: string | null
          hospital_id?: string | null
          id?: string
          is_active?: boolean
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          features: Json | null
          hospital_id: string
          id: string
          is_active: boolean
          max_patients: number
          max_users: number
          plan: Database["public"]["Enums"]["subscription_plan"]
          price_monthly: number
          started_at: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          features?: Json | null
          hospital_id: string
          id?: string
          is_active?: boolean
          max_patients?: number
          max_users?: number
          plan?: Database["public"]["Enums"]["subscription_plan"]
          price_monthly?: number
          started_at?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          features?: Json | null
          hospital_id?: string
          id?: string
          is_active?: boolean
          max_patients?: number
          max_users?: number
          plan?: Database["public"]["Enums"]["subscription_plan"]
          price_monthly?: number
          started_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_conversations: {
        Row: {
          contact_name: string | null
          context: Json | null
          created_at: string
          id: string
          last_message: string | null
          last_message_at: string | null
          metadata: Json | null
          phone_number: string
          updated_at: string
        }
        Insert: {
          contact_name?: string | null
          context?: Json | null
          created_at?: string
          id?: string
          last_message?: string | null
          last_message_at?: string | null
          metadata?: Json | null
          phone_number: string
          updated_at?: string
        }
        Update: {
          contact_name?: string | null
          context?: Json | null
          created_at?: string
          id?: string
          last_message?: string | null
          last_message_at?: string | null
          metadata?: Json | null
          phone_number?: string
          updated_at?: string
        }
        Relationships: []
      }
      whatsapp_messages: {
        Row: {
          ai_generated: boolean | null
          content: string | null
          conversation_id: string | null
          created_at: string
          direction: string
          id: string
          media_url: string | null
          message_type: string
          metadata: Json | null
          status: string | null
          template_name: string | null
          whatsapp_message_id: string | null
        }
        Insert: {
          ai_generated?: boolean | null
          content?: string | null
          conversation_id?: string | null
          created_at?: string
          direction: string
          id?: string
          media_url?: string | null
          message_type?: string
          metadata?: Json | null
          status?: string | null
          template_name?: string | null
          whatsapp_message_id?: string | null
        }
        Update: {
          ai_generated?: boolean | null
          content?: string | null
          conversation_id?: string | null
          created_at?: string
          direction?: string
          id?: string
          media_url?: string | null
          message_type?: string
          metadata?: Json | null
          status?: string | null
          template_name?: string | null
          whatsapp_message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_notification_recipients: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          name: string | null
          notification_types: string[] | null
          phone_number: string
          role: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string | null
          notification_types?: string[] | null
          phone_number: string
          role?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string | null
          notification_types?: string[] | null
          phone_number?: string
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_hospital_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      user_needs_onboarding: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "hospital_admin" | "clinician" | "operations"
      insight_category: "clinical" | "operational" | "financial" | "quality"
      insight_type: "alert" | "trend" | "recommendation" | "prediction"
      risk_level: "low" | "medium" | "high" | "critical"
      subscription_plan: "starter" | "growth" | "enterprise" | "master"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["hospital_admin", "clinician", "operations"],
      insight_category: ["clinical", "operational", "financial", "quality"],
      insight_type: ["alert", "trend", "recommendation", "prediction"],
      risk_level: ["low", "medium", "high", "critical"],
      subscription_plan: ["starter", "growth", "enterprise", "master"],
    },
  },
} as const
