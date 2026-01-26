import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import MemberList from './pages/MemberList';
import WithdrawalRequests from './pages/WithdrawalRequests';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/auth/ProtectedRoute';
import GenealogyTree from './pages/GenealogyTree';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AdminProvider>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          {/* 1. Public Routes */}
          {/* Base URL ko login par redirect karein */}
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* 2. 🛡️ Locked/Protected Admin Routes */}
          {/* Note: Inke paths absolute rakhein taaki /admin/admin error na aaye */}
          <Route path="/admin" element={
            <ProtectedRoute> <Dashboard /> </ProtectedRoute>
          } />

          <Route path="/admin/members" element={
            <ProtectedRoute> <MemberList /> </ProtectedRoute>
          } />

          <Route path="/admin/withdrawals" element={
            <ProtectedRoute> <WithdrawalRequests /> </ProtectedRoute>
          } />

          <Route path="/admin/tree/:userId" element={
            <ProtectedRoute> <GenealogyTree /> </ProtectedRoute>
          } />

          {/* 3. 🚩 Catch-all 404 Route (Ab ye <Routes> ke andar hai) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AdminProvider>
  );
}

export default App;