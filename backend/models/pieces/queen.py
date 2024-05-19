#!/usr/bin/python3
from models.models import Color, Coords, FENChar
from models.pieces.piece import Piece


class Queen(Piece):
    def __init__(self, piece_color: Color):
        super().__init__(piece_color)
        self._FENChar = FENChar.WhiteQueen if piece_color == Color.White else FENChar.BlackQueen
        self._directions = [
            Coords(0, 1),
            Coords(0, -1),
            Coords(1, 0),
            Coords(1, -1),
            Coords(1, 1),
            Coords(-1, 0),
            Coords(-1, 1),
            Coords(-1, -1)
        ]
