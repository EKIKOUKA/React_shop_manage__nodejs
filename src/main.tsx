import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import 'antd/dist/reset.css'
import './index.scss'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
    // <React.StrictMode>
        <HashRouter>
            <App />
        </HashRouter>
    // </React.StrictMode>
)
