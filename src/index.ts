import { Context, mainLoop } from "./context";
import scenes from "./scenes/index";

// Get HTML elements from DOM
const canvas = document.getElementById("main-canvas") as HTMLCanvasElement;
const debugDisplay = document.getElementById("debug-display");

// Setup canvas size
const padding = 50;
canvas.width = window.innerWidth - padding;
canvas.height = window.innerHeight - padding;

// Create main context from HTML elements
const context = new Context(canvas, debugDisplay);

// Get scene selection from local storage
let selection = Math.min(
  parseInt(localStorage.getItem("scene.selection") || "0"),
  scenes.length - 1
);

// Add document listeners
document.addEventListener("keyup", (e) => {
  if (e.code == "KeyN" || e.code == "NumpadAdd") {
    selection = (selection + 1) % scenes.length;
    localStorage.setItem("scene.selection", `${selection}`);
    restartLoop();
  }

  if (e.code == "KeyP" || e.code == "NumpadSubtract") {
    selection = selection == 0 ? scenes.length - 1 : selection - 1;
    localStorage.setItem("scene.selection", `${selection}`);
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
