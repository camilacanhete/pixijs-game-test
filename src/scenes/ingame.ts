import { Game } from "../game/game";
import { Scene } from "./scene";
import { Board } from "../components/board";

export class Ingame extends Scene {

    private board: Board;

    constructor(game: Game) {
        super(game);

        this.board = new Board(this);
    }

    start(): void {
        console.log("Ingame: starting scene");
        super.start();
        this.bindEvents();
    }

    bindEvents(): void {
    }

    removeEvents(): void {
    }
}