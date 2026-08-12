import { useEffect, useState } from 'react';
import { CheckersBoard } from '../components/CheckersBoard';
import { CheckersModeSelect, type CheckersOpponent } from '../components/CheckersModeSelect';
import { GamePageHeader } from '../components/GamePageHeader';
import {
  applyCheckerMove, chooseCheckerBotMove, createCheckersBoard,
  getLegalMoves, type CheckerColor, type CheckerMove,
} from '../lib/checkers';

export function CheckersPage() {
  const [opponent, setOpponent] = useState<CheckersOpponent | null>(null);
  const [board, setBoard] = useState(createCheckersBoard);
  const [turn, setTurn] = useState<CheckerColor>('red');
  const [selected, setSelected] = useState<number | null>(null);
  const [forcedFrom, setForcedFrom] = useState<number | undefined>();
  const legalMoves = getLegalMoves(board, turn, forcedFrom);
  const winner = opponent && !legalMoves.length ? (turn === 'red' ? 'Black' : 'Red') : null;
  const botThinking = opponent === 'bot' && turn === 'black' && !winner;

  useEffect(() => {
    if (!botThinking) return;
    const timer = window.setTimeout(() => {
      const move = chooseCheckerBotMove(board, forcedFrom);
      if (move) playMove(move);
    }, 550);
    return () => window.clearTimeout(timer);
  });

  function clickCell(index: number) {
    if (botThinking || winner) return;
    const move = legalMoves.find((option) => option.from === selected && option.to === index);
    if (move) {
      playMove(move);
      return;
    }
    if (legalMoves.some((option) => option.from === index)) setSelected(index);
  }

  function playMove(move: CheckerMove) {
    const result = applyCheckerMove(board, move);
    const chain = move.captured !== undefined && !result.promoted
      ? getLegalMoves(result.board, turn, move.to) : [];
    setBoard(result.board);
    if (chain.length) {
      setForcedFrom(move.to);
      setSelected(move.to);
    } else {
      setForcedFrom(undefined);
      setSelected(null);
      setTurn(turn === 'red' ? 'black' : 'red');
    }
  }

  function start(nextOpponent = opponent) {
    setOpponent(nextOpponent);
    setBoard(createCheckersBoard());
    setTurn('red');
    setSelected(null);
    setForcedFrom(undefined);
  }

  const status = winner ? `${winner} wins! 🎉` : botThinking ? 'Bot is thinking…' : `${turn === 'red' ? 'Red' : 'Black'} to move${forcedFrom !== undefined ? ' — continue capturing!' : ''}`;

  return (
    <main className="container game-page">
      <GamePageHeader number="09" />
      <section className="game-panel game-panel--checkers">
        <span className="game-icon" aria-hidden="true">⚫</span>
        <h1>Checkers</h1>
        {!opponent ? <CheckersModeSelect onSelect={start} /> : (
          <>
            <p className={`game-status ${winner ? 'game-status--winner' : ''}`}>{status}</p>
            <CheckersBoard board={board} moves={legalMoves} selected={selected} turn={turn} onCellClick={clickCell} />
            <p className="game-hint">Captures are required. Complete every available jump in a capture chain.</p>
            <div className="chess-actions"><button className="restart-button" onClick={() => start()}>New game</button><button className="mine-tool" onClick={() => setOpponent(null)}>Change mode</button></div>
          </>
        )}
      </section>
    </main>
  );
}
