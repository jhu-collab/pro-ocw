export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      invites: {
        Row: {
          created_at: string
          email: string
          id: number
          joined: boolean
          role: string
          send: boolean
          team_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
          joined?: boolean
          role?: string
          send?: boolean
          team_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          joined?: boolean
          role?: string
          send?: boolean
          team_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invites_team_id_fkey"
            columns: ["team_id"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invites_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      members: {
        Row: {
          created_at: string
          id: number
          role: string
          team_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          role: string
          team_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          role?: string
          team_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "members_team_id_fkey"
            columns: ["team_id"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          email: string
          full_name: string | null
          has_onboarded: boolean
          id: string
        }
        Insert: {
          email: string
          full_name?: string | null
          has_onboarded?: boolean
          id: string
        }
        Update: {
          email?: string
          full_name?: string | null
          has_onboarded?: boolean
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      teams: {
        Row: {
          created_at: string
          id: number
          name: string
          stripe_customer_id: string | null
          subscribed: boolean
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          stripe_customer_id?: string | null
          subscribed?: boolean
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
