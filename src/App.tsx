import React, { useEffect, useState, useCallback } from 'react'
import Game from './Game/Game'

function App() {
    const [game, setGame] = useState<Game>()
    const [seed, setSeed] = useState<string>('')

    useEffect(() => {
        const gameInstance = new Game()
        setGame(gameInstance)
    }, [])
    
    const generateMapHandle = useCallback(() => {
        game?.generateMap(seed)
    }, [game, seed])

    return (
        <div className="App">
            <div className="Sidebar">
                <div className="Option">
                    <p>Seed</p>
                    <input type="text" onChange={(e) => setSeed(e.currentTarget.value)} value={seed} />
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
