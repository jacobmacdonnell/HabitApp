import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// function App() {
//     return (
//         <div style={{ background: 'purple', color: 'white', padding: 20 }}>
//             <h1>INLINED APP COMPONENT</h1>
//         </div>
//     )
// }

console.log('DEBUG.JSX importing App.jsx...');
const root = document.getElementById('root');

if (root) {
    createRoot(root).render(
        <StrictMode>
            <App />
        </StrictMode>
    );
} else {
    console.error('No root element');
}
