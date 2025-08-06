import React from 'react'; 
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import EmployeeLogin from './components/EmployeeLogin';
import Dashboard from './components/Dashboard';
import LoadingSpinner from './components/LoadingSpinner'; // We'll convert this to Bootstrap next
import './App.css';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return user ? <Dashboard /> : <EmployeeLogin />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;