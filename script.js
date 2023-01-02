let st = document.querySelector("#top-panel-style"),
  originalStyle = st.textContent,
  container = document.querySelector("aside"),
  topPanel = document.querySelector(".top.panel"),
  canvas = document.getElementById("canvas");

document.body.appendChild(st);

const createMediaQueryForIntro = function() {
  const introHeight = topPanel.clientHeight;
  st.textContent = "@media screen and (min-height:"+introHeight+"px) { "+originalStyle+" }";
}

// const setCanvasDimensions = function() {
//   const cWidth = container.clientWidth;
//   const cHeight = container.clientHeight;
//   canvas.width = cWidth;
//   canvas.height = cHeight;
// }

const handleResize = function() {
  createMediaQueryForIntro();
  // setCanvasDimensions()
}
window.addEventListener("resize", handleResize);
handleResize();

let button = document.querySelector("a.button");
button.addEventListener("click", function(e) {
  e.preventDefault();
  document.querySelector('.resume').scrollIntoView({ 
    behavior: 'smooth' 
  });
})

// let ctx = canvas.getContext("2d");
// let [canvasWidth, canvasHeight] = [canvas.width, canvas.height];
//
// const colors = ['#FF6961', '#FFA07A', '#FFD700', '#9ACD32', '#00FFFF', '#00BFFF'];
// const speed = 10.0;
// const empty = -1;
// const fitFactor = 1.25; // lower => easier it is to "slip" into tight spots
//
// class Game {
//   constructor(radius) {
//     this.grid = makeHexGrid(canvasWidth, canvasHeight, radius) // 2d array of rows of cols ([y][x])
//     this.radius = radius;
//     this.populateEnemies(30)
//     this.launcherAngle = 0.5;
//     this.launcherColor = Math.floor(Math.random() * colors.length)
//   }
//
//   tick() {
//     if (this.inflightPosition) {
//       const [x, y] = this.inflightPosition;
//       let newX = x + Math.cos(this.inflightAngle) * speed;
//       let newY = y + Math.sin(this.inflightAngle) * speed;
//       if (newX <= this.radius || newX >= canvasWidth-this.radius) {
//         this.inflightAngle = Math.PI - this.inflightAngle;
//         newX = x + Math.cos(this.inflightAngle) * speed;
//         newY = y + Math.sin(this.inflightAngle) * speed;
//       }
//       this.inflightPosition = [newX, newY];
//       const [sx, sy] = this.settleInflightEnemy();
//       if (sx !== undefined && sy !== undefined) {
//         let set = this.checkSet(this.enemies, sx, sy, this.enemies[sy][sx])
//         if (set.length >= 3) {
//           set.forEach((coord)=> {
//             this.enemies[coord[1]][coord[0]] = empty;
//           })
//           this.handleOrphanedEnemies();
//         }
//       }
//     }
//   }
//
//   settleInflightEnemy() {
//     // todo make the flying guy stick to the top if it goes off
//     for (let row = 0; row < this.enemies.length; row++) {
//       for (let col = 0; col < this.enemies[0].length; col++) {
//         if (this.enemies[row][col] !== empty) {
//           let [ex, ey] = this.grid[row][col];
//           let [newX, newY] = this.inflightPosition;
//           if (dist(newX, newY, ex, ey) < this.radius * fitFactor) {
//             let closest = canvasWidth*canvasHeight;
//             let closestLoc = null;
//             for (let grow = 0; grow < this.grid.length; grow++) {
//               for (let gcol = 0; gcol < this.grid[0].length; gcol++) {
//                 const [gx, gy] = this.grid[grow][gcol];
//                 const d = dist(newX, newY, gx, gy)
//                 if (d < closest) {
//                   closest = d;
//                   closestLoc = [gcol, grow];
//                 }
//               }
//             }
//             this.enemies[closestLoc[1]][closestLoc[0]] = this.inflightColor;
//             this.inflightAngle = null;
//             this.inflightPosition = null;
//             this.inflightAngle = null;
//             return closestLoc;
//           }
//         }
//       }
//     }
//     return [];
//   }
//
//   aim(fraction) {
//     this.launcherAngle = fraction;
//   }
//
//   draw(ctx) {
//     const radius = hexagonCircleRadius(this.radius);
//     for (let row = 0; row < this.enemies.length; row++) {
//       for (let col = 0; col < this.enemies[0].length; col++) {
//         if (this.enemies[row][col] !== empty) {
//           ctx.beginPath();
//           let [centerX, centerY] = this.grid[row][col];
//           ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
//           ctx.fillStyle = colors[this.enemies[row][col]];
//           ctx.fill();
//           ctx.closePath();
//         }
//       }
//     }
//
//     this.renderLauncher(ctx)
//     if (this.inflightPosition) {
//       ctx.beginPath();
//       let [centerX, centerY] = this.inflightPosition;
//       ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
//       ctx.fillStyle = colors[this.inflightColor];
//       ctx.fill();
//       ctx.closePath();
//     }
//   }
//
//   renderLauncher(ctx) {
//     const radius = hexagonCircleRadius(this.radius);
//     const [x, y] = this.launcherPosition();
//     ctx.fillStyle = colors[this.launcherColor];
//     ctx.beginPath();
//     ctx.arc(x, y, radius, 0, 2 * Math.PI);
//     ctx.fill();
//   }
//
//   launcherPosition() {
//     const launcherRadius = 100;
//     const angle = (this.launcherAngle * Math.PI) - (Math.PI / 2);
//     const x = canvasWidth/2 + (launcherRadius * Math.cos(angle));
//     const y = canvasHeight + (launcherRadius * Math.sin(angle));
//     return [x, y]
//   }
//
//   fire() {
//     const [lx, ly] = this.launcherPosition();
//     const xDiff = lx - canvasWidth/2;
//     const yDiff = ly - canvasHeight;
//     this.inflightAngle = Math.atan2(yDiff, xDiff);
//     this.inflightPosition = [lx, ly];
//     this.inflightColor = this.launcherColor;
//     this.launcherColor = Math.floor(Math.random() * colors.length)
//   }
//
//   populateEnemies(count) {
//     let c = 0;
//     let enemies = [];
//     for (let grow = 0; grow < this.grid.length; grow++) {
//       enemies[grow] = []
//       for (let gcol = 0; gcol < this.grid[0].length; gcol++) {
//         if (c < count) {
//           enemies[grow][gcol] = Math.floor(Math.random() * colors.length);
//           while (this.checkSet(enemies, gcol, grow, enemies[grow][gcol]).length >= 3) {
//             enemies[grow][gcol] = Math.floor(Math.random() * colors.length);
//           }
//           c++
//         } else {
//           enemies[grow][gcol] = empty;
//         }
//       }
//     }
//     this.enemies = enemies
//   }
//
//   checkSet(grid, x, y, color) {
//     const visited = new Set();
//     const queue = [[x, y]];
//     let set = [];
//     while (queue.length > 0) {
//       const coord = queue.shift();
//       const [x, y] = coord;
//       if (grid[y] === undefined || grid[y][x] === undefined) {
//         continue
//       }
//       if (visited.has(`${x},${y}`)) {
//         continue
//       }
//       visited.add(`${x},${y}`);
//       set.push([x, y])
//       this.neighbors(x, y, grid).forEach((coord)=> {
//         const [cx, cy] = coord;
//         if (grid[cy] === undefined || visited.has(`${cx},${cy}`)) {
//           return
//         }
//         if (grid[cy][cx] === color) {
//           queue.push(coord);
//         }
//       })
//     }
//     return set;
//   }
//
//   neighbors(x, y, grid) {
//     let coords = []
//     if (x > 0) coords.push([x-1, y]);
//     if (y > 0) coords.push([x, y-1]);
//     if (x < grid[0].length-1) coords.push([x+1, y]);
//     if (y < grid.length-1) coords.push([x, y+1]);
//     // a hex grid has 2 phases. phase 0 is "high" and touches -y. phase 1 is "low" and touches +y
//     if (x % 2 === 0) {
//       if (x > 0 && y > 0) coords.push([x-1, y-1]);
//       if (x < grid[0].length-1 && y > 0) coords.push([x+1, y-1]);
//     } else {
//       if (x > 0 && y < grid.length-1) coords.push([x-1, y+1]);
//       if (x < grid[0].length-1 && y < grid.length-1) coords.push([x+1, y+1]);
//     }
//     return coords
//   }
//
//   handleOrphanedEnemies() {
//     const visited = new Set();
//     const queue = [];
//     for (let col = 0; col < this.enemies[0].length; col++) {
//       if (this.enemies[0][col] !== empty) {
//         queue.push([col, 0]);
//       }
//     }
//     while (queue.length > 0) {
//       const coord = queue.shift();
//       const [x, y] = coord;
//       if (visited.has(`${x},${y}`)) {
//         continue
//       }
//       visited.add(`${x},${y}`);
//       this.neighbors(x, y, this.enemies).forEach((nCoord)=> {
//         const [cx, cy] = nCoord;
//         if (visited.has(`${cx},${cy}`)) {
//           return
//         }
//         if (this.enemies[cy][cx] !== empty) {
//           queue.push(nCoord);
//         }
//       })
//     }
//
//     for (let row = 0; row < this.enemies.length; row++) {
//       for (let col = 0; col < this.enemies[0].length; col++) {
//         if (!visited.has(`${col},${row}`)) {
//           this.enemies[row][col] = empty
//         }
//       }
//     }
//   }
// }
//
// function makeHexGrid(width, height, r) {
//   const a = 2 * Math.PI / 6;
//   const hexWidth = r * (1 + Math.cos(a))
//   const tileCountX = Math.floor((width - r) / hexWidth);
//   const padding = (width - (tileCountX * hexWidth)) / 3;
//   let grid = [];
//   for (let y = r; y + r * Math.sin(a) < height; y += r * Math.sin(a)) {
//     let row = []
//     for (let x = r, j = 0; x + r * (1 + Math.cos(a)) < width; x += r * (1 + Math.cos(a)), y += (-1) ** j++ * r * Math.sin(a)) {
//       row.push([x + padding, y])
//     }
//     grid.push(row);
//   }
//   return grid;
// }
//
// function hexagonCircleRadius(s) {
//   return s * Math.sqrt(3) / 2;
// }
//
// function dist(x1, y1, x2, y2) {
//   const xDiff = x1 - x2;
//   const yDiff = y1 - y2;
//   return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
// }
//
// game = new Game(30)
//
// canvas.addEventListener('mousemove', (event) => {
//   const [mouseX, mouseY] = [event.offsetX, event.offsetY];
//   const angle = Math.atan2(mouseY - canvasHeight, mouseX - canvasWidth/2);
//   let fraction = (angle + (Math.PI / 2)) / Math.PI;
//   fraction = Math.max(-0.5, Math.min(0.5, fraction));
//   game.aim(fraction)
// });
//
// canvas.addEventListener("click", (event) => {
//   game.fire()
// })
//
// function tick(ts) {
//   game.tick()
//   ctx.clearRect(0, 0, canvasWidth, canvasHeight);
//   game.draw(ctx)
//   window.requestAnimationFrame(tick)
// }
//
// window.requestAnimationFrame(tick)