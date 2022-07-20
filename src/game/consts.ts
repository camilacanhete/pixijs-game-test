//csantos: useful consts for the game

export class GAME {
    static STATE: { [state: string]: string } = {
        START: "GAME_START",
        PAUSED: "GAME_PAUSED",
        OVER: "GAME_OVER",
    }
}

export class SCENES {
    static LIST: { [name: string]: string } = {
        BOOT: "SCENE_BOOT",
        LOADING: "SCENE_LOADING",
        INGAME: "SCENE_INGAME",
    }

    static EVENTS: { [state: string]: string } = {
        START: "SCENE_START",
    }
}

export class RESOURCES {
    static ATLAS: { [name: string]: string } = {
        LOADING: "ATLAS_LOADING",
        INGAME: "ATLAS_INGAME"
    }
}

export class BOARD {
    static TILES: { [type: number]: string } = {
        1: "giraffe",
        2: "panda",
        3: "parrot",
        4: "pig",
        5: "elephant"
    }

    static EVENTS: { [state: string]: string } = {
        SELECT_TILE: "SELECT_TILE",
    }
}