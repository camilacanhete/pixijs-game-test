import { InteractionEvent, Sprite, Texture } from "pixi.js";
import { BOARD } from "../game/consts";
import { Scene } from "../scenes/scene";
import { Board } from "./board";

export interface ITileProperties {
    type: number | undefined,
    row: number,
    col: number,
}

export class Tile extends Sprite {

    static SIZE: number = 100;

    private scene: Scene;
    private board: Board;

    public type: number | undefined = 1;
    public originalScaleX: number = 1;
    public originalScaleY: number = 1;
    public isActive: boolean = true;
    public row: number = -1;
    public col: number = -1;

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
        this.onDrag = this.onDrag.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.on("mousedown", this.onSelectTile);
        this.on("touchstart", this.onSelectTile);
        this.on("mousemove", this.onDrag);
        this.on("touchmove", this.onDrag);
        this.on("mouseup", this.onDragEnd);
        this.on("touchend", this.onDragEnd);
    }

    removeEvents(): void {
        this.off("mousedown", this.onSelectTile);
        this.off("touchstart", this.onSelectTile);
        this.off("mousemove", this.onDrag);
        this.off("touchmove", this.onDrag);
        this.off("mouseup", this.onDragEnd);
        this.off("touchend", this.onDragEnd);
    }

    onSelectTile(): void {
        this.board.onSelectTile(this);
    }

    onDrag(): void {

    }

    onDragEnd(): void {

    }

    setTexture(type: number): void {
        const texture: Texture = (type !== -1) ? Texture.from(BOARD.TILES[type]) : Texture.EMPTY;
        this.texture = texture;
        this.type = type;
    }

    setSize(width: number, height: number): void {
        this.width = width;
        this.height = height;
    }

    setVirtualPosition(row: number, col: number): void {
        this.row = row;
        this.col = col;
    }
}