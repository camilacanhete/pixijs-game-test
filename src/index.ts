import { Application, Loader, Texture, AnimatedSprite, Rectangle } from "pixi.js";
import { getSpine } from "./spine-example";
import { getLayersExample } from "./layers-example";
import { Game } from "./game/game";
import "./styles/index.scss"; //csantos: import styles

declare const VERSION: string;

const gameWidth = 800;
const gameHeight = 600;

const app = new Application({
    backgroundColor: 0xd3d3d3,
    width: gameWidth,
    height: gameHeight,
});

console.log(`Welcome from pixi-typescript-boilerplate ${VERSION}`);

window.onload = async (): Promise<void> => {
    (window as any).__game = new Game();

    // await loadGameAssets();

    // document.body.appendChild(app.view);

    // getLayersExample(app);

    // const birdFromSprite = getBird();
    // birdFromSprite.anchor.set(0.5, 0.5);
    // birdFromSprite.position.set(gameWidth / 2, 530);

    // const spineExample = getSpine();
    // spineExample.position.y = 580;

    // app.stage.addChild(birdFromSprite);
    // app.stage.addChild(spineExample);
    // app.stage.interactive = true;
};

async function loadGameAssets(): Promise<void> {
    return new Promise((res, rej) => {
        const loader = Loader.shared;
        loader.add("rabbit", "./assets/simpleSpriteSheet.json");
        loader.add("pixie", "./assets/spine-assets/pixie.json");

        loader.onComplete.once(() => {
            res();
        });

        loader.onError.once(() => {
            rej();
        });

        loader.load();
    });
}

function getBird(): AnimatedSprite {
    const bird = new AnimatedSprite([
        Texture.from("birdUp.png"),
        Texture.from("birdMiddle.png"),
        Texture.from("birdDown.png"),
    ]);

    bird.loop = true;
    bird.animationSpeed = 0.1;
    bird.play();
    bird.scale.set(3);

    return bird;
}
