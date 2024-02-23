import React, { useState, useEffect } from 'react';
import './App.css';
import { HomePage } from './HomePage/HomePage';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import './components/CampaignModal.css';
import './components/CreateOrganizationModel.css';
import { ContentManagement } from './ContentManagement/ContentManagement';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedInUserData, setLoggedInUserData] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (response) => {
    localStorage.setItem('token', response.token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    localStorage.clear()
  };

  return (
    <BrowserRouter basename="/AR-Game-CMS">
      <div>
        <Routes>
          <Route
            path="/content-management"
            element={
              isAuthenticated ? (
                <ContentManagement handleLogout={handleLogout} userData={loggedInUserData} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="/" element={isAuthenticated ? (<Navigate to="/details" replace />) : (<LoginForm handleLogin={handleLogin} setLoggedInUserData={setLoggedInUserData} />)} />
          <Route path="/details" element={isAuthenticated ? (<HomePage handleLogout={handleLogout} loggedInUserData={loggedInUserData} />) : (<Navigate to="/" replace />)} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
