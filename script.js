window.focus;
let myCanvas = document.getElementById("röv");
let c = myCanvas.getContext("2d");

myCanvas.height = screen.height;
myCanvas.width = screen.width;

let shootingDirections = ["down", "right", "up", "left"];
let currentDirectionIndex = 0;

let x = 700;
let y = 300;

let dx = 5;
let dy = 5;

let dotDim = 5;

let gregHP = 3;
let gregDead = false;
let enemyHP = 5;
let enemyDead = false;

let enemyw = 60;
let enemyh = 76;

let canvash = screen.height;
let canvasw = screen.width;

let gregHeight = 75;
let gregWidth = 75;

const img = new Image();
img.src = "player.png";

const goblin = new Image();
goblin.src = "goblin.png";

let directions = {
  left: false,
  right: false,
  up: false,
  down: false,

  a: false,
  d: false,
  w: false,
  s: false,
};

let shoot = {
  left: false,
  right: false,
  up: false,
  down: false,
};

dotdx = 15;
dotdy = 15;

cooldown = false;

let dots = [];

let enemyDots = [];

let angle = 0;

let enemy = {
  x: 19,
  y: 200,
  dx: 4,
  shootCooldown: 0,
};

let reset = document.getElementById("boll");

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "a":
      directions.left = true;
      break;
    case "d":
      directions.right = true;
      break;
    case "w":
      directions.up = true;
      break;
    case "s":
      directions.down = true;
      break;
    case "ArrowUp":
      if (shoot.up == false && cooldown == false) {
        dots.push({ x: x + gregWidth / 2, y: y, dx: 0, dy: -dotdy });
        shoot.up = true;
        cooldown = true;
        angle = 0;
      }
      break;
    case "ArrowDown":
      if (shoot.down == false && cooldown == false) {
        dots.push({
          x: x + gregWidth / 2,
          y: y + gregHeight,
          dx: 0,
          dy: dotdy,
        });
        shoot.down = true;
        cooldown = true;
        angle = Math.PI;
      }
      break;
    case "ArrowLeft":
      if (shoot.left == false && cooldown == false) {
        dots.push({ x: x, y: y + gregHeight / 2, dx: -dotdx, dy: 0 });
        shoot.left = true;
        cooldown = true;
        angle = -Math.PI / 2;
      }
      break;
    case "ArrowRight":
      if (shoot.right == false && cooldown == false) {
        dots.push({
          x: x + gregWidth,
          y: y + gregHeight / 2,
          dx: dotdx,
          dy: 0,
        });
        shoot.right = true;
        cooldown = true;
        angle = -1.5 * Math.PI;
      }
      break;
    default:
      break;
  }
});

document.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "a":
      directions.left = false;
      break;
    case "d":
      directions.right = false;
      break;
    case "w":
      directions.up = false;
      break;
    case "s":
      directions.down = false;
      break;
    case "ArrowUp":
      shoot.up = false;
      break;
    case "ArrowDown":
      shoot.down = false;
      break;
    case "ArrowLeft":
      shoot.left = false;
      break;
    case "ArrowRight":
      shoot.right = false;
      break;
    default:
      break;
  }
});

setInterval(function () {
  cooldown = false;
}, 50);

function drawRotated() {
  // save the unrotated context of the canvas so it can be restored later
  // the alternative is to untranslate & unrotate after drawing
  c.save();

  // move to the center of the canvas
  c.translate(x + gregWidth / 2, y + gregHeight / 2);

  // rotate the canvas to the specified degrees
  c.rotate(angle);

  // draw the image
  // since the context is rotated, the image will be rotated also
  c.drawImage(img, -gregHeight / 2, -gregWidth / 2);

  //restore the unrotated context
  c.restore();
}

function checkDots(dots, type) {
  // update dot positions and draw them
  dots.forEach((dot, index) => {
    dot.x += dot.dx;
    dot.y += dot.dy;
    c.beginPath();
    c.arc(dot.x, dot.y, dotDim, 0, Math.PI * 2);
    c.fillStyle = "red";
    c.fill();

    // remove dots that go out of bounds
    if (dot.x < 0 || dot.y < 0 || dot.x > canvasw || dot.y > canvash) {
      if (type == "greg") {
        dots.splice(index, 1);
      } else {
        enemyDots.splice(index, 1);
      }
    }
    if (type == "greg") {
      if (
        dot.x < enemy.x + enemyw &&
        dot.x + dotDim > enemy.x &&
        dot.y < enemy.y + enemyh &&
        dot.y + dotDim > enemy.y
      ) {
        dots.splice(index, 1);
        enemyHP -= 1;
        console.log("Enemy HP: " + enemyHP);
      } else if (enemyHP == 0) {
        enemyDead == true;
      }
    } else {
      if (
        dot.x < x + gregWidth &&
        dot.x + dotDim > x &&
        dot.y < y + gregHeight &&
        dot.y + dotDim > y
      ) {
        dots.splice(index, 1);
        gregHP -= 1;
        console.log("Player HP: " + gregHP);
      } else if (gregHP === 0) {
        gregDead = true;
      }
    }
  });
}

function drawEnemy() {
  c.beginPath();
  c.drawImage(goblin, enemy.x, enemy.y, enemyw, enemyh);
  c.fill();
}

function updateEnemy() {
  enemy.x += enemy.dx;

  //change direction when hit wall
  if (enemy.x + enemyw > canvasw || enemy.x < 0) {
    enemy.dx = -enemy.dx;
  }

  // Check if enemy is defeated
  if (enemyHP === 0) {
    // Reset enemy position and HP
    enemy.x = 19;
    enemy.y = 200;
    enemyHP = 5;
  }

  //shoot dots in the direction
  if (enemy.shootCooldown === 0) {
    const currentDirection = shootingDirections[currentDirectionIndex];
    //
    if (currentDirection === "down") {
      enemyDots.push({
        x: enemy.x + 30,
        y: enemy.y + 20,
        dx: 0,
        dy: dotdy,
      });
    } else if (currentDirection === "right") {
      enemyDots.push({
        x: enemy.x + 30,
        y: enemy.y + 20,
        dx: dotdx,
        dy: 0,
      });
    } else if (currentDirection === "up") {
      enemyDots.push({
        x: enemy.x + 30,
        y: enemy.y + 20,
        dx: 0,
        dy: -dotdy,
      });
    } else if (currentDirection === "left") {
      enemyDots.push({
        x: enemy.x + 30,
        y: enemy.y + 20,
        dx: -dotdx,
        dy: 0,
      });
    }

    // Update the current direction index
    currentDirectionIndex =
      (currentDirectionIndex + 1) % shootingDirections.length;

    enemy.shootCooldown = 20;
  } else {
    enemy.shootCooldown--;
  }
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);

  if (gregDead === true) {
    reset.style.display = "block";
  } else {
    checkDots(dots, "greg");
    checkDots(enemyDots, "enemy");

    drawRotated();

    // Draw and update enemy
    drawEnemy();
    updateEnemy();

    // Move player
    // Move diagonally by checking if 2 keys are pressed at same time. If so the position updates with the correct angle
    if (directions.right && directions.down) {
      x += dx / Math.sqrt(2);
      y += dy / Math.sqrt(2);
      angle = -1.25 * Math.PI;
    } else if (directions.right && directions.up) {
      x += dx / Math.sqrt(2);
      y -= dy / Math.sqrt(2);
      angle = -1.75 * Math.PI;
    } else if (directions.left && directions.down) {
      x -= dx / Math.sqrt(2);
      y += dy / Math.sqrt(2);
      angle = (-3 * Math.PI) / 4;
    } else if (directions.left && directions.up) {
      x -= dx / Math.sqrt(2);
      y -= dy / Math.sqrt(2);
      angle = -Math.PI / 4;
    }
    // Move not diagonally by checking which key is being pressed. Then update position with appropriate angle.
    else if (directions.right) {
      x += dx;
      angle = -1.5 * Math.PI;
    } else if (directions.left) {
      x -= dx;
      angle = -Math.PI / 2;
    } else if (directions.up) {
      y -= dy;
      angle = 0;
    } else if (directions.down) {
      y += dy;
      angle = Math.PI;
    }

    // Stop the player from moving out of bounds by checking if the x/y of the player is greater than canvasw/canvash or less than 0.
    //If so, the x/y is set to the canvash/canvasw minus the height/width of the player.
    if (y < 0) {
      y = 0;
    } else if (x < 0) {
      x = 0;
    } else if (y > canvash - gregHeight) {
      y = canvash - gregHeight;
    } else if (x > canvasw - gregWidth) {
      x = canvasw - gregWidth;
    }
  }
}
//---------- START GAME ----------//
img.onload = animate();
reset.addEventListener("click", () => {
  location.reload();
});
