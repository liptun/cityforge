import React, { useEffect, useState, useCallback } from 'react'
import Game from './Game/Game'

function App() {
    const [game, setGame] = useState<Game>()
    const [seed, setSeed] = useState<string>('')
    useEffect(() => {
        const gameInstance = new Game()
        setGame(gameInstance)
        return () => {
            gameInstance.kill()
        }
    }, [])
    const generateMapHandle = useCallback(() => {
        game?.generateMap(seed)
    }, [game, seed])
    return (
        <div className="App">
            <input type="text" placeholder="seed" onChange={(e) => setSeed(e.currentTarget.value)}/>
            <button onClick={generateMapHandle}>Generate</button>
            <canvas id="game"></canvas>
        </div>
    )
}
export default App
