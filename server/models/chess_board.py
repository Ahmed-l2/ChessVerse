from models.models import Color, FENChar
from models.pieces.bishop import Bishop
from models.pieces.king import King
from models.pieces.knight import Knight
from models.pieces.pawn import Pawn
from models.pieces.queen import Queen
from models.pieces.rook import Rook
from models.pieces.piece import Piece

class ChessBoard:
    def __init__(self):
        self.chessBoardSize = 8
        self.chessBoard = [
            [
                Rook(Color.White), Knight(Color.White), Bishop(Color.White), Queen(Color.White),
                King(Color.White), Bishop(Color.White), Knight(Color.White), Rook(Color.White)
            ],
            [
                Pawn(Color.White) for _ in range(8)
            ],
            [None] * 8,
            [None] * 8,
            [None] * 8,
            [None] * 8,
            [
                Pawn(Color.Black) for _ in range(8)
            ],
            [
                Rook(Color.Black), Knight(Color.Black), Bishop(Color.Black), Queen(Color.Black),
                King(Color.Black), Bishop(Color.Black), Knight(Color.Black), Rook(Color.Black)
            ]
        ]
        self._playerColor = Color.White
        self._check_state = {'isInCheck': False}
        self._last_move = None
        self.selectedSquare = None
        self.pieceSafeSquares = []

    @property
    def playerColor(self):
        return self._playerColor.name

    @property
    def chessBoardView(self):
        return [[piece.FENChar if isinstance(piece, Piece) else None for piece in row] for row in self.chessBoard]

    def are_coords_valid(self, x: int, y: int) -> bool:
        return 0 <= x < self.chessBoardSize and 0 <= y < self.chessBoardSize

    def is_in_check(self, player_color: Color, checking_current_position: bool) -> bool:
        for x in range(self.chessBoardSize):
            for y in range(self.chessBoardSize):
                piece = self.chessBoard[x][y]
                if not piece or piece.color == player_color:
                    continue

                for direction in piece.directions:
                    dx, dy = direction.x, direction.y
                    new_x, new_y = x + dx, y + dy

                    if not self.are_coords_valid(new_x, new_y):
                        continue

                    if isinstance(piece, (Pawn, Knight, King)):
                        if isinstance(piece, Pawn) and dy == 0:
                            continue

                        attacked_piece = self.chessBoard[new_x][new_y]
                        if isinstance(attacked_piece, King) and attacked_piece.color == player_color:
                            if checking_current_position:
                                self._check_state = {'isInCheck': True, 'x': new_x, 'y': new_y}
                            return True
                    else:
                        while self.are_coords_valid(new_x, new_y):
                            attacked_piece = self.chessBoard[new_x][new_y]
                            if isinstance(attacked_piece, King) and attacked_piece.color == player_color:
                                if checking_current_position:
                                    self._check_state = {'isInCheck': True, 'x': new_x, 'y': new_y}
                                return True

                            if attacked_piece is not None:
                                break

                            new_x += dx
                            new_y += dy

        if checking_current_position:
            self._check_state = {'isInCheck': False}
        return False

    def is_position_safe_after_move(self, prev_x: int, prev_y: int, new_x: int, new_y: int) -> bool:
        piece = self.chessBoard[prev_x][prev_y]
        if not piece:
            return False

        new_piece = self.chessBoard[new_x][new_y]
        if new_piece and new_piece.color == piece.color:
            return False

        self.chessBoard[prev_x][prev_y] = None
        self.chessBoard[new_x][new_y] = piece

        is_position_safe = not self.is_in_check(piece.color, False)

        self.chessBoard[prev_x][prev_y] = piece
        self.chessBoard[new_x][new_y] = new_piece

        return is_position_safe

    def find_safe_squares(self):
        safe_squares = {}

        for x in range(self.chessBoardSize):
            for y in range(self.chessBoardSize):
                piece = self.chessBoard[x][y]
                if not piece or piece.color != self._playerColor:
                    continue

                piece_safe_squares = []

                for direction in piece.directions:
                    dx, dy = direction.x, direction.y
                    new_x, new_y = x + dx, y + dy

                    if not self.are_coords_valid(new_x, new_y):
                        continue

                    new_piece = self.chessBoard[new_x][new_y]
                    if new_piece and new_piece.color == piece.color:
                        continue

                    if isinstance(piece, (Pawn, Knight, King)):
                        if self.is_position_safe_after_move(x, y, new_x, new_y):
                            piece_safe_squares.append({'x': new_x, 'y': new_y})
                    else:
                        while self.are_coords_valid(new_x, new_y):
                            new_piece = self.chessBoard[new_x][new_y]
                            if new_piece and new_piece.color == piece.color:
                                break

                            if self.is_position_safe_after_move(x, y, new_x, new_y):
                                piece_safe_squares.append({'x': new_x, 'y': new_y})

                            if new_piece is not None:
                                break

                            new_x += dx
                            new_y += dy

                if isinstance(piece, King):
                    if self.can_castle(piece, True):
                        piece_safe_squares.append({'x': x, 'y': 6})

                    if self.can_castle(piece, False):
                        piece_safe_squares.append({'x': x, 'y': 2})
                elif isinstance(piece, Pawn) and self.can_capture_en_passant(piece, x, y):
                    piece_safe_squares.append({'x': x + (1 if piece.color == Color.White else -1), 'y': self._last_move['prevY']})

                if piece_safe_squares:
                    safe_squares[f'{x},{y}'] = piece_safe_squares

        return safe_squares

    def can_capture_en_passant(self, pawn: Pawn, pawn_x: int, pawn_y: int) -> bool:
        if not self._last_move:
            return False
        last_move = self._last_move
        piece, prev_x, prev_y, curr_x, curr_y = last_move['piece'], last_move['prevX'], last_move['prevY'], last_move['currX'], last_move['currY']

        if not isinstance(piece, Pawn) or pawn.color != self._playerColor or abs(curr_x - prev_x) != 2 or pawn_x != curr_x or abs(pawn_y - curr_y) != 1:
            return False

        pawn_new_position_x = pawn_x + (1 if pawn.color == Color.White else -1)
        pawn_new_position_y = curr_y

        self.chessBoard[curr_x][curr_y] = None
        is_position_safe = self.is_position_safe_after_move(pawn_x, pawn_y, pawn_new_position_x, pawn_new_position_y)
        self.chessBoard[curr_x][curr_y] = piece

        return is_position_safe

    def can_castle(self, king: King, king_side_castle: bool) -> bool:
        if king.hasMoved:
            return False

        king_position_x = 0 if king.color == Color.White else 7
        king_position_y = 4
        rook_position_x = king_position_x
        rook_position_y = 7 if king_side_castle else 0
        rook = self.chessBoard[rook_position_x][rook_position_y]

        if not isinstance(rook, Rook) or rook.hasMoved or self._check_state['isInCheck']:
            return False

        first_next_king_position_y = king_position_y + (1 if king_side_castle else -1)
        second_next_king_position_y = king_position_y + (2 if king_side_castle else -2)

        if self.chessBoard[king_position_x][first_next_king_position_y] or self.chessBoard[king_position_x][second_next_king_position_y]:
            return False

        if not king_side_castle and self.chessBoard[king_position_x][1]:
            return False

        return self.is_position_safe_after_move(king_position_x, king_position_y, king_position_x, first_next_king_position_y) and \
               self.is_position_safe_after_move(king_position_x, king_position_y, king_position_x, second_next_king_position_y)
    
    def is_square_selected(self, x, y):
        if not self.selectedSquare or not self.selectedSquare.piece:
            return False
        return self.selectedSquare.x == x and self.selectedSquare.y == y

    def is_square_safe_for_selected_piece(self, x, y):
        return any(coords for coords in self.pieceSafeSquares if coords.x == x and coords.y == y)