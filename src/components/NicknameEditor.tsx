import { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { loadNickname, ProfileError, saveNickname } from '../lib/profile';

type NicknameEditorProps = { email?: string; userId: string };

export function NicknameEditor({ email, userId }: NicknameEditorProps) {
  const { t } = useLanguage();
  const [nickname, setNickname] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    void loadNickname(userId).then((value) => {
      setNickname(value);
      setDraft(value ?? '');
    }).catch(() => setMessage(t('profileError')));
  }, [t, userId]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draft.trim().length < 2 || draft.trim().length > 24) {
      setMessage(t('nicknameLength'));
      return;
    }

    setBusy(true);
    setMessage('');
    try {
      const saved = await saveNickname(userId, draft);
      setNickname(saved);
      setDraft(saved);
      setEditing(false);
    } catch (error) {
      setMessage(error instanceof ProfileError && error.code === '23505' ? t('nicknameTaken') : t('profileError'));
    } finally {
      setBusy(false);
    }
  }

  if (!editing) {
    return (
      <button className="nickname-button" type="button" title={email} onClick={() => setEditing(true)}>
        {nickname ?? t('setNickname')}
      </button>
    );
  }

  return (
    <form className="nickname-form" onSubmit={submit}>
      <input aria-label={t('nickname')} autoFocus maxLength={24} placeholder={t('nicknamePlaceholder')} value={draft} onChange={(event) => setDraft(event.target.value)} />
      <button type="submit" disabled={busy}>{busy ? '…' : t('save')}</button>
      <button type="button" onClick={() => { setDraft(nickname ?? ''); setEditing(false); setMessage(''); }}>{t('cancel')}</button>
      {message && <small role="status">{message}</small>}
    </form>
  );
}
