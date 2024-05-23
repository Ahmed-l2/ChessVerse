import { useEffect, useState } from 'react';
import axios from 'axios';

import p from './assets/p.svg';
import P from './assets/P.svg';
import r from './assets/r.svg';
import R from './assets/R.svg';
import n from './assets/n.svg';
import N from './assets/N.svg';
import b from './assets/b.svg';
import B from './assets/B.svg';
import q from './assets/q.svg';
import Q from './assets/Q.svg';
import k from './assets/k.svg';
import K from './assets/K.svg';

const pieceImages = { p, P, r, R, n, N, b, B, q, Q, k, K };

function ChessBoard() {
  const [chessboardView, setChessboardView] = useState([]);
  const [playerColor, setPlayerColor] = useState();
  const [isInCheck, setIsInCheck] = useState(false);
  const [safeSquares, setSafeSquares] = useState([]);
  const [selectedSquare, setSelectedSquare] = useState(null);


  const fetchChessboard = async () => {
    const response = await axios.get('http://127.0.0.1:5000/chessboard');
    setPlayerColor(response.data.playerColor);
    setChessboardView(response.data.board);
  };

  const checkIfInCheck = async (playerColor, checkingCurrentPosition) => {
    const response = await axios.post('http://127.0.0.1:5000/is_in_check', {
      playerColor,
      checkingCurrentPosition
    });
    setIsInCheck(response.data.isInCheck);
  };

  const fetchSafeSquares = async () => {
    const response = await axios.get('http://127.0.0.1:5000/find_safe_squares');
    setSafeSquares(response.data);
  };

  const isSquareSelected = (x, y) => {
    return selectedSquare && selectedSquare.x === x && selectedSquare.y === y;
  };
  
  const isSquareSafeForSelectedPiece = (x, y) => {
    return safeSquares[`${x},${y}`];
  };

  const selectPiece = async (x, y) => {
    // Call your Flask API to check if the square is selected and if it's safe
    const isSelected = await axios.post('http://127.0.0.1:5000/is_square_selected', { x, y });
    const isSafe = await axios.post('http://127.0.0.1:5000/is_square_safe_for_selected_piece', { x, y });
  
    if (isSelected.data.isSelected && isSafe.data.isSafe) {
      setSelectedSquare({ x, y });
      setSafeSquares([...safeSquares, { x, y }]);
    }
  };

  useEffect(() => {
    fetchChessboard();
  }, []);

  useEffect(() => {
    if (playerColor) {
      checkIfInCheck(playerColor, true);
      fetchSafeSquares();
    }
  }, [playerColor]);

  const isSquareDark = (x, y) => {
    return (x % 2 === 0 && y % 2 === 0) || (x % 2 === 1 && y % 2 === 1);
  };

  return (
    <div>
      <div className="chess-board">
        {chessboardView.map((row, x) => (
          <div key={x} className="row">
            {row.map((piece, y) => (
              <div 
              key={y} 
              className={`square ${isSquareDark(x, y) ? 'dark' : 'light'} ${isSquareSelected(x, y) ? 'selected-square' : ''}`} 
              onClick={() => selectPiece(x, y)}
            >
              {piece && (
                <img src={pieceImages[piece]} alt={piece} className={`piece ${isSquareSafeForSelectedPiece(x, y) ? 'safe-square' : ''}`} />
              )}
            </div>
            ))}
          </div>
        ))}
      </div>
      <div>
        {isInCheck ? console.log('The player is in check!') : console.log('The player is not in check.')}
      </div>
      <div>
        Safe Squares: {console.log(JSON.stringify(safeSquares))}
      </div>
    </div>
  );
}

export default ChessBoard;