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

const ChessGame = () => {
  const [board, setBoard] = useState([]);
  const [legalMoves, setLegalMoves] = useState([]);
  const [error, setError] = useState('');
  const [turn, setTurn] = useState('');
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [squareMoves, setSquareMoves] = useState([]);
  const [currentPiece, setCurrentPiece] = useState('')

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
      console.log(currentPiece);
      let move = ''
      console.log(square)
      if (currentPiece !== 'P' && currentPiece !== 'p') {
        move = currentPiece.toUpperCase() + square;
      } else {
        move = square;
      }
      console.log(move);
      console.log(typeof move);
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
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((piece, colIndex) => (
              <div 
                key={colIndex} 
                className={`square ${(rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark'}
                ${isSquareSelected(rowIndex, colIndex) ? 'selected-square' : ''}`}
                onClick={() => handleSquareClick(rowIndex, colIndex, piece)}
              >
                {piece && (
                  <img src={pieceImages[piece]} alt={piece} className='piece' />
                )}
                {isMoveSquare(rowIndex, colIndex) && (
                  <div className="safe-square" onClick={() => handlePieceMove(rowIndex, colIndex)}></div>
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
    </div>
  );
};

export default ChessGame;
