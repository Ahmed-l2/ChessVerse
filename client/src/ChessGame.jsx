import React, { useEffect, useState } from 'react';
import useSound from 'use-sound';
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

// Import Sound effects
import moveSfx from './assets/move.mp3'
import notifySfx from './assets/notify.mp3'

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

const ChessGame = (props) => {
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

  const [playMove] = useSound(moveSfx);
  const [playNotify] = useSound(notifySfx);

  useEffect(() => {
    handleReset();
  }, [props.ai]);

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

  useEffect(() => {
    const storedMoveList = localStorage.getItem('moveList');
    if (storedMoveList) {
      setMovelist(JSON.parse(storedMoveList));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('moveList', JSON.stringify(moveList));
  }, [moveList]);
  


  const fetchBoard = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/board');
      setBoard(convertFenToBoard(response.data.board));
      setTurn(response.data.turn);
    } catch (error) {
      console.error('Error fetching board:', error);
    }
  };

  const fetchLegalMoves = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/legal_moves');
      setLegalMoves(response.data.legal_moves);
    } catch (error) {
      console.error('Error fetching legal moves:', error);
    }
  };

  const handleMove = async (move) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/move', { move });
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

  const handleDuplicate = async (dest) => {
    if (currentPiece == 'p' || currentPiece == 'P') {
      dest = 'x' + dest;
    }
    console.log('entered dup');
    console.log(dest);
    let count = 0;
      for (let n = 0; n < legalMoves.length; n++) {
        if (compareStr(dest, legalMoves[n])) {
          count++;
        }
      }

      console.log(count);

      if (count > 0) {
        console.log('entered dup2');
        const curSquare = convertToSAN(selectedSquare['row'], selectedSquare['col']);
        let temp = curSquare[0] + dest;
        let move = '';
        for (let n = 0; n < legalMoves.length; n++) {
          if (compareStr(temp, legalMoves[n])) {
            move = legalMoves[n];
          }
        }
        if(!move) {
          return false;
        }
        console.log(`dup = ${move}`);

        try {
          const response = await axios.post('http://127.0.0.1:5000/move', { move });
          if (response.data.error) {
            setError(response.data.error);
          } else {
            setBoard(convertFenToBoard(response.data.board));
            setLegalMoves(response.data.legal_moves);
            setTurn(response.data.turn);
            setError('');
            setPromotion(null); // Clear promotion state
            setMovelist(prevMoveList => [...prevMoveList, move]);
            setGameover(response.data.game_over);
            console.log(response.data.game_over);
            playMove();
            if (gameOver) {
              playNotify();
              return;
            }

            if (props.ai) {
              const aiMoveResponse = await axios.post('http://127.0.0.1:5000/ai_move', { fen: response.data.board });
              if (aiMoveResponse.data.error) {
                setError(aiMoveResponse.data.error);
              } else {
                setBoard(convertFenToBoard(aiMoveResponse.data.board));
                setLegalMoves(aiMoveResponse.data.legal_moves);
                setTurn(aiMoveResponse.data.turn);
                setMovelist(prevMoveList => [...prevMoveList, aiMoveResponse.data.move]);
                setGameover(aiMoveResponse.data.game_over);
                console.log(aiMoveResponse.data.game_over);
                playMove();
                if (gameOver) {
                  playNotify();
                  return;
                }
              }
            }
            return true;
          }
        } catch (error) {
          console.error('Error making move:', error);
          setError('Invalid move');
        }
      }
      return false;
  }

  const handlePieceMove = async (row, col) => {
    try {
      const square = convertToSAN(row, col);
      let move = '';
      console.log(`Trying to move ${currentPiece} to ${square} (${row}, ${col})`);
      console.log(`Row: ${row}, CurrentPiece: ${currentPiece}`);
      if ((currentPiece === 'P' && row === 0) || (currentPiece === 'p' && row === 7)) {
        console.log('Pawn promotion condition met');
        //const promo = compareStr((currentPiece + square), legalMoves)
        console.log(`promo= ${currentPiece + square}`)
        setPromotion(square);
        return; // Stop further execution to wait for promotion choice
      }

      //let dest = 'x' + square;
      if (await handleDuplicate(square)) {
        return true;
      };

      console.log('not duplicate');

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
  
      const response = await axios.post('http://127.0.0.1:5000/move', { move });
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setBoard(convertFenToBoard(response.data.board));
        setLegalMoves(response.data.legal_moves);
        setTurn(response.data.turn);
        setMovelist(prevMoveList => [...prevMoveList, move]);
        setError('');
        setGameover(response.data.game_over);
        console.log(response.data.game_over);
        playMove();
        if (gameOver) {
          playNotify();
          return;
        }
        
        if (props.ai) {
          const aiMoveResponse = await axios.post('http://127.0.0.1:5000/ai_move', { fen: response.data.board });
          if (aiMoveResponse.data.error) {
            setError(aiMoveResponse.data.error);
          } else {
            setBoard(convertFenToBoard(aiMoveResponse.data.board));
            setLegalMoves(aiMoveResponse.data.legal_moves);
            setTurn(aiMoveResponse.data.turn);
            setMovelist(prevMoveList => [...prevMoveList, aiMoveResponse.data.move]);
            setGameover(aiMoveResponse.data.game_over);
            console.log(aiMoveResponse.data.game_over);
            playMove();
            if (gameOver) {
              playNotify();
              return;
            }
          }
        }
      }
    } catch (error) {
      console.error('Error making move:', error);
      setError('Invalid move');
    }
  };

  const handlePromotionChoice = async (choice) => {
    if (promotion) {
      let move = '';
      console.log(`choice: ${promotion + choice.toUpperCase()}`)
      for (let x = 0; x < legalMoves.length; x++) {
        if (compareStr((promotion + choice.toUpperCase()), legalMoves[x])) {
          move = legalMoves[x];
        }
      }
  
      try {
        const response = await axios.post('http://127.0.0.1:5000/move', { move });
        if (response.data.error) {
          setError(response.data.error);
        } else {
          setBoard(convertFenToBoard(response.data.board));
          setLegalMoves(response.data.legal_moves);
          setTurn(response.data.turn);
          setError('');
          setMovelist(prevMoveList => [...prevMoveList, move]);
          setPromotion(null); // Clear promotion state
          playMove();
          if (gameOver) {
            playNotify();
            return;
          }

          if (props.ai) {
            const aiMoveResponse = await axios.post('http://127.0.0.1:5000/ai_move', { fen: response.data.board });
            if (aiMoveResponse.data.error) {
              setError(aiMoveResponse.data.error);
            } else {
              setBoard(convertFenToBoard(aiMoveResponse.data.board));
              setLegalMoves(aiMoveResponse.data.legal_moves);
              setTurn(aiMoveResponse.data.turn);
              setMovelist(prevMoveList => [...prevMoveList, aiMoveResponse.data.move]);
              setGameover(aiMoveResponse.data.game_over);
              console.log(aiMoveResponse.data.game_over);
              playMove();
              if (gameOver) {
                playNotify();
                return;
              }
            }
          }
        }
      } catch (error) {
        console.error('Error making move:', error);
        setError('Invalid move');
      }
    }
  };
  
  const handleReset = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/reset');
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

  const fetchMoves = async (square) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/get_moves', { square });
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
    } else if (!props.ai && (piece && piece.toLowerCase() === piece)) {
      pieceColor = 'black';
    }
  
    if (selectedSquare && selectedSquare.row === row && selectedSquare.col === col) {
      setSelectedSquare(null);
      setSquareMoves([]);
      setCurrentPiece('');
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
    <div className="chess-app">
      <>.</>
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
      {/*<div>
        <h1>Legal Moves</h1>
        {legalMoves.map((move, index) => (
          <button key={index} onClick={() => handleMove(move)}>
            {move}
          </button>
        ))}
      </div>*/}
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
