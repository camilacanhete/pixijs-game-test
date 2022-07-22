import { Sprite, Texture } from "pixi.js";
import { Scene } from "../scenes/scene";
import { HUDText } from "./hud-text";

export class HUD extends Sprite {

    static WIDTH: number = 0;
    static HEIGHT: number = 0;
    static PADDING: number = 15;
    static ORIENTATION: { [dir: string]: string } = {
        LEFT: "LEFT",
        RIGHT: "RIGHT"
    }

    private scene: Scene;
    private originalHeight: number = 0;
    private orientation: string = HUD.ORIENTATION.LEFT;
    private text: HUDText;

    constructor(scene: Scene, orientation: string, text?: string) {
        const texture: Texture = Texture.from("img_hud");
        super(texture);
        this.scene = scene;
        this.interactive = true;
        this.originalHeight = this.height;
        this.orientation = orientation;
        this.anchor.set(0.5);
        this.setScale();
        this.setPosition();
        this.scene.addChild(this);
        this.text = new HUDText(this.scene, this, text);
    }

    setScale(scaleX?: number, scaleY?: number): void {
        if (scaleX === undefined) {
            const height: number = this.scene.screenHeight * 0.065;
            scaleX = scaleY = height / this.originalHeight;
        }
        this.scale.set(scaleX, scaleY);
        HUD.WIDTH = this.width;
        HUD.HEIGHT = this.height;
        this.text?.setTextScale();
    }

    setPosition() {
        if (this.orientation === HUD.ORIENTATION.LEFT) {
            this.position.set(this.width / 2 + HUD.PADDING, this.height / 2 + HUD.PADDING);
        } else {
            this.position.set(this.scene.screenWidth - this.width / 2 - HUD.PADDING, this.height / 2 + HUD.PADDING);
        }
        this.text?.setPosition();
    }

    setText(text: string): void {
        this.text.text = text;
    }

    onWindowResize(): void {
        this.setScale();
        this.setPosition();
    }
}