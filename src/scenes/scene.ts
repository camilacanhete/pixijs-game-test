import { Stage } from "@pixi/layers";
import { Game } from "../game/game";

export class Scene extends Stage {

    public screenWidth: number = 0;
    public screenHeight: number = 0;

    protected game: Game;
    protected isScene: boolean = true;

    constructor(game: Game) {
        super();
        this.game = game;
        this.screenWidth = Game.GAME_WIDTH;
        this.screenHeight = Game.GAME_HEIGHT;
        console.log(this.screenWidth, this.screenHeight);
    }

    start(): void {
        if ((this.game.stage as Scene).isScene) {
            (this.game.stage as Scene).stop();
        }
        this.game.stage = this;
    }

    stop(): void {
        this.removeEvents();
    }

    createComponents(): void {

    }

    bindEvents(): void {

    }

    removeEvents(): void {

    }

    changeScene(scene: string): void {
        this.game.startScene(scene);
    }

    onWindowResize(): void {
        this.screenWidth = Game.GAME_WIDTH;
        this.screenHeight = Game.GAME_HEIGHT;
        console.log(this.screenWidth, this.screenHeight);
    }
}