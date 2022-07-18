import { Loader } from "pixi.js";
import { Scene } from "./scene";
import { Const } from "../game/const";
import { Game } from "../game/game";
import { LoadingBar } from "../components/loading-bar";


export class Loading extends Scene {

    private loader: Loader;
    private loadingBar: LoadingBar | null;

    constructor(game: Game) {
        super(game);
        this.loader = new Loader("../../assets/");
    }

    start(): void {
        console.log("Loading: starting scene");
        super.start();
        this.bindEvents();
        this.createComponents();
        this.preload();
    }

    createComponents(): void {
        this.loadingBar = new LoadingBar(this);
    }

    bindEvents(): void {
        this.onLoadComplete = this.onLoadComplete.bind(this);
        this.onLoad = this.onLoad.bind(this);
        this.loader.onComplete.once(this.onLoadComplete); // called once when the queued resources all load.
        this.loader.onProgress.add(this.onLoad); // called once per loaded/errored file
    }

    removeEvents(): void {
        this.loader.onProgress.detachAll();
    }

    preload(): void {
        console.log("Loading: loading starting");
        this.loader.add(Const.ATLAS.INGAME, "/img/square_nodetails_outline.json");
        this.loader.load();
    }

    onLoad(): void {
        console.log(this.loader.progress);
    }

    onLoadComplete(): void {
        console.log("Loading: loading complete");
        //this.game.startScene(Const.SCENES.LOADING);
    }

    onWindowResize(): void {
        super.onWindowResize();
        this.loadingBar.onWindowResize();
    }
}