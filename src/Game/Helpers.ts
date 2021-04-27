export const scaleNumber = (value: number, rMin: number, rMax: number, tMin: number, tMax: number): number => {
    return ((value - rMin) / (rMax - rMin)) * (tMax - tMin) + tMin
}
