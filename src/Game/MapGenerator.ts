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
        console.log('start generation')
        console.time('Map generation')

        this.map.prepareMatrix(this.mapDimensions.width, this.mapDimensions.height, 1)
        const noiseMap = new Matrix()
        noiseMap.prepareMatrix(this.mapDimensions.width, this.mapDimensions.height, 0)
        noiseMap.noise('seed', 0.02)
        this.map.blendMatrix(noiseMap, (v1, v2) => v1 + v2 * 0.4)
        this.map.scale(0, 1)

        console.timeEnd('Map generation')
    }
}
export default MapGenerator
