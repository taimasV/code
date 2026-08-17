import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './games.css';
import './puzzle-games.css';
import './quoridor.css';
import './detective.css';
import './merge.css';
import './nuts-and-bolts.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
