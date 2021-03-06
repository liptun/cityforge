import React from 'react'
import ReactDOM from 'react-dom'
import { createGlobalStyle } from 'styled-components'
// import './index.scss'
import App from './App'

const GlobalStyles = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;400&display=swap');

    * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        font-family: 'Roboto', sans-serif;
    }

    body {
        background-color: #333;
    }

    canvas {
        display: block;
        @media (max-width: 767px) {
            width: 100%;
            margin: auto;
        }
    }

    .App {
        display: flex;
        flex-wrap: wrap;
    }
    .Sidebar {
        width: 300px;
        background-color: .7;
        padding: 30px;
        @media (max-width: 767px) {
            width: 100%;
            padding: 15px;
        }
    }
    .Option {
        display: grid;
        grid-gap: 10px;
        color: white;
        padding: 8px 0;
        p {
            font-size: 1.2em;
            font-weight: 300;
        }
        button {
            border: 0;
            display: block;
            padding: 5px;
            background-color: #111;
            color: white;
            cursor: pointer;
            &:hover {
                background-color: rgb(224, 71, 0);
            }
        }
    }
`

ReactDOM.render(
    <React.StrictMode>
        <GlobalStyles />
        <App />
    </React.StrictMode>,
    document.getElementById('root')
)
