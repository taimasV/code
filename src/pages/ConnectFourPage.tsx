import { useState } from 'react';
import { ConnectFourBoard } from '../components/ConnectFourBoard';
import { GamePageHeader } from '../components/GamePageHeader';
import { createConnectBoard, dropPiece, findConnectWinner, type ConnectCell } from '../lib/connectFour';

type Player = NonNullable<ConnectCell>;

export function ConnectFourPage() {
  const [board, setBoard] = useState(createConnectBoard);
  const [player, setPlayer] = useState<Player>('red');
  const winningCells = findConnectWinner(board);
  const winner = winningCells.length ? board[winningCells[0]] : null;
  const isDraw = !winner && board.every(Boolean);

  function playColumn(column: number) {
    if (winner || isDraw) return;
    const nextBoard = dropPiece(board, column, player);
    if (!nextBoard) return;
    setBoard(nextBoard);
    setPlayer(player === 'red' ? 'yellow' : 'red');
  }

  function restart() {
    setBoard(createConnectBoard());
    setPlayer('red');
  }

  const status = winner ? `${winner === 'red' ? 'Red' : 'Yellow'} wins! 🎉` : isDraw ? "It's a draw!" : `${player === 'red' ? 'Red' : 'Yellow'}'s turn`;

  return (
    <main className="container game-page">
      <GamePageHeader number="02" />
      <section className="game-panel game-panel--wide">
        <span className="game-icon" aria-hidden="true">🟡</span>
        <h1>Connect 4</h1>
        <p className={`game-status ${winner ? 'game-status--winner' : ''}`}>{status}</p>
        <ConnectFourBoard board={board} locked={Boolean(winner || isDraw)} winningCells={winningCells} onColumnClick={playColumn} />
        <button className="restart-button" onClick={restart}>Restart game</button>
      </section>
    </main>
  );
}
