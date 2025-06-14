const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const map = [
  [1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,1],
  [1,0,1,0,1,0,0,1],
  [1,0,1,0,1,0,0,1],
  [1,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1],
];

const TILE_SIZE = 64;
const FOV = Math.PI / 3;
const RAYS = 320;

let player = {
  x: TILE_SIZE * 1.5,
  y: TILE_SIZE * 1.5,
  angle: 0,
  speed: 0,
};

function castRays() {
  let start = player.angle - FOV / 2;
  let step = FOV / RAYS;

  for (let i = 0; i < RAYS; i++) {
    let rayAngle = start + step * i;
    let distance = 0;
    let hit = false;

    while (!hit && distance < 300) {
      let rayX = player.x + Math.cos(rayAngle) * distance;
      let rayY = player.y + Math.sin(rayAngle) * distance;

      let mapX = Math.floor(rayX / TILE_SIZE);
      let mapY = Math.floor(rayY / TILE_SIZE);

      if (map[mapY]?.[mapX] === 1) {
        hit = true;
        const wallHeight = 20000 / (distance + 0.0001);
        ctx.fillStyle = `rgb(${150 - distance}, 0, 0)`;
        ctx.fillRect(i * 2, (canvas.height / 2) - wallHeight / 2, 2, wallHeight);
      }
      distance += 1;
    }
  }
}

function drawMiniMap() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      ctx.fillStyle = map[y][x] === 1 ? "gray" : "black";
      ctx.fillRect(x * 10, y * 10, 10, 10);
    }
  }
  ctx.fillStyle = "red";
  ctx.fillRect(player.x / 6, player.y / 6, 5, 5);
}

function update() {
  player.x += Math.cos(player.angle) * player.speed;
  player.y += Math.sin(player.angle) * player.speed;
}

function gameLoop() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  update();
  castRays();
  drawMiniMap();

  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") player.speed = 2;
  if (e.key === "ArrowDown") player.speed = -2;
  if (e.key === "ArrowLeft") player.angle -= 0.1;
  if (e.key === "ArrowRight") player.angle += 0.1;
});

document.addEventListener("keyup", e => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") player.speed = 0;
});

gameLoop();


