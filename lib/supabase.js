import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// A Server Actions s'aconsella utilitzar SUPABASE_SERVICE_ROLE_KEY per a operacions d'escriptura admin/segures,
// o SUPABASE_ANON_KEY/NEXT_PUBLIC_SUPABASE_ANON_KEY si s'usa seguretat a nivell de fila (RLS).
const supabaseKey = 
  process.env.SUPABASE_SERVICE_ROLE_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "Avís: Falta NEXT_PUBLIC_SUPABASE_URL o les claus de Supabase a les variables d'entorn."
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');
