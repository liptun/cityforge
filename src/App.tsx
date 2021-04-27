import React, { useEffect, useState, useCallback } from 'react'
import Game from './Game/Game'

function App() {
    const [game, setGame] = useState<Game>()
    const [seed, setSeed] = useState<string>('cityforge')
    const [seaLevel, setSeaLevel] = useState<number>(0)
    const [roughness, setRoughness] = useState<number>(0.2)
    const [mountainess, setMountainess] = useState<number>(2)
    const [debugNoise, setDebugNoise] = useState<boolean>(false)

    useEffect(() => {
        const gameInstance = new Game()
        setGame(gameInstance)
    }, [])
    
    const generateMapHandle = useCallback(() => {
        game?.generateMap()
    }, [game])


    useEffect(() => {
        generateMapHandle()
    }, [seed, seaLevel, roughness, mountainess, debugNoise, generateMapHandle])


    return (
        <div className="App">
            <div className="Sidebar">
                <div className="Option">
                    <p>Seed</p>
                    <input type="text" onChange={(e) => setSeed(e.currentTarget.value)} value={seed} />
                </div>
                <div className="Option">
                    <p>Sea Level: {seaLevel}</p>
                    <input
                        type="number"
                        min="-1"
                        max="1"
                        step={0.1}
                        value={seaLevel}
                        onChange={(e) => setSeaLevel(Number(e.currentTarget.value))}
                    />
                </div>
                <div className="Option">
                    <p>Roughness: {roughness}</p>
                    <input
                        type="number"
                        min="0"
                        max="1"
                        step={0.1}
                        value={roughness}
                        onChange={(e) => setRoughness(Number(e.currentTarget.value))}
                    />
                </div>
                <div className="Option">
                    <p>Mountainess: {mountainess}</p>
                    <input
                        type="number"
                        min="0"
                        max="5"
                        step={0.1}
                        value={mountainess}
                        onChange={(e) => setMountainess(Number(e.currentTarget.value))}
                    />
                </div>
                <div className="Option">
                    <p>Toggle debug noise</p>
                    <button onClick={() => {
                        setDebugNoise(!debugNoise)
                    }}>{debugNoise ? 'enabled' : 'disabled'}</button>
                </div>
                <div className="Option">
                    <button onClick={generateMapHandle}>Generate</button>
                </div>
            </div>
            <canvas id="game"></canvas>
        </div>
    )
}
export default App
