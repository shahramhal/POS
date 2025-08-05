import React from 'react';

// A reusable component for each employee card
const EmployeeCard = ({ name, role }) => {
  return (
    // Responsive grid column: 2 columns on small screens, 3 on medium, 6 on large
    <div className="col-6 col-md-4 col-lg-2">
      <div className="card bg-body-tertiary border-0 text-center py-3 h-100">
        <div className="card-body">
          {/* Placeholder for the avatar image */}
          <div className="avatar-placeholder mx-auto mb-3"></div>
          <h5 className="card-title fs-6 fw-bold mb-1">{name}</h5>
          <p className="card-text text-body-secondary small">{role}</p>
        </div>
      </div>
    </div>
  );
};

const EmployeeLogin = () => {
  // Dummy data - in a real app, this would come from an API
  const employees = [
    { name: 'Sarah Johnson', role: 'Cashier' },
    { name: 'Mike Chen', role: 'Sales Associate' },
    { name: 'Emily Davis', role: 'Supervisor' },
    { name: 'James Wilson', role: 'Stock Clerk' },
    { name: 'Lisa Rodriguez', role: 'Customer Service' },
    { name: 'David Kim', role: 'Cashier' },
    { name: 'Anna Thompson', role: 'Sales Associate' },
    { name: 'Robert Martinez', role: 'Maintenance' },
    { name: 'Jennifer Lee', role: 'Assistant Manager' },
    { name: 'Chris Brown', role: 'Security' },
    { name: 'Maria Garcia', role: 'Cashier' },
    { name: 'Kevin Taylor', role: 'Stock Clerk' },
  ];

  return (
    <div className="container py-4">
      {/* HEADER SECTION */}
      <header className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <div className="bg-danger rounded-circle p-2 d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px' }}>
            <span className="fw-bold fs-4">R</span>
          </div>
          <div>
            <h1 className="fs-3 fw-bold mb-0">Restaurant Name</h1>
            <p className="text-body-secondary mb-0">Employee Clock-In</p>
          </div>
        </div>
        <div className="text-end">
          <h2 className="fs-3 fw-bold mb-0">11:13:31 PM</h2>
          <p className="text-body-secondary mb-0">Tuesday, August 5, 2025</p>
        </div>
      </header>

      {/* MANAGER LOGIN BUTTON */}
      <div className="d-flex justify-content-end mb-4">
        <button className="btn btn-primary">
          Manager Login
        </button>
      </div>

      {/* EMPLOYEE GRID */}
      <div className="row g-3">
        {employees.map((employee, index) => (
          <EmployeeCard key={index} name={employee.name} role={employee.role} />
        ))}
      </div>

      {/* FOOTER TEXT */}
      <div className="text-center mt-4">
        <p className="fs-5">Select your name to clock in or out</p>
        <p className="text-body-secondary">Don't see your name? Contact your manager or use the Manager Login above.</p>
      </div>
    </div>
  );
};

export default EmployeeLogin;