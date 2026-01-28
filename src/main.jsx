import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// قمنا بحذف سطر index.css لأنه كان يسبب المشكلة
// import './index.css' 
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
)