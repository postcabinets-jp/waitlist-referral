export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      waitlists: {
        Row: {
          id: string
          user_id: string
          name: string
          slug: string
          description: string | null
          logo_url: string | null
          template: 'minimal' | 'gradient' | 'dark'
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          slug: string
          description?: string | null
          logo_url?: string | null
          template?: 'minimal' | 'gradient' | 'dark'
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          slug?: string
          description?: string | null
          logo_url?: string | null
          template?: 'minimal' | 'gradient' | 'dark'
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          id: string
          waitlist_id: string
          email: string
          name: string | null
          referral_code: string
          referred_by: string | null
          referral_count: number
          position: number
          metadata: Json
          subscribed_at: string
        }
        Insert: {
          id?: string
          waitlist_id: string
          email: string
          name?: string | null
          referral_code: string
          referred_by?: string | null
          referral_count?: number
          position: number
          metadata?: Json
          subscribed_at?: string
        }
        Update: {
          id?: string
          waitlist_id?: string
          email?: string
          name?: string | null
          referral_code?: string
          referred_by?: string | null
          referral_count?: number
          position?: number
          metadata?: Json
          subscribed_at?: string
        }
        Relationships: []
      }
      milestones: {
        Row: {
          id: string
          waitlist_id: string
          referral_count: number
          reward_title: string
          reward_description: string | null
          sort_order: number
        }
        Insert: {
          id?: string
          waitlist_id: string
          referral_count: number
          reward_title: string
          reward_description?: string | null
          sort_order?: number
        }
        Update: {
          id?: string
          waitlist_id?: string
          referral_count?: number
          reward_title?: string
          reward_description?: string | null
          sort_order?: number
        }
        Relationships: []
      }
      waitlist_events: {
        Row: {
          id: string
          waitlist_id: string
          event_type: 'signup' | 'referral' | 'milestone_reached'
          subscriber_id: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          waitlist_id: string
          event_type: 'signup' | 'referral' | 'milestone_reached'
          subscriber_id?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          waitlist_id?: string
          event_type?: 'signup' | 'referral' | 'milestone_reached'
          subscriber_id?: string | null
          metadata?: Json
          created_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_referral_count: {
        Args: { subscriber_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type Waitlist = Database['public']['Tables']['waitlists']['Row']
export type Subscriber = Database['public']['Tables']['subscribers']['Row']
export type Milestone = Database['public']['Tables']['milestones']['Row']
export type WaitlistEvent = Database['public']['Tables']['waitlist_events']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']

export type WaitlistSettings = {
  welcomeEmail: boolean
  referralEnabled: boolean
  customMessage?: string
  emailTemplate?: string
}
