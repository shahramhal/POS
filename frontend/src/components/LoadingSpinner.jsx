const LoadingSpinner = () => {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 fs-5">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;