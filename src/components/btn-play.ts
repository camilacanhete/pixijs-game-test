import { Sprite, Texture } from "pixi.js";
import { SCENES } from "../game/consts";
import { Scene } from "../scenes/scene";

export class BtnPlay extends Sprite {

    private scene: Scene;
    private active: boolean = false;

    constructor(scene: Scene) {
        const texture: Texture = Texture.from("btn_disabled");
        super(texture);
        this.scene = scene;
        this.interactive = true;
        this.anchor.set(0.5);
        this.position.set(this.scene.screenWidth / 2, this.scene.screenHeight / 2 + this.height + 25);
        this.bindEvents();
        this.scene.addChild(this);
    }

    bindEvents(): void {
        this.onClick = this.onClick.bind(this);
        this.on("mousedown", this.onClick);
        this.on("touchstart", this.onClick);
    }

    removeEvents(): void {
        this.off("mousedown", this.onClick);
        this.off("touchstart", this.onClick);
    }

    onClick(): void {
        if (!this.active) return;
        this.scene.changeScene(SCENES.LIST.INGAME);
    }

    setActiveState(active: boolean = true): void {
        let texture: Texture;
        if (active) {
            texture = Texture.from("btn_enabled");
        } else {
            texture = Texture.from("btn_disabled");
        }
        this.texture = texture;
        this.active = active;
    }

    onWindowResize(): void {
        this.position.set(this.scene.screenWidth / 2, this.scene.screenHeight / 2 + this.height + 25);
    }
}