from flask import Flask, jsonify, request
from chessLogic import ChessGame
from flask_cors import CORS
from stockfish import Stockfish
import time

app = Flask(__name__)
cors = CORS(app, origins='*')
game = ChessGame()

stockfish = Stockfish(path="/usr/games/stockfish")
stockfish._set_option('UCI_LimitStrength', 'true')
stockfish._set_option('UCI_Elo', 1000)

@app.route('/board', methods=['GET'])
def get_board():
    return jsonify({'board': game.get_board(), 'turn': game.get_turn()})

@app.route('/turn', methods=['GET'])
def get_turn():
    return jsonify({'turn': game.get_turn()})

@app.route('/move', methods=['POST'])
def make_move():
    data = request.json
    move = data.get('move')
    print(data)
    print(type(data))
    success, result = game.make_move(move)
    if success:
        return jsonify({'board': result, 'legal_moves': game.get_legal_moves(), 'game_over': game.is_game_over()})
    else:
        return jsonify({'error': result}), 400

@app.route('/ai_move', methods=['POST'])
def get_ai_move():
    #time.sleep(0.5)
    try:
        data = request.json
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
            return jsonify({'error': 'Invalid move'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to get legal moves in the current game state
@app.route('/legal_moves', methods=['GET'])
def get_legal_moves():
    # Return a JSON response with the legal moves
    return jsonify({'legal_moves': game.get_legal_moves()})

# Route to check if the game is over
@app.route('/is_game_over', methods=['GET'])
def is_game_over():
    # Return a JSON response indicating whether the game is over
    return jsonify({'is_game_over': game.is_game_over()})

# Route to reset the game
@app.route('/reset', methods=['POST'])
def reset_game():
    # Reset the game and get the new board state
    new_board = game.reset_game()
    # Return a JSON response with the new board, legal moves, and current turn
    return jsonify({'board': new_board, 'legal_moves': game.get_legal_moves(), 'turn': game.get_turn()})

# Route to get possible moves from a specific square
@app.route('/get_moves', methods=['POST'])
def get_moves():
    import chess

    data = request.json
    # Get the square from the data and convert it to lowercase
    square_str = data.get('square').lower()
    # Find the index of the square in chess.SQUARE_NAMES
    square = chess.SQUARE_NAMES.index(square_str)
    
    moves = game.get_moves(square)
    return jsonify({'moves': moves})

if __name__ == '__main__':
    app.run(debug=True)
