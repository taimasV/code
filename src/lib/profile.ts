import { supabase } from './supabase';

export class ProfileError extends Error {
  constructor(public readonly code: string | undefined, message: string) {
    super(message);
  }
}

export async function loadNickname(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('nickname')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw new ProfileError(error.code, error.message);
  if (!data || typeof data.nickname !== 'string') return null;
  return data.nickname;
}

export async function saveNickname(userId: string, nickname: string) {
  const cleanNickname = nickname.trim();
  const { error } = await supabase.from('profiles').upsert({
    user_id: userId,
    nickname: cleanNickname,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new ProfileError(error.code, error.message);
  return cleanNickname;
}
