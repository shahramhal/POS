// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react"
import { employeeService } from "../services/employeeService"

// Create the context
export const d = createContext()

// Custom hook to use the auth context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = async (employeeId, pin) => {
    setLoading(true)
    setError(null)
    
    try {
      const employee = await employeeService.authenticateEmployee(employeeId, pin)
      if (employee) {
        setUser(employee)
        return { success: true, employee }
      } else {
        setError("Invalid PIN")
        return { success: false, error: "Invalid PIN" }
      }
    } catch (err) {
      console.error("Authentication error:", err)
      setError("Authentication failed")
      return { success: false, error: "Authentication failed" }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setError(null)
  }

  const clockIn = async () => {
    if (!user) return { success: false, error: "No user logged in" }
    
    try {
      const result = await employeeService.clockIn(user.id)
      return result
    } catch (err) {
      console.error("Clock in error:", err)
      return { success: false, error: "Clock in failed" }
    }
  }

  const clockOut = async () => {
    if (!user) return { success: false, error: "No user logged in" }
    
    try {
      const result = await employeeService.clockOut(user.id)
      return result
    } catch (err) {
      console.error("Clock out error:", err)
      return { success: false, error: "Clock out failed" }
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    clockIn,
    clockOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}