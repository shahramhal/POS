import React, { useState, useEffect } from 'react';
import{useAuth} from '../hooks/useAuth';
import { getAllUsers } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const EmployeeLogin = () => {
    const { login, error: authError } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [pin, setPin] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        document.body.setAttribute('data-bs-theme', 'dark');
        const fetchUsers = async () => {
            try {
                const users = await getAllUsers();
                setEmployees(users);
            } catch (err) {
                setApiError(err.message || 'Failed to fetch employees.');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
         const timer = setInterval(() => setCurrentTime(new Date()), 1000);
         return () => {
            clearInterval(timer);
            document.body.removeAttribute('data-bs-theme');
         }
    }, []);

    const handlePinSubmit = async (e) => {
        e.preventDefault();
        if (!selectedEmployee) return;

        setIsSubmitting(true);
        await login(selectedEmployee.email, pin);
        setIsSubmitting(false);
        setPin(''); // Clear PIN on attempt
    };
    
    const formatTime = (date) => date.toLocaleTimeString("en-US");
    const formatDate = (date) => date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    if (loading) return <LoadingSpinner />;

    // PIN Entry Screen
    if (selectedEmployee) {
        return (
            <div className="container d-flex flex-column justify-content-center min-vh-100" style={{ maxWidth: '400px' }}>
                <div className="text-center">
                     <p className="h2 mb-3">Welcome, {selectedEmployee.name}</p>
                     <p className="text-muted mb-4">{selectedEmployee.role}</p>
                     <form onSubmit={handlePinSubmit}>
                        <div className="mb-3">
                            <label htmlFor="pinInput" className="form-label fs-5">Enter PIN</label>
                            <input 
                                type="password" 
                                id="pinInput"
                                className="form-control form-control-lg text-center"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                maxLength="6"
                                disabled={isSubmitting}
                                autoFocus
                            />
                        </div>
                        {(authError) && <p className="text-danger">{authError}</p>}
                        <div className="d-grid gap-2">
                             <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
                                {isSubmitting ? 'Logging in...' : 'Login'}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={() => setSelectedEmployee(null)}>
                                Back to Employee List
                            </button>
                        </div>
                     </form>
                </div>
            </div>
        );
    }

    // Employee Grid Screen
    return (
        <div className="container py-4">
            <header className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="fs-2 fw-bold mb-0">Restaurant Name</h1>
                    <p className="text-body-secondary mb-0">Employee Clock-In</p>
                </div>
                <div className="text-end">
                    <h2 className="fs-4 fw-bold mb-0">{formatTime(currentTime)}</h2>
                    <p className="text-body-secondary mb-0 small">{formatDate(currentTime)}</p>
                </div>
            </header>
             <div className="d-flex justify-content-end mb-4">
                <button className="btn btn-primary">Manager Login</button>
            </div>
            
            {apiError && <div className="alert alert-danger">{apiError}</div>}
            
            <div className="row g-3">
                {Array.isArray(employees) && employees.map(employee =>  (
                    <div key={employee.id} className="col-6 col-md-4 col-lg-2">
                        <div className="card bg-body-tertiary border-0 text-center py-3 h-100" onClick={() => setSelectedEmployee(employee)} style={{cursor: 'pointer'}}>
                            <div className="card-body">
                                <h5 className="card-title fs-6 fw-bold mb-1">{employee.name}</h5>
                                <p className="card-text text-body-secondary small">{employee.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
             <div className="text-center mt-4">
                <p className="fs-5">Select your name to clock in or out</p>
            </div>
        </div>
    );
};

export default EmployeeLogin;