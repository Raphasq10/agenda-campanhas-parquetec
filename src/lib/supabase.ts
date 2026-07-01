import { createClient } from '@supabase/supabase-js'

// Lê as chaves públicas do arquivo de variáveis de ambiente (.env.local)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Inicializa o cliente de conexão do Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
