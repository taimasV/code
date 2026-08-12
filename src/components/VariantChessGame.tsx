import { useEffect, useRef, useState } from 'react';
import { normalizeMove, type Position } from 'chessops/chess';
import { makeSanAndPlay } from 'chessops/san';
import type { Move, Role, Square } from 'chessops/types';
import { Crazyhouse, ThreeCheck } from 'chessops/variant';
import { CrazyhousePocket } from './CrazyhousePocket';
import type { ChessOpponent } from './ChessModeSelect';
import type { ChessVariant } from './ChessVariantSelect';
import { ChessMoves } from './ChessMoves';
import { VariantChessBoard } from './VariantChessBoard';
import type { ChessRating } from '../lib/chessBot';
import { chooseVariantBotMove } from '../lib/variantChessBot';

type VariantChessGameProps = {
  botRating: ChessRating;
  mode: Exclude<ChessVariant, 'standard'>;
  onChangeMode: () => void;
  opponent: ChessOpponent;
};

export function VariantChessGame({ botRating, mode, onChangeMode, opponent }: VariantChessGameProps) {
  const position = useRef<Position>(mode === 'crazyhouse' ? Crazyhouse.default() : ThreeCheck.default());
  const [revision, refresh] = useState(0);
  const [selected, setSelected] = useState<Square | null>(null);
  const [dropRole, setDropRole] = useState<Role | null>(null);
  const [moves, setMoves] = useState<string[]>([]);
  const dropTargets = dropRole
    ? [...position.current.dropDests()].filter((to) => position.current.isLegal({ role: dropRole, to }))
    : [];
  const legalTargets = new Set<Square>(dropRole ? dropTargets : selected !== null ? position.current.dests(selected) : []);
  const botThinking = opponent === 'bot' && position.current.turn === 'black' && !position.current.isEnd();

  useEffect(() => {
    if (!botThinking) return;
    const timer = window.setTimeout(() => {
      const move = chooseVariantBotMove(position.current, botRating);
      const notation = makeSanAndPlay(position.current, move);
      setMoves((current) => [...current, notation]);
      refresh((value) => value + 1);
    }, 650);
    return () => window.clearTimeout(timer);
  }, [botRating, botThinking, revision]);

  function clickSquare(square: Square) {
    if (position.current.isEnd() || botThinking) return;
    if (dropRole) {
      const move: Move = { role: dropRole, to: square };
      if (position.current.isLegal(move)) play(move);
      return;
    }
    const piece = position.current.board.get(square);
    if (selected === null) {
      if (piece?.color === position.current.turn) setSelected(square);
      return;
    }
    if (legalTargets.has(square)) {
      const role = position.current.board.get(selected)?.role;
      const promotion = role === 'pawn' && (square < 8 || square >= 56) ? 'queen' : undefined;
      play(normalizeMove(position.current, { from: selected, to: square, promotion }));
    } else setSelected(piece?.color === position.current.turn ? square : null);
  }

  function play(move: Move) {
    const notation = makeSanAndPlay(position.current, move);
    setMoves((current) => [...current, notation]);
    setSelected(null);
    setDropRole(null);
    refresh((value) => value + 1);
  }

  function restart() {
    position.current = mode === 'crazyhouse' ? Crazyhouse.default() : ThreeCheck.default();
    setMoves([]);
    setSelected(null);
    setDropRole(null);
    refresh((value) => value + 1);
  }

  const outcome = position.current.outcome();
  const winner = outcome?.winner === 'white' ? 'White' : outcome?.winner === 'black' ? 'Black' : null;
  const checks = position.current.remainingChecks;
  const status = outcome ? winner ? `${winner} wins! 🎉` : 'Draw' : botThinking ? `Bot ${botRating} is thinking…` : `${opponent === 'bot' ? 'Your turn' : position.current.turn === 'white' ? 'White to move' : 'Black to move'}${position.current.isCheck() ? ' — check!' : ''}`;

  return (
    <>
      <p className={`game-status ${position.current.isCheck() ? 'game-status--winner' : ''}`}>{status}</p>
      {opponent === 'bot' && <span className="bot-rating-badge">Bot strength: ~{botRating}</span>}
      {checks && <div className="three-check-score"><span>White checks: <strong>{3 - checks.white}/3</strong></span><span>Black checks: <strong>{3 - checks.black}/3</strong></span></div>}
      {mode === 'crazyhouse' && position.current.pockets && (
        <CrazyhousePocket color={position.current.turn} material={position.current.pockets[position.current.turn]} selected={dropRole} onSelect={(role) => { setDropRole(role); setSelected(null); }} />
      )}
      <div className="chess-layout">
        <VariantChessBoard position={position.current} selected={selected} legalTargets={legalTargets} onSquareClick={clickSquare} />
        <ChessMoves moves={moves} />
      </div>
      <p className="game-hint">{mode === 'crazyhouse' ? 'Select a captured piece above the board, then choose a highlighted empty square.' : 'The first player to give three checks wins.'}</p>
      <div className="chess-actions"><button className="restart-button" onClick={restart}>New game</button><button className="mine-tool" onClick={onChangeMode}>Change mode</button></div>
    </>
  );
}
