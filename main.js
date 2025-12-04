import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './src/index.css'
import App from './src/App'

console.log('Main.jsx starting...');
const root = document.getElementById('root')
console.log('Root element found:', root);

if (root) {
    try {
        const rootNode = createRoot(root);
        console.log('Root node created, rendering App...');
        rootNode.render(
            <StrictMode>
                <App />
            </StrictMode>,
        )
        console.log('Render called successfully');
    } catch (e) {
        console.error('CRITICAL RENDER ERROR:', e);
    }
} else {
    console.error('ROOT ELEMENT NOT FOUND');
}
