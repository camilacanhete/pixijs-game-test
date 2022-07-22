import { Container, DisplayObject } from "pixi.js";
import { gsap } from "gsap";
import { BOARD } from "../game/consts";
import { Scene } from "../scenes/scene";
import { ITileProperties, Tile } from "./tile";
import { HUD } from "./hud";

enum DIRECTION {
    HORIZONTAL,
    VERTICAL
}

export class Board extends Container {

    static SIZE: number = 6;

    private scene: Scene;
    private gameArray: Array<Array<Tile>>;
    private removeArray: Array<Array<number>>;
    private tilePool: Array<Tile>;
    private selectedTile: Tile | null = null;
    private canPick: boolean = true;
    private isDragging: boolean = false;
    private isResizing: boolean = false;
    private swappingTiles: number = 0;

    constructor(scene: Scene) {
        super();
        Tile.SIZE = Math.min(scene.screenWidth / Board.SIZE - HUD.PADDING - HUD.WIDTH, scene.screenHeight / Board.SIZE - HUD.PADDING - HUD.HEIGHT);
        this.scene = scene;
        this.gameArray = new Array();
        this.removeArray = new Array();
        this.tilePool = new Array();
        this.sortableChildren = true;
        this.populatePool();
        this.drawBoard();
        this.bindEvents();
        this.scene.addChild(this);
        this.position.set(this.scene.screenWidth / 2 - this.width / 2, this.scene.screenHeight / 2 - this.height / 2);
    }

    bindEvents(): void {
        this.onSelectTile = this.onSelectTile.bind(this);
    }

    populatePool(): void {
        for (let i = 0; i < Board.SIZE * Board.SIZE; i++) {
            this.tilePool[i] = new Tile(this.scene, this);
        }
    }

    drawBoard(): void {
        for (let i: number = 0; i < Board.SIZE; i++) {
            this.gameArray[i] = [];
            for (let j: number = 0; j < Board.SIZE; j++) {
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
                console.log(this.gameArray[i][j].location);
            }
        }
    }

    resizeBoard(): void {
        Tile.SIZE = Math.min(this.scene.screenWidth / Board.SIZE - HUD.PADDING - HUD.WIDTH, this.scene.screenHeight / Board.SIZE - HUD.PADDING - HUD.HEIGHT);
        for (let i: number = 0; i < Board.SIZE; i++) {
            for (let j: number = 0; j < Board.SIZE; j++) {
                this.gameArray[i][j].width = Tile.SIZE;
                this.gameArray[i][j].height = Tile.SIZE;
                this.gameArray[i][j].position.set(Tile.SIZE * j + Tile.SIZE / 2, Tile.SIZE * i + Tile.SIZE / 2);
            }
        }
        this.isResizing = false;
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
        console.log("onSelectTile:", tile.location);
        if (tile.type !== -1) {
            if (this.selectedTile === null) {
                tile.scale.set(tile.originalScaleX + 0.1, tile.originalScaleY + 0.1);
                tile.zIndex = Board.SIZE + 100;
                this.selectedTile = tile;
            }
            else {
                if (this.areTilesTheSame(tile, this.selectedTile)) {
                    this.selectedTile.scale.set(this.selectedTile.originalScaleX, this.selectedTile.originalScaleY);
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

        tile1.zIndex = 1;
        tile2.zIndex = 1;

        this.swappingTiles = 2;
        this.canPick = false;

        this.swapArrayPositions(tile1, tile2);
        this.tweenTile(tile1, tile2, swapBack);
        this.tweenTile(tile2, tile1, swapBack);
    }

    tweenTile(from: Tile, to: Tile, swapBack: boolean): void {
        const row: number = (swapBack) ? to.location.row : from.location.row;
        const col: number = (swapBack) ? to.location.col : from.location.col;
        gsap.to(from, {
            x: Tile.SIZE * col + Tile.SIZE / 2,
            y: Tile.SIZE * row + Tile.SIZE / 2,
            repeat: 0,
            duration: 5,
            onComplete: () => {
                this.swappingTiles--;
                if (this.swappingTiles === 0) {
                    if (!this.matchInBoard() && swapBack) {
                        this.swapTiles(from, to, false);
                    }
                    else {
                        if (this.matchInBoard()) {
                            this.handleMatches();
                        } else {
                            this.canPick = true;
                            this.selectedTile = null;
                        }
                    }
                }
            }
        });
    }

    swapArrayPositions(tile1: Tile, tile2: Tile): void {
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

        const temp: Tile = this.gameArray[from.row][from.col];
        this.gameArray[from.row][from.col] = this.gameArray[to.row][to.col];
        this.gameArray[to.row][to.col] = temp;
    }

    matchInBoard(): boolean {
        for (let i: number = 0; i < Board.SIZE; i++) {
            for (let j: number = 0; j < Board.SIZE; j++) {
                if (this.isMatch(i, j)) {
                    return true;
                }
            }
        }
        return false;
    }

    handleMatches(): void {
        this.removeArray = [];
        for (let i: number = 0; i < Board.SIZE; i++) {
            this.removeArray[i] = [];
            for (let j: number = 0; j < Board.SIZE; j++) {
                this.removeArray[i].push(0);
            }
        }

        this.markMatches(DIRECTION.HORIZONTAL);
        this.markMatches(DIRECTION.VERTICAL);
        console.log(this.removeArray);
        this.destroyTiles();
    }

    markMatches(direction: number): void {
        for (let i: number = 0; i < Board.SIZE; i++) {
            let typeStreak: number = 1;
            let startStreak: number = 0;
            let typeToWatch: number = 0;
            let currentType: number = -1;
            for (let j: number = 0; j < Board.SIZE; j++) {
                if (direction === DIRECTION.HORIZONTAL) {
                    typeToWatch = this.tileAt(i, j);
                } else {
                    typeToWatch = this.tileAt(j, i);
                }
                if (typeToWatch === currentType) {
                    typeStreak++;
                }
                if (typeToWatch !== currentType || j === Board.SIZE - 1) {
                    if (typeStreak >= 3) {
                        if (direction === DIRECTION.HORIZONTAL) {
                            console.log("markMatches: HORIZONTAL Length = " + typeStreak + " :: Start = (" + i + "," + startStreak + ") :: Type = " + currentType);
                        } else {
                            console.log("markMatches: VERTICAL Length = " + typeStreak + " :: Start = (" + startStreak + "," + i + ") :: Type = " + currentType);
                        }
                        for (let k: number = 0; k < typeStreak; k++) {
                            if (direction === DIRECTION.HORIZONTAL) {
                                this.removeArray[i][startStreak + k]++;
                            }
                            else {
                                this.removeArray[startStreak + k][i]++;
                            }
                        }
                    }
                    startStreak = j;
                    typeStreak = 1;
                    currentType = typeToWatch;
                }
            }
        }
    }

    destroyTiles(): void {
        let destroyed: number = 0;
        for (let i: number = 0; i < Board.SIZE; i++) {
            for (let j: number = 0; j < Board.SIZE; j++) {
                if (this.removeArray[i][j] > 0) {
                    destroyed++;
                    const tile: Tile = this.gameArray[i][j];
                    // const tile: Tile = this.findTileByLocation(i, j);
                    tile.isActive = false;
                    gsap.to(tile, {
                        alpha: 0.5,
                        repeat: 0,
                        duration: 0.250,
                        onComplete: () => {
                            destroyed--;
                            tile.alpha = 0;
                            this.tilePool.push(tile);
                            if (destroyed === 0) {
                                this.makeTilesFall();
                                this.replenishBoard();
                            }
                        }
                    });
                }
            }
        }
    }

    fixTileLocation(): void {
        for (let i: number = 0; i < Board.SIZE; i++) {
            for (let j: number = 0; j < Board.SIZE; j++) {
                this.gameArray[i][j].location.row = i;
                this.gameArray[i][j].location.col = j;
            }
        }
    }

    debugTiles(): void {
        //const debugArray: any[][] = [];
        for (let i: number = 0; i < Board.SIZE; i++) {
            //debugArray[i] = [];
            for (let j: number = 0; j < Board.SIZE; j++) {
                this.gameArray[i][j].location.row = i;
                this.gameArray[i][j].location.col = j;
                console.log(this.gameArray[i][j].location);
                //debugArray[i][j] = "[" + i + "," + j + "]:" + this.gameArray[i][j].location.row + "," + this.gameArray[i][j].location.col + "," + Number(this.gameArray[i][j].isActive);
            }
        }
        //console.log(debugArray, this.gameArray);
    }

    makeTilesFall(): void {
        const debugArray: number[][] = [];
        for (let i: number = Board.SIZE - 2; i >= 0; i--) {
            debugArray[i] = [];
            for (let j: number = 0; j < Board.SIZE; j++) {
                if (this.gameArray[i][j].isActive) {
                    const fallTiles: number = this.holesBelow(i, j);
                    if (fallTiles > 0) {
                        gsap.to(this.gameArray[i][j], {
                            y: this.gameArray[i][j].y + fallTiles * Tile.SIZE,
                            duration: 5
                        });
                        this.gameArray[i + fallTiles][j].type = this.gameArray[i][j].type;
                        this.gameArray[i + fallTiles][j].location.row = this.gameArray[i][j].location.row;
                        this.gameArray[i + fallTiles][j].location.col = this.gameArray[i][j].location.col;
                        this.gameArray[i + fallTiles][j].isActive = true;
                        this.gameArray[i][j].isActive = false;
                    }
                }
            }
        }
    }

    holesBelow(row: number, col: number): number {
        let result: number = 0;
        for (let i: number = row + 1; i < Board.SIZE; i++) {
            if (!this.gameArray[i][col].isActive) {
                console.log("holes in", this.gameArray[i][col].location);
                result++;
            }
        }
        return result;
    }

    holesInCol(col: number): number {
        let result: number = 0;
        for (let i: number = 0; i < Board.SIZE; i++) {
            if (!this.gameArray[i][col].isActive) {
                result++;
            }
        }
        return result;
    }

    replenishBoard(): void {
        let replenished: number = 0;
        for (let j: number = 0; j < Board.SIZE; j++) {
            let emptySpots: number = this.holesInCol(j);
            if (emptySpots > 0) {
                for (let i: number = 0; i < emptySpots; i++) {
                    replenished++;
                    const tile: Tile | undefined = this.tilePool.shift();
                    if (tile === undefined) return;
                    const randomType: number = Math.floor(Math.random() * 5) + 1;
                    this.gameArray[i][j] = tile;
                    this.gameArray[i][j].isActive = true;
                    this.gameArray[i][j].alpha = 1;
                    this.gameArray[i][j].position.set(Tile.SIZE * j + Tile.SIZE / 2, Tile.SIZE / 2 - (emptySpots - i) * Tile.SIZE);
                    this.gameArray[i][j].location.row = i;
                    this.gameArray[i][j].location.col = j;
                    this.gameArray[i][j].setTexture(randomType);
                    this.addChild(this.gameArray[i][j]);

                    gsap.to(this.gameArray[i][j], {
                        y: Tile.SIZE * i + Tile.SIZE / 2,
                        duration: 5,
                        callbackScope: this,
                        onComplete: () => {
                            replenished--;
                            if (replenished == 0) {
                                if (this.matchInBoard()) {
                                    setTimeout(this.handleMatches.bind(this), 250);
                                }
                                else {
                                    this.canPick = true;
                                    this.selectedTile = null;
                                }
                            }
                        }
                    });
                }
            }
        }
    }

    onWindowResize(): void {
        if (!this.isResizing) {
            this.isResizing = true;
            this.resizeBoard();
            this.position.set(this.scene.screenWidth / 2 - this.width / 2, this.scene.screenHeight / 2 - this.height / 2);
        }
    }
}