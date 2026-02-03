/**
 * Supabase Client Configuration
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Check if Supabase is configured
 */
export const isSupabaseConfigured = () => {
  return supabase !== null;
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

/**
 * Save study session
 */
export const saveStudySession = async (sessionData) => {
  if (!supabase) {
    console.warn('Supabase not configured. Session not saved to cloud.');
    return null;
  }

  const user = await getCurrentUser();
  if (!user) {
    console.warn('User not authenticated. Session not saved to cloud.');
    return null;
  }

  const { data, error } = await supabase
    .from('study_sessions')
    .insert({
      user_id: user.id,
      pdf_name: sessionData.pdfName,
      chapter_name: sessionData.chapterName,
      theme: sessionData.theme,
      content: sessionData.content
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving study session:', error);
    throw error;
  }

  return data;
};

/**
 * Get user's study sessions
 */
export const getStudySessions = async (limit = 10) => {
  if (!supabase) return [];

  const user = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('study_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching study sessions:', error);
    return [];
  }

  return data;
};

/**
 * Get user preferences
 */
export const getUserPreferences = async () => {
  if (!supabase) return null;

  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('study_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching preferences:', error);
    return null;
  }

  return data;
};

/**
 * Update user preferences
 */
export const updateUserPreferences = async (preferences) => {
  if (!supabase) return null;

  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('study_preferences')
    .upsert({
      user_id: user.id,
      ...preferences
    })
    .select()
    .single();

  if (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }

  return data;
};
