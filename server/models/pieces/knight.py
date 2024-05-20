from models.models import Color, Coords, FENChar
from models.pieces.piece import Piece

class Knight(Piece):
    def __init__(self, piece_color: Color):
        super().__init__(piece_color)
        self._FENChar = FENChar.WhiteKnight if piece_color == Color.White else FENChar.BlackKnight
        self._directions = [
            Coords(1, 2),
            Coords(1, -2),
            Coords(-1, 2),
            Coords(-1, -2),
            Coords(2, 1),
            Coords(2, -1),
            Coords(-2, 1),
            Coords(-2, -1)
        ]
