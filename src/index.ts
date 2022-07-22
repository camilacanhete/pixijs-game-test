import { Application, Loader, Texture, AnimatedSprite, Rectangle } from "pixi.js";
import { Game } from "./game/game";
import "./styles/index.scss"; //csantos: import styles

declare const VERSION: string;

const gameWidth = 800;
const gameHeight = 600;

const app = new Application({
    backgroundColor: 0xd3d3d3,
    width: gameWidth,
    height: gameHeight,
});

console.log(`Welcome from pixi-typescript-boilerplate ${VERSION}`);

window.onload = async (): Promise<void> => {
    (window as any).__game = new Game();
};