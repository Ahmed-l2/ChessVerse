#!/usr/bin/python

from models.models import Color
from models.pieces.bishop import Bishop
from models.pieces.knight import Knight
from models.pieces.queen import Queen
from models.pieces.rook import Rook
from models.pieces.king import King
from models.pieces.pawn import Pawn

# Instantiate a white bishop
white_bishop = Bishop(Color.White)

# Print out the properties of the white bishop
print("White Bishop:")
print("FENChar:", white_bishop.FENChar)  # Expected: B
print("Directions:", [(direction.x, direction.y) for direction in white_bishop.directions])  # Extract x and y coordinates
print("Color:", white_bishop.color)  # Expected: Color.White

# Instantiate a black bishop
black_bishop = Bishop(Color.Black)

# Print out the properties of the black bishop
print("\nBlack Bishop:")
print("FENChar:", black_bishop.FENChar)  # Expected: b
print("Directions:", [(direction.x, direction.y) for direction in black_bishop.directions])  # Extract x and y coordinates
print("Color:", black_bishop.color)  # Expected: Color.Black

print("----------------------------------")

# Instantiate a white bishop
white_knight = Knight(Color.White)

# Print out the properties of the white knight
print("White knigt:")
print("FENChar:", white_knight.FENChar)  # Expected: B
print("Directions:", [(direction.x, direction.y) for direction in white_knight.directions])  # Extract x and y coordinates
print("Color:", white_knight.color)  # Expected: Color.White

# Instantiate a black knight
black_knight = Knight(Color.Black)

# Print out the properties of the black knight
print("\nBlack Knight:")
print("FENChar:", black_knight.FENChar)  # Expected: b
print("Directions:", [(direction.x, direction.y) for direction in black_knight.directions])  # Extract x and y coordinates
print("Color:", black_knight.color)  # Expected: Color.Black

print("----------------------------------")

# Instantiate a white queen
white_queen = Queen(Color.White)

# Print out the properties of the white queen
print("White Queen:")
print("FENChar:", white_queen.FENChar)  # Expected: Q
print("Directions:", [(direction.x, direction.y) for direction in white_queen.directions])  # Extract x and y coordinates
print("Color:", white_queen.color)  # Expected: Color.White

# Instantiate a black queen
black_queen = Queen(Color.Black)

# Print out the properties of the black queen
print("\nBlack Queen:")
print("FENChar:", black_queen.FENChar)  # Expected: q
print("Directions:", [(direction.x, direction.y) for direction in black_queen.directions])  # Extract x and y coordinates
print("Color:", black_queen.color)  # Expected: Color.Black

print("----------------------------------")

# Instantiate a white rook
white_rook = Rook(Color.White)

# Print out the properties of the white rook
print("White Rook:")
print("FENChar:", white_rook.FENChar)  # Expected: R
print("Directions:", [(direction.x, direction.y) for direction in white_rook.directions])  # Extract x and y coordinates
print("Color:", white_rook.color)  # Expected: Color.White
print("Has Moved:", white_rook.hasMoved)  # Expected: False

# Instantiate a black rook
black_rook = Rook(Color.Black)

# Print out the properties of the black rook
print("\nBlack Rook:")
print("FENChar:", black_rook.FENChar)  # Expected: r
print("Directions:", [(direction.x, direction.y) for direction in black_rook.directions])  # Extract x and y coordinates
print("Color:", black_rook.color)  # Expected: Color.Black
print("Has Moved:", black_rook.hasMoved)  # Expected: False

print("----------------------------------")

# Instantiate a white king
white_king = King(Color.White)

# Print out the properties of the white king
print("White King:")
print("FENChar:", white_king.FENChar)  # Expected: K
print("Directions:", [(direction.x, direction.y) for direction in white_king.directions])  # Extract x and y coordinates
print("Color:", white_king.color)  # Expected: Color.White
print("Has Moved:", white_king.hasMoved)  # Expected: False

# Instantiate a black king
black_king = King(Color.Black)

# Print out the properties of the black king
print("\nBlack King:")
print("FENChar:", black_king.FENChar)  # Expected: k
print("Directions:", [(direction.x, direction.y) for direction in black_king.directions])  # Extract x and y coordinates
print("Color:", black_king.color)  # Expected: Color.Black
print("Has Moved:", black_king.hasMoved)  # Expected: False

print("----------------------------------")

# Instantiate a white pawn
white_pawn = Pawn(Color.White)

# Print out the properties of the white pawn
print("White Pawn:")
print("FENChar:", white_pawn.FENChar)  # Expected: P
print("Directions:", [(direction.x, direction.y) for direction in white_pawn.directions])  # Extract x and y coordinates
print("Color:", white_pawn.color)  # Expected: Color.White
print("Has Moved:", white_pawn.hasMoved)  # Expected: False

# Move the white pawn
white_pawn.hasMoved = True

# Print out the properties of the white pawn after moving
print("\nWhite Pawn after moving:")
print("FENChar:", white_pawn.FENChar)  # Expected: P
print("Directions:", [(direction.x, direction.y) for direction in white_pawn.directions])  # Extract x and y coordinates
print("Color:", white_pawn.color)  # Expected: Color.White
print("Has Moved:", white_pawn.hasMoved)  # Expected: True

# Instantiate a black pawn
black_pawn = Pawn(Color.Black)

# Print out the properties of the black pawn
print("\nBlack Pawn:")
print("FENChar:", black_pawn.FENChar)  # Expected: p
print("Directions:", [(direction.x, direction.y) for direction in black_pawn.directions])  # Extract x and y coordinates
print("Color:", black_pawn.color)  # Expected: Color.Black
print("Has Moved:", black_pawn.hasMoved)  # Expected: False

# Move the black pawn
black_pawn.hasMoved = True

# Print out the properties of the black pawn after moving
print("\nBlack Pawn after moving:")
print("FENChar:", black_pawn.FENChar)  # Expected: p
print("Directions:", [(direction.x, direction.y) for direction in black_pawn.directions])  # Extract x and y coordinates
print("Color:", black_pawn.color)  # Expected: Color.Black
print("Has Moved:", black_pawn.hasMoved)  # Expected: True
