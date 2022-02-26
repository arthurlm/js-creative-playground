import { Context, mainLoop } from "./context";

// Get HTML elements from DOM
const canvas = document.getElementById("main-canvas") as HTMLCanvasElement;
const debugDisplay = document.getElementById("debug-display");

// Setup canvas size
const padding = 50;
canvas.width = window.innerWidth - padding;
canvas.height = window.innerHeight - padding;

// Create main context from HTML elements
const context = new Context(canvas, debugDisplay);

// Import all scenes and build vector from them
import scene1 from "./scenes/scene1";
import scene1b from "./scenes/scene1b";
import scene2 from "./scenes/scene2";
import scene3 from "./scenes/scene3";
import oscilatorDemo from "./scenes/oscillatorDemo";
import perlinDemo from "./scenes/perlinDemo";
import scene4 from "./scenes/scene4";
import scene5 from "./scenes/scene5";

const scenes = [
  scene1,
  scene1b,
  scene2,
  scene3,
  oscilatorDemo,
  perlinDemo,
  scene4,
  scene5,
];
let selection = scenes.length - 2;

// Add document listeners
document.addEventListener("keyup", (e) => {
  if (e.code == "KeyN" || e.code == "NumpadAdd") {
    selection = (selection + 1) % scenes.length;
    restartLoop();
  }

  if (e.code == "KeyP" || e.code == "NumpadSubtract") {
    selection = selection == 0 ? scenes.length - 1 : selection - 1;
    restartLoop();
  }

  if (e.code == "Delete") {
    clearActiveScene();
  }

  // console.log(`code: ${e.code}`);
});

function clearActiveScene() {
  context.reset();
  scenes[selection].clearEntities();
}

function restartLoop() {
  if (context.lastRequestFrameId) {
    cancelAnimationFrame(context.lastRequestFrameId);
  }

  clearActiveScene();
  mainLoop(context, scenes[selection], {
    debugEnabled: true,
  });
}

// Start main loop
mainLoop(context, scenes[selection], {
  debugEnabled: true,
});
