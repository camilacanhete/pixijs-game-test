import { Loader } from "pixi.js";
import { Scene } from "./scene";
import { RESOURCES } from "../game/consts";
import { Game } from "../game/game";
import { LoadingBar } from "../components/loading-bar";
import { BtnPlay } from "../components/btn-play";

export class Loading extends Scene {

    private loader: Loader;
    private loadingBar: LoadingBar;
    private btnPlay: BtnPlay;

    constructor(game: Game) {
        super(game);
        this.loader = new Loader("../../assets/");
        this.loadingBar = new LoadingBar(this);
        this.btnPlay = new BtnPlay(this);
    }

    start(): void {
        console.log("Loading: starting scene");
        super.start();
        this.bindEvents();
        this.createComponents();
        this.preload();
    }

    bindEvents(): void {
        this.onLoadComplete = this.onLoadComplete.bind(this);
        this.onLoad = this.onLoad.bind(this);
        this.loader.onComplete.once(this.onLoadComplete); // called once when the queued resources all load.
        this.loader.onProgress.add(this.onLoad); // called once per loaded/errored file
    }

    removeEvents(): void {
        this.loader.onProgress.detachAll();
        this.loadingBar.removeEvents();
        this.btnPlay.removeEvents();
    }

    preload(): void {
        console.log("Loading: loading starting");
        this.loader.add(RESOURCES.ATLAS.INGAME, "/img/gameAtlas.json");
        this.loader.load();
    }

    onLoad(): void {
        //console.log(this.loader.progress);
        this.loadingBar.updateProgress(this.loader.progress);
    }

    onLoadComplete(): void {
        console.log("Loading: loading complete");
        this.btnPlay.setActiveState(true);
    }

    onWindowResize(): void {
        super.onWindowResize();
        this.loadingBar.onWindowResize();
        this.btnPlay.onWindowResize();
    }
}