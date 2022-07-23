import { Game } from "../game/game";
import { Scene } from "./scene";
import { Board } from "../components/board";
import { HUD } from "../components/hud";
import { Timer } from "../components/timer";
import { GAME, SCENES } from "../game/consts";

export class Ingame extends Scene {

    static TIME_IN_MINUTES: number = 1;
    static POINTS_PER_TILE: number = 100;
    static POINTS_GOAL: number = 5000;

    private board: Board;
    private hudPoints: HUD;
    private hudTime: HUD;
    private timer: Timer;
    private score: number = 0;

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
        this.onTimerEnd = this.onTimerEnd.bind(this);
        this.onScoreChange = this.onScoreChange.bind(this);
        window.addEventListener(GAME.EVENTS.TIMER_COUNT, this.onTimerCount);
        window.addEventListener(GAME.EVENTS.TIMER_END, this.onTimerEnd);
        window.addEventListener(GAME.EVENTS.SCORE_CHANGE, this.onScoreChange);
    }

    removeEvents(): void {
        window.removeEventListener(GAME.EVENTS.TIMER_COUNT, this.onTimerCount);
        this.board.removeEvents();
    }

    gameOver(): void {
        this.changeScene(SCENES.LIST.END);
    }

    onTimerCount(e: Event | CustomEvent): void {
        const value: string = (e as CustomEvent).detail;
        this.hudTime.setText(value);
    }

    onTimerEnd(e: Event | CustomEvent): void {
        this.gameOver();
    }

    onScoreChange(e: Event | CustomEvent): void {
        const numberOfTiles: number = Number((e as CustomEvent).detail);
        const points: number = numberOfTiles * Ingame.POINTS_PER_TILE;
        this.score += points;
        this.hudPoints.setText(this.score.toString());
        if (this.score >= Ingame.POINTS_GOAL) {
            this.gameOver();
        }
    }

    onWindowResize(): void {
        super.onWindowResize();
        this.hudPoints.onWindowResize();
        this.hudTime.onWindowResize();
        this.board.onWindowResize();
    }
}