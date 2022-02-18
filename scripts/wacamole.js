const difficulty = {
    easy: {
        decoys: false,
        speeds: [4000, 3500, 3000],
        nextAnimalLimit: 6
    },
    medium: {
        decoys: true,
        speeds: [3000, 2500, 2000],
        nextAnimalLimit: 4
    },
    hard: {
        decoys: true,
        speeds: [1300, 1000, 700],
        nextAnimalLimit: 2
    }
},
gameState = {
    decoys: difficulty.easy.decoys,
    speeds: difficulty.easy.speeds,
    currentSpeed: difficulty.easy.speeds[0],
    nextAnimalLimit: difficulty.easy.nextAnimalLimit,
    score: [],
    heighestScore: 0,
    molesHit: 0,
    animalsHit: 0,
},
animals = [
    'mole',
    'mole',
    'rabbit',
    'mole',
    'duck',
    'mole',
    'mole',
    'squirrel',
    'mole',
    'mole',
];

let timeLimit = 60,
timeBeforeNextAnimal = 2,
timeUpdate;

// ----- Board -----

function reSetBoard(){

    // re-set timer
    clearInterval(timeUpdate);

    // update page
    removeAnimal($(".square"));
    $(".score").text(0);
    $(".timeLimit").text(timeLimit);
    $(".board").toggleClass("inFront")
    $(".timeLimit").removeClass("smallTimeLeft");
    $(".timeLimit").addClass("bigTimeLeft");

    $("#molesHit").text(gameState.molesHit);
    $("#animalsHit").text(gameState.animalsHit);
    $("#totalScore").text(gameState.score[0]);
    $("#averageScore").text((gameState.score.reduce((acc, score) => acc += score, 0) / gameState.score.length).toFixed(1));
    if(gameState.heighestScore < gameState.score[0]){
        gameState.heighestScore = gameState.score[0]
        $("#heightestScore").text(gameState.heighestScore);
    }

    $(".result").text("Nice job! Want to try again?");
    
    // re-set game state
    gameState.molesHit = 0;
    gameState.animalsHit = 0;
    timeLimit = 60;
}

// ----- Game State -----

function updateTimeLimit(){

    timeLimit--;
    $(".timeLimit").text(timeLimit);

    // Switch to mid stage
    if(timeLimit === 40){
        
        gameState.currentSpeed = gameState.speeds[1]

        $(".timeLimit").removeClass("bigTimeLeft");
        $(".timeLimit").addClass("mediumTimeLeft");
    
    // Switch to end phase
    }else if(timeLimit === 20){
        
        gameState.currentSpeed = gameState.speeds[2]

        $(".timeLimit").removeClass("mediumTimeLeft");
        $(".timeLimit").addClass("smallTimeLeft");
    
    // End the game
    }else if(timeLimit === 0){
        reSetBoard();
    }
}

function updateScore(animalType){
    if(animalType === "mole"){
        gameState.score[0]++;
        gameState.molesHit++;
    }else{
        gameState.score[0]--;
        gameState.animalsHit++;
    }
    $(".score").text(gameState.score[0]);
}

function nextAnimal(){
    
    // If no decoys
    if(!gameState.decoys){
        return "mole";
    }

    return animals[randomNum(10)];
}

function removeAnimal(animal){
    animal.off("click").removeClass("mole rabbit duck squirrel");
}

function addAnimal(){
    
    const nextSquare = randomNum(25),
    nextAnimalType = nextAnimal();

    $(`.boardGrid div:nth-child(${nextSquare})`).addClass(nextAnimalType);
    $(`.boardGrid div:nth-child(${nextSquare})`).on("click", function(){
        removeAnimal($(this));
        updateScore(nextAnimalType);
    })

    setTimeout(function(){
        removeAnimal($(`.boardGrid div:nth-child(${nextSquare})`));
    }, gameState.currentSpeed);
}

function animalUpdate(){

    timeBeforeNextAnimal --;
    if(timeBeforeNextAnimal === 0){
        timeBeforeNextAnimal = randomNum(gameState.nextAnimalLimit)
        addAnimal();
    }
}

// ----- Intervals -----

function renderState(){
    animalUpdate();
    updateTimeLimit();
}


// ----- On Calls -----

$("#difficultyEasy").on("click", function(){

    gameState.decoys = difficulty.easy.decoys;
    gameState.speeds = difficulty.easy.speeds;
    gameState.currentSpeed = difficulty.easy.speeds[0];
    gameState.nextAnimalLimit = difficulty.easy.nextAnimalLimit;

    $("#difficultyEasy").addClass("easy");
    $("#difficultyMedium").removeClass("medium");
    $("#difficultyHard").removeClass("hard");
});

$("#difficultyMedium").on("click", function(){

    gameState.decoys = difficulty.medium.decoys;
    gameState.speeds = difficulty.medium.speeds;
    gameState.currentSpeed = difficulty.medium.speeds[0];
    gameState.nextAnimalLimit = difficulty.medium.nextAnimalLimit;

    $("#difficultyEasy").removeClass("easy");
    $("#difficultyMedium").addClass("medium");
    $("#difficultyHard").removeClass("hard");
});

$("#difficultyHard").on("click", function(){

    gameState.decoys = difficulty.hard.decoys;
    gameState.speeds = difficulty.hard.speeds;
    gameState.currentSpeed = difficulty.hard.speeds[0];
    gameState.nextAnimalLimit = difficulty.hard.nextAnimalLimit;

    $("#difficultyEasy").removeClass("easy");
    $("#difficultyMedium").removeClass("medium");
    $("#difficultyHard").addClass("hard");
});

// Start game
$(".playAgain").on("click", function(){

    $(".board").toggleClass("inFront")

    timeUpdate = setInterval(renderState, 1000);
    gameState.score.unshift(0);
});