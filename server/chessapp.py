#!/server/venv/bin/python3

# Import necessary modules
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

# Initialize Stockfish chess engine and set options
stockfish = Stockfish(path="/usr/games/stockfish")
stockfish._set_option('UCI_LimitStrength', 'true')
stockfish._set_option('UCI_Elo', 1000)

# Route to get the current board state
@app.route('/board', methods=['GET'])
def get_board():
    return jsonify({'board': game.get_board(), 'turn': game.get_turn()})

# Route to get the current turn
@app.route('/turn', methods=['GET'])
def get_turn():
    return jsonify({'turn': game.get_turn()})

# Route to make a move
@app.route('/move', methods=['POST'])
def make_move():
    data = request.json  # Parse JSON data from request
    move = data.get('move')  # Get the 'move' field from the data
    print(data)
    print(type(data))
    success, result = game.make_move(move)  # Attempt to make the move
    if success:
        return jsonify({'board': result, 'move': move,'legal_moves': game.get_legal_moves(), 'game_over': game.is_game_over()})
    else:
        return jsonify({'error': result}), 400  # Return error if move is invalid

# Route to get the AI's move
@app.route('/ai_move', methods=['POST'])
def get_ai_move():
    # time.sleep(0.5)  # Optional delay
    try:
        data = request.json  # Parse JSON data from request
        fen_position = data.get('fen')  # Get the FEN position from the frontend

        # Set Stockfish position to the given FEN
        stockfish.set_fen_position(fen_position)

        # Get the best move from Stockfish
        best_move = stockfish.get_best_move()

        # Apply the move to your game (assuming your ChessGame class has a method for this)
        success, result = game.make_move(best_move)
        if success:
            return jsonify({'move': best_move, 'board': result, 'legal_moves': game.get_legal_moves(), 'game_over': game.is_game_over()})
        else:
            return jsonify({'error': 'Invalid move'}), 400  # Return error if move is invalid
    except Exception as e:
        return jsonify({'error': str(e)}), 500  # Return error if exception occurs

# Route to get the legal moves
@app.route('/legal_moves', methods=['GET'])
def get_legal_moves():
    return jsonify({'legal_moves': game.get_legal_moves()})

# Route to check if the game is over
@app.route('/is_game_over', methods=['GET'])
def is_game_over():
    return jsonify({'is_game_over': game.is_game_over()})

# Route to reset the game
@app.route('/reset', methods=['POST'])
def reset_game():
    new_board = game.reset_game()  # Reset the game
    return jsonify({'board': new_board, 'legal_moves': game.get_legal_moves(), 'turn': game.get_turn()})

# Route to get the moves for a specific square
@app.route('/get_moves', methods=['POST'])
def get_moves():
    import chess  # Import chess module for square conversion

    data = request.json  # Parse JSON data from request
    square_str = data.get('square').lower()  # Get the 'square' field from the data and convert to lowercase
    square = chess.SQUARE_NAMES.index(square_str)  # Convert square name to index
    
    moves = game.get_moves(square)  # Get moves for the square
    return jsonify({'moves': moves})

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)