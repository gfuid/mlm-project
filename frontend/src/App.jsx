import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/comman/Header';
import Footer from './components/comman/Footer';
import Home from './pages/Home';
import Login from './pages//Login';
import Register from './pages//Register';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import KycForm from './pages/KycForm';
import MyTeam from './pages/MyTeam';
// PrivateRoute logic


const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Global Header */}
        <Header />

        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected User Routes */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/kyc-update" element={<PrivateRoute><KycForm /></PrivateRoute>} />
            <Route path="/my-team" element={<PrivateRoute><MyTeam /></PrivateRoute>} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;