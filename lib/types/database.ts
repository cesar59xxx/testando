export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          company_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          company_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          company_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      whatsapp_instances: {
        Row: {
          id: string
          user_id: string
          name: string
          phone_number: string | null
          status: "disconnected" | "connecting" | "connected" | "error"
          qr_code: string | null
          webhook_url: string | null
          api_key: string | null
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          phone_number?: string | null
          status?: "disconnected" | "connecting" | "connected" | "error"
          qr_code?: string | null
          webhook_url?: string | null
          api_key?: string | null
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          phone_number?: string | null
          status?: "disconnected" | "connecting" | "connected" | "error"
          qr_code?: string | null
          webhook_url?: string | null
          api_key?: string | null
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      chatbot_configs: {
        Row: {
          id: string
          instance_id: string
          name: string
          is_active: boolean
          welcome_message: string
          initial_options: Json
          flows: Json
          openai_enabled: boolean
          openai_api_key: string | null
          openai_model: string
          openai_instructions: string | null
          fallback_message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          instance_id: string
          name: string
          is_active?: boolean
          welcome_message: string
          initial_options?: Json
          flows?: Json
          openai_enabled?: boolean
          openai_api_key?: string | null
          openai_model?: string
          openai_instructions?: string | null
          fallback_message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          instance_id?: string
          name?: string
          is_active?: boolean
          welcome_message?: string
          initial_options?: Json
          flows?: Json
          openai_enabled?: boolean
          openai_api_key?: string | null
          openai_model?: string
          openai_instructions?: string | null
          fallback_message?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          instance_id: string
          phone_number: string
          name: string | null
          email: string | null
          status: "new" | "contacted" | "qualified" | "converted" | "lost"
          source: string | null
          tags: string[]
          custom_fields: Json
          notes: string | null
          last_interaction: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          instance_id: string
          phone_number: string
          name?: string | null
          email?: string | null
          status?: "new" | "contacted" | "qualified" | "converted" | "lost"
          source?: string | null
          tags?: string[]
          custom_fields?: Json
          notes?: string | null
          last_interaction?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          instance_id?: string
          phone_number?: string
          name?: string | null
          email?: string | null
          status?: "new" | "contacted" | "qualified" | "converted" | "lost"
          source?: string | null
          tags?: string[]
          custom_fields?: Json
          notes?: string | null
          last_interaction?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          instance_id: string
          lead_id: string | null
          phone_number: string
          status: "open" | "closed" | "archived"
          is_bot_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          instance_id: string
          lead_id?: string | null
          phone_number: string
          status?: "open" | "closed" | "archived"
          is_bot_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          instance_id?: string
          lead_id?: string | null
          phone_number?: string
          status?: "open" | "closed" | "archived"
          is_bot_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          message_id: string | null
          direction: "inbound" | "outbound"
          content: string
          type: "text" | "image" | "video" | "audio" | "document"
          media_url: string | null
          is_from_bot: boolean
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          message_id?: string | null
          direction: "inbound" | "outbound"
          content: string
          type?: "text" | "image" | "video" | "audio" | "document"
          media_url?: string | null
          is_from_bot?: boolean
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          message_id?: string | null
          direction?: "inbound" | "outbound"
          content?: string
          type?: "text" | "image" | "video" | "audio" | "document"
          media_url?: string | null
          is_from_bot?: boolean
          metadata?: Json
          created_at?: string
        }
      }
      quick_replies: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          created_at?: string
        }
      }
      analytics_events: {
        Row: {
          id: string
          instance_id: string
          event_type: string
          event_data: Json
          created_at: string
        }
        Insert: {
          id?: string
          instance_id: string
          event_type: string
          event_data?: Json
          created_at?: string
        }
        Update: {
          id?: string
          instance_id?: string
          event_type?: string
          event_data?: Json
          created_at?: string
        }
      }
    }
  }
}
