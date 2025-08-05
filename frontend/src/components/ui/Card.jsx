const Card = ({ className = "", children, ...props }) => {
  return (
    <div className={`rounded-lg border bg-gray-800 border-gray-700 text-white shadow-sm ${className}`} {...props}>
      {children}
    </div>
  )
}

export default Card