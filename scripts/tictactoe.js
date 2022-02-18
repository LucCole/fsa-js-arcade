const gameState = {
    players: ['x', 'o'],
    computer: 0,
    score: {
        x: 0,
        o: 0,
    },
    board: [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ],
    posLeft: 9
},
board = $(".board").children();

let playerNames = ["Player 1", "Player 2"];


// ----- Player -----

function changePlayer(){
    gameState.players.reverse();
}


// ----- Board -----

function reSetBoard(){

    if(gameState.players[0] === "o"){
        changePlayer();
    }

    gameState.board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    gameState.posLeft = 9;

    squares = $(".board .square");
    squares.removeClass("x o");
    squares.text("");

}

// This adds to our Board array, not the actual board
function addToBoard(square){

    let counter = 0;
    const boardIndex = board.index(square);

    // Rows
    gameState.board.forEach((row, Indx) => {

        // Columns
        row.forEach((col, colndx) => {

            if(counter === boardIndex){

                gameState.board[Indx][colndx] = gameState.players[0]
            }

            counter++;
        })
    });
}

function addLetterToBoard(square){

    square.addClass(`${gameState.players[0]}`);
    square.text(gameState.players[0]);
    addToBoard(square);
    gameState.posLeft--
}

function computerSquareSelect(){
    
    let squares = $(".board").children(),
    marked = false;

    squares.each(function(indx){

        if(!marked){

            if($(this).text() === ""){
                addLetterToBoard($(this));
                marked = true;
            }
        }
    });
}

function addPoint(){

    const player = gameState.players[0];
    gameState.score[player]++;

    if(player === "x"){
        $(".playerOneScore").text(gameState.score[player])
        $(".result").text(`${playerNames[0]} WON!`);
    }else{
        $(".playerTwoScore").text(gameState.score[player])
        $(".result").text(`${playerNames[1]} WON!`);
    }
}

function squareClick(square){
// To be run everytime a square is clicked

    // If not selected
    if(!square.hasClass("x") && !square.hasClass("o")){

        addLetterToBoard(square);

        // If won
        if(goThroughRows()){
            $(".square").off("click");
            $(".playAgain").text("Play Again");
            addPoint();
            $(".board").toggleClass("inFront")
            
        }else{

            // If draw
            if(!gameState.posLeft){

                $(".square").off("click");
                $(".playAgain").text("Play Again");
                $(".board").toggleClass("inFront")
                $(".result").text("DRAW");
            }

            // Change player 
            changePlayer();

            // If single player use the computers term
            if(gameState.computer && gameState.players[0] === "o"){

                // Select square, Check win, switch players. Ovverides Player 2's turn
                computerSquareSelect();

                if(goThroughRows()){
                    $(".square").off("click");
                    $(".playAgain").text("Play Again");
                    addPoint();
                    $(".board").toggleClass("inFront")
                }

                changePlayer();
            }
        }
    }
}


// ----- Check Win -----

function checkWin(rows){
    let won = false;

    // If there are 3 X's || 3 O's, Win
    rows.forEach(function(row){

        let xTotal = 0,
        oTotal = 0;

        row.forEach(ele => {
            if(ele === "x"){
                xTotal++;
            }else if(ele === "o"){
                oTotal++;
            }
        });

        if(xTotal === 3 || oTotal === 3){
            won = true;
        }

    });

    return won;
}

function getRows(){

    const rows = {
        horazontal: [],
        vertical: [],
        diagonal: [[], []],
    },
    boardRows = gameState.board,
    length = boardRows.length;


    boardRows.forEach(function(value, index){

        // Horizontal rows
        rows.horazontal.push(value);


        // Vertical rows
        rows.vertical.push([]);
        for(i = 0; i < length; i++){
            rows.vertical[index].push(boardRows[i][index])
        }

        // Diagonal rows
        rows.diagonal[0].push(value[index]);
        rows.diagonal[1].push(value[(boardRows.length - index) - 1]);
    });
    
    return rows;
}

function goThroughRows(){

    // All possible winning rows
    const rows = getRows();

    // If one is filled
    if(checkWin(rows.horazontal) || checkWin(rows.vertical) || checkWin(rows.diagonal)){
        return true;
    }

    return false;
}


// ----- On Calls -----

$("#switchToSingle").on("click", function(){

    $(".onePlayerForm").removeClass("displayNone");
    $(".twoPlayerForm").addClass("displayNone");
});

$("#switchToMulti").on("click", function(){

    $(".onePlayerForm").addClass("displayNone");
    $(".twoPlayerForm").removeClass("displayNone");
});

$(".startOnePlayer").on("click", function(){

    $(".options").toggleClass("displayNone");
    $(".start").toggleClass("displayNone");


    const playerNameInpt = $(".playerInpt").val();
    // If not empty input
    if(playerNameInpt !== ""){    
        playerNames[0] = playerNameInpt;
    }


    playerNames[1] = "Computer";

    $(".playerOneName").text(playerNames[0]);
    $(".playerTwoName").text(playerNames[1]);


    gameState.computer = 1;

});

$(".startTwoPlayer").on("click", function(){

    $(".options").toggleClass("displayNone");
    $(".start").toggleClass("displayNone");

    const playerOneNameInpt = $(".playerOneInpt").val(),
    playerTwoNameInpt = $(".playerTwoInpt").val();

    // If not empty input
    if(playerOneNameInpt !== ""){    
        playerNames[0] = playerOneNameInpt;
    }
    if(playerTwoNameInpt !== ""){    
        playerNames[1] = playerTwoNameInpt;
    }


    $(".playerOneName").text(playerNames[0]);
    $(".playerTwoName").text(playerNames[1]);

    gameState.computer = 0;

});

$(".playAgain").on("click", function(){

    $(".board").toggleClass("inFront")

    $(this).text("Restart")

    reSetBoard();

    $(".square").on("click", function(){
        squareClick($(this));
    });
});