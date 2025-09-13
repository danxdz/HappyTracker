import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import App from './App'
import './index.css'

// Fun loading animation
const LoadingScreen = () => {
  const [loading, setLoading] = React.useState(true)
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000) // 1 second loading for faster experience
    
    return () => clearTimeout(timer)
  }, [])
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-title">🎮 HappyTracker</div>
        <div className="loading-subtitle">Your Health MMO Adventure Awaits!</div>
        <div className="loading-spinner"></div>
        <div className="loading-emoji">🥗✨🎯</div>
        <div className="loading-text">
          Creating your personalized health journey...<br />
          <small>Powered by AI magic! ✨</small>
        </div>
      </div>
    )
  }
  
  return <App />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <LoadingScreen />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)