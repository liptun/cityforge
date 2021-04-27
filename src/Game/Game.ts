import * as PIXI from 'pixi.js'
import SimplexNoise from 'simplex-noise'

import Tile from './Tile'

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

class Game {
    app: PIXI.Application | null = null
    canvasSelector = '#game'
    canvasElement: HTMLCanvasElement | null
    canvasWidth = 8 * 64
    canvasHeight = 8 * 64
    tileSize = 8

    constructor() {
        this.canvasElement = document.querySelector<HTMLCanvasElement>(this.canvasSelector)
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
        
        const noise = new SimplexNoise(seed)
        this.app?.stage.removeChildren()
        for (let y = 0; y < 64; y++) {
            for (let x = 0; x < 64; x++) {
                const mapTile = new Tile(x * this.tileSize, y * this.tileSize)
                const noiseValue = (noise.noise2D(x, y) + 1) / 2
                mapTile.transformToWater()
                if (noiseValue <= 1 && noiseValue >= 0.5) {
                    mapTile.transformToLand()
                }
                
                this.app?.stage.addChild(mapTile)
            }
        }



    }

    kill() {
        this.app?.destroy()
    }
}

export default Game
