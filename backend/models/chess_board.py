#!/usr/bin/python3
from models.models import Color, FENChar
from models.pieces.bishop import Bishop
from models.pieces.king import King
from models.pieces.knight import Knight
from models.pieces.pawn import Pawn
from models.pieces.queen import Queen
from models.pieces.rook import Rook
from models.pieces.piece import Piece

class ChessBoard:
    def __init__(self):
        self.chessBoard = [
            [
                Rook(Color.White), Knight(Color.White), Bishop(Color.White), Queen(Color.White),
                King(Color.White), Bishop(Color.White), Knight(Color.White), Rook(Color.White)
            ],
            [
                Pawn(Color.White) for _ in range(8)
            ],
            [None] * 8,
            [None] * 8,
            [None] * 8,
            [None] * 8,
            [
                Pawn(Color.Black) for _ in range(8)
            ],
            [
                Rook(Color.Black), Knight(Color.Black), Bishop(Color.Black), Queen(Color.Black),
                King(Color.Black), Bishop(Color.Black), Knight(Color.Black), Rook(Color.Black)
            ]
        ]
        self._playerColor = Color.White

    @property
    def playerColor(self):
        return self._playerColor

    @property
    def chessBoardView(self):
        return [[piece.FENChar if isinstance(piece, Piece) else None for piece in row] for row in self.chessBoard]

    @staticmethod
    def isSquareDark(x, y):
        return (x % 2 == 0 and y % 2 == 0) or (x % 2 == 1 and y % 2 == 1)
