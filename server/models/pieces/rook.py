#!/usr/bin/python3
from models.models import Color, Coords, FENChar
from models.pieces.piece import Piece


class Rook(Piece):
    def __init__(self, piece_color: Color):
        super().__init__(piece_color)
        self._hasMoved = False
        self._FENChar = FENChar.WhiteRook if piece_color == Color.White else FENChar.BlackRook
        self._directions = [
            Coords(1, 0),
            Coords(-1, 0),
            Coords(0, 1),
            Coords(0, -1)
        ]

    @property
    def hasMoved(self):
        return self._hasMoved

    @hasMoved.setter
    def hasMoved(self, value):
        self._hasMoved = value
