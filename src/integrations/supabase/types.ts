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
      addresses: {
        Row: {
          city: string
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          state: string
          street_address1: string
          street_address2: string | null
          type: string | null
          updated_at: string
          used_in_order: boolean | null
          user_id: string
          zip_code: string
        }
        Insert: {
          city: string
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          state: string
          street_address1: string
          street_address2?: string | null
          type?: string | null
          updated_at?: string
          used_in_order?: boolean | null
          user_id: string
          zip_code: string
        }
        Update: {
          city?: string
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          state?: string
          street_address1?: string
          street_address2?: string | null
          type?: string | null
          updated_at?: string
          used_in_order?: boolean | null
          user_id?: string
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "crm_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action_type: string
          admin_id: string
          created_at: string
          details: Json | null
          entity_id: string
          entity_type: string
          id: string
        }
        Insert: {
          action_type: string
          admin_id: string
          created_at?: string
          details?: Json | null
          entity_id: string
          entity_type: string
          id?: string
        }
        Update: {
          action_type?: string
          admin_id?: string
          created_at?: string
          details?: Json | null
          entity_id?: string
          entity_type?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "crm_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bulk_actions: {
        Row: {
          action_type: Database["public"]["Enums"]["bulk_action_type"]
          affected_records: number | null
          created_at: string | null
          created_by: string | null
          details: Json | null
          entity_type: string
          error_message: string | null
          file_url: string | null
          id: string
          status: Database["public"]["Enums"]["bulk_action_status"]
          updated_at: string | null
        }
        Insert: {
          action_type: Database["public"]["Enums"]["bulk_action_type"]
          affected_records?: number | null
          created_at?: string | null
          created_by?: string | null
          details?: Json | null
          entity_type: string
          error_message?: string | null
          file_url?: string | null
          id?: string
          status?: Database["public"]["Enums"]["bulk_action_status"]
          updated_at?: string | null
        }
        Update: {
          action_type?: Database["public"]["Enums"]["bulk_action_type"]
          affected_records?: number | null
          created_at?: string | null
          created_by?: string | null
          details?: Json | null
          entity_type?: string
          error_message?: string | null
          file_url?: string | null
          id?: string
          status?: Database["public"]["Enums"]["bulk_action_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bulk_actions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "crm_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bulk_actions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "crm_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          code: string
          created_at: string | null
          discount_type: string
          discount_value: number
          id: string
          is_active: boolean | null
          updated_at: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          discount_type?: string
          discount_value: number
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          discount_type?: string
          discount_value?: number
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string
          file_type: string
          file_url: string
          id: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          file_type: string
          file_url: string
          id?: string
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          file_type?: string
          file_url?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "crm_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_quiz_responses: {
        Row: {
          answers: Json
          completed_at: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          answers: Json
          completed_at?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          answers?: Json
          completed_at?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketing_quiz_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "crm_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketing_quiz_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_quiz_responses_pt: {
        Row: {
          answers: Json
          completed_at: string | null
          created_at: string | null
          email: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          answers: Json
          completed_at?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          answers?: Json
          completed_at?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      media_library: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          file_name: string
          file_size: number
          file_url: string
          id: string
          mime_type: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          file_name: string
          file_size: number
          file_url: string
          id?: string
          mime_type: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          file_name?: string
          file_size?: number
          file_url?: string
          id?: string
          mime_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      otp_attempts: {
        Row: {
          attempt_count: number | null
          created_at: string | null
          email: string
          id: string
          last_attempt: string | null
        }
        Insert: {
          attempt_count?: number | null
          created_at?: string | null
          email: string
          id?: string
          last_attempt?: string | null
        }
        Update: {
          attempt_count?: number | null
          created_at?: string | null
          email?: string
          id?: string
          last_attempt?: string | null
        }
        Relationships: []
      }
      package_quizzes: {
        Row: {
          additional_notes: string | null
          created_at: string
          current_step: number | null
          id: string
          label_style: string | null
          logo_placement: string | null
          primary_color: string | null
          project_id: string
          reference_labels: string[] | null
          secondary_color: string | null
          status: string | null
          typography_choice: string | null
          updated_at: string
          user_id: string
          visual_elements: string[] | null
        }
        Insert: {
          additional_notes?: string | null
          created_at?: string
          current_step?: number | null
          id?: string
          label_style?: string | null
          logo_placement?: string | null
          primary_color?: string | null
          project_id: string
          reference_labels?: string[] | null
          secondary_color?: string | null
          status?: string | null
          typography_choice?: string | null
          updated_at?: string
          user_id: string
          visual_elements?: string[] | null
        }
        Update: {
          additional_notes?: string | null
          created_at?: string
          current_step?: number | null
          id?: string
          label_style?: string | null
          logo_placement?: string | null
          primary_color?: string | null
          project_id?: string
          reference_labels?: string[] | null
          secondary_color?: string | null
          status?: string | null
          typography_choice?: string | null
          updated_at?: string
          user_id?: string
          visual_elements?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "package_quizzes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_quizzes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "crm_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_quizzes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          is_primary: boolean | null
          position: number
          product_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          is_primary?: boolean | null
          position?: number
          product_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          is_primary?: boolean | null
          position?: number
          product_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string
          description: string | null
          from_price: number
          id: string
          image_url: string | null
          is_new: boolean | null
          is_tiktok: boolean | null
          name: string
          srp: number
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          from_price: number
          id?: string
          image_url?: string | null
          is_new?: boolean | null
          is_tiktok?: boolean | null
          name: string
          srp: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          from_price?: number
          id?: string
          image_url?: string | null
          is_new?: boolean | null
          is_tiktok?: boolean | null
          name?: string
          srp?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          billing_address_street: string | null
          billing_address_street2: string | null
          billing_city: string | null
          billing_state: string | null
          billing_zip: string | null
          brand_status: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          instagram_handle: string | null
          language: string | null
          last_name: string | null
          launch_urgency: string | null
          name: string | null
          onboarding_completed: boolean | null
          phone: string | null
          product_interest: Json | null
          profile_type: string | null
          role: string
          shipping_address_city: string | null
          shipping_address_state: string | null
          shipping_address_street: string | null
          shipping_address_street2: string | null
          shipping_address_zip: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          billing_address_street?: string | null
          billing_address_street2?: string | null
          billing_city?: string | null
          billing_state?: string | null
          billing_zip?: string | null
          brand_status?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          instagram_handle?: string | null
          language?: string | null
          last_name?: string | null
          launch_urgency?: string | null
          name?: string | null
          onboarding_completed?: boolean | null
          phone?: string | null
          product_interest?: Json | null
          profile_type?: string | null
          role?: string
          shipping_address_city?: string | null
          shipping_address_state?: string | null
          shipping_address_street?: string | null
          shipping_address_street2?: string | null
          shipping_address_zip?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          billing_address_street?: string | null
          billing_address_street2?: string | null
          billing_city?: string | null
          billing_state?: string | null
          billing_zip?: string | null
          brand_status?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          instagram_handle?: string | null
          language?: string | null
          last_name?: string | null
          launch_urgency?: string | null
          name?: string | null
          onboarding_completed?: boolean | null
          phone?: string | null
          product_interest?: Json | null
          profile_type?: string | null
          role?: string
          shipping_address_city?: string | null
          shipping_address_state?: string | null
          shipping_address_street?: string | null
          shipping_address_street2?: string | null
          shipping_address_zip?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      project_meetings: {
        Row: {
          created_at: string | null
          id: string
          meeting_link: string | null
          project_id: string
          scheduled_at: string | null
          scheduled_for: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          meeting_link?: string | null
          project_id: string
          scheduled_at?: string | null
          scheduled_for: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          meeting_link?: string | null
          project_id?: string
          scheduled_at?: string | null
          scheduled_for?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_meetings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_meetings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "crm_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_meetings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_products: {
        Row: {
          created_at: string
          id: string
          product_id: string | null
          project_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id?: string | null
          project_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string | null
          project_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_products_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_specific_products: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          images: Json | null
          main_image_url: string | null
          name: string | null
          project_product_id: string | null
          selling_price: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          images?: Json | null
          main_image_url?: string | null
          name?: string | null
          project_product_id?: string | null
          selling_price?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          images?: Json | null
          main_image_url?: string | null
          name?: string | null
          project_product_id?: string | null
          selling_price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_specific_products_project_product_id_fkey"
            columns: ["project_product_id"]
            isOneToOne: false
            referencedRelation: "project_products"
            referencedColumns: ["id"]
          },
        ]
      }
      project_stages: {
        Row: {
          created_at: string
          id: string
          name: string
          position: number | null
          project_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          position?: number | null
          project_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          position?: number | null
          project_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_stages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_tasks: {
        Row: {
          assignee_id: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          position: number | null
          project_id: string | null
          stage_id: string | null
          stage_position: number | null
          start_date: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          position?: number | null
          project_id?: string | null
          stage_id?: string | null
          stage_position?: number | null
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          position?: number | null
          project_id?: string | null
          stage_id?: string | null
          stage_position?: number | null
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_tasks_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "crm_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tasks_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tasks_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "project_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      project_team_members: {
        Row: {
          created_at: string
          id: string
          project_id: string | null
          role: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          project_id?: string | null
          role: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string | null
          role?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_team_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "crm_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          cover_image_url: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          pack_type: Database["public"]["Enums"]["project_pack_type"]
          points: number | null
          points_used: number | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          pack_type?: Database["public"]["Enums"]["project_pack_type"]
          points?: number | null
          points_used?: number | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          pack_type?: Database["public"]["Enums"]["project_pack_type"]
          points?: number | null
          points_used?: number | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "crm_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sample_request_products: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          sample_request_id: string
          unit_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          sample_request_id: string
          unit_price?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          sample_request_id?: string
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sample_request_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sample_request_products_sample_request_id_fkey"
            columns: ["sample_request_id"]
            isOneToOne: false
            referencedRelation: "sample_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      sample_requests: {
        Row: {
          billing_address: string | null
          billing_city: string | null
          billing_state: string | null
          billing_zip: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          payment_method: string | null
          product_id: string | null
          shipping_address: string | null
          shipping_city: string | null
          shipping_cost: number | null
          shipping_state: string | null
          shipping_zip: string | null
          shopify_order_id: string | null
          status: string | null
          subtotal: number
          total: number
          tracking_number: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          billing_address?: string | null
          billing_city?: string | null
          billing_state?: string | null
          billing_zip?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          payment_method?: string | null
          product_id?: string | null
          shipping_address?: string | null
          shipping_city?: string | null
          shipping_cost?: number | null
          shipping_state?: string | null
          shipping_zip?: string | null
          shopify_order_id?: string | null
          status?: string | null
          subtotal?: number
          total?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          billing_address?: string | null
          billing_city?: string | null
          billing_state?: string | null
          billing_zip?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          payment_method?: string | null
          product_id?: string | null
          shipping_address?: string | null
          shipping_city?: string | null
          shipping_cost?: number | null
          shipping_state?: string | null
          shipping_zip?: string | null
          shopify_order_id?: string | null
          status?: string | null
          subtotal?: number
          total?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sample_requests_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sample_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "crm_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sample_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_rates: {
        Row: {
          additional_rate_per_item: number | null
          base_rate: number
          country: string
          created_at: string
          id: string
          max_items: number | null
          min_items: number
          updated_at: string
        }
        Insert: {
          additional_rate_per_item?: number | null
          base_rate: number
          country: string
          created_at?: string
          id?: string
          max_items?: number | null
          min_items: number
          updated_at?: string
        }
        Update: {
          additional_rate_per_item?: number | null
          base_rate?: number
          country?: string
          created_at?: string
          id?: string
          max_items?: number | null
          min_items?: number
          updated_at?: string
        }
        Relationships: []
      }
      shopify_logs: {
        Row: {
          created_at: string
          error: string | null
          id: string
          payload: Json
          status: string
          topic: string
        }
        Insert: {
          created_at?: string
          error?: string | null
          id?: string
          payload: Json
          status: string
          topic: string
        }
        Update: {
          created_at?: string
          error?: string | null
          id?: string
          payload?: Json
          status?: string
          topic?: string
        }
        Relationships: []
      }
      shopify_products: {
        Row: {
          created_at: string | null
          id: string
          last_synced_at: string | null
          product_id: string | null
          shopify_id: string
          shopify_variant_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_synced_at?: string | null
          product_id?: string | null
          shopify_id: string
          shopify_variant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_synced_at?: string | null
          product_id?: string | null
          shopify_id?: string
          shopify_variant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shopify_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      user_permissions: {
        Row: {
          can_manage_bulk_actions: boolean | null
          can_manage_catalog: boolean | null
          can_manage_crm: boolean | null
          can_manage_orders: boolean | null
          can_manage_projects: boolean | null
          can_manage_users: boolean | null
          can_view_reports: boolean | null
          created_at: string
          id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          can_manage_bulk_actions?: boolean | null
          can_manage_catalog?: boolean | null
          can_manage_crm?: boolean | null
          can_manage_orders?: boolean | null
          can_manage_projects?: boolean | null
          can_manage_users?: boolean | null
          can_view_reports?: boolean | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          can_manage_bulk_actions?: boolean | null
          can_manage_catalog?: boolean | null
          can_manage_crm?: boolean | null
          can_manage_orders?: boolean | null
          can_manage_projects?: boolean | null
          can_manage_users?: boolean | null
          can_view_reports?: boolean | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          created_at: string
          id: string
          payload: Json
          topic: string
        }
        Insert: {
          created_at?: string
          id?: string
          payload: Json
          topic: string
        }
        Update: {
          created_at?: string
          id?: string
          payload?: Json
          topic?: string
        }
        Relationships: []
      }
    }
    Views: {
      crm_view: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string | null
          last_name: string | null
          phone: string | null
          projects: Json | null
          role: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      bulk_action_status: "pending" | "processing" | "completed" | "failed"
      bulk_action_type: "import" | "delete" | "contacts"
      profile_type: "general" | "design" | "backend"
      project_pack_type: "start" | "pro" | "ultra"
      user_role:
        | "admin"
        | "member"
        | "sampler"
        | "team_member"
        | "designer_partner"
        | "customer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
