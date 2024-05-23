import { useEffect, useState } from 'react'
import ChessBoard from './ChessBoard';
import axios from "axios"
import ChessGame from './ChessGame';


function App() {
  return (
    <div className="App">
      <ChessGame />
    </div>
  );
}


export default App
