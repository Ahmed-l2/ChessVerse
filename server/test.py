import chess

board = chess.Board()

print(board)
print(board.legal_moves)
board.push_san('h3')
print(board)

