"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const flagsLeft = document.querySelector('#flags-left');
    const fire = document.querySelector('#flame');
    const result = document.querySelector('#result');
    let width = 10;
    let bombAmount = 20;
    let flags = 0;
    let squares = [];
    let isGameOver = false;
    function createBoard() {
        flagsLeft.innerHTML = bombAmount.toString();
        const bombsArray = Array(bombAmount).fill('bomb');
        const emptyArray = Array(width * width - bombAmount).fill('valid');
        const gameArray = emptyArray.concat(bombsArray);
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5);
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.setAttribute('id', i.toString());
            square.classList.add(shuffledArray[i]);
            grid.appendChild(square);
            squares.push(square);
            square.addEventListener('click', () => click(square));
            square.oncontextmenu = (e) => {
                e.preventDefault();
                addFlag(square);
            };
        }
        //add numbers
        for (let i = 0; i < squares.length; i++) {
            let total = 0;
            // if the modulus of i/width is 0 we are on the left hand side of the grid
            const isLeftEdge = (i % width === 0);
            // if the modulus i/width is 9 we are at the right edge
            const isRightEdge = (i % width === width - 1);
            if (squares[i].classList.contains('valid')) {
                //i>0; not at the left edge; checks the div to the left then total +1
                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb'))
                    total++;
                // i>9; not at the right edge; checks the div to the top right then total +1
                if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb'))
                    total++;
                // i>10; checks box on top then total +1
                if (i > 10 && squares[i - width].classList.contains('bomb'))
                    total++;
                //i > 11; is not at the left edge; checks top left then total +1
                if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb'))
                    total++;
                // i<98; is not at the right edge; checks right then total +1
                if (i < 98 && !isRightEdge && squares[i + 1].classList.contains('bomb'))
                    total++;
                //i< 90; is not at the left edge; checks bottom left then total +1
                if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb'))
                    total++;
                //is< 88; is not at the right edge; checks bottom right then total +1
                if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb'))
                    total++;
                //i< 89 checks below
                if (i < 89 && squares[i + width].classList.contains('bomb'))
                    total++;
                squares[i].setAttribute('data', total.toString());
            }
        }
    }
    // Rest of the code...
    function addFlag(square) {
        if (isGameOver)
            return;
        if (!square.classList.contains('checked') && (flags < bombAmount)) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag');
                square.innerHTML = "<img src='./Assets/checked.png'>";
                flags++;
                flagsLeft.innerHTML = (bombAmount - flags).toString();
                checkForWin();
            }
            else {
                square.classList.remove('flag');
                square.innerHTML = '';
                flags--;
                flagsLeft.innerHTML = (bombAmount - flags).toString();
            }
        }
    }
    function click(square) {
        let currentId = square.id;
        // If the game is over, nothing happens when clicked
        if (isGameOver)
            return;
        // If the square is already checked or flagged, nothing happens when clicked
        if (square.classList.contains('checked') || square.classList.contains('flag'))
            return;
        // If the square contains a bomb, handle game over
        if (square.classList.contains('bomb')) {
            gameOver(square);
        }
        else {
            let totalAttribute = square.getAttribute('data');
            if (totalAttribute !== null) {
                let total = parseInt(totalAttribute);
                if (!isNaN(total)) {
                    square.classList.add('checked');
                    if (total === 1)
                        square.classList.add('one');
                    if (total === 2)
                        square.classList.add('two');
                    if (total === 3)
                        square.classList.add('three');
                    if (total === 4)
                        square.classList.add('four');
                    square.innerHTML = total.toString();
                    square.style.backgroundImage = "url('./Assets/valid.png')";
                    return;
                }
            }
            // Call the checkSquare function with the current square and its ID
            checkSquare(square, currentId);
        }
        square.classList.add('checked');
    }
    // Define the gameOver function with an argument
    function gameOver(square) {
        result.innerHTML = 'BOOM! Game Over!';
        isGameOver = true;
        fire.style.display = 'flex';
        // Show ALL the bombs
        squares.forEach(square => {
            if (square.classList.contains('bomb')) {
                square.innerHTML = '💣';
                square.classList.remove('bomb');
                square.classList.add('checked');
            }
        });
    }
    function checkSquare(square, currentId) {
        const parsedCurrentId = parseInt(currentId);
        if (isNaN(parsedCurrentId)) {
            return;
        }
        const isLeftEdge = parsedCurrentId % width === 0;
        const isRightEdge = parsedCurrentId % width === width - 1;
        // Happens after 10 milliseconds
        // The 10 millisecond delay gives the illusion of a sweeping animation
        setTimeout(() => {
            // If criteria is met, performs click() on the square to the left
            if (parsedCurrentId > 0 && !isLeftEdge) {
                const newId = squares[parsedCurrentId - 1].id;
                const newSquare = document.getElementById(newId);
                if (newSquare instanceof HTMLDivElement) {
                    click(newSquare);
                }
            }
            // If criteria is met, performs click() on the square to the top right
            if (parsedCurrentId > 9 && !isRightEdge) {
                const newId = squares[parsedCurrentId + 1 - width].id;
                const newSquare = document.getElementById(newId);
                if (newSquare instanceof HTMLDivElement) {
                    click(newSquare);
                }
            }
            // If criteria is met, performs click() on the square to the top
            if (parsedCurrentId > 10) {
                const newId = squares[parsedCurrentId - width].id;
                const newSquare = document.getElementById(newId);
                if (newSquare instanceof HTMLDivElement) {
                    click(newSquare);
                }
            }
            // If criteria is met, performs click() on the square to the top left
            if (parsedCurrentId > 11 && !isLeftEdge) {
                const newId = squares[parsedCurrentId - 1 - width].id;
                const newSquare = document.getElementById(newId);
                if (newSquare instanceof HTMLDivElement) {
                    click(newSquare);
                }
            }
            // Changes the background image
            square.style.backgroundImage = "url('./Assets/valid.png')";
        }, 10);
    }
    function checkForWin() {
        let matches = 0;
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches++;
            }
            if (matches === bombAmount) {
                result.innerHTML = 'YOU WIN!';
                isGameOver = true;
                for (let x = 0; x < 900; x++) {
                    setInterval(() => animateWin(x), 1);
                }
            }
        }
    }
    const tank = document.querySelector('.tankTest');
    const container = document.querySelector('.container');
    const containerWidth = container.clientWidth;
    const tankWidth = tank.clientWidth;
    const distance = containerWidth / 4;
    const duration = 6000;
    let startTime = null;
    let currentPosition = -30;
    function animate(timestamp) {
        if (!startTime)
            startTime = timestamp;
        const elapsedTime = timestamp - startTime;
        currentPosition = -30 + (elapsedTime / duration) * distance;
        if (currentPosition <= distance) {
            tank.style.left = currentPosition - 150 + 'px';
            requestAnimationFrame(animate);
        }
    }
    requestAnimationFrame(animate);
    function animateWin(x) {
        if (isGameOver) {
            tank.style.left = currentPosition - 150 + x + 'px';
        }
    }
    createBoard();
});
