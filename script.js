// Hi, thanks for checking out my source code.
// You might find the `step` function below to be the most interesting part.
// If you're wondering how the point cloud gets created, check out
// `create_point_cloud.py`

var list, tog, dx, dy, d,
  p, o, i, n, t,
  proximity = 0.8,
  ease = 0.12,
  width, height,
  xscale, yscale,
  data, pcount, next, quartets,
  particle = { x: 0, y: 0, nextx: 0, nexty: 0 },
  container = document.createElement("aside"),
  canvas = document.createElement("canvas"),
  context = canvas.getContext("2d");
  
document.body.appendChild(container);
container.appendChild(canvas);

var setScale = function() {
  height = parseInt(container.clientHeight);
  width = parseInt(height * 1.333);
  xscale = d3.scaleLinear().range([0,width]).domain([0,600]);
  yscale = d3.scaleLinear().range([0,height]).domain([0,450]);
  canvas.width = width;
  canvas.height = height;
  if (data) {
    loadPoints(data);
  }
}

var loadPoints = function(points) {
  data = points;
  list = [];
  pcount = data.length;
  for (i = 0; i < pcount; i++) {
    p = Object.create(particle);
    if (i === pcount-1) {
      p.x = p.ox = xscale(data[0][0]);
      p.y = p.oy = yscale(data[0][1]);
      p.nextx = xscale(data[0][0]);
      p.nexty = yscale(data[0][1]);
    } else {
      p.x = p.ox = xscale(data[i][0]);
      p.y = p.oy = yscale(data[i][1]);
      p.nextx = xscale(data[i+1][0]);
      p.nexty = yscale(data[i+1][1]);
    }
    list[i] = p;
  }
}

setScale();
window.addEventListener("resize", setScale);
    
// on each iteration, `step` alternates between calculating the positions of
// each particle and rendering the particles to the canvas. each point eases
// toward the next in the list until it comes within a distance equal to
// `proximity`, then it begins easing toward the next point. over time the points
// converge along a simpified curve – the algorithm acts as a point averaging
// routine.

var step = function() {
  if (tog = !tog) {
    
    for (i = 0; i < pcount; i++) {
      p = list[i];
      d = (dx = p.nextx - p.x) * dx + (dy = p.nexty - p.y) * dy;
      if (d < proximity && i < pcount-1) {
        // it's close enough, send it toward the next point
        next = list[i+1];
        p.nextx = next.ox;
        p.nexty = next.oy;
        p.ox = p.x;
        p.oy = p.y;
      }
      p.x += (p.nextx - p.x) * ease;
      p.y += (p.nexty - p.y) * ease;
    }

  } else {
    
    b = (a = context.createImageData(width, height)).data;
    // activate the pixel corresponding to each point
    for (i = 0; i < pcount; i++) {
      p = list[i];
      n = (~~p.x + (~~p.y * width)) * 4;
      quartets = [
        // coordinates for a plus sign, relative to `p`
        [n, n+1, n+2, n+3],
        [nn = n-(width*4), nn+1, nn+2, nn+3],
        [nn = n+(width*4), nn+1, nn+2, nn+3],
        [nn = n+4, nn+1, nn+2, nn+3],
        [nn = n-4, nn+1, nn+2, nn+3],
        [nn = n-(width*8), nn+1, nn+2, nn+3],
        [nn = n+(width*8), nn+1, nn+2, nn+3],
        [nn = n+8, nn+1, nn+2, nn+3],
        [nn = n-8, nn+1, nn+2, nn+3],
      ];
      for (q = 0; q < quartets.length; q++) {
        b[quartets[q][0]] = b[quartets[q][1]] = b[quartets[q][2]] = 0; // black
        b[quartets[q][3]] = 255;
      }
    }
    context.putImageData(a, 0, 0);
    
  }
  requestAnimationFrame(step);
}

d3.json("dave.json").get(function(error, d) {
  loadPoints(d);
  step();
})
// .on("progress", function() { console.log("progress"); })
// .on("load", function(json) { console.log("success!"); })
// .on("error", function(error) { console.log("failure!", error); })

var button = document.querySelector("a.button");
button.addEventListener("click", function(e) {
  e.preventDefault();
  document.querySelector('.resume').scrollIntoView({ 
    behavior: 'smooth' 
  });
})
