import React, { useEffect, useState } from 'react';
import useSound from 'use-sound';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Import SVG images for chess pieces
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

// Import sound effects
import moveSfx from './assets/move.mp3';
import notifySfx from './assets/notify.mp3';

// Map piece identifiers to their corresponding images
const pieceImages = { p, P, r, R, n, N, b, B, q, Q, k, K };

// Define board letters and numbers for coordinates
const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const numbers = ['8', '7', '6', '5', '4', '3', '2', '1'];

// Function to compare two strings for matching characters
const compareStr = (str1, str2) => {
  let map = {};
  for (let char of str2) {
      if (!map[char]) {
          map[char] = 1;
      } else {
          map[char]++;
      }
  }

  for (let char of str1) {
      if (!map[char]) {
          return false;
      } else {
          map[char]--;
      }
  }

  return true;
};

const ChessGame = ({ ai, sessionId }) => {
  // State variables
  const [board, setBoard] = useState([]);
  const [legalMoves, setLegalMoves] = useState([]);
  const [error, setError] = useState('');
  const [turn, setTurn] = useState('');
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [squareMoves, setSquareMoves] = useState([]);
  const [currentPiece, setCurrentPiece] = useState('');
  const [promotion, setPromotion] = useState(null);
  const [moveList, setMovelist] = useState(() => {
    const storedMoveList = localStorage.getItem('moveList');
    return storedMoveList ? JSON.parse(storedMoveList) : [];
  });
  const [gameOver, setGameover] = useState(false);

  // Load sound effects
  const [playMove] = useSound(moveSfx);
  const [playNotify] = useSound(notifySfx);

  // Save session ID to localStorage
  useEffect(() => {
    localStorage.setItem('sessionId', sessionId);
  }, [sessionId]);

  // Effect to reset the game when AI prop changes
  useEffect(() => {
    handleReset();
  }, [ai]);

  // Initial fetch of board and legal moves
  useEffect(() => {
    fetchBoard();
    fetchLegalMoves();
  }, [sessionId]);

  // Fetch board and legal moves on turn change
  useEffect(() => {
    setSelectedSquare(null);
    setSquareMoves([]);
    fetchBoard();
    fetchLegalMoves();
    setPromotion(null);
  }, [turn]);

  // Load move list from localStorage on mount
  useEffect(() => {
    const storedMoveList = localStorage.getItem('moveList');
    if (storedMoveList) {
      setMovelist(JSON.parse(storedMoveList));
    }
  }, []);

  // Save move list to localStorage on update
  useEffect(() => {
    localStorage.setItem('moveList', JSON.stringify(moveList));
  }, [moveList]);

  const handleNewGame = async () => {
    try {
      const response = await axios.post('https://chess.ahmed-codes.tech/api/new_game');
      setSessionId(response.data.session_id);
    } catch (error) {
      console.error('Error starting new game:', error);
    }
  };

  // Process move response from the server
  const processMoveResponse = async (response) => {
    if (response.data.error) {
      setError(response.data.error);
    } else {
      setBoard(convertFenToBoard(response.data.board));
      setLegalMoves(response.data.legal_moves);
      setTurn(response.data.turn);
      setMovelist(prevMoveList => [...prevMoveList, response.data.move]);
      setError('');
      setGameover(response.data.game_over);
      playMove();
      if (gameOver) {
        playNotify();
        return;
      }
    }
  };

  // Fetch the current board state from the server
  const fetchBoard = async () => {
    try {
      const response = await axios.get(`https://chess.ahmed-codes.tech/api/${sessionId}/board`);
      setBoard(convertFenToBoard(response.data.board));
      setTurn(response.data.turn);
    } catch (error) {
      console.error('Error fetching board:', error);
    }
  };

  // Fetch legal moves from the server
  const fetchLegalMoves = async () => {
    try {
      const response = await axios.get(`https://chess.ahmed-codes.tech/api/${sessionId}/legal_moves`);
      setLegalMoves(response.data.legal_moves);
    } catch (error) {
      console.error('Error fetching legal moves:', error);
    }
  };

  // Handle potential duplicate moves
  const handleDuplicate = async (dest) => {
    if (currentPiece === 'p' || currentPiece === 'P') {
      dest = 'x' + dest;
    }
    let count = 0;
    for (let n = 0; n < legalMoves.length; n++) {
      if (compareStr(dest, legalMoves[n])) {
        count++;
      }
    }

    if (count > 0) {
      const curSquare = convertToSAN(selectedSquare.row, selectedSquare.col);
      let temp = curSquare[0] + dest;
      let move = '';
      for (let n = 0; n < legalMoves.length; n++) {
        if (compareStr(temp, legalMoves[n])) {
          move = legalMoves[n];
        }
      }
      if (!move) {
        return false;
      }

      try {
        const response = await axios.post(`https://chess.ahmed-codes.tech/api/${sessionId}/move`, { move });
        await processMoveResponse(response);
    
        if (ai) {
          const aiMoveResponse = await axios.post(`https://chess.ahmed-codes.tech/api/${sessionId}/ai_move`, { fen: response.data.board });
          await processMoveResponse(aiMoveResponse);
        }
        return true;
      } catch (error) {
        console.error('Error making move:', error);
        setError('Invalid move');
      }
    }
    return false;
  };

  // Handle piece move action
  const handlePieceMove = async (row, col) => {
    try {
      const square = convertToSAN(row, col);
      let move = '';

      // Check for pawn promotion
      if ((currentPiece === 'P' && row === 0) || (currentPiece === 'p' && row === 7)) {
        setPromotion(square);
        return; // Stop further execution to wait for promotion choice
      }

      if (await handleDuplicate(square)) {
        return true;
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
          }
        }
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

      const response = await axios.post(`https://chess.ahmed-codes.tech/api/${sessionId}/move`, { move });
      await processMoveResponse(response);

      if (ai) {
        const aiMoveResponse = await axios.post(`https://chess.ahmed-codes.tech/api/${sessionId}/ai_move`, { fen: response.data.board });
        await processMoveResponse(aiMoveResponse);
      }
    } catch (error) {
      console.error('Error making move:', error);
      setError('Invalid move');
    }
  };

  // Handle promotion piece selection
  const handlePromotionChoice = async (choice) => {
    if (promotion) {
      let move = '';
      for (let x = 0; x < legalMoves.length; x++) {
        if (compareStr((promotion + choice.toUpperCase()), legalMoves[x])) {
          move = legalMoves[x];
        }
      }

      try {
        const response = await axios.post(`https://chess.ahmed-codes.tech/api/${sessionId}/move`, { move });
        await processMoveResponse(response);
    
        if (ai) {
          const aiMoveResponse = await axios.post(`https://chess.ahmed-codes.tech/api/${sessionId}/ai_move`, { fen: response.data.board });
          await processMoveResponse(aiMoveResponse);
        }
      } catch (error) {
        console.error('Error making move:', error);
        setError('Invalid move');
      }
    }
  };

  // Reset the game state
  const handleReset = async () => {
    try {
      const response = await axios.post(`https://chess.ahmed-codes.tech/api/${sessionId}/reset`);
      setBoard(convertFenToBoard(response.data.board));
      setLegalMoves(response.data.legal_moves);
      setTurn(response.data.turn);
      setError('');
      setMovelist([]);
      setGameover(false);
      playNotify();
    } catch (error) {
      console.error('Error resetting game:', error);
    }
  };

  // Fetch possible moves for a selected square
  const fetchMoves = async (square) => {
    try {
      const response = await axios.post(`https://chess.ahmed-codes.tech/api/${sessionId}/get_moves`, { square });
      setSquareMoves(response.data.moves);
    } catch (error) {
      console.error('Error fetching moves:', error);
    }
  };

  // Convert FEN string to board array
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

  // Convert row and column indices to SAN (Standard Algebraic Notation)
  const convertToSAN = (rowIndex, colIndex) => {
    return letters[colIndex] + numbers[rowIndex];
  };

  // Handle click on a square
  const handleSquareClick = (row, col, piece) => {
    let pieceColor = null;
    if (piece && piece.toUpperCase() === piece) {
      pieceColor = 'white';
    } else if (!ai && (piece && piece.toLowerCase() === piece)) {
      pieceColor = 'black';
    }

    if (selectedSquare && selectedSquare.row === row && selectedSquare.col === col) {
      setSelectedSquare(null);
      setSquareMoves([]);
      setCurrentPiece('');
      setPromotion(null);
    } else if (pieceColor === turn) {
      const square = convertToSAN(row, col);
      fetchMoves(square);
      setSelectedSquare({ row, col });
      setCurrentPiece(piece);
    }
  };

  // Check if a square is selected
  const isSquareSelected = (row, col) => {
    return selectedSquare && selectedSquare.row === row && selectedSquare.col === col;
  };

  // Check if a square is a legal move destination
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
    <div className="chess-app">
      <br></br>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {gameOver && (
        <div className={`game-over-prompt ${gameOver ? 'show' : ''}`}>
          <p className="alert">GAME OVER!</p>
          <button className="read" onClick={handleReset}>Restart Game</button>
        </div>
      )}
      <div className="board-and-move-list">
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
                  <div className="board-coordinate">
                    {colIndex === 0 && <div className="number" id={numbers[7 - rowIndex]}>{numbers[7 - rowIndex]}</div>}
                    {rowIndex === 0 && <div className="letter" id={letters[colIndex]}>{letters[colIndex]}</div>}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className='move-list'>
          <h2>Move List</h2>
          <ul id="move-list">
            {moveList.map((move, index) => (
              <li key={index}>{move}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className='access'>
        <h1 className='turn'>Current Turn: {turn}</h1>
        <div className='btn'>
          <button className="mark-as-read" onClick={handleReset}>RESTART GAME</button>
          <button className="mark-as-read" onClick={() => setGameover(true)}>RESIGN</button>
        </div>
      </div>
      {promotion && (
        <div className="promo-card">
          <h1>CHOOSE PROMOTION PIECE</h1>
          <div className="avatar">
            <img src={pieceImages['Q']} alt="queen" onClick={() => handlePromotionChoice('q')}/>
            <img src={pieceImages['R']} alt="rook" onClick={() => handlePromotionChoice('r')}/>
            <img src={pieceImages['B']} alt="bishop" onClick={() => handlePromotionChoice('b')}/>
            <img src={pieceImages['N']} alt="Knight" onClick={() => handlePromotionChoice('n')}/>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChessGame;
