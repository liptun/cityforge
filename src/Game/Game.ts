import * as PIXI from 'pixi.js'
import SimplexNoise from 'simplex-noise'

import Tile from './Tile'

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

const MAP_SIZE = 256
const SEA_LEVEL = 0
const ROUGHNESS = 0.2
const MOUNTAINS = 2

class Game {
    app: PIXI.Application | null = null
    canvasSelector = '#game'
    canvasElement: HTMLCanvasElement | null
    canvasWidth = 4 * MAP_SIZE
    canvasHeight = 4 * MAP_SIZE
    tileSize = 4

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

    generateMap(seed = '2137') {
        const noise = new SimplexNoise(seed)
        const noise2 = new SimplexNoise(seed + 'extrasalt')
        const noise3 = new SimplexNoise(seed + 'extrasaltextra')
        const noise4 = new SimplexNoise(seed + 'extrasaltextrathin')
        this.app?.stage.removeChildren()
        for (let y = 0; y < MAP_SIZE; y++) {
            for (let x = 0; x < MAP_SIZE; x++) {
                const mapTile = new Tile(x * this.tileSize, y * this.tileSize)
                const noiseValue1 = (noise.noise2D(x / 300, y / 300) + 1) / 2
                const noiseValue2 = noise2.noise2D(x / 44, y / 44) * .2
                const noiseValue3 = noise3.noise2D(x / 16, y / 16) * ROUGHNESS + 1
                const noiseValue4 = noise4.noise2D(x / 150, y / 150) * MOUNTAINS + 1

                let noiseValueStack = SEA_LEVEL
                noiseValueStack += noiseValue1
                noiseValueStack += noiseValue2
                noiseValueStack *= noiseValue3
                noiseValueStack *= noiseValue4

                const clampNoiseValue = Math.min(1, Math.max(0, noiseValueStack))
                mapTile.transformToWater()
                // mapTile.alpha = clampNoiseValue
                if (clampNoiseValue > 0.33) {
                    mapTile.transformToSand()
                }
                if (clampNoiseValue > 0.4) {
                    mapTile.transformToLand()
                }
                if (clampNoiseValue > 0.8) {
                    mapTile.transformToDirt()
                }
                if (clampNoiseValue > 0.95) {
                    mapTile.transformToRock()
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
