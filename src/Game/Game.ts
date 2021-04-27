import * as PIXI from 'pixi.js'
import SimplexNoise from 'simplex-noise'

import Tile from './Tile'

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

const MAP_SIZE = 256

interface generatorOptions {
    seed?: string
    seaLevel?: number
    roughness?: number
    mountainess?: number
    debugNoise?: boolean
}

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

    generateMap({
        seed = 'cityforge',
        seaLevel = 0,
        roughness = 0.2,
        mountainess = 2,
        debugNoise = false,
    }: generatorOptions = {}) {
        console.log('starting generate map')
        console.time()

        const seed1 = seed ?? ''
        const seed2 = seed ? seed + '1' : ''
        const seed3 = seed ? seed + '2' : ''
        const seed4 = seed ? seed + '3' : ''

        const noise = new SimplexNoise(seed1)
        const noise2 = new SimplexNoise(seed2)
        const noise3 = new SimplexNoise(seed3)
        const noise4 = new SimplexNoise(seed4)
        this.app?.stage?.removeChildren?.()
        for (let y = 0; y < MAP_SIZE; y++) {
            for (let x = 0; x < MAP_SIZE; x++) {
                const mapTile = new Tile(x * this.tileSize, y * this.tileSize)
                const noiseValue1 = (noise.noise2D(x / 300, y / 300) + 1) / 2
                const noiseValue2 = noise2.noise2D(x / 44, y / 44) * 0.2
                const noiseValue3 = noise3.noise2D(x / 16, y / 16) * roughness + 1
                const noiseValue4 = noise4.noise2D(x / 150, y / 150) * mountainess + 1

                let noiseValueStack = seaLevel * -1
                noiseValueStack += noiseValue1
                noiseValueStack += noiseValue2
                noiseValueStack *= noiseValue3
                noiseValueStack *= noiseValue4
                noiseValueStack /= 1.2

                const clampNoiseValue = Math.min(1, Math.max(0, noiseValueStack))

                if (debugNoise) {
                    mapTile.alpha = clampNoiseValue
                } else {
                    mapTile.transformToWater()
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
                }

                this.app?.stage.addChild(mapTile)
            }
        }
        
        console.timeEnd()
    }

    kill() {
        this.app?.destroy()
    }
}

export default Game
