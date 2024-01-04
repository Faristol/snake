const board = 500;
const cell = 10;
let canvas = null;
let id = 0;
let snake = [
  { x: 2, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 0 },
];
let food = { x: 10, y: 40 };
//const snakeSpeed = 1;
//default -> right
let currentDirection = { x: 1, y: 0 };
let lastDirection = { x: 1, y: 0 };

const inici = () => {
  canvas = document.querySelector("#cv");
  document.addEventListener("keydown", movementControl);
  canvas.width = board;
  canvas.height = board;
  canvas.style.border = "1px solid black";
  game();
};

const movementControl = (e) => {
  switch (e.key) {
    case "ArrowUp":
      //x cte y--
      console.log("ArrowUp");
      lastDirection = currentDirection;
      currentDirection = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      //x cte y++
      lastDirection = currentDirection;
      currentDirection = { x: 0, y: 1 };
      console.log("ArrowDown");
      break;
    case "ArrowLeft":
      //x-- y cte
      lastDirection = currentDirection;
      currentDirection = { x: -1, y: 0 };
      console.log("ArrowLeft");

      break;
    case "ArrowRight":
      //x++ y cte
      lastDirection = currentDirection;
      currentDirection = { x: 1, y: 0 };
      console.log("ArrowRight");
      break;
  }
};
const game = () => {
  window.clearInterval(id);
  draw();
  update();
  //després de fer el update, comprovem si el cap:
  //a tocat la poma
  //o a colisionat -> window.location.href = './index.html';
  checkCollisions();

  id = window.setInterval(game, 200);
};
const draw = () => {
  if (canvas.getContext) {
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.width);
    snake.forEach((segment) => {
      ctx.fillStyle = "green";
      ctx.strokeStyle = "black";
      ctx.fillRect(segment.x * cell, segment.y * cell, cell, cell);
      ctx.strokeRect(segment.x * cell, segment.y * cell, cell, cell);
    });
    if (food) {
      ctx.fillStyle = "red";
      ctx.strokeStyle = "black";
      ctx.fillRect(food.x * cell, food.y * cell, cell, cell);
      ctx.strokeRect(food.x * cell, food.y * cell, cell, cell);
    } else {
      //sino hi ha, la generem tinguent en compte les posicions dels segments del snake
      generateFood();
    }
    generateFood();
  }
};
const update = () => {
  //sha de fer una copia profunda per a que no mantinga la referencia, amb [...snake] no serviria,
  //done fe
  let copySnake = JSON.parse(JSON.stringify(snake));
  //el cap marca la direcció, els altres segments agafen la x i la y del segment anterior
  for (let i = 0; i < snake.length; i++) {
    if (i === 0) {
      snake[i].x += currentDirection.x;
      snake[i].y += currentDirection.y;
    } else {
      snake[i].x = copySnake[i - 1].x;
      snake[i].y = copySnake[i - 1].y;
    }
  }
};
const checkCollisions = () => {
  //primer vegem si ha tocat la poma
  if (snake[0].x === food.x && snake[0].y === food.y) {
    //el cap està en === posició, igualem la poma a false, afegim un segment al final, i creem altra poma
    food = false;
    //aci hi ha un problema -> si al menjar-se la poma, l'ultim segment del snake, creix fora dels limits del canvas
    //de moment no farem res
    snake.push({
      //soc un genio i en ma casa no ho saben
      x:
        lastDirection.x === 1
          ? snake[snake.length - 1].x + cell
          : snake[snake.length - 1].x - cell,
      y:
        lastDirection.y === 1
          ? snake[snake.length - 1].y + cell
          : snake[snake.length - 1].y - cell,
    });
    return;
  }
  //vegem si xoca contra algun del seus segments
  //creem una copia
  let copyCapedSnake = JSON.parse(JSON.stringify(snake));
  //llevem el cap, ens quedem amb ell i modifiquem la copia que ja no tindrà cap
  let headCoordinates = copyCapedSnake.shift();
  //vegem si algun dels segments té === coordenades q el cap
  if (
    copyCapedSnake.some(
      (coordinates) =>
        coordinates.x === headCoordinates.x &&
        coordinates.y === headCoordinates.y
    )
  ) {
    restart();
  }
  //ara vegem si xoca contra les parets
  if(snake[0].x*cell>board||snake[0].x*cell<0||snake[0].y*cell>board||snake[0].y*cell<0){
    restart();
  }
};
const restart = () => {
  window.location.href = "./index.html";
};
const generateFood = () => {
  //0-board
  let randomX = Math.floor((Math.random()*board+1));
  let randomY = Math.floor((Math.random()*board+1));
  //per a fer-ho més dinàmic
  //i com board sempre serà major que la cel·la
  //suposant que la cel·la sempre tindrà 0 

  console.log(randomX);
  console.log(randomY);

}

window.onload = inici;
