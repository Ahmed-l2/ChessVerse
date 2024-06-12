#!/server/venv/bin/python3

# Import necessary modules
import uuid
from flask import Flask, jsonify, request  # Flask for web framework, jsonify for JSON responses, request for handling incoming requests
from chessLogic import ChessGame  # Import the custom ChessGame logic
from flask_cors import CORS  # Import CORS for Cross-Origin Resource Sharing
from stockfish import Stockfish  # Import Stockfish chess engine
import time  # Import time for adding delays (if needed)

# Initialize Flask app and enable CORS for all origins
app = Flask(__name__)
cors = CORS(app, origins='*')

# Initialize ChessGame instance
game = ChessGame()
games = {}

# Initialize Stockfish chess engine and set options
stockfish = Stockfish(path="/usr/games/stockfish")
stockfish._set_option('UCI_LimitStrength', 'true')
stockfish._set_option('UCI_Elo', 1000)

# Helper function to get game instance for a session
def get_game(session_id):
    if session_id not in games:
        games[session_id] = ChessGame()
    return games[session_id]

# Route to create a new game session
@app.route('/new_game', methods=['POST'])
def new_game():
    session_id = str(uuid.uuid4())
    games[session_id] = ChessGame()
    return jsonify({'session_id': session_id})

# Route to get the current board state
@app.route('/<session_id>/board', methods=['GET'])
def get_board(session_id):
    game = get_game(session_id)
    return jsonify({'board': game.get_board(), 'turn': game.get_turn()})

# Route to get the current turn
@app.route('/<session_id>/turn', methods=['GET'])
def get_turn(session_id):
    game = get_game(session_id)
    return jsonify({'turn': game.get_turn()})

# Route to make a move
@app.route('/<session_id>/move', methods=['POST'])
def make_move(session_id):
    data = request.json
    move = data.get('move')
    game = get_game(session_id)
    success, result = game.make_move(move)
    if success:
        return jsonify({'board': result, 'move': move, 'legal_moves': game.get_legal_moves(), 'game_over': game.is_game_over()})
    else:
        return jsonify({'error': result}), 400

# Route to get the AI's move
@app.route('/<session_id>/ai_move', methods=['POST'])
def get_ai_move(session_id):
    try:
        data = request.json
        fen_position = data.get('fen')
        game = get_game(session_id)
        stockfish.set_fen_position(fen_position)
        best_move = stockfish.get_best_move()
        success, result = game.make_move(best_move)
        if success:
            return jsonify({'move': best_move, 'board': result, 'legal_moves': game.get_legal_moves(), 'game_over': game.is_game_over()})
        else:
            return jsonify({'error': 'Invalid move'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to get the legal moves
@app.route('/<session_id>/legal_moves', methods=['GET'])
def get_legal_moves(session_id):
    game = get_game(session_id)
    return jsonify({'legal_moves': game.get_legal_moves()})

# Route to check if the game is over
@app.route('/<session_id>/is_game_over', methods=['GET'])
def is_game_over(session_id):
    game = get_game(session_id)
    return jsonify({'is_game_over': game.is_game_over()})

# Route to reset the game
@app.route('/<session_id>/reset', methods=['POST'])
def reset_game(session_id):
    game = get_game(session_id)
    new_board = game.reset_game()
    return jsonify({'board': new_board, 'legal_moves': game.get_legal_moves(), 'turn': game.get_turn()})

# Route to get the moves for a specific square
@app.route('/<session_id>/get_moves', methods=['POST'])
def get_moves(session_id):
    import chess

    data = request.json
    square_str = data.get('square').lower()
    square = chess.SQUARE_NAMES.index(square_str)
    game = get_game(session_id)
    moves = game.get_moves(square)
    return jsonify({'moves': moves})

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)