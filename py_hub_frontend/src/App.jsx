// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
// import './App.css'
import routes from "./routes";
import { AuthProvider } from "@hooks/useAuth";
import { UIProvider } from "@hooks/useUI";
import { MainProvider } from "@hooks/useMainContext";

function AppRoutes() {
  return useRoutes(routes);
}

function App() {
  return (
    <>
      <Router>
        <MainProvider>
          <AppRoutes />
        </MainProvider>
        {/* <UIProvider>
          <AuthProvider>
          </AuthProvider>
        </UIProvider> */}
      </Router>
    </>
  );
}

export default App;
