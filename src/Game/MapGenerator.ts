import Matrix from './Matrix'

interface MapDimensions {
    width: number
    height: number
}

class MapGenerator {
    map: Matrix
    mapDimensions: MapDimensions
    constructor() {
        this.map = new Matrix()
        this.mapDimensions = {
            width: 256,
            height: 256,
        }
    }
    start(seed = '') {
        const { width, height } = this.mapDimensions
        console.log('start generation')
        console.time('Map generation')

        this.map.prepareMatrix(width, height, 1)
        const noiseMap = new Matrix()
        noiseMap.prepareMatrix(width, height, 0)
        noiseMap.noise(seed, 15 / 1000)
        this.map.blendMatrix(noiseMap, (v1, v2) => v1 * v2)
        this.map.scale(0, 1)

        const rivers = new Matrix()
        rivers.prepareMatrix(width, height)
        rivers.noise(seed, 8 / 1000)
        rivers.absolute()
        rivers.treshold(0.2)
        rivers.scale(-1, 1)
        rivers.smooth(10)

        this.map.addMatrix(rivers)

        const mountains = new Matrix()
        mountains.prepareMatrix(width, height)
        mountains.noise(seed, 25 / 1000)
        mountains.absolute()
        mountains.scale(0, 1)
        mountains.inverse()
        mountains.smooth(10)

        this.map.addMatrix(mountains)
        this.map.smooth(50)

        const sharpness = new Matrix()
        sharpness.prepareMatrix(width, height)
        sharpness.noise(seed, 40 / 1000)

        this.map.addMatrix(sharpness)

        const sharpness2 = new Matrix()
        sharpness2.prepareMatrix(width, height)
        sharpness2.noise(seed, 60 / 1000)

        this.map.addMatrix(sharpness2)

        this.map.scale(0, 1)

        rivers.inverse()
        rivers.treshold(.5)
        rivers.smooth(10)
        rivers.scale(.6, 1.8)

        this.map.multiplyMatrix(rivers)
        this.map.smooth(4)



        console.timeEnd('Map generation')
    }
}
export default MapGenerator
