-- Fix conversations and messages tables to use user_id instead of profile id
-- First update the conversations table structure and data
-- Add new columns for user_id
ALTER TABLE public.conversations 
ADD COLUMN participant_1_user_id UUID,
ADD COLUMN participant_2_user_id UUID;

-- Update the new columns with user_id values from profiles table
UPDATE public.conversations 
SET participant_1_user_id = (
  SELECT user_id FROM public.profiles WHERE id = participant_1_id
),
participant_2_user_id = (
  SELECT user_id FROM public.profiles WHERE id = participant_2_id
);

-- Drop old columns and rename new ones
ALTER TABLE public.conversations DROP COLUMN participant_1_id;
ALTER TABLE public.conversations DROP COLUMN participant_2_id;
ALTER TABLE public.conversations RENAME COLUMN participant_1_user_id TO participant_1_id;
ALTER TABLE public.conversations RENAME COLUMN participant_2_user_id TO participant_2_id;

-- Make the columns not null
ALTER TABLE public.conversations ALTER COLUMN participant_1_id SET NOT NULL;
ALTER TABLE public.conversations ALTER COLUMN participant_2_id SET NOT NULL;

-- Update messages table structure and data
-- Add new columns for user_id
ALTER TABLE public.messages 
ADD COLUMN sender_user_id UUID,
ADD COLUMN receiver_user_id UUID;

-- Update the new columns with user_id values from profiles table
UPDATE public.messages 
SET sender_user_id = (
  SELECT user_id FROM public.profiles WHERE id = sender_id
),
receiver_user_id = (
  SELECT user_id FROM public.profiles WHERE id = receiver_id
);

-- Drop old columns and rename new ones
ALTER TABLE public.messages DROP COLUMN sender_id;
ALTER TABLE public.messages DROP COLUMN receiver_id;
ALTER TABLE public.messages RENAME COLUMN sender_user_id TO sender_id;
ALTER TABLE public.messages RENAME COLUMN receiver_user_id TO receiver_id;

-- Make the columns not null
ALTER TABLE public.messages ALTER COLUMN sender_id SET NOT NULL;
ALTER TABLE public.messages ALTER COLUMN receiver_id SET NOT NULL;