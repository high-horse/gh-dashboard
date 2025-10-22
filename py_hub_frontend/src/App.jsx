// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import {BrowserRouter as Router,  useRoutes } from 'react-router-dom'
// import './App.css'
import routes from './routes'
import { AuthProvider } from '@hooks/useAuth'

function AppRoutes() {
  return useRoutes(routes)
}

function App() {

  return (
    <>
    <AuthProvider>
     <Router>
      <AppRoutes />
     </Router>
    </AuthProvider>
    </>
  )
}

export default App
