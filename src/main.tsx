import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import Gleap from 'gleap'
import { AuthProvider } from "./contexts/AuthContext"
import { BrowserRouter } from "react-router-dom"

// Initialize Gleap
Gleap.initialize("qqAquIhEn19VOadZnGz2Xg48r3NoXdas");

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

const root = createRoot(rootElement)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)