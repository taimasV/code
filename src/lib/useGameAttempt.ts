import { useCallback, useState } from 'react';

export function useGameAttempt() {
  const [attemptId, setAttemptId] = useState(() => crypto.randomUUID());
  const startNewAttempt = useCallback(() => setAttemptId(crypto.randomUUID()), []);
  return { attemptId, startNewAttempt };
}
