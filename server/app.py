from flask import Flask, jsonify, request
from flask_cors import CORS
from models.chess_board import ChessBoard

app = Flask(__name__)
cors = CORS(app, origins='*')

# Initialize the chess board
chess_board = ChessBoard()

@app.route('/')
def index():
    return 'Hello, World!'  # For testing purposes

@app.route('/chessboard')
def get_chessboard():
    chessBoardData = {
        'board': chess_board.chessBoardView,
        'playerColor': chess_board.playerColor
    }
    return jsonify(chessBoardData)

@app.route('/is_in_check', methods=['POST'])
def is_in_check():
    data = request.json
    player_color = data['playerColor']
    checking_current_position = data['checkingCurrentPosition']
    result = chess_board.is_in_check(player_color, checking_current_position)
    return jsonify({'isInCheck': result})

@app.route('/find_safe_squares', methods=['GET'])
def find_safe_squares():
    safe_squares = chess_board.find_safe_squares()
    return jsonify(safe_squares)

@app.route('/is_square_selected', methods=['POST'])
def is_square_selected():
    data = request.json
    x = data['x']
    y = data['y']
    result = chess_board.is_square_selected(x, y)
    return jsonify({'isSelected': result})

@app.route('/is_square_safe_for_selected_piece', methods=['POST'])
def is_square_safe_for_selected_piece():
    data = request.json
    x = data['x']
    y = data['y']
    result = chess_board.is_square_safe_for_selected_piece(x, y)
    return jsonify({'isSafe': result})

if __name__ == '__main__':
    app.run(debug=True)
