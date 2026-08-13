import { Route, Switch } from 'wouter';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { TicTacToePage } from './pages/TicTacToePage';
import { ConnectFourPage } from './pages/ConnectFourPage';
import { MemoryPage } from './pages/MemoryPage';
import { MinesweeperPage } from './pages/MinesweeperPage';
import { SnakePage } from './pages/SnakePage';
import { BattleshipPage } from './pages/BattleshipPage';
import { ChessPage } from './pages/ChessPage';
import { CheckersPage } from './pages/CheckersPage';
import { ReversiPage } from './pages/ReversiPage';
import { ReactionPage } from './pages/ReactionPage';
import { MahjongPage } from './pages/MahjongPage';
import { ConnectDotsPage } from './pages/ConnectDotsPage';
import { AuthPage } from './pages/AuthPage';

export default function App() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/tic-tac-toe" component={TicTacToePage} />
      <Route path="/connect-four" component={ConnectFourPage} />
      <Route path="/memory" component={MemoryPage} />
      <Route path="/minesweeper" component={MinesweeperPage} />
      <Route path="/snake" component={SnakePage} />
      <Route path="/battleship" component={BattleshipPage} />
      <Route path="/chess" component={ChessPage} />
      <Route path="/checkers" component={CheckersPage} />
      <Route path="/reversi" component={ReversiPage} />
      <Route path="/reaction" component={ReactionPage} />
      <Route path="/mahjong" component={MahjongPage} />
      <Route path="/connect-dots" component={ConnectDotsPage} />
      <Route path="/login"><AuthPage mode="signin" /></Route>
      <Route path="/register"><AuthPage mode="signup" /></Route>
      <Route path="/auth"><AuthPage mode="signin" /></Route>
      <Route component={NotFoundPage} />
    </Switch>
  );
}
