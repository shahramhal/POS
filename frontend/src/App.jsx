import React from 'react'; 
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import EmployeeLogin from './components/EmployeeLogin';
import Dashboard from './components/Dashboard';
import LoadingSpinner from './components/LoadingSpinner'; 
import {EmployeeRegister} from './components/EmployeeRegister';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<EmployeeLogin />} />
          <Route path="/register" element={<EmployeeRegister />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;