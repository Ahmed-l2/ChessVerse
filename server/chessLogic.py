# Import necessary libraries
import chess
import chess.pgn
import chess.engine

# Define a class for the chess game
class ChessGame:
    # Initialize the game board and the chess engine
    def __init__(self):
        self.board = chess.Board()  # Create a new game board
        self.engine = chess.engine.SimpleEngine.popen_uci("/usr/games/stockfish")  # Initialize the Stockfish engine

    # Get the current state of the game board
    def get_board(self):
        return self.board.fen()

    # Make a move on the board
    def make_move(self, move):
        try:
            self.board.push_san(move)  # Try to make the move
            return True, self.board.fen()  # Return the new state of the board
        except ValueError:
            return False, "Invalid move"  # If the move is invalid, return an error message
    
    # Make a move using the AI
    def ai_move(self):
        # Get the best move from Stockfish
        self.engine.set_fen_position(self.board.fen())
        best_move = self.engine.get_best_move()

        # Apply the move to the board
        success, result = self.make_move(best_move)
        if success:
            return result  # Return the new state of the board
        else:
            return "Invalid move"  # If the move is invalid, return an error message

    # Check if the game is over
    def is_game_over(self):
        return self.board.is_game_over()

    # Get a list of all legal moves
    def get_legal_moves(self):
        return [self.board.san(move) for move in self.board.legal_moves]

    # Get the current turn
    def get_turn(self):
        return 'white' if self.board.turn == chess.WHITE else 'black'

    # Reset the game
    def reset_game(self):
        self.board.reset()  # Reset the game board
        return self.board.fen()  # Return the initial state of the board
    
    # Get all legal moves from a specific square
    def get_moves(self, square):
        moves = [move for move in self.board.legal_moves if move.from_square == square]
        return [self.board.san(move) for move in moves]  # Return the moves in standard algebraic notation