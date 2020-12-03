const grid = document.querySelector('.grid');
const jumper = document.createElement('div');
let jumperLeft = 50;
let startPoint = 150;
let jumperBottom = startPoint;
let gameIsOver = false;
let platCount = 100;
let platforms = [];
let upTimeId;
let downTimeId;
let leftTimeId;
let rightTimeId;
let isJumping = false;
let isLeft = false;
let isRight = false;


class Platform {
    constructor(newPlatBott) {
        this.bottom = newPlatBott;
        this.left = Math.random() * 1000;
        this.visual = document.createElement('div');

        const visual = this.visual;
        visual.classList.add('platform');
        visual.style.left = this.left + 'px';
        visual.style.bottom = this.bottom + 'px';
        grid.appendChild(visual);
    }
}

function makePlatform() {
    for (let i = 0; i < platCount; i++) {
        let platGap = 6000 / platCount;
        let newPlatBott = 100 + i * platGap;
        let newPlat = new Platform(newPlatBott);
        platforms.push(newPlat);
        console.log(platforms);
    }
}

function movePlatform() {
    if (jumperBottom > 200) {
        platforms.forEach(plat => {
            plat.bottom -= 4;
            let visual = plat.visual;
            visual.style.bottom = plat.bottom + 'px';
        })
    }
}

function makeJumper() {
    grid.appendChild(jumper);
    jumper.classList.add('jumper');
    console.log(jumperLeft);
    jumperLeft = platforms[0].left;
    jumper.style.left = jumperLeft + 'px';
    jumper.style.bottom = jumperBottom + 'px';
}


function jump() {
    clearInterval(downTimeId);
    isJumping = true;
    upTimeId = setInterval(function () {
        jumperBottom += 20;
        jumper.style.bottom = jumperBottom + 'px';
        if (jumperBottom > startPoint + 200) {
            fall();
        }
    }, 30)
}

function fall() {
    clearInterval(upTimeId);
    isJumping = false;
    downTimeId = setInterval(function () {
        jumperBottom -= 5;
        jumper.style.bottom = jumperBottom + 'px';
        if (jumperBottom <= 0) {
            gameOver();
        }
        platforms.forEach(platform => {
            if (
                (jumperBottom >= platform.bottom) &&
                (jumperBottom <= platform.bottom + 15) &&
                ((jumperLeft + 60) >= platform.left) &&
                (jumperLeft <= (platform.left + 85)) &&
                !isJumping
            ) {
                console.log('landed');
                startPoint = jumperBottom;
                jump();
            }
        })

    }, 30)
}

function gameOver() {
    console.log('game over');
    gameIsOver = true;
    clearInterval(upTimeId);
    clearInterval(downTimeId);
}

function control(e) {
    jumper.style.bottom = jumperBottom + 'px'
    if (e.key === 'ArrowLeft') {
        console.log('from control function')
        moveLeft();
    } else if (e.key === 'ArrowRight') {
        moveRight();
        console.log('moveRight');
    }
    else if (e.key === 'ArrowUp') {
        console.log('moveStraight');
    }
}


function moveLeft() {
    if (isRight) {
        clearInterval(rightTimeId)
        isRight = false
    }
    isLeft = true
    leftTimeId = setInterval(() => {
        if (jumperLeft >= 0) {
            jumperLeft -= 5
            jumper.style.left = jumperLeft + 'px'
        } else moveRight()
    }, 20)
}

function moveRight() {
    if (isLeft) {
        clearInterval(leftTimeId)
        isGoingLeft = false
    }
    isRight = true
    rightTimeId = setInterval(() => {
        if (jumperLeft <= 940) {
            jumperLeft += 5
            jumper.style.left = jumperLeft + 'px'
        } else moveLeft()
    }, 20)
}

function begin() {
    if (!gameIsOver) {
        makePlatform();
        makeJumper();
        setInterval(movePlatform, 30);
        jump();
        document.addEventListener('keyup', control);
    }
}

begin();
