import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AdminUpload from './pages/AdminUpload'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/panel-admin" element={<ProtectedRoute><AdminUpload /></ProtectedRoute>} />
        <Route path="/admin-upload" element={<ProtectedRoute><AdminUpload /></ProtectedRoute>} />
      </Routes>
    </Router>
  </StrictMode>,
)
