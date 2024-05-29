import { useState } from 'react';
import ChessGame from './ChessGame';
import bg from './assets/bg.png';

function App() {
  const [showCard, setShowCard] = useState(true);
  const [playAgainstAI, setPlayAgainstAI] = useState(true);

  const handlePlayAgainstAI = () => {
    setShowCard(false);
    setPlayAgainstAI(true);
  };

  const handleLocalPlay = () => {
    setShowCard(false);
    setPlayAgainstAI(false);
  };

  return (
    <>
      {showCard ? (
        <div className="card">
          <p className="alert">WELCOME TO CHESSVERSE!</p>
          <div className="actions">
            <a className="read" href="#" onClick={handlePlayAgainstAI}>
              Play against AI
            </a>
            <a className="mark-as-read" href="#" onClick={handleLocalPlay}>
              Local Play 
            </a>
          </div>
        </div>
      ) : (
        <ChessGame ai={playAgainstAI}/>
      )}
    </>
  );
}

export default App;