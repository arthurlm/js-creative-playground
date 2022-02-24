import { Context, mainLoop } from "./context";
import scene from "./scenes/scene3";

const canvas = document.getElementById("main-canvas") as HTMLCanvasElement;

const padding = 50;
canvas.width = window.innerWidth - padding;
canvas.height = window.innerHeight - padding;

const context = new Context(canvas);

mainLoop(context, scene);
