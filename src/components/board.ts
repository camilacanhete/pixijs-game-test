import { Container } from "pixi.js";
import { BOARD } from "../game/consts";
import { Scene } from "../scenes/scene";
import { ITileProperties, Tile } from "./tile";

export class Board extends Container {

    static SIZE: number = 6;

    private scene: Scene;
    private gameArray: Array<Array<Tile>>;
    private tilePool: Array<Tile>;
    private selectedTile: Tile | null = null;
    private canPick: boolean = true;
    private isDragging: boolean = false;
    private swappingTiles: number = 0;

    constructor(scene: Scene) {
        super();
        Tile.SIZE = Math.min(scene.screenWidth / Board.SIZE, scene.screenHeight / Board.SIZE);
        this.scene = scene;
        this.gameArray = new Array();
        this.tilePool = new Array(Board.SIZE * Board.SIZE);
        this.sortableChildren = true;
        this.populatePool();
        this.drawBoard();
        this.bindEvents();
        this.scene.addChild(this);
    }

    bindEvents(): void {
        this.onSelectTile = this.onSelectTile.bind(this);
    }

    populatePool(): void {
        for (let i = 0; i < this.tilePool.length; i++) {
            this.tilePool[i] = new Tile(this.scene, this);
        }
    }

    drawBoard(): void {
        for (let i = 0; i < Board.SIZE; i++) {
            this.gameArray[i] = [];
            for (let j = 0; j < Board.SIZE; j++) {
                const tile: Tile | undefined = this.tilePool.shift();
                if (tile === undefined) return;
                do {
                    const randomType: number = Math.floor(Math.random() * 5) + 1;
                    this.gameArray[i][j] = tile;
                    this.gameArray[i][j].position.set(Tile.SIZE * j + Tile.SIZE / 2, Tile.SIZE * i + Tile.SIZE / 2);
                    this.gameArray[i][j].location.row = i;
                    this.gameArray[i][j].location.col = j;
                    this.gameArray[i][j].setTexture(randomType);
                    this.addChild(this.gameArray[i][j]);
                } while (this.isMatch(i, j));
            }
        }
    }

    isMatch(row: number, col: number): boolean {
        return this.isHorizontalMatch(row, col) || this.isVerticalMatch(row, col);
    }

    isHorizontalMatch(row: number, col: number): boolean {
        return this.tileAt(row, col) === this.tileAt(row, col - 1) && this.tileAt(row, col) == this.tileAt(row, col - 2);
    }

    isVerticalMatch(row: number, col: number): boolean {
        return this.tileAt(row, col) === this.tileAt(row - 1, col) && this.tileAt(row, col) == this.tileAt(row - 2, col);
    }

    tileAt(row: number, col: number): number {
        if (row < 0 || row >= Board.SIZE || col < 0 || col >= Board.SIZE) {
            return -1;
        }
        return this.gameArray[row][col].type;
    }

    areTilesTheSame(tile1: Tile, tile2: Tile): boolean {
        return tile1.location.row === tile2.location.row && tile1.location.col === tile2.location.col;
    }

    areTilesNeighbors(tile1: Tile, tile2: Tile): boolean {
        return Math.abs(tile1.location.row - tile2.location.row) + Math.abs(tile1.location.col - tile2.location.col) === 1;
    }

    onSelectTile(tile: Tile): void {
        if (tile.type !== -1) {
            if (this.selectedTile === null) {
                tile.scale.set(tile.originalScaleX + 0.1, tile.originalScaleY + 0.1);
                tile.zIndex = Board.SIZE + 1;
                this.selectedTile = tile;
            }
            else {
                if (this.areTilesTheSame(tile, this.selectedTile)) {
                    this.selectedTile.scale.set(this.selectedTile.originalScaleX, this.selectedTile.originalScaleY);
                    this.selectedTile.zIndex = 1;
                    this.selectedTile = null;
                }
                else {
                    if (this.areTilesNeighbors(tile, this.selectedTile)) {
                        this.selectedTile.scale.set(this.selectedTile.originalScaleX, this.selectedTile.originalScaleY);
                        this.swapTiles(this.selectedTile, tile, true);
                    }
                    else {
                        this.selectedTile.scale.set(this.selectedTile.originalScaleX, this.selectedTile.originalScaleY);
                        tile.scale.set(tile.originalScaleX + 0.1, tile.originalScaleY + 0.1);
                        this.selectedTile = tile;
                    }
                }
            }
        }
    }

    swapTiles(tile1: Tile, tile2: Tile, swapBack: boolean): void {
        const from: ITileProperties = {
            type: tile1.type,
            row: tile1.location.row,
            col: tile1.location.col,
        };
        const to: ITileProperties = {
            type: tile2.type,
            row: tile2.location.row,
            col: tile2.location.col,
        };
        this.swappingTiles = 2;
        this.canPick = false;

        // TODO: animate this interaction
        this.gameArray[from.row][from.col].setTexture(to.type);
        this.gameArray[to.row][to.col].setTexture(from.type);
        // this.gameArray[from.row][from.col].type = to.type;
        // this.gameArray[to.row][to.col].type = from.type;
        // this.tweenTile(tile1, tile2, swapBack);
        // this.tweenTile(tile2, tile1, swapBack);
    }

    tweenTile(tile1: Tile, tile2: Tile, swapBack: boolean): void {

    }
}