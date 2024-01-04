const board = 500;
const cell = 10;
let canvas = null;
let id = 0;

//350x350
let snake = [
  { x: 2, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 0 },
];
let food = { x: 10, y: 40 };
//const snakeSpeed = 1;
//default -> right
let currentDirection = { x: 1, y: 0 };

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
      currentDirection = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      //x cte y++
      currentDirection = { x: 0, y: 1 };
      console.log("ArrowDown");
      break;
    case "ArrowLeft":
      //x-- y cte
      currentDirection = { x: -1, y: 0 };
      console.log("ArrowLeft");
      break;
    case "ArrowRight":
      //x++ y cte
      currentDirection = { x: 1, y: 0 };
      console.log("ArrowRight");
      break;
  }
};
const game = () => {
  window.clearInterval(id);
  draw();
  update();
  id=window.setInterval(game,200);
};
const draw = () => {
  if(canvas.getContext){
    ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.width);
    snake.forEach((segment)=>{
      ctx.fillStyle = "green";
      ctx.strokeStyle = "black";
      ctx.fillRect(segment.x*cell,segment.y*cell,cell,cell);
      ctx.strokeRect(segment.x*cell,segment.y*cell,cell,cell);
    })
    if(food){
      ctx.fillStyle = "red";
      ctx.strokeStyle = "black";
      ctx.fillRect(food.x*cell,food.y*cell,cell,cell);
      ctx.strokeRect(food.x*cell,food.y*cell,cell,cell);
    }
  }
};
const update = () => {
  //sha de fer una copia profunda per a que no mantinga la referencia amb [...snake] no serviria,
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

  console.log(snake);
};


window.onload = inici;
