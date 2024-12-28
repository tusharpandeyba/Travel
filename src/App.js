import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import OrganiserDashboard from './components/OrganiserDashBoard';
import CartPage from './components/CartPage';
import UserDashboard from './components/UserDashBoard';
import LoginPage from './components/Login';
import RegisterPage from './components/Register';
import PaymentPage from './components/PaymentPage';

function App() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Fetch user ID dynamically from localStorage
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    
    if (token && storedUserId) {
      setUserId(storedUserId);
    }
  }, []); // This effect will run once on component mount

  const handleLogin = (userData) => {
    // Assuming `userData` contains `token` and `userId`
    localStorage.setItem('token', userData.token);
    localStorage.setItem('userId', userData.userId);
    
    setUserId(userData.userId); // Update state with the new userId
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/organiserDashBoard" element={<OrganiserDashboard userId={userId} />} />
        <Route path="/cart" element={userId ? <CartPage userId={userId} /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/userDetails" element={userId ? <UserDashboard userId={userId} /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>
    </Router>
  );
}

export default App;
