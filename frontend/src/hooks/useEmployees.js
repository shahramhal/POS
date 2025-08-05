// src/hooks/useEmployees.js
import { useState, useEffect } from "react"
import { employeeService } from "../services/employeeService"

export const useEmployees = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await employeeService.getAllEmployees()
        setEmployees(data)
      } catch (error) {
        console.error("Error fetching employees:", error)
        setError("Failed to load employees")
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  return { employees, loading, error }
}