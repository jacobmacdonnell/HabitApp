import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

console.log('DEBUG.JSX importing App.jsx...');
const root = document.getElementById('root');

if (root) {
    createRoot(root).render(
        <StrictMode>
            <ThemeProvider>
                <App />
            </ThemeProvider>
        </StrictMode>
    );
} else {
    console.error('No root element');
}
