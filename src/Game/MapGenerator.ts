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
            width: 170,
            height: 170,
        }
    }
    start() {
        const { width, height } = this.mapDimensions
        console.log('start generation')
        console.time('Map generation')

        this.map.prepareMatrix(width, height, 1)
        this.map.noise('', 0.03)
        this.map.eachSet(({ x }) => this.map.get(x, 0))
        const noiseMap = new Matrix()
        noiseMap.prepareMatrix(width, height, 0)
        noiseMap.noise('', 0.02)
        this.map.blendMatrix(noiseMap, (v1, v2) => v1 * v2)
        this.map.scale(0, 1)

        const islands = new Matrix()
        islands.prepareMatrix(width, height)
        islands.noise('', 1.2 / 100)
        // islands.scale(0,1)
        islands.absolute()
        islands.smooth(1)
        islands.treshold(.1)
        islands.scale(0, 1)
        islands.inverse()
        islands.smooth(3)

        // islands.eachSet(({ v }) => (v > 0.3 ? 1 : 0))

        const islands2 = new Matrix()
        // islands.prepareMatrix(width, height)
        // islands.noise('', 1.2 / 100)
        // // islands.eachSet(({ v }) => (v > 0.3 ? 1 : 0))
        // islands.smooth(10)

        // islands.addMatrix(islands2)
        // islands.scale(0, 1)

        this.map.multiplyMatrix(islands)

        const mountains = new Matrix()
        mountains.prepareMatrix(width, height)
        mountains.noise('', 1.2 / 10)
        mountains.scale(0, 0.2)

        this.map.blendMatrix(mountains, (v1, v2) => (v1 > 0.1 ? v1 + v2 : v1))

        this.map.scale(0, 1)

        this.map.applyMatrix(islands)

        console.timeEnd('Map generation')
    }
}
export default MapGenerator
