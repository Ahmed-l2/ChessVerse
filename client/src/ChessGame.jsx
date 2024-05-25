import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Import SVG images
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

const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const numbers = ['8', '7', '6', '5', '4', '3', '2', '1'];

const compareStr = (str1, str2) =>{
  let map = {};
  for(let char of str2) {
      if(!map[char]) {
          map[char] = 1;
      } else {
          map[char]++;
      }
  }

  for(let char of str1) {
      if(!map[char]) {
          return false;
      } else {
          map[char]--;
      }
  }

  return true;
};

const ChessGame = () => {
  const [board, setBoard] = useState([]);
  const [legalMoves, setLegalMoves] = useState([]);
  const [error, setError] = useState('');
  const [turn, setTurn] = useState('');
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [squareMoves, setSquareMoves] = useState([]);
  const [currentPiece, setCurrentPiece] = useState('');
  const [promotion, setPromotion] = useState(null);
  const [promotionSquare, setPromotionSquare] = useState(null);


  useEffect(() => {
    fetchBoard();
    fetchLegalMoves();
  }, []);

  useEffect(() => {
    setSelectedSquare(null);
    setSquareMoves([]);
    fetchBoard();
    fetchLegalMoves();
  }, [turn]);


  const fetchBoard = async () => {
    try {
      const response = await axios.get('http://localhost:5000/board');
      setBoard(convertFenToBoard(response.data.board));
      setTurn(response.data.turn);
    } catch (error) {
      console.error('Error fetching board:', error);
    }
  };

  const fetchLegalMoves = async () => {
    try {
      const response = await axios.get('http://localhost:5000/legal_moves');
      setLegalMoves(response.data.legal_moves);
    } catch (error) {
      console.error('Error fetching legal moves:', error);
    }
  };

  const handleMove = async (move) => {
    try {
      const response = await axios.post('http://localhost:5000/move', { move });
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setBoard(convertFenToBoard(response.data.board));
        setLegalMoves(response.data.legal_moves);
        setTurn(response.data.turn);
        setError('');
      }
    } catch (error) {
      console.error('Error making move:', error);
      setError('Invalid move');
    }
  };

  const handlePieceMove = async (row, col) => {
    try {
      const square = convertToSAN(row, col);
      let move = '';
      console.log(`Trying to move ${currentPiece} to ${square} (${row}, ${col})`);
      console.log(`Row: ${row}, CurrentPiece: ${currentPiece}`);
      if ((currentPiece === 'P' && row === 0) || (currentPiece === 'p' && row === 7)) {
        console.log('Pawn promotion condition met');
        setPromotionSquare({ row, col });
        setPromotion({ piece: currentPiece, square });
        return; // Stop further execution to wait for promotion choice
      }

      if (currentPiece !== 'P' && currentPiece !== 'p') {
        let temp = currentPiece.toUpperCase() + square;
        for (let j = 0; j < legalMoves.length; j++) {
          if (compareStr(temp, legalMoves[j])) {
            move = legalMoves[j];
          }
        }
      } else {
        for (let x = 0; x < legalMoves.length; x++) {
          if (compareStr(square, legalMoves[x])) {
            move = legalMoves[x];
          };
        };
      };

      if ((currentPiece === 'P' && row === 7) || (currentPiece === 'p' && row === 0)) {
        
      }
  
      // Check if the move is a castling move
      if ((currentPiece === 'k' || currentPiece === 'K') && (square === 'h1' || square === 'a1' || square === 'h8' || square === 'a8')) {
        if ((square === 'h1' || square === 'h8') && legalMoves.includes('O-O')) {
          move = 'O-O';
        }
        if ((square === 'a1' || square === 'a8') && legalMoves.includes('O-O-O')) {
          move = 'O-O-O';
        }
      }
  
      const response = await axios.post('http://localhost:5000/move', { move });
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setBoard(convertFenToBoard(response.data.board));
        setLegalMoves(response.data.legal_moves);
        setTurn(response.data.turn);
        setError('');
      }
    } catch (error) {
      console.error('Error making move:', error);
      setError('Invalid move');
    }
  };

  const handlePromotionChoice = async (choice) => {
    if (promotion) {
      const { piece, square } = promotion;
      const move = square + choice;
  
      try {
        const response = await axios.post('http://localhost:5000/move', { move });
        if (response.data.error) {
          setError(response.data.error);
        } else {
          setBoard(convertFenToBoard(response.data.board));
          setLegalMoves(response.data.legal_moves);
          setTurn(response.data.turn);
          setError('');
          setPromotion(null); // Clear promotion state
          setPromotionSquare(null);
        }
      } catch (error) {
        console.error('Error making move:', error);
        setError('Invalid move');
      }
    }
  };
  

  const handleReset = async () => {
    try {
      const response = await axios.post('http://localhost:5000/reset');
      setBoard(convertFenToBoard(response.data.board));
      setLegalMoves(response.data.legal_moves);
      setTurn(response.data.turn);
      setError('');
    } catch (error) {
      console.error('Error resetting game:', error);
    }
  };

  const fetchMoves = async (square) => {
    try {
      const response = await axios.post('http://localhost:5000/get_moves', { square });
      console.log(`Fetched moves for ${square}:`, response.data.moves); // Debugging line
      setSquareMoves(response.data.moves);
    } catch (error) {
      console.error('Error fetching moves:', error);
    }
  };
  

  const convertFenToBoard = (fen) => {
    const rows = fen.split(' ')[0].split('/');
    return rows.map(row => {
      const expandedRow = [];
      for (let char of row) {
        if (isNaN(char)) {
          expandedRow.push(char);
        } else {
          for (let i = 0; i < parseInt(char); i++) {
            expandedRow.push(null);
          }
        }
      }
      return expandedRow;
    });
  };

  const convertToSAN = (rowIndex, colIndex) => {
    return letters[colIndex] + numbers[rowIndex];
  };

  const handleSquareClick = (row, col, piece) => {
    let pieceColor = null;
    if (piece && piece.toUpperCase() === piece) {
      pieceColor = 'white';
    } else if (piece && piece.toLowerCase() === piece) {
      pieceColor = 'black';
    }
  
    if (selectedSquare && selectedSquare.row === row && selectedSquare.col === col) {
      setSelectedSquare(null);
      setSquareMoves([]);
      setCurrentPiece(''); // Clear the currentPiece state
      setPromotion(null);
    } else if (pieceColor === turn) {
      const square = convertToSAN(row, col);
      console.log(`Selected Square: ${square}`); // Debugging line
      fetchMoves(square);
      setSelectedSquare({ row, col });
      setCurrentPiece(piece);
    }
  };
  

  const isSquareSelected = (row, col) => {
    return selectedSquare && selectedSquare.row === row && selectedSquare.col === col;
  };

  const isMoveSquare = (row, col) => {
    const square = convertToSAN(row, col);
    if (currentPiece === 'k' && (square === 'h8' || square === 'a8')) {
      if (square === 'h8' && legalMoves.includes('O-O')) {
        return true;
      }
      if (square === 'a8' && legalMoves.includes('O-O-O')) {
        return true;
      }
    } else if (currentPiece === 'K' && (square === 'h1' || square === 'a1')) {
      if (square === 'h1' && legalMoves.includes('O-O')) {
        return true;
      }
      if (square === 'a1' && legalMoves.includes('O-O-O')) {
        return true;
      }
    }
    for (let i = 0; i < squareMoves.length; i++) {
      if (squareMoves[i].includes(square)) {
        return true;
      }
    };
    return false;
  };
  
  
  return (
    <div>
      <h1>Chess Board</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="chess-board">
        {board.slice().reverse().map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((piece, colIndex) => (
              <div
                key={colIndex}
                className={`square ${(rowIndex + colIndex) % 2 === 0 ? 'dark' : 'light'}
                ${isSquareSelected(7 - rowIndex, colIndex) ? 'selected-square' : ''}`}
                onClick={() => handleSquareClick(7 - rowIndex, colIndex, piece)}
              >
                {piece && (
                  <img src={pieceImages[piece]} alt={piece} className='piece' />
                )}
                {isMoveSquare(7 - rowIndex, colIndex) && (
                  <div className="safe-square" onClick={() => handlePieceMove(7 - rowIndex, colIndex)}></div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div>
        <h1>Current Turn: {turn}</h1>
        <button onClick={handleReset}>RESTART GAME</button>
        <h1>Legal Moves</h1>
        {legalMoves.map((move, index) => (
          <button key={index} onClick={() => handleMove(move)}>
            {move}
          </button>
        ))}
      </div>
      {promotion && (
        <div className="promotion-choice">
          <p>Choose promotion piece:</p>
          <button onClick={() => handlePromotionChoice('q')}>Queen</button>
          <button onClick={() => handlePromotionChoice('r')}>Rook</button>
          <button onClick={() => handlePromotionChoice('b')}>Bishop</button>
          <button onClick={() => handlePromotionChoice('n')}>Knight</button>
        </div>
      )}
    </div>
  );
};

export default ChessGame;
