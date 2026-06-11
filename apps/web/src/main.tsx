import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './styles.css'
import { LoginPage } from './components/pages/LoginPage'
import { SignupPage } from './components/pages/SignupPage'
import { ProfilePage } from './components/pages/ProfilePage'
import { FeedPage } from './components/pages/FeedPage'
import { PostDetailPage } from './components/pages/PostDetailPage'
import { CreatePostPage } from './components/pages/CreatePostPage'
import { RequireAuth } from './components/organisms/RequireAuth'

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/feed" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<SignupPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/posts/novo" element={<RequireAuth><CreatePostPage /></RequireAuth>} />
        <Route path="/posts/:slug" element={<PostDetailPage />} />
        <Route
          path="/perfil"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
