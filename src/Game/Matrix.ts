import SimplexNoise from 'simplex-noise'
import { scaleNumber } from './Helpers'

export type MatrixEachCallback = (x: number, y: number, v: number, index: number) => void
export type MatrixBlendCallback = (v1: number, v2: number) => number

class Matrix {
    matrix: number[][] = []

    prepareMatrix(width: number = 64, height: number = 64, defaultValue: number = 0) {
        const matrix: number[][] = []
        for (let y = 0; y < height; y++) {
            const row = []
            for (let x = 0; x < width; x++) {
                row.push(defaultValue)
            }
            matrix.push(row)
        }
        this.matrix = matrix
    }

    get(x: number, y: number): number {
        return this.matrix[y][x]
    }

    set(x: number, y: number, v: number): void {
        this.matrix[y][x] = v
    }

    noise(seed: string, scale: number): void {
        const noise = new SimplexNoise(seed)
        this.each((x, y) => {
            this.set(x, y, noise.noise2D(x * scale, y * scale))
        })
    }

    scale(min: number, max: number): void {
        let maxValue = 0
        let minValue = 0
        this.each((_, __, v, index) => {
            if (index === 0) {
                maxValue = v
                minValue = v
            } else {
                maxValue = maxValue < v ? v : maxValue
                minValue = minValue > v ? v : minValue
            }
        })

        this.each((x, y, v) => {
            const scaledValue = scaleNumber(v, minValue, maxValue, min, max)
            this.set(x, y, scaledValue)
        })
        // console.log(minValue, maxValue)
    }

    addMatrix(secondMatrix: Matrix): void {
        this.each((x, y, v) => {
            const valueToAdd = secondMatrix.get(x, y)
            this.set(x, y, v + valueToAdd)
        })
    }

    multiplyMatrix(secondMatrix: Matrix): void {
        this.each((x, y, v) => {
            const valueToAdd = secondMatrix.get(x, y)
            this.set(x, y, v * valueToAdd)
        })
    }

    blendMatrix(secondMatrix: Matrix, callback: MatrixBlendCallback): void {
        this.each((x, y, v) => this.set(x, y, callback(v, secondMatrix.get(x, y))))
    }

    each(callback: MatrixEachCallback): void {
        let index = 0
        for (let y = 0; y < this.matrix.length; y++) {
            for (let x = 0; x < this.matrix[y].length; x++) {
                callback(x, y, this.get(x, y), index)
                index++
            }
        }
    }
}

export default Matrix
