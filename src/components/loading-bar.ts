import { BLEND_MODES, Container, Sprite, Texture } from "pixi.js";
import { Scene } from "../scenes/scene";

export class LoadingBar extends Container {

    private scene: Scene;
    private backgroundImage: Sprite;
    private foregroundImage: Sprite;
    private maskImage: Sprite;
    private step: number = 0;

    constructor(scene: Scene) {
        super();
        this.scene = scene;

        const textureBackground: Texture = Texture.from("img_background");
        const textureForeground: Texture = Texture.from("img_foreground");
        const textureMask: Texture = Texture.from("img_mask");

        this.backgroundImage = new Sprite(textureBackground);
        this.foregroundImage = new Sprite(textureForeground);
        this.maskImage = new Sprite(textureMask);

        this.addImages();
        this.scene.addChild(this);
    }

    addImages(): void {
        this.maskImage.blendMode = BLEND_MODES.SRC_IN;

        this.backgroundImage.anchor.set(0.5);
        this.foregroundImage.anchor.set(0.5);
        this.maskImage.anchor.set(0.5);

        this.backgroundImage.position.set(this.scene.screenWidth / 2, this.scene.screenHeight / 2);
        this.foregroundImage.position.set(this.scene.screenWidth / 2, this.scene.screenHeight / 2);
        this.maskImage.position.set(this.backgroundImage.x - this.backgroundImage.width, this.scene.screenHeight / 2);

        this.foregroundImage.mask = this.maskImage;

        this.addChild(this.backgroundImage);
        this.addChild(this.foregroundImage);
        this.addChild(this.maskImage);
    }

    //csantos: step is integer. EG: 66%
    updateProgress(value: number): void {
        const stepWidth: number = this.backgroundImage.width * value * 0.01;
        this.maskImage.position.x = (this.backgroundImage.x - this.backgroundImage.width) + stepWidth;
        this.maskImage.position.y = this.scene.screenHeight / 2;
        this.step = value;
        console.log("Loading bar: updating value to", this.step);
    }

    removeEvents() { }

    onWindowResize(): void {
        this.backgroundImage.position.set(this.scene.screenWidth / 2, this.scene.screenHeight / 2);
        this.foregroundImage.position.set(this.scene.screenWidth / 2, this.scene.screenHeight / 2);
        this.updateProgress(this.step);
    }
}