var canvas = document.getElementById("canvas_id");

var sizeOfBlock = 16;
var numberOfBlock = 50;
var snake = {};
var apple = {};
var score = "";
var gameInterval = "";

//game setting
function gameStart() {
  //
  //start btn disappear when game start
  document.getElementById("start").style.display = "none";

  canvas.width = 800;
  canvas.height = 800;

  //game update rate and apple reput rate
  gameInterval = setInterval(gameRoutine, 100);
  appleInterval = setInterval(
    putApple,
    (Math.floor(Math.random() * 6) + 4) * 1000
  );

  snake = {
    body: [{ x: sizeOfBlock, y: sizeOfBlock }],
    size: 5,
    direction: { x: 0, y: -1 },
  };
  putApple();
  updateScore(0);
}

//handling snake move rule
function movesnake() {
  var newBlock = {
    x: snake.body[0].x + snake.direction.x,
    y: snake.body[0].y + snake.direction.y,
  };
  snake.body.unshift(newBlock);
  while (snake.body.length > snake.size) {
    snake.body.pop();
  }
}

//handling snake move direction
window.onload = function () {
  document.addEventListener("keydown", handleKeyDown);
};
function handleKeyDown(event) {
  var originX = snake.direction.x;
  var originY = snake.direction.y;
  if (event.keyCode === 39) {
    //left arrow
    snake.direction.x = -originY;
    snake.direction.y = originX;
  } else if (event.keyCode === 37) {
    //right arrow
    snake.direction.x = originY;
    snake.direction.y = -originX;
  }
}

//handling score
function updateScore(newScore) {
  score = newScore;
  document.getElementById("score_id").innerHTML = score;
}

//handling apple appear
function putApple() {
  //random appear
  apple = {
    x: Math.floor(Math.random() * sizeOfBlock),
    y: Math.floor(Math.random() * sizeOfBlock),
  };
  console.log(apple);

  //reput apple if apple appear on the snake
  for (i = 0; i < snake.body.length; i++) {
    if (apple.x === snake.body[i].x && apple.y === snake.body[i].y) {
      putApple();
      break;
    }
  }
}

//game rule setting
function gameRoutine() {
  movesnake();
  if (snakeIsDead()) {
    ggler();
    return;
  }

  //if hit the wall, reduce the wall then turn aroung and take a step
  if (hitTheWall(snake.body[0])) {
    reduceWall();
    snake.body[0].x += hitTheWall(snake.body[0]).oneStepX;
    snake.body[0].y += hitTheWall(snake.body[0]).oneStepY;
    snake.direction.x = -snake.direction.x;
    snake.direction.y = -snake.direction.y;
  }
  if (apple.x === snake.body[0].x && apple.y === snake.body[0].y) {
    eatApple();
  }
  updateCanvas();
}

//game rule setting
function eatApple() {
  snake.size += 1;
  apple = {};
  updateScore(score + 1);
}

//game rule setting
function hitTheWall(head) {
  var step = {
    oneStepX: 0,
    oneStepY: 0,
  };
  //hit wall
  if (head.x < 0) {
    step.oneStepY = 1;
    return step;
  } else if (head.x >= numberOfBlock) {
    head.x = numberOfBlock;
    step.oneStepY = 1;
    return step;
  } else if (head.y < 0) {
    step.oneStepX = 1;
    return step;
  } else if (head.y >= numberOfBlock) {
    head.y = numberOfBlock;
    step.oneStepX = 1;
    return step;
  }
}

//game rule setting
function snakeIsDead() {
  //
  //hit body
  for (i = 1; i < snake.body.length; i++) {
    if (
      snake.body[0].x === snake.body[i].x &&
      snake.body[0].y === snake.body[i].y
    ) {
      return true;
    }
  }

  //game over if canvas too small either
  return canvas.width < 300 ? true : false;
  return false;
}

//game rule setting
function reduceWall() {
  canvas.width -= 113;
  numberOfBlock = Math.floor(canvas.width / sizeOfBlock);
  canvas.height -= 113;
  numberOfBlock = Math.floor(canvas.height / sizeOfBlock);
}

//game over
function ggler() {
  clearInterval(appleInterval);
  clearInterval(gameInterval);
  document.getElementById("start").style.display = "block";
}

//draw all stuff on canvas
function updateCanvas() {
  if (canvas.getContext) {
    //draw map
    var context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    //draw snake
    context.fillStyle = "lime";
    for (i = 0; i < snake.body.length; i++) {
      context.fillRect(
        snake.body[i].x * sizeOfBlock,
        snake.body[i].y * sizeOfBlock,
        sizeOfBlock - 1,
        sizeOfBlock - 1
      );
    }

    //draw apple
    context.fillStyle = "red";
    context.fillRect(
      apple.x * sizeOfBlock,
      apple.y * sizeOfBlock,
      sizeOfBlock - 1,
      sizeOfBlock - 1
    );
  }
}
