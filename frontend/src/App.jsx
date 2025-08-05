import { useAuth } from './context/AuthContext.jsx';
import EmployeeLogin from './components/EmployeeLogin.jsx';
import Dashboard from './components/Dashboard.jsx';
import './App.css';

function App() {
  const { user } = useAuth();

  return (
    <div className="App min-vh-100" data-bs-theme="dark">
      {user ? <Dashboard /> : <EmployeeLogin />}
    </div>
  );
}

export default App;