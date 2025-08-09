import { useState } from "react";
// import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from "./LoadingSpinner";
import { createEmployee } from '../services/EmployeeLogin';

export const EmployeeRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password_hash: '',  // Changed from password to match backend schema
        role: 'waiter',
        is_active: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await createEmployee(formData);
            setSuccess(true);
            setFormData({
                name: '',
                email: '',
                password_hash: '',
                role: 'waiter',
                is_active: true
            });
            console.log("Employee created successfully:", response);
        } catch (err) {
            setError(err.message || 'Failed to create employee');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-header">
                    <h3>Register New Employee</h3>
                </div>
                <div className="card-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">Employee created successfully!</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                name="password_hash"
                                value={formData.password_hash}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Role</label>
                            <select
                                className="form-select"
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                            >
                                <option value="waiter">Waiter</option>
                                <option value="kitchen">Kitchen</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleInputChange}
                            />
                            <label className="form-check-label">Active</label>
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Employee'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};