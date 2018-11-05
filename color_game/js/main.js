const HARD = 6;
const EASY = 3;
const C = "Classic";
const A = "Arcade";
var gPicked;
var gColors;
var gGameType = C;
var gDiffucult = HARD;
var elMes = document.querySelector('.message');
var gTime = 60;
var gScore = 0;

if (localStorage.bestColorScore == undefined) localStorage.bestColorScore = 0;

function init() {
    gColors = getColors(gDiffucult);
    gPicked = pickColor(gColors);
    document.querySelector('.head').style.backgroundColor = 'slategray';
    renderSquares();
    assignColor();
    if (gGameType === C) {
        addClicks();
        document.querySelector('.newbtn').textContent = "NEW ROUND";
    }
    else {
        manageArcade();
    }
}

function renderSquares() {
    var domain = document.querySelector(".square-container");
    var strHtml = '';
    for (var i = 0; i < gDiffucult; i++) {
        strHtml += '<div class="colorSquare"></div>';
    }
    domain.innerHTML = strHtml;
}


function getColors(num) {
    var colors = [];
    for (var i = 0; i < num; i++) {
        colors[i] = generateColor();
    }
    return colors;
}

function pickColor(colorArr) {
    return colorArr[Math.floor(Math.random() * colorArr.length)];
}

function generateColor() {
    r = Math.floor(Math.random() * 256);
    g = Math.floor(Math.random() * 256);
    b = Math.floor(Math.random() * 256);
    return "rgb(" + r + ", " + g + ", " + b + ")";
}

function assignColor() {
    var elSquares = document.querySelectorAll('.colorSquare');
    for (var i = 0; i < elSquares.length; i++) {
        if (gColors[i]) {
            elSquares[i].style.display = 'block';
            elSquares[i].style.backgroundColor = gColors[i];
        }
        else {
            console.log('here');
            elSquares[i].style.display = 'none';
        }
    }
    document.querySelector('.pickedC').innerHTML = gPicked;
}

function addClicks() {
    var elSquares = document.querySelectorAll('.colorSquare');
    for (var i = 0; i < gDiffucult; i++) {
        elSquares[i].addEventListener('click', function () {
            var clickedColor = this.style.backgroundColor;
            if (clickedColor === gPicked) {
                colorSame();
                elMes.textContent = 'GOOD JOB';
                document.querySelector('.newbtn').textContent = "NEW GAME?";
            }
            else {
                this.style.backgroundColor = '#232323';
                elMes.textContent = 'TRY AGAIN';
            }
        })
    }
}

function colorSame() {
    var elSquares = document.querySelectorAll('.colorSquare');
    for (var i = 0; i < elSquares.length; i++) {
        if (gColors[i]) {
            elSquares[i].style.backgroundColor = gPicked;
        }
        else {
            elSquares[i].style.disply = 'none';
        }
    }
    document.querySelector('.head').style.backgroundColor = gPicked;
}

function reset() {
    init();

    if (gGameType === A) {
        timer();
    }
    document.querySelector('.game-over').style.display = "none";
    elMes.textContent = '';

}

function setDiffuculty(elBtn) {
    var elBtns = document.querySelectorAll('.diffbtn');
    for (var i = 0; i < elBtns.length; i++) {
        elBtns[i].classList.toggle('selected');
    }
    if (elBtn.value === 'easy') {
        gDiffucult = EASY;
    }
    else {
        gDiffucult = HARD;
    }
    reset();
}

function setType(elbtn) {
    var elTypes = document.querySelectorAll('.type');
    for (var i = 0; i < elTypes.length; i++) {
        elTypes[i].classList.toggle('choosen');
        elTypes[i].toggleAttribute('disabled');
    }
    gGameType = elbtn.textContent;
    if (gGameType === C) document.querySelector('.arcade-timer').style.display = 'none';

    console.log(gGameType);
    reset();
}

function readyForTimer() {

}

function timer() {
    var timeToCount = gTime;
    var arcadeTimer = document.querySelector('.arcade-timer');
    var timeUpdate = document.querySelector('.time-display');
    var recordDisplay = document.querySelector('.record-display');
    recordDisplay.textContent = localStorage.bestColorScore;
    arcadeTimer.style.display = 'block';
    document.querySelector('.newbtn').style.display = 'none';
    timeUpdate.textContent = timeToCount;
    var timer = setInterval(() => {
        timeToCount -= 1;
        timeUpdate.textContent = timeToCount;
        if (timeToCount === 0) {
            clearInterval(timer);
            endRound();
        }
    }, 1000);

}

function manageArcade() {
    var elSquares = document.querySelectorAll('.colorSquare');
    if (gTime > 0.9) {
        for (var i = 0; i < gDiffucult; i++) {
            elSquares[i].addEventListener('click', function () {
                var clickedColor = this.style.backgroundColor;
                if (clickedColor === gPicked) {
                    colorSame();
                    elMes.textContent = 'GOOD JOB';
                    updateScore();
                }
                else {
                    this.style.backgroundColor = '#232323';
                    elMes.textContent = 'WRONG';
                }
                setTimeout(init, 500);
            })
        }
    }
}
function updateScore() {
    gScore++;
    var scoreDisplay = document.querySelector('.score-display');
    scoreDisplay.textContent = gScore;
}

function endRound() {
    document.querySelector('.game-over').style.display = "block";
    document.querySelector('.game-over').style.animation = "roll-in-left 0.8s ease-out both";
    if (localStorage.bestColorScore < gScore) localStorage.bestColorScore = gScore;
    document.querySelector('.newbtn').style.display = 'inline';
    document.querySelector('.newbtn').textContent = "NEW GAME?";

}