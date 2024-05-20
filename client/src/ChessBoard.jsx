import { useEffect, useState } from 'react'
import axios from "axios"

// Piece Image Imports
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


const pieceImages = {
  p, P, r, R, n, N, b, B, q, Q, k, K,
};

function ChessBoard() {

  const [chessboardView, setChessboardView] = useState([])
  const [playerColor, setPlayerColor] = useState()

  const fetchApi = async () => {
    const response = await axios.get("http://127.0.0.1:5000/chessboard");
    setPlayerColor(response.data.playerColor);
    console.log(response.data);
    console.log(response.data.playerColor);
    setChessboardView(response.data.board);
  }

  useEffect(() => {
    fetchApi();
  }, []);

  const isSquareDark = (x, y) => {
    return (x % 2 === 0 && y % 2 === 0) || (x % 2 === 1 && y % 2 === 1);
  };

  return (
    <div className="chess-board">
      {chessboardView.map((row, x) => (
        <div key={x} className="row">
          {row.map((piece, y) => (
            <div key={y} className={`square ${isSquareDark(x, y) ? 'dark' : 'light'}`}>
              {piece && (
                <img
                  src={pieceImages[piece]}
                  alt={piece}
                  className="piece"
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default ChessBoard