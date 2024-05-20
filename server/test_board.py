#!/usr/bin/python3
from models.models import Color, FENChar
from models.chess_board import ChessBoard

# Create a new chess board
board = ChessBoard()

# Print the player color
print("Player Color:", board.playerColor)  # Expected: Color.White

# Print the initial state of the chess board
print("\nInitial Chess Board:")
for row in board.chessBoardView:
    print(row)

# Move a piece (for testing purposes, let's move the pawn at (1, 1) two steps forward)
board.chessBoard[1][1].hasMoved = True

# Print the updated state of the chess board
print("\nUpdated Chess Board:")
for row in board.chessBoardView:
    print(row)
