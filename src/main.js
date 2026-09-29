// VARIABLES

const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');
const stepSeconds = 1 / 60;
let lastTime = 0;
let accumulator = 0;

// FUNCTIONS

function resizeCanvas() {
  const scale = Math.max(1, Math.floor(Math.min(window.innerWidth / screenWidth, window.innerHeight / screenHeight)));
  canvas.style.width = screenWidth * scale + 'px';
  canvas.style.height = screenHeight * scale + 'px';
}

function frame(time) {
  const elapsed = Math.min(0.1, (time - lastTime) / 1000 || 0);
  lastTime = time;
  accumulator += elapsed;
  let steps = 0;
  while (accumulator >= stepSeconds && steps < 4) {
    updateInput();
    updateGame();
    accumulator -= stepSeconds;
    steps++;
  }
  if (steps === 4) accumulator = 0;
  drawGame(ctx);
  requestAnimationFrame(frame);
}

// INITIALIZATION

defineAllSprites();
makeStars();
ctx.imageSmoothingEnabled = false;
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
window.addEventListener('keydown', event => {
  initAudio();
  if (event.code === 'KeyM') toggleMute();
});
window.addEventListener('pointerdown', () => initAudio());
requestAnimationFrame(frame);
