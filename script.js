// Grid and elements for gameplay //
const grid = document.querySelector('.grid');
const jumper = document.createElement('div');
const scoreKeeper = document.createElement('div');
const scoreCard = document.createElement('h1');
const platformClass = document.querySelector('.platform');
const burger1 = document.querySelector('.burger1');
const burger2 = document.querySelector('.burger2');
const reloadButton = document.getElementById("reload");

const scroll = document.getElementById('scroll');
const overlay = document.getElementById('overlay');
const winScreen = document.getElementById('winScreen');

// Music and Audio
const themeMusic = document.getElementById('themeMusic');
const gameOverMusic = document.getElementById('gameOverMusic');
const winMusic = document.getElementById('winMusic');
const porkDeath = document.getElementById('porkDeath');
const squeal = document.getElementById('squealing');

let score = 0;
let jumperLeft = 50;
let startPoint = 150;
let jumperBottom = startPoint;
let gameIsOver = false;
let platCount = 10;
let platforms = [];
let upTimeId;
let downTimeId;
var leftTimeId;
var rightTimeId;
let isJumping = false;
let isLeft = false;
let isRight = false;
let displayOn = false;
let platformTimeId;
let gridWidth = 0; // Dynamic grid width

// Constructor that builds platforms //
class Platform {
    constructor(newPlatBott) {
        this.bottom = newPlatBott;
        this.left = Math.random() * (gridWidth - 100); // Dynamic based on grid width
        this.visual = document.createElement('div');
        const visual = this.visual;
        visual.classList.add('platform');
        visual.style.left = this.left + 'px';
        visual.style.bottom = this.bottom + 'px';
        grid.appendChild(visual);
    }
}

// Create new platforms and push them to platforms array //
function makePlatform() {
    for (let i = 0; i < platCount; i++) {
        let platGap = 700 / platCount;
        let newPlatBott = 100 + i * platGap;
        let newPlat = new Platform(newPlatBott);
        platforms.push(newPlat);
    }
}

// Push platforms to the bottom of the screen and make new ones coming// 
// From the top //
function movePlatform(int) {
    console.log('inside movePlatform()');
    if (jumperBottom > 10) {
        platforms.forEach(plat => {
            plat.bottom -= 2;
            let visual = plat.visual;
            visual.style.bottom = plat.bottom + 'px';

            if (plat.bottom < 10) {
                let firstPlatform = platforms[0].visual;
                firstPlatform.classList.remove('platform');
                platforms.shift();
                score++;
                keepScore()
                let newPlatform = new Platform(700);
                platforms.push(newPlatform);
            }
            return;
        });
    }
}

// Increment ScoreBoard //
function keepScore() {
    grid.appendChild(scoreKeeper);
    scoreKeeper.classList.add('scoreKeeper');
    scoreKeeper.appendChild(scoreCard);
    scoreCard.innerHTML = score;
    if (score >= 50) {
        win();
    }
}

// WINNER!!! //
function win() {
    burger1.style.display = 'none';
    burger2.style.display = 'none';
    clearInterval(platformTimeId);
    clearInterval(upTimeId);
    clearInterval(downTimeId);
    clearInterval(rightTimeId);
    clearInterval(leftTimeId);
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }
    console.log('after the while (grid.firstChild)')
    winScreen.style.display = 'block';
    themeMusic.pause();
    winMusic.loop = true;
    winMusic.play();
}

// reload page on win page //
function reload() {
    reload = location.reload();
}
reloadButton.addEventListener("click", reload, false);

// this appends the pig to the grid //
function makeJumper() {
    grid.appendChild(jumper);
    jumper.classList.add('jumper');
    jumperLeft = platforms[0].left;
    jumper.style.left = jumperLeft + 'px';
    jumper.style.bottom = jumperBottom + 'px';
}

// jumps //
function jump() {
    clearInterval(downTimeId);

    isJumping = true;
    upTimeId = setInterval(() => {
        jumperBottom += 50;
        jumper.style.bottom = jumperBottom + 'px';
        jumper.classList.add('flip');
        squeal.play();
        setTimeout(() => {
            jumper.classList.remove('flip')
        }, 300)
        if (jumperBottom > startPoint + 250) {
            fall();
        }
    }, 40);
}

function fall() {
    clearInterval(upTimeId);
    isJumping = false;
    downTimeId = setInterval(() => {
        jumperBottom -= 5;
        jumper.style.bottom = jumperBottom + 'px';
        if (jumperBottom <= 0) {
            gameOver();
        }
        // Check if space is not a platform, if is then jump() //
        platforms.forEach(platform => {
            if (
                (jumperBottom >= platform.bottom) &&
                (jumperBottom <= platform.bottom + 10) &&
                ((jumperLeft + 78) >= platform.left) &&
                (jumperLeft <= (platform.left + 85)) &&
                !isJumping
            ) {
                startPoint = jumperBottom;
                console.log('End of fall()', upTimeId, downTimeId, rightTimeId, leftTimeId);
                jump();
            }
        });
    }, 30)
}

// Keyboard Controller Functionality //
function control(e) {
    jumper.style.bottom = jumperBottom + 'px'
    if (e.key === 'ArrowLeft') {
        moveLeft();
    } else if (e.key === 'ArrowRight') {
        moveRight();
    }
}

function moveLeft() {
    if (isRight) {
        clearInterval(rightTimeId);
        isRight = false;
        jumper.classList.remove('right');
    }

    isLeft = true;
    clearInterval(leftTimeId);
    leftTimeId = setInterval(() => {
        if (jumperLeft >= 0) {
            jumperLeft -= 5;
            jumper.style.left = jumperLeft + 'px';
        } else moveRight();
    }, 20);
}

function moveRight() {
    if (isLeft) {
        clearInterval(leftTimeId);
        isGoingLeft = false;
        jumper.classList.add('right');
    }

    isRight = true;
    clearInterval(rightTimeId);
    rightTimeId = setInterval(() => {
        if (jumperLeft <= gridWidth - 60) { // Dynamic right boundary
            jumperLeft += 5;
            jumper.style.left = jumperLeft + 'px';
        } else moveLeft();
    }, 20);
}

// Reseting Game Play //
function resetStats() {
    clearInterval(upTimeId);
    clearInterval(downTimeId);
    clearInterval(rightTimeId);
    clearInterval(leftTimeId);
}

function playAgain() {
    porkDeath.play();
    gameOverMusic.play();
    overlay.style.display = "block";
    clearInterval(upTimeId);
    clearInterval(downTimeId);
    clearInterval(rightTimeId);
    clearInterval(leftTimeId);
    console.log('end of playAgain()', upTimeId, downTimeId, rightTimeId, leftTimeId);
}

function startGame() {
    displayOn = true;
    scroll.style.display = 'none';
    overlay.style.display = 'none';
    grid.style.display = 'block';
    gridWidth = grid.offsetWidth; // Set dynamic grid width
    platformTimeId = setInterval(movePlatform, 30);
    begin();
    themeMusic.play();
    themeMusic.loop = true;
}

function startOver() {
    gameOverMusic.pause();
    overlay.style.display = "none";
    gameIsOver = false;
    platforms = [];
    startGame();
}

function gameOver() {
    gameIsOver = true;
    score = 0;
    clearInterval(platformTimeId);
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild)
    }
    themeMusic.pause();
    playAgain();
    console.log('gameover');
}

function begin() {
    if (!gameIsOver) {
        console.log('In begin()', platformTimeId);
        makePlatform();
        makeJumper();
        platformTimeId;
        jump();
        console.log('this is the platformClass ' + platformClass);
        document.addEventListener('keyup', control);
    }
    return;
}