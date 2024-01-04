const board = 500;
const cell = 10;
let canvas = null;

//350x350
const snake = [
  { x: 2, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 0 },
];
const food = { x: 10, y: 40 };
//const snakeSpeed = 1;
//default -> right
const currentDirection = { x: 1, y: 0 };

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
      break;
    case "ArrowDown":
      //x cte y++
      console.log("ArrowDown");
      break;
    case "ArrowLeft":
      //x-- y cte
      console.log("ArrowLeft");
      break;
    case "ArrowRight":
      //x++ y cte
      console.log("ArrowRight");
      break;
  }
};
const game = () => {
  draw();
  update();
  window.requestAnimationFrame(game);
};
const update = () => {};
console.log(canvas)
const draw = () => {
  if(canvas.getContext){
    ctx = canvas.getContext("2d");
    snake.forEach((segment)=>{
      ctx.fillStyle = "green";
      ctx.fillRect(segment.x*cell,segment.y*cell,cell,cell);
    })
    if(food){
      ctx.fillStyle = "red";
      ctx.fillRect(food.x*cell,food.y*cell,cell,cell);
    }
    
  }
  
};


window.onload = inici;
