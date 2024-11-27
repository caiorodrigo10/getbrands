import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import Gleap from 'gleap'
import { initializeAnalytics } from './lib/analytics/initialize'

// Initialize Gleap
Gleap.initialize("qqAquIhEn19VOadZnGz2Xg48r3NoXdas");

// Initialize Segment Analytics
initializeAnalytics();

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

const root = createRoot(rootElement)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)