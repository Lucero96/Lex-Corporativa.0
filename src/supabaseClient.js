import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://taccxsmczvjfwdnpmvdj.supabase.co'; // Reemplaza con tu URL
const supabaseKey = 'sb_publishable_P7ksHWwv25HApYH7Q4JuOQ_03aPykMw';

export const supabase = createClient(supabaseUrl, supabaseKey);