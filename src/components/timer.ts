import { GAME } from "../game/consts";

export class Timer {

    private duration: number = 1;
    private evTimerStart: Event;
    private evTimerCount: CustomEvent;
    private evTimerEnd: Event;
    private fnInterval: any;

    constructor() {
        this.evTimerStart = new Event(GAME.EVENTS.TIMER_START);
        this.evTimerCount = new CustomEvent(GAME.EVENTS.TIMER_COUNT);
        this.evTimerEnd = new Event(GAME.EVENTS.TIMER_END);
    }

    start(milliseconds: number): void {
        let timer: number = milliseconds;
        let minutes: number = 0;
        let seconds: number = 0;
        let sSeconds: string = "";
        console.log(minutes, seconds);
        // minutes = Math.max(0, Math.min(59, Math.round(seconds)));
        // seconds = Math.max(0, Math.min(60, Math.round(minutes)));
        this.fnInterval = setInterval(() => {
            minutes = Math.trunc((timer / 1000) / 60);
            seconds = Math.trunc((timer / 1000) % 60);

            sSeconds = (seconds < 10) ? "0" + seconds.toString() : seconds.toString();

            this.onTimerCount(minutes.toString() + ":" + sSeconds);

            timer -= 1000;

            if (timer < 0) {
                clearInterval(this.fnInterval);
                this.onTimerEnd();
            }

        }, 1000);
        // console.log("Started at", minutes, seconds);
    }

    onTimerStart(): void {
        window.dispatchEvent(this.evTimerStart);
    }

    onTimerCount(value: string): void {
        this.evTimerCount = new CustomEvent(GAME.EVENTS.TIMER_COUNT, {
            detail: value
        });
        window.dispatchEvent(this.evTimerCount);
    }

    onTimerEnd(): void {
        window.dispatchEvent(this.evTimerEnd);
    }
}