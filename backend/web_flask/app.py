#!/usr/bin/python3
from flask import Flask, jsonify, render_template
from models.chess_board import ChessBoard
from models.models import pieceImagePaths

app = Flask(__name__)


@app.route('/')
def index():
    return 'Hello, World!'  # For testing purposes

chess_board = ChessBoard()  # Assuming you have a ChessBoard class

@app.route('/chessboardjson')
def get_chessboardjson():
    return jsonify(chess_board.chessBoardView)

#@app.route('/chessboard')
#def get_chessboard():
#    chessBoardView = chess_board.chessBoardView
#    return render_template('chess_board.html', chessBoardView=chessBoardView, isSquareDark=ChessBoard.isSquareDark, pieceImagePaths=pieceImagePaths)


if __name__ == '__main__':
    app.run(debug=True)
