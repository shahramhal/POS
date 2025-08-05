import { useState } from "react"
import { useEmployees } from "../hooks/useEmployees"
import { useTime } from "../hooks/useTime"
import { useAuth } from "../context/AuthContext"
import EmployeeGrid from "./EmployeeGrid"
import PinEntry from "./PinEntry"
import Header from "./Header"
import LoadingSpinner from "./LoadingSpinner"

const EmployeeLogin = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [showPinScreen, setShowPinScreen] = useState(false)
  const { employees, loading, error } = useEmployees()
  const { currentTime, formatTime, formatDate } = useTime()
  const { login } = useAuth()

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee)
    setShowPinScreen(true)
  }

  const handlePinSubmit = async (pin) => {
    const result = await login(selectedEmployee.id, pin)
    if (result.success) {
      // Login successful, user will be redirected by App component
      return { success: true }
    } else {
      return { success: false, error: result.error }
    }
  }

  const handleBackToGrid = () => {
    setSelectedEmployee(null)
    setShowPinScreen(false)
  }

  const handleManagerLogin = () => {
    console.log("Manager login requested")
    alert("Manager login functionality would be implemented here")
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <Header
          currentTime={currentTime}
          formatTime={formatTime}
          formatDate={formatDate}
          onManagerLogin={handleManagerLogin}
          showBackButton={showPinScreen}
          onBack={handleBackToGrid}
        />

        {showPinScreen && selectedEmployee ? (
          <PinEntry
            employee={selectedEmployee}
            onPinSubmit={handlePinSubmit}
            onBack={handleBackToGrid}
          />
        ) : (
          <EmployeeGrid
            employees={employees}
            onEmployeeSelect={handleEmployeeSelect}
          />
        )}
      </div>
    </div>
  )
}

export default EmployeeLogin