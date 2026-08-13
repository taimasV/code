import { useEffect, useState } from 'react';
import { GamePageHeader } from '../components/GamePageHeader';
import { ReversiBoard } from '../components/ReversiBoard';
import { ReversiModeSelect, type ReversiOpponent } from '../components/ReversiModeSelect';
import {
  applyReversiMove, chooseReversiBotMove, countReversiPieces,
  createReversiBoard, getReversiMoves, type ReversiColor, type ReversiMove,
} from '../lib/reversi';

type Winner = ReversiColor | 'draw' | null;

export function ReversiPage() {
  const [opponent, setOpponent] = useState<ReversiOpponent | null>(null);
  const [board, setBoard] = useState(createReversiBoard);
  const [turn, setTurn] = useState<ReversiColor>('black');
  const [winner, setWinner] = useState<Winner>(null);
  const [notice, setNotice] = useState('');
  const moves = getReversiMoves(board, turn);
  const score = countReversiPieces(board);
  const botThinking = opponent === 'bot' && turn === 'white' && !winner;

  useEffect(() => {
    if (!botThinking) return;
    const timer = window.setTimeout(() => {
      const move = chooseReversiBotMove(board);
      if (move) playMove(move);
    }, 650);
    return () => window.clearTimeout(timer);
  });

  function playMove(move: ReversiMove) {
    const nextBoard = applyReversiMove(board, turn, move);
    setBoard(nextBoard);
    advanceTurn(nextBoard, turn);
  }

  function advanceTurn(nextBoard: ReturnType<typeof createReversiBoard>, current: ReversiColor) {
    const other = current === 'black' ? 'white' : 'black';
    if (getReversiMoves(nextBoard, other).length) {
      setTurn(other);
      setNotice('');
      return;
    }
    if (getReversiMoves(nextBoard, current).length) {
      setNotice(`${other === 'black' ? 'Black' : 'White'} has no moves and passes.`);
      return;
    }
    const finalScore = countReversiPieces(nextBoard);
    setWinner(finalScore.black === finalScore.white ? 'draw' : finalScore.black > finalScore.white ? 'black' : 'white');
  }

  function start(nextOpponent = opponent) {
    setOpponent(nextOpponent);
    setBoard(createReversiBoard());
    setTurn('black');
    setWinner(null);
    setNotice('');
  }

  const status = winner === 'draw' ? "It's a draw!" : winner
    ? `${winner === 'black' ? 'Black' : 'White'} wins! 🎉`
    : botThinking ? 'Bot is thinking…' : notice || `${turn === 'black' ? 'Black' : 'White'} to move`;

  return (
    <main className="container game-page">
      <GamePageHeader number="10" />
      <section className="game-panel game-panel--reversi">
        <span className="game-icon" aria-hidden="true">⚪</span>
        <h1>Reversi</h1>
        {!opponent ? <ReversiModeSelect onSelect={start} /> : (
          <>
            <p className={`game-status ${winner ? 'game-status--winner' : ''}`}>{status}</p>
            <div className="reversi-score"><span>⚫ Black <strong>{score.black}</strong></span><span>⚪ White <strong>{score.white}</strong></span></div>
            <ReversiBoard board={board} moves={moves} disabled={botThinking || Boolean(winner)} onMove={playMove} />
            <p className="game-hint">Place a piece to trap one or more opponent pieces between your own.</p>
            <div className="chess-actions"><button className="restart-button" onClick={() => start()}>New game</button><button className="mine-tool" onClick={() => setOpponent(null)}>Change mode</button></div>
          </>
        )}
      </section>
    </main>
  );
}
