import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import Gleap from 'gleap'

// Initialize Gleap with custom styling
Gleap.initialize("qqAquIhEn19VOadZnGz2Xg48r3NoXdas");

// Configure Gleap widget appearance
Gleap.getInstance().setUIConfig({
  primaryColor: "#4c1e6c",
  headerColor: "#4c1e6c",
  buttonColor: "#4c1e6c",
});

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

const root = createRoot(rootElement)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)