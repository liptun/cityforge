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
        this.map.prepareMatrix(this.mapDimensions.width, this.mapDimensions.height, 1)
        const noiseMap = new Matrix()
        noiseMap.prepareMatrix(this.mapDimensions.width, this.mapDimensions.height, 0)
        noiseMap.noise('seed', .02)
        this.map.blendMatrix(noiseMap, (v1, v2) => v1 + v2 * .4)
    }
}
export default MapGenerator
