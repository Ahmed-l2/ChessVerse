from flask import Flask, send_from_directory, jsonify, request
import os
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

react_folder = 'client'
directory= os.getcwd()+ f'/{react_folder}/dist/assets'


@app.route('/')
def index():
    ''' User will call with with thier id to store the symbol as registered'''
    path= os.getcwd()+ f'/{react_folder}/dist'
    print(path)
    return send_from_directory(directory=path,path='index.html')

#
@app.route('/static/<folder>/<file>')
def css(folder,file):
    ''' User will call with with thier id to store the symbol as registered'''
    
    path = folder+'/'+file
    return send_from_directory(directory=directory,path=path)


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
    # time.sleep(0.5)
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
            return jsonify({'move': best_move, 'board': result, 'legal_moves': game.get_legal_moves(),
                            'game_over': game.is_game_over()})
        else:
            return jsonify({'error': 'Invalid move'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


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
    app.run(debug=True, threaded=True)