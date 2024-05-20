#!/usr/bin/python3
from models.models import Color, Coords, FENChar
from models.pieces.piece import Piece


class Pawn(Piece):
    def __init__(self, piece_color: Color):
        super().__init__(piece_color)
        self._hasMoved = False
        self._directions = [
            Coords(1, 0),
            Coords(2, 0) if piece_color == Color.White else Coords(-2, 0),  # Handle initial two-step move for white and black pawns
            Coords(1, 1) if piece_color == Color.White else Coords(-1, 1),  # Diagonal capture to the right for white and left for black pawns
            Coords(1, -1) if piece_color == Color.White else Coords(-1, -1)  # Diagonal capture to the left for white and right for black pawns
        ]
        self._FENChar = FENChar.WhitePawn if piece_color == Color.White else FENChar.BlackPawn

    @property
    def hasMoved(self):
        return self._hasMoved

    @hasMoved.setter
    def hasMoved(self, value):
        self._hasMoved = value
        self._directions = [
            Coords(1, 0),
            Coords(1, 1) if self.color == Color.White else Coords(1, -1),  # Diagonal capture after pawn has moved
            Coords(1, -1) if self.color == Color.White else Coords(1, 1)
        ]
