import { ITextStyle, Text } from "pixi.js";
import { FONT } from "../game/consts";
import { Scene } from "../scenes/scene";
import { HUD } from "./hud";

export class HUDText extends Text {

    static FONTSIZE: number = 720;

    private scene: Scene;
    private hud: HUD;
    private baseWidth: number = 0;
    private baseHeight: number = 0;

    constructor(scene: Scene, hud: HUD, text: string = "000") {
        const style: Partial<ITextStyle> = {
            fontFamily: "Fredoka One",
            fontSize: 42,
            fill: 0xFFFFFF,
            align: "center"
        };
        super(text, style);
        this.scene = scene;
        this.hud = hud;
        this.anchor.set(0.5);
        this.setTextScale();
        this.setPosition();
        this.scene.addChild(this);
    }

    setTextScale() {
        this.baseWidth = this.hud.width;
        this.baseHeight = this.hud.height;
        const scale: number = Math.min(this.baseWidth, this.baseHeight) / FONT.BASE_SCREEN_SIZE;
        this.style.fontSize = HUDText.FONTSIZE * scale;
    }

    setPosition(): void {
        this.position.set(this.hud.position.x, this.hud.position.y);
    }
}