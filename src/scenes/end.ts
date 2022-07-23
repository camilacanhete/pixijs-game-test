
import { Game } from "../game/game";
import { Scene } from "./scene";

export class End extends Scene {

    constructor(game: Game) {
        super(game);
    }

    start(): void {
        console.log("End: starting scene");
        super.start();
    }
}