import { useContext } from 'react';
// Import the context itself, which is now the default export from AuthContext.jsx
import { AuthContext } from '../context/AuthContext';

// This custom hook provides an easy way to access the auth context.
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        // This error will be thrown if the hook is used outside of the AuthProvider,
        // which helps catch bugs early.
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
