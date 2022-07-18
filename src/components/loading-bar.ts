import { Container, Sprite, Texture } from "pixi.js";
import { Const } from "../game/const";
import { Scene } from "../scenes/scene";

export class LoadingBar extends Container {

    private scene: Scene;
    private backgroundImage: Sprite | null;
    private foregroundImage: Sprite | null;

    constructor(scene: Scene) {
        super();
        this.scene = scene;
        this.createImages();
        this.scene.addChild(this);
    }

    createImages(): void {
        const textureBackground: Texture = Texture.from("carga1");
        const textureForeground: Texture = Texture.from("carga2");
        this.backgroundImage = new Sprite(textureBackground);
        this.foregroundImage = new Sprite(textureForeground);
        this.backgroundImage.anchor.set(0.5);
        this.foregroundImage.anchor.set(0.5);
        this.backgroundImage.position.set(this.scene.screenWidth / 2, this.scene.screenHeight / 2);
        this.foregroundImage.position.set(this.scene.screenWidth / 2, this.scene.screenHeight / 2);
        this.addChild(this.backgroundImage);
        this.addChild(this.foregroundImage);
    }

    onWindowResize(): void {
        this.backgroundImage.position.set(this.scene.screenWidth / 2, this.scene.screenHeight / 2);
        this.foregroundImage.position.set(this.scene.screenWidth / 2, this.scene.screenHeight / 2);
    }
}