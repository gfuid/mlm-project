import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // 🚩 Pehle context import karein
import { Toaster } from 'react-hot-toast'; // 🚩 Notifications ke liye

// Components
import Header from './components/comman/Header';
import Footer from "./components/comman/Footer";
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import KycForm from './pages/KycForm';
import MyTeam from './pages/MyTeam';
import Membership from './pages/Membership'; // Spelling fix: memberber -> Membership
import Services from './pages/Services';
import About from './pages/About';

const App = () => {
  return (
    <AuthProvider> {/* 🚩 Sabse upar AuthProvider zaroori hai */}
      <Toaster position="top-center" /> {/* Notifications ke liye */}
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />

          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/membership" element={<Membership />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected User Routes */}
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/kyc-update" element={<PrivateRoute><KycForm /></PrivateRoute>} />
              <Route path="/my-team" element={<PrivateRoute><MyTeam /></PrivateRoute>} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;