import * as PIXI from 'pixi.js'
import defaultTile from './assets/default.png'
import waterTile from './assets/water.png'
import landTile from './assets/land.png'
import sandTile from './assets/sand.png'
import rockTile from './assets/rock.png'
import dirtTile from './assets/dirt.png'

class Tile extends PIXI.AnimatedSprite {
    constructor(x = 0, y = 0) {
        super([PIXI.Texture.from(defaultTile)])
        this.width = 4
        this.height = 4
        this.x = x
        this.y = y
    }
    transformToWater() {
        this.texture = PIXI.Texture.from(waterTile)
    }
    transformToLand() {
        this.texture = PIXI.Texture.from(landTile)
    }
    transformToSand() {
        this.texture = PIXI.Texture.from(sandTile)
    }
    transformToRock() {
        this.texture = PIXI.Texture.from(rockTile)
    }
    transformToDirt() {
        this.texture = PIXI.Texture.from(dirtTile)
    }
}

export default Tile
