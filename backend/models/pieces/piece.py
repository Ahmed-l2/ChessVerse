#!/usr/bin/python3
from models.models import Color, Coords, FENChar

class Piece:
    def __init__(self, color: Color):
        self._color = color

    @property
    def FENChar(self):
        return self._FENChar.value

    @property
    def directions(self):
        return self._directions

    @property
    def color(self):
        return self._color
