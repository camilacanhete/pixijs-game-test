//csantos: useful consts for the game
export class Const {

    static GAME_STATE = {
        START: "GAME_START",
        PAUSED: "GAME_PAUSED",
        OVER: "GAME_OVER",
    }

    static ATLAS = {
        LOADING: "ATLAS_LOADING",
        INGAME: "ATLAS_INGAME"
    }

    static AUDIO = {
        BEEP: "AUDIO_BEEP",
        BOMB: "AUDIO_BOMB",
        CLASSIC: "AUDIO_CLASSIC",
        CLICK: "AUDIO_CLICK",
        EXPLODE: "AUDIO_EXPLODE",
        LOSE: "AUDIO_LOSE",
        POP: "AUDIO_POP",
        SHOOT: "AUDIO_SHOOT",
        SPLASH: "AUDIO_SPLASH",
        SWIPE: "AUDIO_SWIPE",
        WRONG: "AUDIO_WRONG"
    }

    static FONT = {
        BASE_SCREEN_SIZE: 1024,
        FREDOKA: "FONT_FREDOKA",
        FREDOKA_NUMBER: "FONT_FREDOKA_ONE"
    }

    static SCENES = {
        BOOT: "SCENE_BOOT",
        LOADING: "SCENE_LOADING",
        INGAME: "SCENE_INGAME",
    }

    static SPINE = {
        CHARACTER: "SPINE_CHARACTER"
    }
}