import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or Service Key is missing from .env file');
}

// The 'Database' type would need to be copied from your frontend's 
// `src/integrations/supabase/types.ts` if you want full type safety.
// For now, we can proceed without it for simplicity.
export const supabase = createClient(supabaseUrl, supabaseKey);