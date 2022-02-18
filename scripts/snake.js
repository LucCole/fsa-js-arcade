const snake = {
    body: [[10, 5], [10, 6], [10, 7], [10, 8]],
    nextDirection: [0, 1],
    causeOfDeath: null
}

const gameState = {
    apple: [randomNum(16), randomNum(16)],
    timeInterval: null,
    speed: 1000 / 8,
    scores: [],
    heighestScore: 4
}


// ----- Game State -----

function tick() {
    changeSnakePosition();    
}


// ----- Board -----

function createGrid(x){
    // rows
    for(i = 0; i < x; i++){

        // columns
        for(j = 0; j < x; j++){

            let newSqure = $(`<div class="square" data-x="${i}" data-y="${j}"></div>`);
            $(".boardGrid").append(newSqure);
        }   
    }
}

function gameOver(){
    clearInterval(gameState.timeInterval)
    $(".board").toggleClass("inFront");

    $("#snakeLengthCounter").text(4)
    $("#snakeLength").text(snake.body.length-1);
    $(".result").html(`Died by <span class="deathMessage">${snake.causeOfDeath}</span>`)
    $(".playAgain").text("Play Again");

    gameState.scores.unshift(snake.body.length-1);

    snake.body = [[10, 5], [10, 6], [10, 7], [10, 8]];
    snake.nextDirection = [0, 1];
    gameState.apple = [randomNum(16), randomNum(16)];
    $(".square").removeClass("snake apple")

    gameState.timeInterval = null;

    const average = (gameState.scores.reduce((acc, score) => acc += score, 0) / gameState.scores.length).toFixed(1)
    $("#averageLength").text(average);

    if(gameState.heighestScore <= gameState.scores[0]){
        gameState.heighestScore = gameState.scores[0]
        $("#heightestScore").text(gameState.heighestScore);
    }
}


// ----- Game -----

function addApple(){

    let uniquePosition = false,
    x,
    y;

    while(!uniquePosition){
        x = randomNum(16);
        y = randomNum(16);
        uniquePosition = ifAppleOnSnake([x, y])
    }

    gameState.apple = [x, y];

    $(`[data-x=${gameState.apple[0]}][data-y=${gameState.apple[1]}]`).addClass("apple");
}

function removeApple(){
    $(`[data-x=${gameState.apple[0]}][data-y=${gameState.apple[1]}]`).removeClass("apple")
}

function ifAppleOnSnake(apple){
    
    let onSnake = true;

    snake.body.forEach(function(part){

        if(apple.toString() === part.toString()){
            onSnake = false;
        }
    });

    return onSnake;
}

function ifSnakeOnItself(){

    const snakeParts = snake.body;
    let onItself = false;

    snakeParts.forEach(function(part, index){

        const restOfSnake = snakeParts.slice(index+1)

        restOfSnake.forEach(function(subPart){
            if(subPart.toString() === part.toString()){
                onItself = true;
                snake.causeOfDeath = "trying to eat itself"
            }
        });

    });

    return onItself;
}

function ifHitWall(){

    const head = snake.body[snake.body.length - 1];
    
    if(!$(`[data-x=${head[0]}][data-y=${head[1]}]`).length){
        snake.causeOfDeath = "hitting a wall";
        return true;
    }

    return false;
}

function changeSnakePosition(){

    // Add new head
    const head = [
        snake.body[snake.body.length-1][0] + snake.nextDirection[0],
        snake.body[snake.body.length-1][1] + snake.nextDirection[1],
    ]

    snake.body.push([
        head[0],
        head[1]
    ]);

    $(`[data-x=${head[0]}][data-y=${head[1]}]`).addClass("snake");

    // If !hit wall && !eat itself 
    if(!ifHitWall() && !ifSnakeOnItself()){

        // If not on apple
        if(gameState.apple[0] !== head[0] || gameState.apple[1] !== head[1]){
            $(`[data-x=${snake.body[0][0]}][data-y=${snake.body[0][1]}]`).removeClass("snake");
            snake.body.shift();
        // If on apple
        }else{

            $("#snakeLengthCounter").text(snake.body.length);
            removeApple();
            addApple();
        }
    
    // Game over
    }else{
        gameOver();
    }
}


// ----- Setup -----

createGrid(20);


// ----- On Calls -----

$("html").keydown(function(evt) {

    if(gameState.timeInterval !== null){

        // IF statment so it can't turn on itself, IE the opposite direction.

        // Left: Arrow Key - A
        if(evt.keyCode === 37 || evt.keyCode === 65){

            if(snake.nextDirection[1] !== 1){
                snake.nextDirection = [0, -1];
            }

        // UP: Arrow Key - W
        }else if(evt.keyCode === 38 || evt.keyCode === 87){

            if(snake.nextDirection[0] !== 1){
                snake.nextDirection = [-1, 0];
            }

        // Right: Arrow Key - D
        }else if(evt.keyCode === 39 || evt.keyCode === 68){

            if(snake.nextDirection[1] !== -1){
                snake.nextDirection = [0, 1];
            }

        // Down: rrow Key - S
        }else if(evt.keyCode === 40 || evt.keyCode === 83){

            if(snake.nextDirection[0] !== -1){
                snake.nextDirection = [1, 0];
            }
        }
    }
})

$("#difficultyEasy").on("click", function(){

    gameState.speed = Math.floor(1000 / 10);

    $("#difficultyEasy").addClass("easy");
    $("#difficultyMedium").removeClass("medium");
    $("#difficultyHard").removeClass("hard");
});

$("#difficultyMedium").on("click", function(){

    gameState.speed = Math.floor(1000 / 15);

    $("#difficultyEasy").removeClass("easy");
    $("#difficultyMedium").addClass("medium");
    $("#difficultyHard").removeClass("hard");
});

$("#difficultyHard").on("click", function(){

    gameState.speed = Math.floor(1000 / 20);

    $("#difficultyEasy").removeClass("easy");
    $("#difficultyMedium").removeClass("medium");
    $("#difficultyHard").addClass("hard");
});

$(".playAgain").on("click", function(){

    snake.body.forEach(function(elem){
        $(`[data-x=${elem[0]}][data-y=${elem[1]}]`).addClass("snake");
    })
    
    snake.body = [[10, 5], [10, 6], [10, 7], [10, 8]];
    addApple();

    $(".board").toggleClass("inFront")

    setTimeout(function(){
        gameState.timeInterval = setInterval(tick, gameState.speed);
    }, 1000)
});