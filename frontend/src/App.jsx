import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Components
import Header from './components/comman/Header';
import Footer from './components/comman/Footer';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import KycForm from './pages/KycForm';
import MyTeam from './pages/MyTeam';
import Membership from './pages/Membership';
import Services from './pages/Services';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Levels from './pages/Levels';

const App = () => {
  return (
    <AuthProvider>
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #334155'
          }
        }}
      />

      <Router>
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <Header />

          {/* Main Content */}
          <main className="flex-grow">
            <Routes>
              {/* ===== PUBLIC ROUTES ===== */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/membership" element={<Membership />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              {/* ===== PROTECTED ROUTES ===== */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              <Route
                path="/update-kyc"
                element={
                  <PrivateRoute>
                    <KycForm />
                  </PrivateRoute>
                }
              />

              <Route
                path="/my-team"
                element={
                  <PrivateRoute>
                    <MyTeam />
                  </PrivateRoute>
                }
              />

              <Route
                path="/levels"
                element={
                  <PrivateRoute>
                    <Levels />
                  </PrivateRoute>
                }
              />

              {/* ===== 404 NOT FOUND ===== */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;