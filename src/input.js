// VARIABLES

const keyBindings = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
  KeyA: 'left',
  KeyD: 'right',
  KeyW: 'up',
  KeyS: 'down',
  KeyX: 'jump',
  KeyK: 'jump',
  Space: 'jump',
  KeyZ: 'fire',
  KeyJ: 'fire',
  Enter: 'start',
  ShiftRight: 'select',
  ShiftLeft: 'select',
};

const buttonNames = ['left', 'right', 'up', 'down', 'jump', 'fire', 'start', 'select'];
const keyboardHeld = {};
const keyboardLatch = {};
const input = { held: {}, pressed: {}, released: {} };
let previousHeld = {};

// FUNCTIONS

function readGamepadButtons() {
  const result = {};
  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  for (const pad of pads) {
    if (!pad) continue;
    const axisX = pad.axes[0] || 0;
    const axisY = pad.axes[1] || 0;
    const pressed = index => pad.buttons[index] && pad.buttons[index].pressed;
    if (axisX < -0.5 || pressed(14)) result.left = true;
    if (axisX > 0.5 || pressed(15)) result.right = true;
    if (axisY < -0.5 || pressed(12)) result.up = true;
    if (axisY > 0.5 || pressed(13)) result.down = true;
    if (pressed(0)) result.jump = true;
    if (pressed(1) || pressed(2)) result.fire = true;
    if (pressed(9)) result.start = true;
    if (pressed(8)) result.select = true;
  }
  return result;
}

function updateInput() {
  const pad = readGamepadButtons();
  for (const name of buttonNames) {
    const isHeld = !!(keyboardHeld[name] || keyboardLatch[name] || pad[name]);
    keyboardLatch[name] = false;
    input.held[name] = isHeld;
    input.pressed[name] = isHeld && !previousHeld[name];
    input.released[name] = !isHeld && previousHeld[name];
  }
  previousHeld = { ...input.held };
}

// INITIALIZATION

window.addEventListener('keydown', event => {
  const name = keyBindings[event.code];
  if (!name) return;
  event.preventDefault();
  keyboardHeld[name] = true;
  if (!event.repeat) keyboardLatch[name] = true;
});

window.addEventListener('keyup', event => {
  const name = keyBindings[event.code];
  if (!name) return;
  event.preventDefault();
  keyboardHeld[name] = false;
});

window.addEventListener('blur', () => {
  for (const name in keyboardHeld) keyboardHeld[name] = false;
});
