import { Game } from "../game/game";
import { Scene } from "./scene";
import { Board } from "../components/board";
import { HUD } from "../components/hud";
import { Timer } from "../components/timer";
import { GAME } from "../game/consts";

export class Ingame extends Scene {

    static TIME_IN_MINUTES: number = 2;

    private board: Board;
    private hudPoints: HUD;
    private hudTime: HUD;
    private timer: Timer;

    constructor(game: Game) {
        super(game);

        this.board = new Board(this);
        this.hudPoints = new HUD(this, HUD.ORIENTATION.LEFT);
        this.hudTime = new HUD(this, HUD.ORIENTATION.RIGHT, Ingame.TIME_IN_MINUTES.toString() + ":00");
        this.timer = new Timer();
    }

    start(): void {
        console.log("Ingame: starting scene");
        super.start();
        this.bindEvents();
        this.timer.start(Ingame.TIME_IN_MINUTES * 60000);
    }

    bindEvents(): void {
        this.onTimerCount = this.onTimerCount.bind(this);
        window.addEventListener(GAME.EVENTS.TIMER_COUNT, this.onTimerCount);
    }

    removeEvents(): void {
        window.removeEventListener(GAME.EVENTS.TIMER_COUNT, this.onTimerCount);
    }

    onTimerCount(e: Event | CustomEvent): void {
        const value: string = (e as CustomEvent).detail;
        this.hudTime.setText(value);
    }

    onWindowResize(): void {
        super.onWindowResize();
        this.hudPoints.onWindowResize();
        this.hudTime.onWindowResize();
        this.board.onWindowResize();
    }
}