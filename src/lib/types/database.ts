// Generated from the live Supabase schema. Do not edit by hand.
// Regenerate: supabase gen types typescript --project-id zkkvymewfnadmdvdxlxg

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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      block_progress: {
        Row: {
          block_id: string
          completed_at: string | null
          enrollment_id: string
          id: string
          status: Database["public"]["Enums"]["block_progress_status"]
        }
        Insert: {
          block_id: string
          completed_at?: string | null
          enrollment_id: string
          id?: string
          status?: Database["public"]["Enums"]["block_progress_status"]
        }
        Update: {
          block_id?: string
          completed_at?: string | null
          enrollment_id?: string
          id?: string
          status?: Database["public"]["Enums"]["block_progress_status"]
        }
        Relationships: [
          {
            foreignKeyName: "block_progress_block_id_fkey"
            columns: ["block_id"]
            isOneToOne: false
            referencedRelation: "course_blocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "block_progress_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      business_certifications: {
        Row: {
          business_id: string
          created_at: string
          file_url: string | null
          id: string
          name: string
        }
        Insert: {
          business_id: string
          created_at?: string
          file_url?: string | null
          id?: string
          name: string
        }
        Update: {
          business_id?: string
          created_at?: string
          file_url?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_certifications_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_locations: {
        Row: {
          business_id: string
          city: string | null
          country: string | null
          created_at: string
          id: string
          position: number
          region: string | null
          street: string | null
        }
        Insert: {
          business_id: string
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          position?: number
          region?: string | null
          street?: string | null
        }
        Update: {
          business_id?: string
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          position?: number
          region?: string | null
          street?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_locations_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_members: {
        Row: {
          business_id: string
          created_at: string
          id: string
          invited_by: string | null
          invited_email: string | null
          joined_at: string | null
          role: Database["public"]["Enums"]["member_role"]
          status: Database["public"]["Enums"]["member_status"]
          user_id: string | null
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          invited_by?: string | null
          invited_email?: string | null
          joined_at?: string | null
          role?: Database["public"]["Enums"]["member_role"]
          status?: Database["public"]["Enums"]["member_status"]
          user_id?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          invited_by?: string | null
          invited_email?: string | null
          joined_at?: string | null
          role?: Database["public"]["Enums"]["member_role"]
          status?: Database["public"]["Enums"]["member_status"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_members_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_members_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      business_notification_prefs: {
        Row: {
          business_id: string
          notify_course_complete: boolean
          notify_product_updates: boolean
          notify_signups: boolean
          user_id: string
        }
        Insert: {
          business_id: string
          notify_course_complete?: boolean
          notify_product_updates?: boolean
          notify_signups?: boolean
          user_id: string
        }
        Update: {
          business_id?: string
          notify_course_complete?: boolean
          notify_product_updates?: boolean
          notify_signups?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_notification_prefs_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_notification_prefs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      business_training_languages: {
        Row: {
          business_id: string
          id: string
          language: string
        }
        Insert: {
          business_id: string
          id?: string
          language: string
        }
        Update: {
          business_id?: string
          id?: string
          language?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_training_languages_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          business_type: Database["public"]["Enums"]["business_type"] | null
          company_size: string | null
          contact_email: string | null
          contact_phone: string | null
          cover_url: string | null
          created_at: string
          description: string | null
          id: string
          industry: string | null
          logo_url: string | null
          name: string
          owner_id: string | null
          position_of_owner: string | null
          quiz_retake_policy: Json
          stamp_url: string | null
          status: Database["public"]["Enums"]["business_status"]
          tagline: string | null
          timezone: string | null
          updated_at: string
          website: string | null
          year_founded: number | null
        }
        Insert: {
          business_type?: Database["public"]["Enums"]["business_type"] | null
          company_size?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name: string
          owner_id?: string | null
          position_of_owner?: string | null
          quiz_retake_policy?: Json
          stamp_url?: string | null
          status?: Database["public"]["Enums"]["business_status"]
          tagline?: string | null
          timezone?: string | null
          updated_at?: string
          website?: string | null
          year_founded?: number | null
        }
        Update: {
          business_type?: Database["public"]["Enums"]["business_type"] | null
          company_size?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name?: string
          owner_id?: string | null
          position_of_owner?: string | null
          quiz_retake_policy?: Json
          stamp_url?: string | null
          status?: Database["public"]["Enums"]["business_status"]
          tagline?: string | null
          timezone?: string | null
          updated_at?: string
          website?: string | null
          year_founded?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "businesses_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          certificate_id: string
          enrollment_id: string
          id: string
          issued_at: string
          visible_on_portfolio: boolean
        }
        Insert: {
          certificate_id?: string
          enrollment_id: string
          id?: string
          issued_at?: string
          visible_on_portfolio?: boolean
        }
        Update: {
          certificate_id?: string
          enrollment_id?: string
          id?: string
          issued_at?: string
          visible_on_portfolio?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "certificates_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: true
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      course_blocks: {
        Row: {
          content_ref: Json
          course_id: string
          created_at: string
          id: string
          position: number
          quiz_navigation_override: Database["public"]["Enums"]["quiz_navigation_override"]
          source_error: string | null
          source_status: Database["public"]["Enums"]["block_source_status"]
          source_text: string | null
          title: string | null
          type: Database["public"]["Enums"]["block_type"]
          updated_at: string
        }
        Insert: {
          content_ref?: Json
          course_id: string
          created_at?: string
          id?: string
          position: number
          quiz_navigation_override?: Database["public"]["Enums"]["quiz_navigation_override"]
          source_error?: string | null
          source_status?: Database["public"]["Enums"]["block_source_status"]
          source_text?: string | null
          title?: string | null
          type: Database["public"]["Enums"]["block_type"]
          updated_at?: string
        }
        Update: {
          content_ref?: Json
          course_id?: string
          created_at?: string
          id?: string
          position?: number
          quiz_navigation_override?: Database["public"]["Enums"]["quiz_navigation_override"]
          source_error?: string | null
          source_status?: Database["public"]["Enums"]["block_source_status"]
          source_text?: string | null
          title?: string | null
          type?: Database["public"]["Enums"]["block_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_blocks_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_tags: {
        Row: {
          course_id: string
          id: string
          tag: string
        }
        Insert: {
          course_id: string
          id?: string
          tag: string
        }
        Update: {
          course_id?: string
          id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_tags_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          build_block_id: string | null
          build_stage: Database["public"]["Enums"]["course_build_stage"]
          business_id: string
          created_at: string
          created_by: string | null
          description: string | null
          duration_label: string | null
          id: string
          quiz_navigation_default: Database["public"]["Enums"]["quiz_navigation"]
          quiz_retry_cooldown_hours_default: number | null
          quiz_retry_max_default: number | null
          share_token: string
          status: Database["public"]["Enums"]["course_status"]
          tagline: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          visibility: Database["public"]["Enums"]["course_visibility"]
          what_you_will_learn: string[]
        }
        Insert: {
          build_block_id?: string | null
          build_stage?: Database["public"]["Enums"]["course_build_stage"]
          business_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_label?: string | null
          id?: string
          quiz_navigation_default?: Database["public"]["Enums"]["quiz_navigation"]
          quiz_retry_cooldown_hours_default?: number | null
          quiz_retry_max_default?: number | null
          share_token?: string
          status?: Database["public"]["Enums"]["course_status"]
          tagline?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["course_visibility"]
          what_you_will_learn?: string[]
        }
        Update: {
          build_block_id?: string | null
          build_stage?: Database["public"]["Enums"]["course_build_stage"]
          business_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_label?: string | null
          id?: string
          quiz_navigation_default?: Database["public"]["Enums"]["quiz_navigation"]
          quiz_retry_cooldown_hours_default?: number | null
          quiz_retry_max_default?: number | null
          share_token?: string
          status?: Database["public"]["Enums"]["course_status"]
          tagline?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["course_visibility"]
          what_you_will_learn?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "courses_build_block_id_fkey"
            columns: ["build_block_id"]
            isOneToOne: false
            referencedRelation: "course_blocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          business_id: string | null
          completed_at: string | null
          completed_block_total: number | null
          course_id: string
          cycle: number
          enrolled_at: string
          id: string
          learner_id: string
          status: Database["public"]["Enums"]["enrollment_status"]
        }
        Insert: {
          business_id?: string | null
          completed_at?: string | null
          completed_block_total?: number | null
          course_id: string
          cycle?: number
          enrolled_at?: string
          id?: string
          learner_id: string
          status?: Database["public"]["Enums"]["enrollment_status"]
        }
        Update: {
          business_id?: string | null
          completed_at?: string | null
          completed_block_total?: number | null
          course_id?: string
          cycle?: number
          enrolled_at?: string
          id?: string
          learner_id?: string
          status?: Database["public"]["Enums"]["enrollment_status"]
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      learner_certifications: {
        Row: {
          created_at: string
          file_url: string | null
          id: string
          name: string
          user_id: string
          visible_on_portfolio: boolean
        }
        Insert: {
          created_at?: string
          file_url?: string | null
          id?: string
          name: string
          user_id: string
          visible_on_portfolio?: boolean
        }
        Update: {
          created_at?: string
          file_url?: string | null
          id?: string
          name?: string
          user_id?: string
          visible_on_portfolio?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "learner_certifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      learner_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          date_of_birth: string | null
          employed: boolean | null
          employer_business_id: string | null
          employer_locked: boolean
          employer_name: string | null
          job_title: string | null
          phone: string | null
          phone_country_code: string | null
          portfolio_slug: string | null
          preferred_language: string | null
          public_portfolio: boolean
          resume_data: Json | null
          resume_url: string | null
          timezone: string | null
          updated_at: string
          user_id: string
          years_experience: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          date_of_birth?: string | null
          employed?: boolean | null
          employer_business_id?: string | null
          employer_locked?: boolean
          employer_name?: string | null
          job_title?: string | null
          phone?: string | null
          phone_country_code?: string | null
          portfolio_slug?: string | null
          preferred_language?: string | null
          public_portfolio?: boolean
          resume_data?: Json | null
          resume_url?: string | null
          timezone?: string | null
          updated_at?: string
          user_id: string
          years_experience?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          date_of_birth?: string | null
          employed?: boolean | null
          employer_business_id?: string | null
          employer_locked?: boolean
          employer_name?: string | null
          job_title?: string | null
          phone?: string | null
          phone_country_code?: string | null
          portfolio_slug?: string | null
          preferred_language?: string | null
          public_portfolio?: boolean
          resume_data?: Json | null
          resume_url?: string | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
          years_experience?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learner_profiles_employer_business_id_fkey"
            columns: ["employer_business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learner_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      learner_skills: {
        Row: {
          id: string
          skill: string
          user_id: string
        }
        Insert: {
          id?: string
          skill: string
          user_id: string
        }
        Update: {
          id?: string
          skill?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learner_skills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      member_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          job_title: string | null
          phone: string | null
          phone_country_code: string | null
          preferred_language: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          job_title?: string | null
          phone?: string | null
          phone_country_code?: string | null
          preferred_language?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          job_title?: string | null
          phone?: string | null
          phone_country_code?: string | null
          preferred_language?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          attempt_number: number | null
          attempted_at: string
          id: string
          learner_id: string
          passed: boolean
          quiz_id: string
          score: number
          started_at: string | null
          submitted_at: string | null
        }
        Insert: {
          attempt_number?: number | null
          attempted_at?: string
          id?: string
          learner_id: string
          passed: boolean
          quiz_id: string
          score: number
          started_at?: string | null
          submitted_at?: string | null
        }
        Update: {
          attempt_number?: number | null
          attempted_at?: string
          id?: string
          learner_id?: string
          passed?: boolean
          quiz_id?: string
          score?: number
          started_at?: string | null
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          correct_option: number
          created_at: string
          explanation: string | null
          id: string
          options: Json
          position: number
          question_text: string
          quiz_id: string
        }
        Insert: {
          correct_option: number
          created_at?: string
          explanation?: string | null
          id?: string
          options: Json
          position?: number
          question_text: string
          quiz_id: string
        }
        Update: {
          correct_option?: number
          created_at?: string
          explanation?: string | null
          id?: string
          options?: Json
          position?: number
          question_text?: string
          quiz_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          block_id: string
          created_at: string
          generation_count: number | null
          id: string
          passing_score: number
          retry_cooldown_hours: number | null
          retry_max: number | null
          reveal_answers: boolean
          scope: Database["public"]["Enums"]["quiz_scope"]
          scope_block_ids: string[]
          title: string | null
          updated_at: string
        }
        Insert: {
          block_id: string
          created_at?: string
          generation_count?: number | null
          id?: string
          passing_score?: number
          retry_cooldown_hours?: number | null
          retry_max?: number | null
          reveal_answers?: boolean
          scope?: Database["public"]["Enums"]["quiz_scope"]
          scope_block_ids?: string[]
          title?: string | null
          updated_at?: string
        }
        Update: {
          block_id?: string
          created_at?: string
          generation_count?: number | null
          id?: string
          passing_score?: number
          retry_cooldown_hours?: number | null
          retry_max?: number | null
          reveal_answers?: boolean
          scope?: Database["public"]["Enums"]["quiz_scope"]
          scope_block_ids?: string[]
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_block_id_fkey"
            columns: ["block_id"]
            isOneToOne: true
            referencedRelation: "course_blocks"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          email_verified: boolean
          full_name: string | null
          id: string
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          created_at?: string
          email: string
          email_verified?: boolean
          full_name?: string | null
          id: string
          updated_at?: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          created_at?: string
          email?: string
          email_verified?: boolean
          full_name?: string | null
          id?: string
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      company_for_join: {
        Args: { p_business_id: string }
        Returns: {
          city: string
          contact_email: string
          contact_phone: string
          country: string
          course_count: number
          cover_url: string
          description: string
          id: string
          industry: string
          learner_count: number
          logo_url: string
          name: string
          region: string
          tagline: string
          website: string
        }[]
      }
      course_by_share_token: {
        Args: { p_token: string }
        Returns: {
          business_id: string
          business_logo_url: string
          business_name: string
          description: string
          id: string
          tagline: string
          thumbnail_url: string
          title: string
          visibility: Database["public"]["Enums"]["course_visibility"]
          what_you_will_learn: string[]
        }[]
      }
      portfolio_by_slug: {
        Args: { p_slug: string }
        Returns: {
          avatar_url: string
          bio: string
          full_name: string
          job_title: string
          user_id: string
          years_experience: string
        }[]
      }
      portfolio_certificates: {
        Args: { p_slug: string }
        Returns: {
          business_name: string
          certificate_id: string
          course_title: string
          issued_at: string
        }[]
      }
      quiz_questions_for_learner: {
        Args: { p_quiz_id: string }
        Returns: {
          id: string
          options: Json
          position: number
          question_text: string
        }[]
      }
      verify_certificate: {
        Args: { p_certificate_id: string }
        Returns: {
          business_name: string
          business_stamp_url: string
          certificate_id: string
          course_title: string
          issued_at: string
          learner_name: string
        }[]
      }
    }
    Enums: {
      block_progress_status: "locked" | "unlocked" | "completed"
      block_source_status: "empty" | "ready" | "pending" | "failed"
      block_type: "video" | "text" | "quiz"
      business_status: "active"
      business_type: "independent" | "franchise" | "chain"
      course_build_stage:
        | "basics"
        | "sequence"
        | "walkthrough"
        | "details"
        | "publish"
      course_status: "draft" | "published"
      course_visibility: "public" | "private"
      enrollment_status: "in_progress" | "completed"
      member_role: "admin" | "operator" | "auditor"
      member_status: "invited" | "active"
      quiz_navigation: "allow_back" | "lock_forward"
      quiz_navigation_override: "allow_back" | "lock_forward" | "inherit"
      quiz_scope:
        | "preceding_block"
        | "since_last_quiz"
        | "specific_blocks"
        | "whole_course"
        | "none"
      user_type: "business_owner" | "company_member" | "learner"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      block_progress_status: ["locked", "unlocked", "completed"],
      block_source_status: ["empty", "ready", "pending", "failed"],
      block_type: ["video", "text", "quiz"],
      business_status: ["active"],
      business_type: ["independent", "franchise", "chain"],
      course_build_stage: [
        "basics",
        "sequence",
        "walkthrough",
        "details",
        "publish",
      ],
      course_status: ["draft", "published"],
      course_visibility: ["public", "private"],
      enrollment_status: ["in_progress", "completed"],
      member_role: ["admin", "operator", "auditor"],
      member_status: ["invited", "active"],
      quiz_navigation: ["allow_back", "lock_forward"],
      quiz_navigation_override: ["allow_back", "lock_forward", "inherit"],
      quiz_scope: [
        "preceding_block",
        "since_last_quiz",
        "specific_blocks",
        "whole_course",
        "none",
      ],
      user_type: ["business_owner", "company_member", "learner"],
    },
  },
} as const
