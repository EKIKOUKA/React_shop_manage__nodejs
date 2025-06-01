import React from 'react'
import ReactDOM from 'react-dom/client'
import { StrictMode } from 'react'
import { HashRouter } from 'react-router-dom'
import 'antd/dist/reset.css'
// import './index.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <HashRouter>
            <App />
        </HashRouter>
    </React.StrictMode>
)
