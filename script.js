function resizeCanvas() {
  const screenElement = document.querySelector(".screen");
  const screenWidth = screenElement.offsetWidth;
  const screenHeight = screenElement.offsetHeight;
  canvas.style.width = `${screenWidth}px`;
  canvas.style.height = `${screenHeight}px`;
  canvas.style.transformOrigin = "top left";
  canvas.style.transform = `scale(${screenWidth / 320})`;
}

let proposalClicked = false;

window.addEventListener("resize", resizeCanvas);
window.addEventListener("orientationchange", resizeCanvas);

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 320;
canvas.height = 320;
resizeCanvas();

const game = {
  kitty: {
    x: 144,
    y: 240,
    size: 32,
    speedX: 0,
    collected: 0,
    animation: "idle",
    frame: 0,
    baseY: 240,
  },
  cookies: [],
  playing: true,
  message: "",
  messageTimer: null,
};

let eatTimer = 0;

// Draw kitty
function drawKitty() {
  game.kitty.frame += 0.15; // Speed up animation
  const f = Math.floor(game.kitty.frame) % 4;

  // Walking animation offset
  let yOffset = 0;
  if (game.kitty.animation.includes("walk")) {
    yOffset = Math.sin(game.kitty.frame) * 2;
  }
  ctx.save();
  ctx.translate(0, yOffset);

  // Base body
  ctx.fillStyle = "#FFC0CB";
  ctx.fillRect(game.kitty.x, game.kitty.baseY, 32, 32);

  // Ears with bounce
  ctx.fillStyle = "#FF69B4";
  const earBounce = Math.sin(game.kitty.frame * 0.5) * 2;
  ctx.fillRect(game.kitty.x + 4, game.kitty.baseY + earBounce, 6, 6);
  ctx.fillRect(game.kitty.x + 22, game.kitty.baseY + earBounce, 6, 6);

  // Eyes with blink
  if (f === 3) {
    // Blink frame
    ctx.fillStyle = "#FF69B4";
    ctx.fillRect(game.kitty.x + 8, game.kitty.y + 12, 4, 2);
    ctx.fillRect(game.kitty.x + 20, game.kitty.y + 12, 4, 2);
  } else {
    // Normal eyes
    ctx.fillStyle = "#FFF";
    ctx.fillRect(game.kitty.x + 8, game.kitty.y + 10, 4, 4);
    ctx.fillRect(game.kitty.x + 20, game.kitty.y + 10, 4, 4);

    // Pupils that move based on direction
    ctx.fillStyle = "#000";
    const pupilOffset =
      game.kitty.speedX > 0 ? 1 : game.kitty.speedX < 0 ? -1 : 0;
    ctx.fillRect(game.kitty.x + 9 + pupilOffset, game.kitty.y + 11, 2, 2);
    ctx.fillRect(game.kitty.x + 21 + pupilOffset, game.kitty.y + 11, 2, 2);
  }

  // Mouth based on state
  if (game.kitty.animation === "eat") {
    // Big chomping mouth
    ctx.fillStyle = "#FF1493";
    ctx.fillRect(game.kitty.x + 12, game.kitty.y + 18, 8, f % 2 ? 4 : 6);
  } else if (game.kitty.animation === "sad") {
    // Sad mouth
    ctx.fillStyle = "#FF1493";
    ctx.beginPath();
    ctx.arc(game.kitty.x + 16, game.kitty.y + 24, 4, Math.PI, 0);
    ctx.fill();
  } else if (game.kitty.animation === "excited") {
    // Wide grin
    ctx.fillStyle = "#FF1493";
    ctx.beginPath();
    // Big arc for mouth
    ctx.arc(game.kitty.x + 16, game.kitty.y + 22, 6, 0, Math.PI, false);
    ctx.fill();
  }
  ctx.fillStyle = "#FFC0CB";
  ctx.fillRect(game.kitty.x, game.kitty.baseY, 32, 32);

  // Ears with bounce
  ctx.fillStyle = "#FF69B4";
  const earBounce2 = Math.sin(game.kitty.frame * 0.5) * 2;
  ctx.fillRect(game.kitty.x + 4, game.kitty.baseY + earBounce2, 6, 6);
  ctx.fillRect(game.kitty.x + 22, game.kitty.baseY + earBounce2, 6, 6);

  // Eyes with blink
  if (f === 3) {
    // Blink frame
    ctx.fillStyle = "#FF69B4";
    ctx.fillRect(game.kitty.x + 8, game.kitty.baseY + 12, 4, 2);
    ctx.fillRect(game.kitty.x + 20, game.kitty.baseY + 12, 4, 2);
  } else {
    // Normal eyes
    ctx.fillStyle = "#FFF";
    ctx.fillRect(game.kitty.x + 8, game.kitty.baseY + 10, 4, 4);
    ctx.fillRect(game.kitty.x + 20, game.kitty.baseY + 10, 4, 4);

    // Pupils that move based on direction
    ctx.fillStyle = "#000";
    const pupilOffset =
      game.kitty.speedX > 0 ? 1 : game.kitty.speedX < 0 ? -1 : 0;
    ctx.fillRect(game.kitty.x + 9 + pupilOffset, game.kitty.baseY + 11, 2, 2);
    ctx.fillRect(game.kitty.x + 21 + pupilOffset, game.kitty.baseY + 11, 2, 2);
  }

  // Mouth based on state
  if (game.kitty.animation === "eat") {
    // Big chomping mouth
    ctx.fillStyle = "#FF1493";
    ctx.fillRect(game.kitty.x + 12, game.kitty.baseY + 18, 8, f % 2 ? 4 : 6);
  } else if (game.kitty.animation === "sad") {
    // Sad mouth
    ctx.fillStyle = "#FF1493";
    ctx.beginPath();
    ctx.arc(game.kitty.x + 16, game.kitty.baseY + 24, 4, Math.PI, 0);
    ctx.fill();
  } else if (game.kitty.animation === "excited") {
    // Wide grin
    ctx.fillStyle = "#FF1493";
    ctx.beginPath();
    // Big arc for mouth
    ctx.arc(game.kitty.x + 16, game.kitty.baseY + 22, 6, 0, Math.PI, false);
    ctx.fill();
  } else {
    // Happy smile
    ctx.fillStyle = "#FF1493";
    ctx.fillRect(game.kitty.x + 12, game.kitty.baseY + 18, 8, 2);
    ctx.fillRect(game.kitty.x + 12, game.kitty.baseY + 16, 2, 2);
    ctx.fillRect(game.kitty.x + 18, game.kitty.baseY + 16, 2, 2);
  }

  ctx.restore();
}

// Spawn cookies
function spawnCookie() {
  if (game.cookies.length < 5) {
    game.cookies.push({
      x: Math.random() * (canvas.width - 20),
      y: -20,
      size: 20,
    });
  }
}

// Draw cookie
function drawCookie(cookie) {
  ctx.fillStyle = "#D2691E";
  ctx.beginPath();
  ctx.arc(
    cookie.x + cookie.size / 2,
    cookie.y + cookie.size / 2,
    cookie.size / 2,
    0,
    Math.PI * 2
  );
  ctx.fill();

  // Chocolate chips
  ctx.fillStyle = "#3D2B1F";
  for (let i = 0; i < 3; i++) {
    const chipX = cookie.x + 4 + Math.random() * 12;
    const chipY = cookie.y + 4 + Math.random() * 12;
    ctx.fillRect(chipX, chipY, 2, 2);
  }
}

function updateGame() {
  if (!game.playing) {
    return;
  }

  // Move kitty
  game.kitty.x += game.kitty.speedX;
  game.kitty.x = Math.max(0, Math.min(canvas.width - 32, game.kitty.x));

  // Move cookies
  game.cookies.forEach((c, idx) => {
    c.y += 2;
    // Collision check
    if (
      c.x + c.size > game.kitty.x &&
      c.x < game.kitty.x + 32 &&
      c.y + c.size > game.kitty.y &&
      c.y < game.kitty.y + 32
    ) {
      game.cookies.splice(idx, 1);
      game.kitty.collected++;
      if (game.kitty.collected >= 10) gameWin();
      game.kitty.animation = "eat";
      eatTimer = 30; // short duration
    }
    if (c.y > canvas.height) game.cookies.splice(idx, 1);
  });

  if (game.kitty.animation === "eat") {
    eatTimer--;
    if (eatTimer <= 0) {
      game.kitty.animation = "idle";
    }
  }
}

function draw() {
  // Background
  ctx.fillStyle = "#FFDAB9";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw cookies
  game.cookies.forEach((cookie) => drawCookie(cookie));

  // Draw kitty
  drawKitty();

  // HUD
  ctx.fillStyle = "#FF1493";
  ctx.font = "16px monospace";
  ctx.fillText(`Cookies: ${game.kitty.collected}/10`, 10, 20);

  // Message
  if (game.message) {
    ctx.textAlign = "center";
    ctx.fillText(game.message, canvas.width / 2, canvas.height - 10);
  }
}

const screenEl = document.querySelector(".screen");
const endOverlay = document.createElement("div");
endOverlay.className = "endOverlay";
screenEl.appendChild(endOverlay);

function animateKittyHearts() {
  ctx.fillStyle = "#FF69B4";
  for (let i = 0; i < 6; i++) {
    const time = game.kitty.frame * 0.1 + i;
    const x = game.kitty.x + Math.cos(time) * 20 + 16;
    const y = game.kitty.y - 20 - Math.sin(time) * 10;

    // Smaller, cuter pixel hearts
    ctx.fillRect(x + 1, y, 2, 2);
    ctx.fillRect(x, y + 1, 4, 2);
    ctx.fillRect(x + 1, y + 3, 2, 1);
  }
}

function animateKittyTears() {
  ctx.fillStyle = "#ADD8E6";
  for (let i = 0; i < 4; i++) {
    const rx = game.kitty.x + 9 + (i % 2) * 12;
    const ry = game.kitty.y + 15 + i * 3;
    ctx.beginPath();
    ctx.arc(rx, ry, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

const sadMessages = [
  "My heart just dropped like a bug in my code...",
  "Game Over before it even began...",
  "Looks like I'll play single-player...",
  "Task failed successfully... 💔",
  "Error 404: Love not found...",
];

function drawEndKitty(isProposal = true) {
  // Base kitty
  ctx.fillStyle = "#FFC0CB";
  ctx.fillRect(game.kitty.x, game.kitty.y, 32, 32);

  // Eyes
  if (isProposal) {
    // Happy sparkly eyes
    ctx.fillStyle = "#FFF";
    ctx.fillRect(game.kitty.x + 8, game.kitty.y + 10, 6, 6);
    ctx.fillRect(game.kitty.x + 18, game.kitty.y + 10, 6, 6);

    // Love-struck pupils
    ctx.fillStyle = "#FF1493";
    ctx.fillRect(game.kitty.x + 10, game.kitty.y + 12, 2, 2);
    ctx.fillRect(game.kitty.x + 20, game.kitty.y + 12, 2, 2);

    // Happy smile
    ctx.fillRect(game.kitty.x + 12, game.kitty.y + 18, 8, 2);
    ctx.fillRect(game.kitty.x + 12, game.kitty.y + 16, 2, 2);
    ctx.fillRect(game.kitty.x + 18, game.kitty.y + 16, 2, 2);
  } else {
    // Sad eyes
    ctx.fillStyle = "#FFF";
    ctx.fillRect(game.kitty.x + 8, game.kitty.y + 12, 6, 4);
    ctx.fillRect(game.kitty.x + 18, game.kitty.y + 12, 6, 4);

    // Sad pupils
    ctx.fillStyle = "#000";
    ctx.fillRect(game.kitty.x + 10, game.kitty.y + 13, 2, 2);
    ctx.fillRect(game.kitty.x + 20, game.kitty.y + 13, 2, 2);

    // Sad mouth
    ctx.fillStyle = "#FF1493";
    ctx.beginPath();
    ctx.arc(game.kitty.x + 16, game.kitty.y + 24, 4, Math.PI, 0);
    ctx.fill();
  }
}

function animateEndHearts() {
  ctx.fillStyle = "#FF69B4";
  for (let i = 0; i < 8; i++) {
    const time = game.kitty.frame * 0.1 + i;
    const radius = 20 + Math.sin(time) * 5;
    const x = game.kitty.x + 16 + Math.cos(time) * radius;
    const y = game.kitty.y - 10 + Math.sin(time * 2) * radius * 0.3;

    // Pixel heart
    ctx.fillRect(x, y, 2, 2);
    ctx.fillRect(x - 1, y + 2, 4, 2);
    ctx.fillRect(x, y + 4, 2, 1);
  }
}

const proposalMessages = [
  { msg: "Will you be my Valentine?", yes: "YES!", no: "no..." },
  { msg: "Would you share cookies with me?", yes: "Always!", no: "never" },
  { msg: "Can I be your player 2?", yes: "PLAY!", no: "quit" },
  { msg: "Want to be my purr-fect match?", yes: "Meow!", no: "nah" },
  { msg: "Stay and play forever?", yes: "YES!", no: "exit" },
];

function gameWin() {
  game.playing = false;
  game.kitty.animation = "idle"; 
  const proposal =
    proposalMessages[Math.floor(Math.random() * proposalMessages.length)];

    //make cookie disappear
    game.cookies = [];

  function animate() {
    if (game.playing) return; 

    ctx.fillStyle = "#FFDAB9";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawEndKitty(true);
    animateEndHearts();
    game.kitty.frame += 0.1;
    if (game.kitty.animation === "eat") {
      game.kitty.animation = "idle";
    }

    requestAnimationFrame(animate);
  }

  animate();
  endOverlay.style.visibility = "visible";
  endOverlay.innerHTML = `
    <p>${proposal.msg}</p>
    <div class="options">
      <div class="option" id="optionYes">${proposal.yes}</div>
      <div class="option" id="optionNo">${proposal.no}</div>
    </div>
  `;

  document.getElementById("optionYes").onclick = () => handleYes();
  document.getElementById("optionNo").onclick = () => handleNo();
}

// Random flirty lines
const $lines = [
  "Let's make this game a co-op!",
  "You're the cheat code to my heart!",
  "You've got the high score in my heart!",
  "We're a perfect pair of pixels!",
  "You make my heart go 8-bit!",
  "Player 2 has joined my heart!",
  "You're my favorite power-up!",
];

function handleYes() {
  if (proposalClicked) return;
  const line = flirtyLines[Math.floor(Math.random() * $lines.length)];
  game.kitty.animation = "excited";
  endOverlay.innerHTML = `<p>${line}</p>`;
  proposalClicked = true;
  setTimeout(() => {
    endOverlay.innerHTML += `<div class="option" id="resetButton">Reset</div>`;
    document.getElementById("resetButton").onclick = () => location.reload();
  }, 3000);
}

function handleNo() {
  if (proposalClicked) return;
  const sadMessage =
    sadMessages[Math.floor(Math.random() * sadMessages.length)];
  game.kitty.animation = "sad";
  endOverlay.innerHTML = `<p>😿</p><p>${sadMessage}</p>`;
  proposalClicked = true;
  setTimeout(() => {
    endOverlay.innerHTML += `<div class="option" id="resetButton">Reset</div>`;
    document.getElementById("resetButton").onclick = () => location.reload();
  }, 3000);
}

function showMessage(msg, dur = 2000) {
  game.message = msg;
  if (game.messageTimer) clearTimeout(game.messageTimer);
  game.messageTimer = setTimeout(() => {
    game.message = "";
  }, dur);
}

const originalDraw = draw;
draw = function () {
  originalDraw();
  if (!game.playing) {
    animateKittyHearts(); 
  }
};

function gameLoop() {
  updateGame();
  draw();
  requestAnimationFrame(gameLoop);
}

// Keyboard stoff
document.addEventListener("keydown", (e) => {
  if (!game.playing) {
    if (e.key.toLowerCase() === "a") {
      showMessage("Yes! Meow! ❤️");
      setTimeout(() => location.reload(), 1500);
    } else if (e.key.toLowerCase() === "b") {
      showMessage("No? Aww... 😿");
      setTimeout(() => location.reload(), 1500);
    }
    return;
  }
  if (e.key === "ArrowLeft") {
    game.kitty.speedX = -4;
    game.kitty.animation = "walkLeft";
  }
  if (e.key === "ArrowRight") {
    game.kitty.speedX = 4;
    game.kitty.animation = "walkRight";
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    game.kitty.speedX = 0;
    if (game.kitty.animation.includes("walk")) {
      game.kitty.animation = "idle";
    }
  }
});

// D-Pad
const dpadCenter = document.querySelector(".dpad-center");
const dpadUp = document.querySelector(".dpad-up");
const dpadDown = document.querySelector(".dpad-down");
const dpadLeft = document.querySelector(".dpad-left");
const dpadRight = document.querySelector(".dpad-right");

[dpadUp, dpadDown, dpadLeft, dpadRight, dpadCenter].forEach((el) => {
  el.addEventListener("mousedown", (ev) => {
    if (!game.playing) return;
    if (el === dpadLeft) game.kitty.speedX = -4;
    else if (el === dpadRight) game.kitty.speedX = 4;
  });
  el.addEventListener("mouseup", () => {
    game.kitty.speedX = 0;
  });

  // Touch support
  el.addEventListener("touchstart", (ev) => {
    if (!game.playing) return;
    if (el === dpadLeft) game.kitty.speedX = -4;
    else if (el === dpadRight) game.kitty.speedX = 4;
  });
});

// Buttons
const buttons = document.querySelectorAll(".button");
buttons.forEach((btn, i) => {
  btn.addEventListener("mousedown", () => {
    btn.style.transform = "scale(0.95)";
    if (!game.playing) {
      if (i === 0) {
        showMessage("Yes! Meow! ❤️");
        handleYes();
      } else {
        showMessage("No? Aww... 😿");
        handleNo();
      }
    }
  });
  btn.addEventListener("mouseup", () => {
    btn.style.transform = "scale(1)";
  });

  // Touch support
  btn.addEventListener("touchstart", () => {
    btn.style.transform = "scale(0.95)";
    if (!game.playing) {
      if (i === 0) {
        showMessage("Yes! Meow! ❤️");
        handleYes();
      } else {
        showMessage("No? Aww... 😿");
        handleNo();
      }
    }
  });
});

// Start
setInterval(spawnCookie, 1000);
gameLoop();
