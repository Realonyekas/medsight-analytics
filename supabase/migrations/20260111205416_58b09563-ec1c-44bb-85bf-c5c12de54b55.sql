-- Add 'master' to subscription_plan enum for the special admin access plan
ALTER TYPE public.subscription_plan ADD VALUE IF NOT EXISTS 'master';