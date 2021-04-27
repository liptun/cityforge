import SimplexNoise from 'simplex-noise'
import { scaleNumber } from './Helpers'

export interface MatrixCallbackParams {
    x: number
    y: number
    v: number
    i: number
}
export type MatrixEachCallback = (params: MatrixCallbackParams) => void
export type MatrixEachSetCallback = (params: MatrixCallbackParams) => number
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
        if (typeof this.matrix[y] !== 'undefined' && typeof this.matrix[y][x] !== 'undefined') {
            return this.matrix[y][x]
        }
        return 0
    }

    set(x: number, y: number, v: number): void {
        this.matrix[y][x] = v
    }

    applyMatrix(matrix: Matrix): void {
        this.eachSet(({ x, y }) => matrix.get(x, y))
    }

    each(callback: MatrixEachCallback): void {
        let index = 0
        for (let y = 0; y < this.matrix.length; y++) {
            for (let x = 0; x < this.matrix[y].length; x++) {
                callback({ x, y, v: this.get(x, y), i: index })
                index++
            }
        }
    }

    eachSet(callback: MatrixEachSetCallback): void {
        this.each(({ x, y, v, i }) => this.set(x, y, callback({ x, y, v, i })))
    }

    noise(seed: string, scale: number): void {
        const noise = new SimplexNoise(seed)
        this.each(({ x, y }) => {
            this.set(x, y, noise.noise2D(x * scale, y * scale))
        })
    }

    scale(min: number, max: number): void {
        let maxValue = 0
        let minValue = 0
        this.each(({ v, i }) => {
            if (i === 0) {
                maxValue = v
                minValue = v
            } else {
                maxValue = maxValue < v ? v : maxValue
                minValue = minValue > v ? v : minValue
            }
        })

        this.each(({ x, y, v }) => {
            const scaledValue = scaleNumber(v, minValue, maxValue, min, max)
            this.set(x, y, scaledValue)
        })
    }

    absolute(): void {
        this.eachSet(({ v }) => Math.abs(v))
    }

    treshold(treshold: number): void {
        this.eachSet(({ v }) => (v > treshold ? 1 : 0))
    }

    inverse(): void {
        this.eachSet(({ v }) => v * -1 + 1)
    }

    smooth(steps = 3): void {
        for (let i = 0; i < steps; i++) {
            this.eachSet(({ x, y, v }) => {
                const sumAdjacent =
                    this.get(x - 1, y - 1) +
                    this.get(x, y - 1) +
                    this.get(x + 1, y - 1) +
                    this.get(x - 1, y) +
                    v +
                    this.get(x + 1, y) +
                    this.get(x - 1, y + 1) +
                    this.get(x, y + 1) +
                    this.get(x + 1, y + 1)
                return Math.abs(sumAdjacent) > 0 ? sumAdjacent / 9 : 1
            })
        }
    }

    addMatrix(secondMatrix: Matrix): void {
        this.each(({ x, y, v }) => {
            const valueToAdd = secondMatrix.get(x, y)
            this.set(x, y, v + valueToAdd)
        })
    }

    multiplyMatrix(secondMatrix: Matrix): void {
        this.each(({ x, y, v }) => {
            const valueToAdd = secondMatrix.get(x, y)
            this.set(x, y, v * valueToAdd)
        })
    }

    blendMatrix(secondMatrix: Matrix, callback: MatrixBlendCallback): void {
        this.each(({ x, y, v }) => this.set(x, y, callback(v, secondMatrix.get(x, y))))
    }
}

export default Matrix
