-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flow_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flow_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- WhatsApp Instances policies
CREATE POLICY "Users can view own instances" ON public.whatsapp_instances
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own instances" ON public.whatsapp_instances
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own instances" ON public.whatsapp_instances
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own instances" ON public.whatsapp_instances
  FOR DELETE USING (auth.uid() = user_id);

-- Chatbot Configs policies
CREATE POLICY "Users can view own chatbot configs" ON public.chatbot_configs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.whatsapp_instances
      WHERE id = chatbot_configs.instance_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own chatbot configs" ON public.chatbot_configs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.whatsapp_instances
      WHERE id = chatbot_configs.instance_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own chatbot configs" ON public.chatbot_configs
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.whatsapp_instances
      WHERE id = chatbot_configs.instance_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own chatbot configs" ON public.chatbot_configs
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.whatsapp_instances
      WHERE id = chatbot_configs.instance_id AND user_id = auth.uid()
    )
  );

-- Flow Nodes policies
CREATE POLICY "Users can view own flow nodes" ON public.flow_nodes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chatbot_configs cc
      JOIN public.whatsapp_instances wi ON wi.id = cc.instance_id
      WHERE cc.id = flow_nodes.config_id AND wi.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own flow nodes" ON public.flow_nodes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chatbot_configs cc
      JOIN public.whatsapp_instances wi ON wi.id = cc.instance_id
      WHERE cc.id = flow_nodes.config_id AND wi.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own flow nodes" ON public.flow_nodes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.chatbot_configs cc
      JOIN public.whatsapp_instances wi ON wi.id = cc.instance_id
      WHERE cc.id = flow_nodes.config_id AND wi.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own flow nodes" ON public.flow_nodes
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.chatbot_configs cc
      JOIN public.whatsapp_instances wi ON wi.id = cc.instance_id
      WHERE cc.id = flow_nodes.config_id AND wi.user_id = auth.uid()
    )
  );

-- Flow Edges policies
CREATE POLICY "Users can view own flow edges" ON public.flow_edges
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chatbot_configs cc
      JOIN public.whatsapp_instances wi ON wi.id = cc.instance_id
      WHERE cc.id = flow_edges.config_id AND wi.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own flow edges" ON public.flow_edges
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chatbot_configs cc
      JOIN public.whatsapp_instances wi ON wi.id = cc.instance_id
      WHERE cc.id = flow_edges.config_id AND wi.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own flow edges" ON public.flow_edges
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.chatbot_configs cc
      JOIN public.whatsapp_instances wi ON wi.id = cc.instance_id
      WHERE cc.id = flow_edges.config_id AND wi.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own flow edges" ON public.flow_edges
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.chatbot_configs cc
      JOIN public.whatsapp_instances wi ON wi.id = cc.instance_id
      WHERE cc.id = flow_edges.config_id AND wi.user_id = auth.uid()
    )
  );

-- Leads policies
CREATE POLICY "Users can view own leads" ON public.leads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.whatsapp_instances
      WHERE id = leads.instance_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own leads" ON public.leads
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.whatsapp_instances
      WHERE id = leads.instance_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own leads" ON public.leads
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.whatsapp_instances
      WHERE id = leads.instance_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own leads" ON public.leads
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.whatsapp_instances
      WHERE id = leads.instance_id AND user_id = auth.uid()
    )
  );

-- Conversations policies
CREATE POLICY "Users can view own conversations" ON public.conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.whatsapp_instances
      WHERE id = conversations.instance_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own conversations" ON public.conversations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.whatsapp_instances
      WHERE id = conversations.instance_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own conversations" ON public.conversations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.whatsapp_instances
      WHERE id = conversations.instance_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own conversations" ON public.conversations
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.whatsapp_instances
      WHERE id = conversations.instance_id AND user_id = auth.uid()
    )
  );

-- Messages policies
CREATE POLICY "Users can view own messages" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      JOIN public.whatsapp_instances wi ON wi.id = c.instance_id
      WHERE c.id = messages.conversation_id AND wi.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own messages" ON public.messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations c
      JOIN public.whatsapp_instances wi ON wi.id = c.instance_id
      WHERE c.id = messages.conversation_id AND wi.user_id = auth.uid()
    )
  );

-- Quick Replies policies
CREATE POLICY "Users can view own quick replies" ON public.quick_replies
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quick replies" ON public.quick_replies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quick replies" ON public.quick_replies
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own quick replies" ON public.quick_replies
  FOR DELETE USING (auth.uid() = user_id);

-- Analytics Events policies
CREATE POLICY "Users can view own analytics" ON public.analytics_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.whatsapp_instances
      WHERE id = analytics_events.instance_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own analytics" ON public.analytics_events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.whatsapp_instances
      WHERE id = analytics_events.instance_id AND user_id = auth.uid()
    )
  );
