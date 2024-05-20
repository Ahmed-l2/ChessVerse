#!/usr/bin/python3
from flask import Flask, jsonify, render_template
from flask_cors import CORS
from models.chess_board import ChessBoard


app = Flask(__name__)
cors = CORS(app, origins='*')


@app.route('/')
def index():
    return 'Hello, World!'  # For testing purposes

@app.route('/chessboard')
def get_chessboard():
    chessBoard = ChessBoard()
    chessBoardData = {
        'board': chessBoard.chessBoardView,
        'playerColor': chessBoard.playerColor
    }
    return jsonify(chessBoardData)


if __name__ == '__main__':
    app.run(debug=True)