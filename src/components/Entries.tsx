import { useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { SupabaseSetupMessage } from './SupabaseSetupMessage';

// Database example: read, add, and remove the current user's entries.
// The `entries` table is created by a migration in supabase/migrations/.
// Adapt it to quizzes, habits, places, cards, or another product idea.
type Entry = {
  id: string;
  title: string;
  created_at: string;
};

export function Entries({ userEmail }: { userEmail: string }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  async function load() {
    const { data, error } = await supabase
      .from('entries')
      .select('id, title, created_at')
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setEntries(data ?? []);
  }

  useEffect(() => {
    if (isSupabaseConfigured) void load();
  }, []);

  if (!isSupabaseConfigured) return <SupabaseSetupMessage />;

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const { error } = await supabase.from('entries').insert({ title: title.trim() });
    if (error) setError(error.message);
    else {
      setTitle('');
      load();
    }
  }

  async function remove(id: string) {
    const { error } = await supabase.from('entries').delete().eq('id', id);
    if (error) setError(error.message);
    else load();
  }

  return (
    <section className="card">
      <p className="hello">Hello, {userEmail} 👋</p>
      <h2>My entries</h2>

      <form onSubmit={add} className="form-row">
        <input
          placeholder="add something…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {error && <p className="message">{error}</p>}

      {entries.length === 0 ? (
        <p className="empty">Nothing here yet. Add your first entry 👆</p>
      ) : (
        <ul className="list">
          {entries.map((it) => (
            <li key={it.id}>
              <span>{it.title}</span>
              <button className="ghost small" onClick={() => remove(it.id)}>
                delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
