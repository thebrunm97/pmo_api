// src/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

// Defina a URL do Supabase e a chave anônima

const supabaseUrl = 'https://hejewayflbuemnffrhae.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlamV3YXlmbGJ1ZW1uZmZyaGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxODUxNTYsImV4cCI6MjA2NTc2MTE1Nn0.IbncfbRBTlyQbfPah2I6CRht3maKvj2uTKIhyik6r_o';

// Cria e exporta o nosso cliente Supabase, que usaremos em toda a aplicação
export const supabase = createClient(supabaseUrl, supabaseAnonKey);