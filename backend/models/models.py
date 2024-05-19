#!/usr/bin/python3
from enum import Enum


class Color(Enum):
    White = 0
    Black = 1

class Coords:
    def __init__(self, x: int, y: int):
        self.x = x
        self.y = y

class FENChar(Enum):
    WhitePawn = 'P'
    WhiteKnight = 'N'
    WhiteBishop = 'B'
    WhiteRook = 'R'
    WhiteQueen = 'Q'
    WhiteKing = 'K'
    BlackPawn = 'p'
    BlackKnight = 'n'
    BlackBishop = 'b'
    BlackRook = 'r'
    BlackQueen = 'q'
    BlackKing = 'k'

pieceImagePaths = {
    FENChar.WhitePawn: "static/images/P.svg",
    FENChar.WhiteKnight: "static/images/N.svg",
    FENChar.WhiteBishop: "static/images/B.svg",
    FENChar.WhiteRook: "static/images/R.svg",
    FENChar.WhiteQueen: "static/images/Q.svg",
    FENChar.WhiteKing: "static/images/K.svg",
    FENChar.BlackPawn: "static/images/p.svg",
    FENChar.BlackKnight: "static/images/n.svg",
    FENChar.BlackBishop: "static/images/b.svg",
    FENChar.BlackRook: "static/images/r.svg",
    FENChar.BlackQueen: "static/images/q.svg",
    FENChar.BlackKing: "static/images/k.svg"
}
