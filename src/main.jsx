import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'
import { CommentContext} from './components/CommentContext';
import { ToggleThemeProvider } from './utils/ToggleThemeContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToggleThemeProvider>
      <CommentContext>
        <App />
      </CommentContext>
    </ToggleThemeProvider>
  </React.StrictMode>,
)
