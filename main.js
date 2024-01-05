const board = 800;
const cell = 50;
const snakeSpeed = 200;
let headImage;
let appleImage;
let score = 0;
let record = 0;

let canvas = null;
let ctx = null;
let id = 0;
let snake = [
  { x: 2, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 0 },
];
let food = generateFood();
//default -> right
let currentDirection = { x: 1, y: 0 };
let lastDirection = { x: 1, y: 0 };
const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
};
const inici = async () => {
  canvas = document.querySelector("#cv");
  document.addEventListener("keydown", movementControl);
  canvas.width = board;
  canvas.height = board;
  canvas.style.border = "1px solid black";
  if(localStorage.getItem('record')){
    record = localStorage.getItem('record');
  }else{
    localStorage.setItem('record',record);
  }
  refreshRecord();
  try {
    headImage = await loadImage("./snakehead.png");
    appleImage = await loadImage("./apple.png");
    game();
  } catch (error) {
    console.error("Error loading images:", error);
  }
};
const refreshRecord = () => {
  document.getElementById('highestScore').innerHTML = `Highest Score: ${record}`;
  localStorage.setItem('record',record);
}
const refreshScore = () => {
  document.getElementById('currentScore').innerHTML = `Score: ${score}`;
  if(score > record){
    record = score;
    refreshRecord();
  }
}
const movementControl = (e) => {
  switch (e.key) {
    case "ArrowUp":
      //x cte y--
      lastDirection = currentDirection;
      currentDirection = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      //x cte y++
      lastDirection = currentDirection;
      currentDirection = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      //x-- y cte
      lastDirection = currentDirection;
      currentDirection = { x: -1, y: 0 };

      break;
    case "ArrowRight":
      //x++ y cte
      lastDirection = currentDirection;
      currentDirection = { x: 1, y: 0 };
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
  id = window.setInterval(game, snakeSpeed);
};
const draw = () => {
  if (canvas.getContext) {
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.width);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    snake.forEach((segment, index) => {
      if (index === 0) {
        drawHead(segment.x, segment.y);
      } else {
        drawSegment(segment.x, segment.y, "green");
      }
    });
    if (food) {
      drawApple(food.x, food.y);
    } else {
      //sino hi ha, la generem tinguent en compte les posicions dels segments del snake
      food = generateFood();
    }
  }
};
const drawApple = (x, y) => {
  //si ho feia aixina notava el parpadeig
  //appleImage.onload = () => {
  //ctx.drawImage(appleImage, x*cell, y*cell, cell, cell);
  //}
  ctx.drawImage(appleImage, x * cell, y * cell, cell, cell);
};
const drawHead = (x, y) => {
  //esto es fumadeta
  ctx.save();
  ctx.translate(x * cell + cell / 2, y * cell + cell / 2);
  ctx.rotate(getDirectionAngle());
  ctx.drawImage(headImage, -cell / 2, -cell / 2, cell, cell);
  ctx.restore();
};
const getDirectionAngle = () => {
  return Math.atan2(currentDirection.y, currentDirection.x);
};
const drawSegment = (x, y, color) => {
  ctx.fillStyle = color;
  ctx.strokeStyle = "black";
  ctx.fillRect(x * cell, y * cell, cell, cell);
  ctx.strokeRect(x * cell, y * cell, cell, cell);
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
      x:
        lastDirection.x === 1
          ? snake[snake.length - 1].x + cell
          : snake[snake.length - 1].x - cell,
      y:
        lastDirection.y === 1
          ? snake[snake.length - 1].y + cell
          : snake[snake.length - 1].y - cell,
    });
    score++;
    refreshScore();
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
  if (
    snake[0].x * cell >= board ||
    snake[0].x * cell < 0 ||
    snake[0].y * cell >= board ||
    snake[0].y * cell < 0
  ) {
    restart();
  }
};
const restart = () => {
  window.location.href = "./index.html";
};
function generateFood() {
  //cell-board
  //si els px del cell son 10 i els px del board son 500 hi hauran 50x50 cel·les
  //com treballem cen cel·les el numero generat deura d'estar compres entre 0 i (500/10) 50 (ambdós inclosos) PERO COM
  //LES CELES VAN DE 0 A 49 LULTIM NO SINCLOU
  //i a més  les coordenades generades no deuran coincidir amb cap coordenada de cap segment
  let randomX = Math.floor(Math.random() * (board / cell));
  let randomY = Math.floor(Math.random() * (board / cell));
  while (
    snake.some((segment) => segment.x === randomX && segment.y === randomY)
  ) {
    randomX = Math.floor(Math.random() * (board / cell));
    randomY = Math.floor(Math.random() * (board / cell));
  }
  return { x: randomX, y: randomY };
}
window.onload = inici;
