import { Loader } from "pixi.js";
import { Const } from "../game/const";
import { Game } from "../game/game";
import { Scene } from "./scene";

export class Boot extends Scene {

    private loader: Loader;
    private domElement: HTMLElement | null;

    constructor(game: Game) {
        super(game);
        this.loader = new Loader("../../assets/");
        this.domElement = document.getElementById("loading");
    }

    start(): void {
        console.log("Boot: starting scene");
        super.start();
        this.bindEvents();
        this.preload();
    }

    bindEvents(): void {
        this.onLoadComplete = this.onLoadComplete.bind(this);
        this.loader.onComplete.once(this.onLoadComplete); // called once when the queued resources all load.
    }

    removeEvents(): void {
        console.log("Boot: removing events");
        this.loader.onProgress.detachAll();
    }

    preload(): void {
        console.log("Boot: loading starting");
        this.loader.add(Const.ATLAS.LOADING, "/img/loadingAtlas.json");
        this.loader.load();
    }

    onLoadComplete(): void {
        console.log("Boot: loading complete");
        if (this.domElement !== null) this.domElement.remove();
        this.game.startScene(Const.SCENES.LOADING);
    }
}