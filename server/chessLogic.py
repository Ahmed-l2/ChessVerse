import chess
import chess.pgn
import chess.engine

class ChessGame:
    def __init__(self):
        self.board = chess.Board()
        self.engine = chess.engine.SimpleEngine.popen_uci("/usr/games/stockfish")

    def get_board(self):
        return self.board.fen()

    def make_move(self, move):
        try:
            self.board.push_san(move)
            return True, self.board.fen()
        except ValueError:
            return False, "Invalid move"
    
    def ai_move(self):
        # Get the best move from Stockfish
        self.engine.set_fen_position(self.board.fen())
        best_move = self.engine.get_best_move()

        # Apply the move to the board
        success, result = self.make_move(best_move)
        if success:
            return result
        else:
            return "Invalid move"

    def is_game_over(self):
        return self.board.is_game_over()

    def get_legal_moves(self):
        return [self.board.san(move) for move in self.board.legal_moves]

    def get_turn(self):
        return 'white' if self.board.turn == chess.WHITE else 'black'

    def reset_game(self):
        self.board.reset()
        return self.board.fen()
    
    def get_moves(self, square):
        moves = [move for move in self.board.legal_moves if move.from_square == square]
        return [self.board.san(move) for move in moves]
