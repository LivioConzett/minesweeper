
// get the html element
const gameField = document.querySelector('.field-holder');
const gameWindow = document.querySelector('.game-window');
const bombCounter = document.querySelector('.bomb-counter-text');
const resetButton = document.querySelector('.reset-button');
const settingsHolder = document.querySelector('.settings-holder');
const settingsButton = document.querySelector('.settings-button');
const widthInput = document.querySelector('#width-input');
const heightInput = document.querySelector('#height-input');
const bombInput = document.querySelector('#bomb-input');
const flagButton = document.querySelector('.flag-button');
const questionButton = document.querySelector('.question-button');


let fieldRows = 10;
let fieldColumns = 10;
let bombAmount = 10;

const minFieldRows = 5;
const minFieldColumns = 5;

const maxFieldRows = 18;
const maxFieldColumns = 30;


let firstClick = true;

let flagActive = false;
let questionActive = false;

// array of fileds 2d
let fieldArray = [];

// array of fields 1d used to randomly place bombs
let bombAddArray = [];


 // remove the right click menu
gameWindow.addEventListener('contextmenu', (event) => {
    event.preventDefault();
}, false);


// add the reset button listener
resetButton.addEventListener('mousedown', (event) => {

    resetButton.classList.remove('box-out-narrow');
    resetButton.classList.add('box-in-narrow');

    settingsHolder.style.visibility = 'visible';


});

flagButton.addEventListener('mousedown', (event) => {

    deactivateQuestion();

    if(flagActive){
        deactivateFlag();
    }
    else{
        activateFlag();
    }
});

questionButton.addEventListener('mousedown', (event) => {

    deactivateFlag();

    if(questionActive){
        deactivateQuestion();
    }
    else{
        activateQuestion();
    }
});


settingsButton.addEventListener('mousedown', (event) => {

    checkInputs();

    settingsButton.classList.remove('box-out-narrow');
    settingsButton.classList.add('box-in-narrow');

    fieldColumns = widthInput.value;
    fieldRows = heightInput.value;
    bombAmount = bombInput.value;

    settingsHolder.style.visibility = 'hidden';

    settingsButton.classList.remove('box-in-narrow');
    settingsButton.classList.add('box-out-narrow');

    initAll();

});

heightInput.addEventListener('change', (event) => {

    checkInputs();

});

widthInput.addEventListener('change', (event) => {

    checkInputs();

});

bombInput.addEventListener('change', (event) => {

    checkInputs();

});


// start the game
initAll();


// function to init all
function initAll(){

    
    bombCounter.innerHTML = bombAmount;
    
    firstClick = true;
    
    bombAddArray = [];

    resetButton.classList.remove('box-in-narrow');
    resetButton.classList.add('box-out-narrow');
    resetButton.style.visibility = 'hidden';
    
    buildGrid();

}

// activate the flag
function activateFlag(){
    flagButton.classList.remove('box-out-wide');
    flagButton.classList.add('box-in-wide');
    flagButton.style.backgroundColor = 'rgba(0,255,0,.5)';

    flagActive = true;
}

function deactivateFlag(){
    flagButton.classList.remove('box-in-wide');
    flagButton.classList.add('box-out-wide');
    flagButton.style.backgroundColor = '';

    flagActive = false;
}

// activate the flag
function activateQuestion(){
    questionButton.classList.remove('box-out-wide');
    questionButton.classList.add('box-in-wide');
    questionButton.style.backgroundColor = 'rgba(0,255,0,.5)';

    questionActive = true;
}

function deactivateQuestion(){
    questionButton.classList.remove('box-in-wide');
    questionButton.classList.add('box-out-wide');
    questionButton.style.backgroundColor = '';

    questionActive = false;
}

// check the inputs
function checkInputs(){

    if(widthInput.value === '' | widthInput.value < minFieldColumns){
        widthInput.value = minFieldColumns;
    }

    if(heightInput.value === '' | heightInput.value < minFieldRows){
        heightInput.value = minFieldRows;
    }

    if(widthInput.value > maxFieldColumns){
        widthInput.value = maxFieldColumns;
    }

    if(heightInput.value > maxFieldRows){
        heightInput.value = maxFieldRows;
    }

    if(bombInput.value === '' | bombInput.value < 1){
        bombInput.value = 1;
    }

    let maxBombs = (widthInput.value * heightInput.value)-1;

    if(bombInput.value > maxBombs){
        bombInput.value = maxBombs;
    }

}

// function to create the array
function createArray(){

    fieldArray = [];

    for(let i = 0; i<fieldRows;i++){
        fieldArray.push([]);
    }
}

// reset the game field
function resetGameField(){

    //remove everything
    gameField.innerHTML = '';
    
    // add the game over overlay back
    let div = document.createElement('div');
    div.classList.add('game-over-overlay');
    
    gameField.append(div);
}

// function to build the grid
function buildGrid(){

    // create the grid
    createArray();

    //remove the previous field
    resetGameField();

    for(let i = 0; i<fieldRows;i++){

        let fieldRow = document.createElement('div');
        fieldRow.classList.add('field-row');
        fieldRow.id = `fieldrow-${i}`;

        for(let q = 0; q<fieldColumns;q++){

            let field = document.createElement('div');
            field.classList.add('field');
            field.classList.add('box-out-narrow');
            field.id = `field-${i}-${q}`;
            field.dataset.clicked = false;
            field.dataset.question = false;
            field.dataset.flagged = false;
            field.dataset.row = i;
            field.dataset.column = q;
            field.dataset.bomb = false;

            field.addEventListener('mousedown', (event) => {

                event.preventDefault();
                event.stopPropagation();

                handleClick(event, field);

            });

           
            fieldArray[i][q] = field;

            bombAddArray.push(field);

            fieldRow.append(field);

        }

        gameField.append(fieldRow);
    }
}

// add the bombs to the fields
function addBombs(fieldToIgnore){

    // remove the clicked field from the array
    bombAddArray = bombAddArray.filter((x) => {
        return x != fieldToIgnore;
    });

    let random = 0;

    for(let i = 0; i<bombAmount; i++){

        // get a random field
        random = Math.floor(Math.random() * bombAddArray.length);

        // add the bomb to that field
        bombAddArray[random].dataset.bomb = true;

        // remove that field from array
        bombAddArray.splice(random,1);
    }
}

// count the amount of flags planted
function countFlags(){

    let flaggs = 0;

    for(let i = 0; i<fieldArray.length;i++){
        for(let q = 0; q<fieldArray[i].length;q++){
            if(fieldArray[i][q].dataset.flagged === 'true'){
                flaggs ++;
            }
        }
    }

    // calc how many bombs are still left
    const bombsLeft = bombAmount - flaggs;
    
    if(bombsLeft >= 0){
        bombCounter.style.color = 'black';
    }
    else{
        bombCounter.style.color = 'red';
    }

    bombCounter.innerHTML = bombsLeft;

}

// check if the player has won
function checkForWin(){
    
    // check if all the flags have been placed
    // if not. you don't have to do the rest
    if(bombCounter.innerHTML != '0'){
        // console.log('not zero');
        return 0;
    }

    let over = true;
    
    for(let i = 0; i<fieldArray.length;i++){
        for(let q = 0; q<fieldArray[i].length;q++){
            if(fieldArray[i][q].dataset.flagged != 'true' && fieldArray[i][q].dataset.clicked != 'true'){
                over = false;
            }
        }
    }

    if(over){
        won();
    }
}

// do this when player won
function won(){
    resetButton.style.visibility = 'visible';
    
    const gameOverlay = document.querySelector('.game-over-overlay');
    
    // gameOverlay.innerHTML = 'You won!';
    gameOverlay.style.backgroundColor = 'rgba(0,255,0,.2)';
    gameOverlay.style.visibility = 'visible';
    
}

// do this when player hits a bomb
function lost(field){
    
    resetButton.style.visibility = 'visible';

    const gameOverlay = document.querySelector('.game-over-overlay');
    
    // gameOverlay.innerHTML = 'You Lost!';
    gameOverlay.style.color = 'red';
    gameOverlay.style.visibility = 'visible';
    gameOverlay.style.backgroundColor = 'rgba(255,0,0,.2)';


    field.classList.add('bomb');
    field.style.backgroundColor = 'red';

    // go through all the fields a reveal them if they are a bomb
    for(let i = 0; i<fieldArray.length; i++){
        for(let q = 0; q<fieldArray[i].length;q++){
            let checkField = fieldArray[i][q];

            if(checkField.dataset.bomb === 'true'){
                checkField.classList.add('bomb');
                checkField.classList.remove('box-out-narrow');
                checkField.dataset.clicked = true;

                if(checkField.dataset.flagged === 'true'){
                    checkField.style.backgroundColor = 'green';
                }
            }
        }
    }
}

// handle the press of a field
function handleClick(event, field){

    if(field.dataset.clicked === 'false'){

        switch(event.button){
            case 0:
                if(flagActive){
                    rightClick(field);
                }
                else if(questionActive){
                    middleClick(field);
                }
                else {
                    leftClick(field);
                }
                break;
            case 1:
                middleClick(field);
                break;
            case 2:
                rightClick(field);
                break;
            default:
        }
    }
}

// handle the left click
function leftClick(field){

    // check that it isn't flagged or questioned
    if(field.dataset.flagged === 'true' | field.dataset.question === 'true'){
        return 0;
    }

    //check if it is the first click
    if(firstClick){
        firstClick = false;
        addBombs(field);
    }

    revealField(field);

    if(field.innerHTML === '' && field.dataset.bomb != 'true'){
    
        fieldZero(field);
    }

    checkForWin();
}

// handle the middle click
function middleClick(field){

    field.dataset.flagged = false;
    removeAllBackgrounds(field);

    if(field.dataset.question === 'false'){
        field.dataset.question = true;
        field.classList.add('question');
    }
    else{
        field.dataset.question = false;
    }

    countFlags();
}

// handle the right click
function rightClick(field){

    field.dataset.question = false;
    removeAllBackgrounds(field);
    
    if(field.dataset.flagged === 'false'){
        field.dataset.flagged = true;
        field.classList.add('flag');
    }
    else{
        field.dataset.flagged = false;
    }
    
    countFlags();

    checkForWin();

}

function removeAllBackgrounds(field){

    field.classList.remove('flag');
    field.classList.remove('question');
}

// reveal the field
function revealField(field){

    field.classList.remove('box-out-narrow');
    field.style.cursor = 'default';
    field.dataset.clicked = true;
    
    if(field.dataset.bomb === 'true'){
        lost(field);
    }
    else {

        field.style.backgroundImage = '';
        
        const number = calcNumber(field);
        
        if(number > 0){
            field.style.color = numToColor(number);
            field.innerHTML = number;
        }
        else{
            field.innerHTML = '';
        }
    }
}


// calculate what number should be in the field
function calcNumber(field){

    let bombCounter = 0;

    // get array of surrounding field
    const checkArray = getSurroundingFields(field);

    // go through the fields and check if they are bombs
    for(let i = 0; i<checkArray.length; i++){

        if(checkArray[i].dataset.bomb === 'true'){
            bombCounter ++;
        }
    }
    return bombCounter;
}

// return the color for the number
function numToColor(num){

    let color = 'black';

    switch(num){
        case 1:
            color = 'blue';
            break;
        case 2:
            color = 'green';
            break;
        case 3:
            color = 'orange';
            break;
        case 4:
            color = 'yellow';
            break;
        case 5:
            color = 'violet';
            break;
        case 6:
            color = 'cyan';
            break;
        case 7:
            color = 'red';
            break;
        case 8:
            color = 'purple';
        default:
    }

    return color;
}

// gives back an array with the surounding fields
function getSurroundingFields(field){

    const row = parseInt(field.dataset.row);
    const column = parseInt(field.dataset.column);

    let arrayOfFields = [];
    let checkArray = [];
    
    checkArray.push([row-1,column-1]);
    checkArray.push([row-1,column]);
    checkArray.push([row-1,column+1]);
    checkArray.push([row,column-1]);
    checkArray.push([row,column+1]);
    checkArray.push([row+1,column-1]);
    checkArray.push([row+1,column]);
    checkArray.push([row+1,column+1]);

    // console.log(checkArray);


    // go through the fields and check if they are within the field
    for(let i = 0; i<checkArray.length; i++){

        if(checkArray[i][0] > -1 && 
           checkArray[i][0] < fieldRows && 
           checkArray[i][1] > -1 &&
           checkArray[i][1] < fieldColumns){

                arrayOfFields.push(fieldArray[checkArray[i][0]][checkArray[i][1]]);
                
           }
    }
    return arrayOfFields;
}

// gets called when a field calc is 0
function fieldZero(field){

    let fieldCheckArray = [];
    let newFields = [];
    let currentField = field;
    let safetyCounter = 0;

    // push the current filed into the fieldCheckarray
    fieldCheckArray.push(field);

    // for(let y = 0; y < 30; y++){
    while(fieldCheckArray.length > 0){

        // incase something goes wrong
        safetyCounter ++;
        // you can't check more fileds than there are fields
        if(safetyCounter > (fieldRows * fieldColumns)){
            break;
        }

        // reveal the field only if it isn't flagged or questioned
        if(currentField.dataset.flagged === 'false' && currentField.dataset.question === 'false'){
            revealField(currentField);
        }

        // if the field has no bombs surrounding it, do the check again
        if(currentField.innerHTML === ''){
            newFields = getSurroundingFieldsNotClicked(currentField);
        }

        // add the newly found fields to the field list to check
        for(let i = 0; i<newFields.length; i++){
            fieldCheckArray.push(newFields[i]);
        }

        // remove the current field from the array
        fieldCheckArray = fieldCheckArray.filter((x) => {
            return x != currentField;
        });

        // set the beginning field in the array to the current field
        if(fieldCheckArray.length > 0){
            currentField = fieldCheckArray[0];
        }
    }
}

// get the surrounding fields that aren't clicked yet
function getSurroundingFieldsNotClicked(field){

    // create an array of fields to check
    let checkArray = getSurroundingFields(field);

    let arrayToCheck = [];

    // go through the fields and check if they are bombs
    for(let i = 0; i<checkArray.length; i++){

        // only add the fields that haven't already been revealed and aren't flagged or questioned
        if(checkArray[i].dataset.clicked === 'false' && field.dataset.flagged === 'false' && field.dataset.question === 'false'){
            arrayToCheck.push(checkArray[i]);
        }
           
    }
    return arrayToCheck;
}