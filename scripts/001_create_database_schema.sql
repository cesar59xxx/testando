-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extended from auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  company_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WhatsApp Instances table
CREATE TABLE IF NOT EXISTS public.whatsapp_instances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone_number TEXT,
  status TEXT NOT NULL DEFAULT 'disconnected', -- disconnected, connecting, connected, error
  qr_code TEXT,
  webhook_url TEXT,
  api_key TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chatbot Configurations table
CREATE TABLE IF NOT EXISTS public.chatbot_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instance_id UUID NOT NULL REFERENCES public.whatsapp_instances(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  welcome_message TEXT NOT NULL,
  initial_options JSONB DEFAULT '[]',
  flows JSONB DEFAULT '[]',
  openai_enabled BOOLEAN DEFAULT false,
  openai_api_key TEXT,
  openai_model TEXT DEFAULT 'gpt-4',
  openai_instructions TEXT,
  fallback_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chatbot Flow Nodes table (for visual flow builder)
CREATE TABLE IF NOT EXISTS public.flow_nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  config_id UUID NOT NULL REFERENCES public.chatbot_configs(id) ON DELETE CASCADE,
  node_id TEXT NOT NULL,
  type TEXT NOT NULL, -- message, question, condition, api, ai
  position_x FLOAT NOT NULL,
  position_y FLOAT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(config_id, node_id)
);

-- Chatbot Flow Edges table (connections between nodes)
CREATE TABLE IF NOT EXISTS public.flow_edges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  config_id UUID NOT NULL REFERENCES public.chatbot_configs(id) ON DELETE CASCADE,
  edge_id TEXT NOT NULL,
  source TEXT NOT NULL,
  target TEXT NOT NULL,
  label TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(config_id, edge_id)
);

-- Leads table
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instance_id UUID NOT NULL REFERENCES public.whatsapp_instances(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  name TEXT,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'new', -- new, contacted, qualified, converted, lost
  source TEXT, -- chatbot, manual, import
  tags TEXT[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  notes TEXT,
  last_interaction TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(instance_id, phone_number)
);

-- Conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instance_id UUID NOT NULL REFERENCES public.whatsapp_instances(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  phone_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open', -- open, closed, archived
  is_bot_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  message_id TEXT UNIQUE, -- WhatsApp message ID
  direction TEXT NOT NULL, -- inbound, outbound
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'text', -- text, image, video, audio, document
  media_url TEXT,
  is_from_bot BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quick Replies table
CREATE TABLE IF NOT EXISTS public.quick_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics Events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instance_id UUID NOT NULL REFERENCES public.whatsapp_instances(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- message_sent, message_received, lead_created, bot_triggered, etc
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_whatsapp_instances_user_id ON public.whatsapp_instances(user_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_configs_instance_id ON public.chatbot_configs(instance_id);
CREATE INDEX IF NOT EXISTS idx_flow_nodes_config_id ON public.flow_nodes(config_id);
CREATE INDEX IF NOT EXISTS idx_flow_edges_config_id ON public.flow_edges(config_id);
CREATE INDEX IF NOT EXISTS idx_leads_instance_id ON public.leads(instance_id);
CREATE INDEX IF NOT EXISTS idx_leads_phone_number ON public.leads(phone_number);
CREATE INDEX IF NOT EXISTS idx_conversations_instance_id ON public.conversations(instance_id);
CREATE INDEX IF NOT EXISTS idx_conversations_lead_id ON public.conversations(lead_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_instance_id ON public.analytics_events(instance_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_whatsapp_instances_updated_at BEFORE UPDATE ON public.whatsapp_instances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chatbot_configs_updated_at BEFORE UPDATE ON public.chatbot_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flow_nodes_updated_at BEFORE UPDATE ON public.flow_nodes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
