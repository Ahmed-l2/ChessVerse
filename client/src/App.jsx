import { useState, useEffect } from 'react';
import ChessGame from './ChessGame';
import bg from './assets/bg.png';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [showCard, setShowCard] = useState(true);
  const [playAgainstAI, setPlayAgainstAI] = useState(true);
  const [sessionId, setSessionId] = useState(localStorage.getItem('sessionId') || uuidv4());

  useEffect(() => {
    localStorage.setItem('sessionId', sessionId);
  }, [sessionId]);

  const handlePlayAgainstAI = () => {
    setShowCard(false);
    setPlayAgainstAI(true);
  };

  const handleLocalPlay = () => {
    setShowCard(false);
    setPlayAgainstAI(false);
  };

  const handleMainMenu = () => {
    setShowCard(true);
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
        <>
          <button className="menu" onClick={handleMainMenu}>MAIN MENU</button>
          <ChessGame ai={playAgainstAI} sessionId={sessionId} />
        </>
      )}
    </>
  );
}

export default App;