import { InteractionEvent, Sprite, Texture } from "pixi.js";
import { BOARD } from "../game/consts";
import { Scene } from "../scenes/scene";
import { Board } from "./board";

export interface ITileProperties {
    type: number,
    row: number,
    col: number,
}

export class Tile extends Sprite {

    static SIZE: number = 100;

    private scene: Scene;
    private board: Board;

    public originalScaleX: number = 1;
    public originalScaleY: number = 1;
    public isActive: boolean = true;
    public type: number = 1;
    public location: { [location: string]: number } = {
        row: -1,
        col: -1,
    };

    constructor(scene: Scene, board: Board) {
        const texture: Texture = Texture.from(BOARD.TILES[1]);
        super(texture);
        this.scene = scene;
        this.board = board;
        this.interactive = true;
        this.width = Tile.SIZE;
        this.height = Tile.SIZE;
        this.originalScaleX = this.scale.x;
        this.originalScaleY = this.scale.y;
        this.anchor.set(0.5);
        this.bindEvents();
    }

    bindEvents(): void {
        this.onSelectTile = this.onSelectTile.bind(this);
        this.on("mousedown", this.onSelectTile);
        this.on("touchstart", this.onSelectTile);
    }

    removeEvents(): void {
        this.off("mousedown", this.onSelectTile);
        this.off("touchstart", this.onSelectTile);
    }

    onSelectTile(): void {
        this.board.onSelectTile(this);
    }

    setTexture(type: number): void {
        const texture: Texture = Texture.from(BOARD.TILES[type]);
        this.texture = texture;
        this.type = type;
    }
}