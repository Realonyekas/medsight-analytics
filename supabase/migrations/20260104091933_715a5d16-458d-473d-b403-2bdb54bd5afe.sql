-- Move extensions to a dedicated schema
CREATE SCHEMA IF NOT EXISTS extensions;

-- Reinstall extensions in proper schema
DROP EXTENSION IF EXISTS pg_cron;
DROP EXTENSION IF EXISTS pg_net;

CREATE EXTENSION IF NOT EXISTS pg_cron SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net SCHEMA extensions;