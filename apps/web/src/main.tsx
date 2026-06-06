import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import { LoginPage } from './components/pages/LoginPage'

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <LoginPage />
  </StrictMode>,
)
