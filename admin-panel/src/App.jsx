import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext'; // 👈 Wrap here
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import MemberList from './pages/MemberList';
import WithdrawalRequests from './pages/WithdrawalRequests';
import { Toaster } from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute'; // Import karein
import GenealogyTree from './pages/GenealogyTree';

function App() {
  return (
    <AdminProvider>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/" element={<Navigate to="/admin/login" />} />

          {/* 🛡️ Protected Master Routes */}
          <Route path="/admin" element={
            <ProtectedRoute> <Dashboard /> </ProtectedRoute>
          } />
          <Route path="/admin/members" element={
            <ProtectedRoute> <MemberList /> </ProtectedRoute>
          } />
          <Route path="/admin/withdrawals" element={
            <ProtectedRoute> <WithdrawalRequests /> </ProtectedRoute>
          } />
          {/* Genealogy Tree ko bhi protect karein */}
          <Route path="/admin/tree/:userId" element={
            <ProtectedRoute> <GenealogyTree /> </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AdminProvider>
  );
}


export default App;