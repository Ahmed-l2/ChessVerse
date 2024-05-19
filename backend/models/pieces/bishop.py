#!/usr/bin/python3
from models.models import Color, Coords, FENChar
from models.pieces.piece import Piece


class Bishop(Piece):
    def __init__(self, piece_color: Color):
        super().__init__(piece_color)
        self._FENChar = FENChar.WhiteBishop if piece_color == Color.White else FENChar.BlackBishop
        self._directions = [
            Coords(1, 1),
            Coords(1, -1),
            Coords(-1, 1),
            Coords(-1, -1)
        ]
