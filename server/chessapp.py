from flask import Flask, jsonify, request
from chessLogic import ChessGame
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, origins='*')
game = ChessGame()

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
        return jsonify({'board': result, 'legal_moves': game.get_legal_moves()})
    else:
        return jsonify({'error': result}), 400

@app.route('/legal_moves', methods=['GET'])
def get_legal_moves():
    return jsonify({'legal_moves': game.get_legal_moves()})

@app.route('/is_game_over', methods=['GET'])
def is_game_over():
    return jsonify({'is_game_over': game.is_game_over()})

@app.route('/reset', methods=['POST'])
def reset_game():
    new_board = game.reset_game()
    return jsonify({'board': new_board, 'legal_moves': game.get_legal_moves(), 'turn': game.get_turn()})

@app.route('/get_moves', methods=['POST'])
def get_moves():
    import chess

    data = request.json
    square_str = data.get('square').lower()
    square = chess.SQUARE_NAMES.index(square_str)
    
    moves = game.get_moves(square)
    return jsonify({'moves': moves})

if __name__ == '__main__':
    app.run(debug=True)