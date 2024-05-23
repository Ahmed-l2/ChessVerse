import unittest
from models.models import Color
from models.pieces.king import King
from models.pieces.rook import Rook
from models.pieces.pawn import Pawn
from models.chess_board import ChessBoard

class TestChessBoard(unittest.TestCase):
    def setUp(self):
        self.chess_board = ChessBoard()

    def test_are_coords_valid(self):
        self.assertTrue(self.chess_board.are_coords_valid(0, 0))
        self.assertTrue(self.chess_board.are_coords_valid(7, 7))
        self.assertFalse(self.chess_board.are_coords_valid(-1, 0))
        self.assertFalse(self.chess_board.are_coords_valid(8, 8))

    def test_is_in_check(self):
        self.chess_board.chessBoard[0][4] = King(Color.White)
        self.chess_board.chessBoard[1][4] = Rook(Color.Black)
        self.assertTrue(self.chess_board.is_in_check(Color.White, True))
        self.chess_board.chessBoard[1][4] = None
        self.assertFalse(self.chess_board.is_in_check(Color.White, True))

    def test_is_position_safe_after_move(self):
        self.chess_board.chessBoard[0][4] = King(Color.White)
        self.chess_board.chessBoard[1][4] = Rook(Color.Black)
        self.assertFalse(self.chess_board.is_position_safe_after_move(0, 4, 0, 3))
        self.chess_board.chessBoard[1][4] = None
        self.assertTrue(self.chess_board.is_position_safe_after_move(0, 4, 0, 3))

    def test_find_safe_squares(self):
        self.chess_board.chessBoard[0][4] = King(Color.White)
        self.chess_board.chessBoard[1][4] = Rook(Color.Black)
        safe_squares = self.chess_board.find_safe_squares()
        self.assertNotIn('0,4', safe_squares)
        self.chess_board.chessBoard[1][4] = None
        safe_squares = self.chess_board.find_safe_squares()
        self.assertIn('0,4', safe_squares)