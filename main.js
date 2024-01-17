<!--намалювати фігури -->

  const figures = [
  {
    name: "kvL",
    shape: [
      "+++",
      "+++",
      "+++"
    ]
  },
  {
    name: "kvM",
    shape: [
      "++",
      "++"
    ]
  },
  {
    name: "kvS",
    shape: [
      "+"
    ]
  },
  {
    name: "liM",
    shape: [
      "++",
      "--"
    ]
  },
  {
    name: "liL",
    shape: [
      "---",
      "+++",
      "---"
    ]
  },
  {
    name: "liXL",
    shape: [
      "----",
      "++++",
      "----",
      "----"
    ]
  },
  {
    name: "liXXL",
    shape: [
      "-----",
      "-----",
      "+++++",
      "-----",
      "-----"
    ]
  },
  {
    name: "kutP",
    shape: [
      "+-",
      "++"
    ]
  },
  {
    name: "kutVP",
    shape: [
      "+--",
      "+--",
      "+++"
    ]
  },
  {
    name: "kutL",
    shape: [
      "-+",
      "++"
    ]
  },
  {
    name: "kutVL",
    shape: [
      "--+",
      "--+",
      "+++"
    ]
  },
  {
    name: "L",
    shape: [
      "-+-",
      "-+-",
      "-++"
    ]
  },
  {
    name: "J",
    shape: [
      "-+-",
      "-+-",
      "++-"
    ]
  },
  {
    name: "S",
    shape: [
      "-++",
      "++-",
      "---"
    ]
  },
  {
    name: "Z",
    shape: [
      "++-",
      "-++",
      "---"
    ]
  },
  {
    name: "T",
    shape: [
      "+++",
      "-+-",
      "---"
    ]
  }
];


const color = ["1", "2", "3", "4", "5"];

<!-- змінні -->
const columns = 20;
const rows = 40;
let gameBoard = createGameBoard(rows, columns);
let currentRow = 0;
let currentColumn = Math.floor((columns - 3) / 2);
let occupied = [];
let figure = createFigure();
let gameInterval;
let fullColorRows, fullRows;
let rowsNext = 5;
let columnsNext = 5;
let nextBoard = rowsNext * columnsNext;
let intervalId;
let totalScore = 0;

<!-- створити ігрове поле -->
function createGameBoard(rows, columns) {
    const board = Array.from({ length: rows }, () => Array(columns).fill(0));
    return board;
}


<!-- створити поле 5×5 для наступ фігур -->
const boardNext = createGameBoard(rowsNext, columnsNext); 
      
<!-- намалювати ігрове поле -->
function drawGameBoard(rows, columns, container) {
    const playGround = document.querySelector(container);
    playGround.innerHTML = "";
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            const cell = document.createElement("div");
            const cellValue = gameBoard[i][j];
            if (cellValue > 0) {
                cell.classList.add(`color${cellValue}`);
            }
            cell.innerHTML = cellValue;
            playGround.appendChild(cell);
        }
    }
}

<!-- змінна для клітинки поля gameBoard[i][j] -->

<!-- рандомна функція -->
function getRandomElement(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

<!-- створити фігуру -->
function createFigure() {
    let randomFigure = getRandomElement(figures);
    let randomColor = getRandomElement(color);
    
    let coloredFigure = {
        name: randomFigure.name,
        shape: [],
    };
    
    for (let i = 0; i < randomFigure.shape.length; i++) {
        let row = '';
        for (let j = 0; j < randomFigure.shape[i].length; j++) {
            row += randomFigure.shape[i][j] === "+" ? randomColor : '0';
        }
        coloredFigure.shape.push(row);
    }
 
    let randomTurn = getRandomElement([1, 2, 3, 4]);

    for (let i = 0; i < randomTurn; i++) {
        currentF = rotate(coloredFigure);
    }
    
    return currentF;
}

  <!--  створити 3 currentFigure-->
let currentF1, currentF2, currentF3;

function threeCurrentFigure() {
    currentF1 = createFigure();
    currentF2 = createFigure();
    currentF3 = createFigure();
    let nextFSmall = document.querySelector(".nextFigureSmall");
    let nextFBig = document.querySelector(".nextFigureBig");

    displayFigure(currentF3, nextFSmall);
    displayFigure(currentF2, nextFBig);
    currentFigure = currentF1;
    
    return currentFigure;
}

<!-- намалювати 2 наступні фігури при першому запуску-->
function displayFigure(figure, container) {
    container.innerHTML = "";
    const containerWidth = 5; 
    const containerHeight = 5;
    const offsetX = Math.floor((containerWidth - figure.shape[0].length) / 2);
    const offsetY = Math.floor((containerHeight - figure.shape.length) / 2);

    for (let i = 0; i < containerHeight; i++) {
        for (let j = 0; j < containerWidth; j++) {
            const cell = document.createElement("div");

            const figureRow = i - offsetY;
            const figureColumn = j - offsetX;
            const cellValue = figureRow >= 0 && figureRow < figure.shape.length &&
                              figureColumn >= 0 && figureColumn < figure.shape[0].length ?                             figure.shape[figureRow][figureColumn] : 0;

            if (cellValue > 0) {
                cell.classList.add(`color${cellValue}`);
            }

            cell.innerHTML = cellValue;
            container.appendChild(cell);
        }
    }
}

threeCurrentFigure();

<!--вибір 3х фігур поточної і 2х наступних-->
function startNewFigure(){
  currentF1 = currentF2;
  currentF2 = currentF3;
  currentF3 = createFigure();
  let nextFSmall = document.querySelector(".nextFigureSmall");
  let nextFBig = document.querySelector(".nextFigureBig");
    
    displayFigure(currentF3, nextFSmall);
    displayFigure(currentF2, nextFBig);
    currentFigure = currentF1;
   
    return currentFigure;
}

<!-- функція очищення ігрового поля -->
function cleanBoard(){
    for (let i = 0; i < rows; i++) { 
   for (let j = 0; j < columns; j++) { 
      if (gameBoard[i][j] > 0) { 
         const isOccupiedCell = occupied.some(cell => cell.row === i && cell.column === j); 
         if (!isOccupiedCell) { 
         gameBoard[i][j] = 0; }
         } 
         } 
         }
}
  
<!-- намалювати фігуру на полі -->

  <!--  1.очистити все поле -->
  
  function drawFigure(currentFigure, currentRow, currentColumn) {
  <!-- console.log(currentFigure.shape); -->
  <!-- console.log(currentRow); -->
   cleanBoard();
   
   <!-- 2.додати цифри більше 0 з фігури -->
   
  for (let i = 0; i < currentFigure.shape.length; i++){
    for (let j = 0; j < currentFigure.shape[i].length; j++){
            if (currentFigure.shape[i][j] > 0) {
                if (gameBoard[currentRow + i] && gameBoard[currentRow + i][currentColumn + j] !== undefined) {
                    gameBoard[currentRow + i][currentColumn + j] = currentFigure.shape[i][j];
                }
            } else if (currentFigure.shape[i][j] === 0) {
                if (gameBoard[currentRow + i] && gameBoard[currentRow + i][currentColumn + j] !== undefined) {
                    gameBoard[currentRow + i][currentColumn + j] = 0;
                }
            }
        }
    }
    
   <!-- намалювати поле -->
drawGameBoard(rows, columns, ".playGround");
}

drawFigure(currentFigure, currentRow, currentColumn);

<!-- рух фігур -->
   <!-- 1.зміщення фігури вниз по інтервалу -->
function goDown() {
      <!-- встановлення рівня швидкості радіння фігур -->
    let intervalTime, levelToScore;
    let level = document.querySelector(".level");

    if (totalScore <= 200) {
        intervalTime = 500;
        levelToScore = 1;
    } else if ((totalScore <= 500) && (totalScore > 200)) {
        intervalTime = 350;
        levelToScore = 2;
    } else if ((totalScore <= 1000) && (totalScore > 500)) {
        intervalTime = 200;
        levelToScore = 3;
    } else if ((totalScore <= 2000) && (totalScore > 2000)){
        intervalTime = 100;
        levelToScore = 4;
    } else {
        intervalTime = 50;
        levelToScore = 5;
    }
    level.textContent = levelToScore;
    
    <!-- функція руху вниз по інтервалу -->
    function moveDownInterval() {
        if (downOk()) {
            currentRow += 1;
            drawFigure(currentFigure, currentRow, currentColumn);
        } else {
            let occ = addOccupied();
            rowsFull(occ);
            calculateTotalPoints(figure, currentRow, currentColumn, rowsFull);
            clearInterval(intervalId);

            if (isGameOver()) {
                gameOver();
            } else {
                startNewFigure();
                currentRow = 0;
                currentColumn = Math.floor((columns - 3) / 2);
                drawFigure(currentFigure, currentRow, currentColumn);
                intervalId = setInterval(moveDownInterval, intervalTime);
            }
        }
    }
    moveDownInterval();
}

goDown();

   <!-- 2. падіння фігури по кнопці -->
function dropDown() {
    playDropMisic();
    while (downOk(currentFigure, currentRow + 1)) {
        currentRow += 1;
    }

    let occ = addOccupied();
    drawFigure(currentFigure, currentRow, currentColumn); 
    rowsFull(occ);
calculateTotalPoints(figure, currentRow, currentColumn);
    startNewFigure();
    currentRow = 0;
    currentColumn = Math.floor((columns - 3) / 2);
    drawFigure(currentFigure, currentRow, currentColumn);
    
}
 
   <!-- 3 рух вправо -->
function moveRight() {
    if (moveROk()) {
        currentColumn += 1;
        drawFigure(currentFigure, currentRow, currentColumn);
    } else {
        drawFigure(currentFigure, currentRow, currentColumn);
        
    }
}

  <!-- 4 рух вліво -->
function moveLeft(){
    if (moveLOk()){
        currentColumn -= 1;
        drawFigure(currentFigure, currentRow, currentColumn);
    } else {
        drawFigure(currentFigure, currentRow, currentColumn);      
    }
}
  
  <!-- 5 оборот фігури -->
 
function rotate(figure){
  let rotatedF = { 
  name: figure.name, 
  shape: []
  }
  for (let i = 0; i < figure.shape[0].length; i++) {
    let newRow = "";
    for (let j = figure.shape.length - 1; j >= 0; j--) {
      newRow += figure.shape[j][i];
    }
    rotatedF.shape.push(newRow);
  }
  return rotatedF;
}
      

<!-- оборот поиочної фігури -->
function rotateCurrent(){
    if (rotateOk()){
    currentFigure = rotate(currentFigure);
    } else {
           drawFigure(currentFigure, currentRow, currentColumn);  
    }
}
      
<!-- кнопки руху фігур -->
   <!-- 1 кнопка руху фігури вправо -->
let btnRight = document.querySelector(".btnRight");
btnRight.addEventListener("click", moveRight);

   <!-- 2 кнопка для руху вліво -->
let btnLeft = document.querySelector(".btnLeft");
btnLeft.addEventListener("click", moveLeft);
  
   <!-- 3 кнопка для руху вниз -->
 let btnDown = document.querySelector(".btnDown");
btnDown.addEventListener("click", dropDown); 

   <!-- 4 кнопка для обороту -->
let btnRotate = document.querySelector(".rotate");
btnRotate.addEventListener("click", rotateCurrent);

<!-- кнопки управління грою -->
let btnStop = document.querySelector(".btnStop");
btnStop.addEventListener("click", stopbyButton);
let btnStart = document.querySelector(".startGame");
btnStart.addEventListener("click", startGame);
let btnNewGame = document.querySelector(".newGame");
btnNewGame.addEventListener("click", newGame);
let btnPause = document.querySelector(".btnPause");
btnPause.addEventListener("click", pauseGame);

<!-- вспливаючі вікна -->
let pauseDiv = document.querySelector(".pauseDiv");
let continueDiv = document.querySelector(".continueDiv");
let gameOvr = document.querySelector(".gameOver");
let threeBest = document.querySelector(".threeBest");
let gameNew = document.querySelector(".gameNew");
let playerName = document.querySelector('.name');
let playerNameInput = document.querySelector(".name input");
let score = document.querySelector(".countScore");

<!--Додавання обробників подій для клавіатури-->
document.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "ArrowLeft":
      moveLeft();
      break;
    case "ArrowRight":
      moveRight();
      break;
    case "ArrowDown":
      dropDown();
      break;
    case " ":
      rotateCurrent();
      break;
    case "Enter":
    if (!gameStarted){ 
        startGame(); 
        } else { 
        newGame(); 
        }
  }
});

<!-- виявлення зіткнень -->
   <!-- 1 дозвіл на рух вліво -->
function moveLOk() {
   for (let i = 0; i < currentFigure.shape.length; i++) {
      for (let j = 0; j < currentFigure.shape[i].length; j++) {
         if (currentFigure.shape[i][j] > 0 && ((currentColumn + j <= 0) ||
  (gameBoard[currentRow + i] &&
  gameBoard[currentRow + i][currentColumn + j - 1] !== undefined && occupied.some(
       (cell) => cell.row === currentRow + i && cell.column === currentColumn + j - 1)))
            ) {
                return false;
            }
        }
    }
    return true;
}

   <!-- 2 дозвіл на рух вправо-->
function moveROk() {
   for (let i = 0; i < currentFigure.shape.length; i++) {
      for (let j = 0; j < currentFigure.shape[i].length; j++) {
         if (currentFigure.shape[i][j] > 0 && ((currentColumn + j + 1 >= columns) ||
(gameBoard[currentRow + i] && gameBoard[currentRow + i][currentColumn + j + 1] !== undefined && occupied.some((cell) => cell.row === currentRow + i && cell.column === currentColumn + j + 1)))
            ) {
                return false;
            }
        }
    }
    return true;
}

  <!-- 3 дозвіл на рух вниз -->
function downOk() {
  occupiedSet = new Set(occupied.map(cell => `${cell.row}-${cell.column}`));

  for (let i = 0; i < currentFigure.shape.length; i++) {
    for (let j = 0; j < currentFigure.shape[i].length; j++) {
      if (currentFigure.shape[i][j] > 0) {
       const nextRow = currentRow + i + 1;
       const nextColumn = currentColumn + j;
          if (nextRow >= rows || nextColumn < 0 || nextColumn >= columns){
             return false;
             }
          if (occupiedSet.has(`${nextRow}-${nextColumn}`)){
             return false;
             }
          }
       }
    }
    return true;
}

 <!-- 4 дозвіл на оборот фігури -->
function rotateOk(){
  const newShape = currentFigure.shape;
 for (let i = 0; i < newShape.length; i++){
   for (let j = 0; j < newShape[i].length; j++){
     if (newShape[i][j] >= 0){
       const nextRow = currentRow + i;
       const nextColumn = currentColumn + j;
         if (
           nextRow < 0 || nextRow >= rows || nextColumn < 0 || nextColumn >= columns || occupiedSet.has(`${nextRow}-${nextColumn}`)){
            return false;
          }
        }
      }
    }
    return true;
}

<!-- додати зайняті клітини -->
function addOccupied(){
  for (let i = 0; i < currentFigure.shape.length; i++){
    for (let j = 0; j < currentFigure.shape[i].length; j++){
       if (currentFigure.shape[i][j] > 0){
          const newCell = { row: currentRow + i, column: currentColumn + j };
          occupied.push(newCell);
       }
    }
  }
    return occupied;
}

<!--  зникнення повного ряду -->
   <!-- знайти повні ряди -->
function rowsFull(occ){
 let rowsFull = [];
  for (let i = 0; i < rows; i++){ let isFullRow = occupied.filter(cell => cell.row === i).length === columns;
   if (isFullRow){ 
   rowsFull.push(i);
    } 
  }
  dropDownRows(rowsFull); 
}
     
   <!-- зникнення повних рядів -->
function dropDownRows(rowsFull) {
  playDropMisic();
  let rowsToRemove = [...rowsFull];

  for (let i = rowsToRemove.length - 1; i >= 0; i--){
  gameBoard.splice(rowsToRemove[i], 1);
  }
    const emptyRows = Array.from({ length: rowsToRemove.length }, () => new Array(columns).fill(0));
    gameBoard.unshift(...emptyRows);
    occupied = updateOccupied();
    
<!-- Підрахунок балів в залежності від довжини rowsToRemove  -->
    let pointsForRow = 0;
    if (rowsToRemove.length === 0 || rowsToRemove.length === 1){
    pointsForRows = rowsToRemove.length * 20;
} else {
    pointsForRows = rowsToRemove.length * 20 + (rowsToRemove.length - 1) * 10;
}
    let score = document.querySelector(".countScore");
    totalScore += pointsForRows;
    score.textContent = totalScore;
}

<!-- оновити зайняті клітини після зникнення рчдів -->
function updateOccupied(){
 const updatedOccupied = [];
 for (let i = 0; i < gameBoard.length; i++){
    for (let j = 0; j < gameBoard[i].length; j++){
    if (gameBoard[i][j] > 0){
       updatedOccupied.push({ row: i, column: j });
    }
  }
}
    return updatedOccupied;
}


      
<!-- підрахунок балів -->
function addPointsForBlocks(figure) {
    let points = 0;
    let score1 = 0;

    for (let i = 0; i < figure.shape.length; i++){
      for (let j = 0; j < figure.shape[i].length; j++){
        if (figure.shape[i][j] > 0){
                points++;
        }
      }
   }
    return points;
}

<!-- додати бали за поточну фігуру до загальних балів -->
function calculateTotalPoints(figure, currentRow, currentColumn){
    let pointsForCurrentFigure = addPointsForBlocks(currentFigure);
    totalScore += pointsForCurrentFigure;
    score.textContent = totalScore;
    
    return totalScore;
}
  
<!-- допоміжні функції -->

<!-- завантаження сторінки в статичному вигляді --> 

function startGame(){
    playBackgroundMusic();
    gameStarted = true;
    clearInterval(intervalId);
    cleanBoard();
    totalScore = 0;
    btnStart.classList.add('visible');
    setButtonsState(true);
    setTimeout(function (){
       btnStart.classList.remove('visible');
       btnStart.classList.add('invisible');
       pauseDiv.classList.add('invisible');
       pauseDiv.classList.remove('visible');
       gameOvr.classList.add('invisible');
       gameOvr.classList.remove('visible');
       intervalId = setInterval(goDown, 500);
       startNewFigure();
       currentRow = 0;
       currentColumn = Math.floor((columns - 3) / 2);
        drawFigure(currentFigure, currentRow, currentColumn);
    }, 1000);
}

<!--запуск гри при завантаженні сторінки -->
document.addEventListener("DOMContentLoaded", function () {
setButtonsState(false);
    btnStart.addEventListener("click", startGame);
});

<!-- запуск нової гри без перегрузки сторінкм -->
function newGame() {
  gameStarted = false;
  playBackgroundMusic();
  totalScore = 0;
  score.textContent = totalScore;
  const elementsToToggle = [
    gameNew, pauseDiv, gameOvr, playerName
  ];

  elementsToToggle.forEach(element => {
        element.classList.toggle('visible', false);
  element.classList.toggle('invisible', true);
    });

  setTimeout(() => {
     elementsToToggle.forEach(element => element.classList.add('invisible'));
     elementsToToggle.forEach(element => element.classList.remove('visible'));
     
     clearInterval(intervalId);
     intervalId = setInterval(goDown, 500);
     cleanBoard();
     occupied = [];
     startNewFigure();
     currentRow = 0;
     currentColumn = Math.floor((columns - 3) / 2);
     setButtonsState(true);
     drawFigure(currentFigure, currentRow, currentColumn);
    }, 1000);
}


  <!-- встановлення неактивності кнопок до початку гри, при паузі та після завершення гри -->
let btnActiveAll = document.querySelectorAll(".buttons button");
function setButtonsState(isGameRunning){
     btnActiveAll.forEach(button => {
     button.disabled = !isGameRunning; 
     });
}
      
<!-- зупинка гри при відсутності місця-->
function isGameOver() {
    for (let j = 0; j < currentFigure.shape[0].length; j++){
        if (gameBoard[0][currentColumn + j] > 0){
           return true; 
    }
  }
    return false;
}

<!-- зупинка гри по кнопці -->
function stopbyButton() {
    clearInterval(intervalId); 
    gameOver();
}

function savePlayerName() {
    playWinnerMusic();
    gameOvr.classList.remove("visible");
    gameOvr.classList.add("invisible");
    playerName.classList.add("visible");
    const btnSaveName = document.querySelector(".name button");
    btnSaveName.addEventListener("click", function (){
        let playerName = playerNameInput.value;
    });
}

function saveToLocalStorage(name, score) {
    const user = { name: name, count: score };
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (!storedUser || user.count >= storedUser.count){
        localStorage.setItem('user', JSON.stringify(user));
    }
}

function gameOver(){
    pauseBackgroundMusic();
    gameOvr.textContent = "Гра завершена. Ваш результат: " + totalScore + " балів";
    gameOvr.classList.add('visible');
    gameOvr.classList.remove('invisible');
    setButtonsState(false);
    if (oneOfThreeBest()){
        setTimeout(savePlayerName, 500);
    }
}

function oneOfThreeBest(){
    const user = { name: playerName, count: totalScore };
    const storedUser = JSON.parse(localStorage.getItem('user'));

    return !storedUser || user.count >= storedUser.count;
}

<!-- пауза в грі -->
function pauseGame(){
    pauseBackgroundMusic();
    clearInterval(intervalId);
    pauseDiv.classList.replace("invisible", "visible");
    continueDiv.addEventListener("click", continueGame);
    setButtonsState(false);
}

<!-- продовжити гру після паузи -->
function continueGame() {
    playBackgroundMusic();
    intervalId = setInterval(goDown, 500);
    pauseDiv.classList.replace("visible", "invisible");
    setButtonsState(true);
}


<!-- музика -->
const backgroundMusic = document.querySelector('#backgroundMusic');
const dropMusic = document.querySelector("#dropMusic");
const winnerMusic = document.querySelector("#winnerMusic");

function playBackgroundMusic() {
    backgroundMusic.play();
}
function pauseBackgroundMusic() {
    backgroundMusic.pause();
}
function playDropMisic() {
    dropMusic.play();
    setTimeout(() => { 
    dropMusic.pause();
    dropMusic.currentTime = 0;
     }, 1000); 
}
function playWinnerMusic() {
    winnerMusic.play();
    setTimeout(() => { 
    winnerMusic.pause();
    winnerMusic.currentTime = 0;
     }, 3000); 
}




