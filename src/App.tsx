import { Route, Switch } from 'wouter';
import { HomePage } from './pages/HomePage';
import { LandingPage } from './pages/LandingPage';
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
import { SudokuPage } from './pages/SudokuPage';
import { NonogramPage } from './pages/NonogramPage';
import { WordlePage } from './pages/WordlePage';
import { QuoridorPage } from './pages/QuoridorPage';
import { DetectivePage } from './pages/DetectivePage';
import { MergePage } from './pages/MergePage';
import { NutsAndBoltsPage } from './pages/NutsAndBoltsPage';
import { FlagsPage } from './pages/FlagsPage';
import { DartsPage } from './pages/DartsPage';
import { YatzyPage } from './pages/YatzyPage';
import { LanguageSwitcher } from './components/LanguageSwitcher';

export default function App() {
  return (
    <><LanguageSwitcher /><Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/games" component={HomePage} />
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
      <Route path="/sudoku" component={SudokuPage} />
      <Route path="/nonogram" component={NonogramPage} />
      <Route path="/wordle" component={WordlePage} />
      <Route path="/quoridor" component={QuoridorPage} />
      <Route path="/detective" component={DetectivePage} />
      <Route path="/merge" component={MergePage} />
      <Route path="/nuts-and-bolts" component={NutsAndBoltsPage} />
      <Route path="/flags" component={FlagsPage} />
      <Route path="/darts" component={DartsPage} />
      <Route path="/yatzy" component={YatzyPage} />
      <Route path="/login"><AuthPage mode="signin" /></Route>
      <Route path="/register"><AuthPage mode="signup" /></Route>
      <Route path="/auth"><AuthPage mode="signin" /></Route>
      <Route component={NotFoundPage} />
    </Switch></>
  );
}
