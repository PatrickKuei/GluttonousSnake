var BLOCK_SIZE = 20;
var BLOCK_COUNT = 20;
var snack;
var apple;
var score;
var gameInterval;

window.onload = function(){
    document.addEventListener('keydown', handleKeyDown);
}
function handleKeyDown(event){
var originX = snack.direction.x;
var originY = snack.direction.y;
    if(event.keyCode === 39){//left arrow
        snack.direction.x = -originY;
        snack.direction.y = originX;
    }else if(event.keyCode === 37){//right arrow
        snack.direction.x = originY;
        snack.direction.y = -originX;
    }
}

function gameStart(){
    gameInterval = setInterval(gameRoutine, 100);
    snack = {
        body: [
            { x: BLOCK_COUNT / 2, y: BLOCK_COUNT / 2 }
        ],
        size: 5,
        direction: { x: 0, y:-1 }
    }
    putApple();
    updateScore(0);
}

function updateScore(newScore){
    score = newScore;
    document.getElementById('score_id').innerHTML = score;
}

function putApple(){
    apple = {
        x: Math.floor(Math.random() * BLOCK_COUNT),
        y: Math.floor(Math.random() * BLOCK_COUNT)
    }

    for(i = 0; i < snack.body.length; i++){
        if(apple.x === snack.body[i].x &&
            apple.y === snack.body[i].y){
                putApple();
                break;
            }
    }
}

function gameRoutine(){
    moveSnack();
    if(snackIsDead()){
        ggler();
        return;
    }
    if(apple.x === snack.body[0].x &&
        apple.y === snack.body[0].y){
            eatApple();
        }
    updateCanvas();
}

function eatApple(){
    snack.size += 1;
    putApple();
    updateScore(score + 1)
}

function snackIsDead(){
    //hit wall
    if(snack.body[0].x < 0){
        return true;
    }else if(snack.body[0].x >= BLOCK_COUNT){
        return true;
    }else if(snack.body[0].y < 0){
        return true;
    }else if(snack.body[0].y >= BLOCK_COUNT){
        return true;
    }

    //hit body
    for(i = 1; i < snack.body.length; i++){
        if(snack.body[0].x === snack.body[i].x &&
            snack.body[0].y === snack.body[i].y){
                return true;
            }
    }
    return false;
}

function ggler(){
    clearInterval(gameInterval);
}

function moveSnack(){
    var newBlock = {
        x: snack.body[0].x + snack.direction.x,
        y: snack.body[0].y + snack.direction.y
    };

    snack.body.unshift(newBlock);
    while(snack.body.length > snack.size){
        snack.body.pop();
    };
}

function updateCanvas() {
    var canvas = document.getElementById('canvas_id');
    if(canvas.getContext){
        /** @type {CanvasRenderingContext2D} */
        var context = canvas.getContext('2d');
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'lime';
        for( i = 0; i < snack.body.length; i++ ){
            context.fillRect(
                snack.body[i].x * BLOCK_SIZE,
                snack.body[i].y * BLOCK_SIZE,
                BLOCK_SIZE -1,
                BLOCK_SIZE -1
            );
        }
        context.fillStyle = 'red';
        context.fillRect(
            apple.x * BLOCK_SIZE, 
            apple.y * BLOCK_SIZE,
            BLOCK_SIZE -1,
            BLOCK_SIZE -1
        )
    }
}