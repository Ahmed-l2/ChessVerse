// chess_board_jquery.js

// Function to fetch chess board data from Flask backend
function fetchChessBoard() {
    $.get('/chessboardjson', function(chessBoardView) {
        renderChessBoard(chessBoardView);
    });
}

// Function to render chess board based on data
function renderChessBoard(chessBoardView) {
    var $chessBoard = $('.chess-board');

    $.each(chessBoardView, function(rowIndex, row) {
        var $row = $('<div class="row"></div>');

        $.each(row, function(colIndex, piece) {
            var $square = $('<div class="square"></div>');

            if (piece) {
		$square.text(piece);
            }

            if ((rowIndex + colIndex) % 2 === 0) {
                $square.addClass('dark');
            } else {
                $square.addClass('light');
            }

            $row.append($square);
        });

        $chessBoard.append($row);
    });
}

// Load chess board when the page is ready
$(document).ready(function() {
    fetchChessBoard();
});
