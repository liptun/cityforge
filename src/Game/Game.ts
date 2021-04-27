import * as PIXI from 'pixi.js'
import MapGenerator from './MapGenerator'
import Tile from './Tile'

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

class Game {
    app: PIXI.Application | null = null
    canvasSelector = '#game'
    canvasElement: HTMLCanvasElement | null
    canvasWidth = 1280
    canvasHeight = 720
    tileSize = 4
    generator: MapGenerator

    constructor() {
        this.canvasElement = document.querySelector<HTMLCanvasElement>(this.canvasSelector)
        this.generator = new MapGenerator()
        if (this.canvasElement) {
            this.initPixiApplication()
            this.generateMap()
        }
    }

    initPixiApplication() {
        this.app = new PIXI.Application({
            width: this.canvasWidth,
            height: this.canvasHeight,
            view: this.canvasElement ?? undefined,
        })
    }

    generateMap() {
        this.generator.start()
        this.generator.map.each(({x, y, v}) => {
            const mapTile = new Tile(x * this.tileSize, y * this.tileSize)
            mapTile.alpha = v
            mapTile.transformToRock()
            this.app?.stage.addChild(mapTile)
        })
    }
}

export default Game
