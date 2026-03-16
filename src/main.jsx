import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AdminUpload from './pages/AdminUpload'
import Login from './pages/Login'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/panel-admin" element={<AdminUpload />} />
        <Route path="/admin-upload" element={<AdminUpload />} />
      </Routes>
    </Router>
  </StrictMode>,
)
