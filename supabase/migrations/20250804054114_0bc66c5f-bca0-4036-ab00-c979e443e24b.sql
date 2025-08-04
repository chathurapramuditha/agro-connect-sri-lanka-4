-- Fix RLS policies for conversations table to use user_id instead of profile id
-- First, let's update the conversations table to use user_id columns
DROP POLICY "Users can create conversations" ON public.conversations;
DROP POLICY "Users can update their own conversations" ON public.conversations;
DROP POLICY "Users can view their own conversations" ON public.conversations;

-- Create new policies that work with user_id
CREATE POLICY "Users can create conversations" 
ON public.conversations 
FOR INSERT 
WITH CHECK (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);

CREATE POLICY "Users can update their own conversations" 
ON public.conversations 
FOR UPDATE 
USING (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);

CREATE POLICY "Users can view their own conversations" 
ON public.conversations 
FOR SELECT 
USING (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);

-- Update messages table policies to use user_id
DROP POLICY "Users can create messages" ON public.messages;
DROP POLICY "Users can update their own messages" ON public.messages;
DROP POLICY "Users can view their own messages" ON public.messages;

CREATE POLICY "Users can create messages" 
ON public.messages 
FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own messages" 
ON public.messages 
FOR UPDATE 
USING (auth.uid() = sender_id);

CREATE POLICY "Users can view their own messages" 
ON public.messages 
FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Enable realtime for messages and conversations
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.conversations REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;