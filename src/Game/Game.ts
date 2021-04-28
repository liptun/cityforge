import * as PIXI from 'pixi.js'
import MapGenerator from './MapGenerator'
import Tile from './Tile'

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

class Game {
    app: PIXI.Application | null = null
    canvasSelector = '#game'
    canvasElement: HTMLCanvasElement | null
    canvasWidth = 64 * 8
    canvasHeight = 64 * 8
    tileSize = 8
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

    generateMap(seed = '') {
        this.app?.stage?.removeChildren()
        this.generator.start(seed)
        this.generator.map.each(({ x, y, v }) => {
            const mapTile = new Tile(x * this.tileSize, y * this.tileSize)
            mapTile.transformToWater()
            if (v > 0.4) {
                mapTile.transformToSand()
            }
            if (v > 0.45) {
                mapTile.transformToLand()
            }
            if (v > 0.8) {
                mapTile.transformToDirt()
            }
            if (v > 0.9) {
                mapTile.transformToRock()
            }

            // debug
            // mapTile.alpha = v
            // mapTile.transformToRock()

            this.app?.stage.addChild(mapTile)
        })
    }
}

export default Game
