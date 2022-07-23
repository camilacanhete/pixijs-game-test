import { Application, IApplicationOptions } from "pixi.js";
import { SCENES } from "./consts";
import { Scene } from "../scenes/scene";
import { Boot } from "../scenes/boot";
import { Loading } from "../scenes/loading";
import { Ingame } from "../scenes/ingame";
import { End } from "../scenes/end";

export class Game extends Application {

    static GAME_WIDTH: number = window.innerWidth * window.devicePixelRatio;
    static GAME_HEIGHT: number = window.innerHeight * window.devicePixelRatio;

    private scene: Scene | null = null;

    constructor() {
        const options: IApplicationOptions = {
            backgroundColor: 0xF7F4DA,
            width: Game.GAME_WIDTH,
            height: Game.GAME_HEIGHT,
        };

        super(options);

        document.body.appendChild(this.view);
        this.bindEvents();
        this.onWindowResize();
        this.startScene();
    }

    bindEvents(): void {
        this.onWindowResize = this.onWindowResize.bind(this);
        window.addEventListener('resize', this.onWindowResize);
    }

    startScene(scene?: string): void {
        switch (scene) {
            case SCENES.LIST.LOADING:
                this.scene = new Loading(this);
                break;
            case SCENES.LIST.INGAME:
                this.scene = new Ingame(this);
                break;
            case SCENES.LIST.END:
                this.scene = new End(this);
                break;
            default:
                this.scene = new Boot(this);
        }
        this.scene.start();
    }

    onWindowResize(): void {
        const deviceRatio: number = window.devicePixelRatio;
        Game.GAME_WIDTH = window.innerWidth * deviceRatio;
        Game.GAME_HEIGHT = window.innerHeight * deviceRatio;
        this.renderer.resize(Game.GAME_WIDTH, Game.GAME_HEIGHT);
        // this.stage.scale.x = this.stage.scale.y = 1 / deviceRatio;
        if (this.scene !== null) this.scene.onWindowResize();
        console.log("Game: changing canvas to ", Game.GAME_WIDTH, Game.GAME_HEIGHT);
    }
}
