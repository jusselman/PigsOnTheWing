// Constants snacked from the html //
const grid = document.querySelector('.grid');
const jumper = document.createElement('div');
const squeal = document.getElementById('squealing');
const scroll = document.getElementById('scroll');
const overlay = document.getElementById('overlay');
const themeMusic = document.getElementById('themeMusic');
const gameOverMusic = document.getElementById('gameOverMusic');
const porkDeath = document.getElementById('porkDeath');

// The other variables //
let score = 0;
let jumperLeft = 50;
let startPoint = 150;
let jumperBottom = startPoint;
let gameIsOver = false;
let platCount = 7;
let platforms = [];
let upTimeId;
let downTimeId;
let leftTimeId;
let rightTimeId;
let isJumping = false;
let isLeft = false;
let isRight = false;
let displayOn = false;


// Constructor that builds platforms //
class Platform {
    constructor(newPlatBott) {
        this.bottom = newPlatBott;
        this.left = Math.random() * 900;
        this.visual = document.createElement('div');
        const visual = this.visual;
        visual.classList.add('platform');
        visual.style.left = this.left + 'px';
        visual.style.bottom = this.bottom + 'px';
        grid.appendChild(visual);
    }
}

// You'll never guess what this one does //
function makePlatform() {
    for (let i = 0; i < platCount; i++) {
        let platGap = 700 / platCount;
        let newPlatBott = 100 + i * platGap;
        let newPlat = new Platform(newPlatBott);
        platforms.push(newPlat);
    }
}

// This one either //
function movePlatform() {
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
                if (score >= 50) {
                    win();
                }
                let newPlatform = new Platform(700);
                platforms.push(newPlatform);
            }
            return;
        });
    }
}

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
        if (jumperBottom > startPoint + 300) {
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
        clearInterval(rightTimeId)
        isRight = false;
        jumper.classList.remove('right');
    }
    isLeft = true
    leftTimeId = setInterval(() => {
        if (jumperLeft >= 0) {
            jumperLeft -= 5;
            jumper.style.left = jumperLeft + 'px';
        } else moveRight();
    }, 20);
}

function moveRight() {
    if (isLeft) {
        clearInterval(leftTimeId)
        isGoingLeft = false;
        jumper.classList.add('right');
    }
    isRight = true
    rightTimeId = setInterval(() => {
        if (jumperLeft <= 940) {
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

function gameOver() {
    gameIsOver = true;
    clearInterval(upTimeId);
    clearInterval(downTimeId);
    platformInterval(movePlatform, 3000);
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild)
    }
    themeMusic.pause();
    playAgain();
}

// Brings up play again screen, changes music to gameover music //
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

function startOver() {
    gameOverMusic.pause();
    overlay.style.display = "none";
    gameIsOver = false;
    platforms = [];
    startGame();
}

function win() {
    console.log('You Win');
}

// Start button triggers this on landing page, basically clears elements from home screen and starts gameplay//
function startGame() {
    displayOn = true;
    scroll.style.display = 'none';
    overlay.style.display = 'none';
    grid.style.display = 'block';
    begin();
    themeMusic.play();
    themeMusic.loop = true;
}

// Initiates gameplay //
function begin() {
    if (!gameIsOver) {
        console.log("In begin()", upTimeId, downTimeId, rightTimeId, leftTimeId);
        makePlatform();
        makeJumper();
        setInterval(movePlatform, 30);
        jump();
        document.addEventListener('keyup', control);
    }
    return;
}

