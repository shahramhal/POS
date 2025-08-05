"use client"

import { useState, useEffect } from "react"
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
import { Shield, User, ArrowLeft, Delete, Loader2 } from "lucide-react"

// Step 1: Import the API service functions
import { getAllUsers, loginUserWithPin } from "../services/api.js" // Adjust the path if it's different

export default function EmployeeLogin() {
  // --- STATE MANAGEMENT ---
  const [currentTime, setCurrentTime] = useState(new Date())
  
  // State for real employee data from the API
  const [employees, setEmployees] = useState([]) 
  const [isLoading, setIsLoading] = useState(true)
  const [apiError, setApiError] = useState(null)

  // State for the login flow
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [showPinScreen, setShowPinScreen] = useState(false)
  const [enteredPin, setEnteredPin] = useState("")
  const [pinError, setPinError] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // --- EFFECTS ---

  // Effect to fetch users from the API when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        setApiError(null)
        const usersFromApi = await getAllUsers()
        
        // Format the user data for the UI (e.g., adding a placeholder avatar)
        const formattedUsers = usersFromApi.map(user => ({
            ...user,
            avatar: `https://placehold.co/80x80/60A5FA/FFFFFF?text=${user.name.charAt(0)}`
        }));
        setEmployees(formattedUsers)
      } catch (error) {
        console.error("Failed to fetch employees:", error)
        setApiError("Could not load employee data. Please check the connection and refresh.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, []) // Empty dependency array means this runs once on mount

  // Effect to update the clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])


  // --- HANDLERS ---

  const handleEmployeeSelect = (employeeId) => {
    setSelectedEmployee(employeeId)
    setShowPinScreen(true)
    setEnteredPin("")
    setPinError(false)
  }

  const handleManagerLogin = () => {
    // This would typically navigate to a different route/component for manager login
    console.log("Manager login requested")
    setApiError("Manager login page is not implemented yet.")
  }

  const handlePinDigit = (digit) => {
    if (enteredPin.length < 6) {
      setEnteredPin((prev) => prev + digit)
      setPinError(false)
    }
  }

  const handlePinClear = () => {
    setEnteredPin("")
    setPinError(false)
  }

  const handlePinDelete = () => {
    setEnteredPin((prev) => prev.slice(0, -1))
    setPinError(false)
  }

  // Step 2: Modify the PIN confirm handler to call the API
  const handlePinConfirm = async () => {
    const employee = employees.find((emp) => emp.id === selectedEmployee)
    if (!employee) return

    setIsLoggingIn(true)
    setPinError(false)

    try {
      // Use the employee's email and the entered PIN to log in
      const loginResponse = await loginUserWithPin(employee.email, enteredPin)
      
      console.log("Login successful! Token:", loginResponse.access_token)
      // TODO: Save the token to your global state (Context/Zustand/Redux)
      // and navigate to the main POS screen.

      // For now, just show the success message and reset
      setTimeout(() => {
        handleBackToEmployeeGrid()
      }, 2000)

    } catch (error) {
      console.error("Login failed:", error.message)
      setPinError(true) // Show the "Incorrect PIN" message
      setEnteredPin("")
      setIsLoggingIn(false) // Stop the loading state on failure
    }
  }

  const handleBackToEmployeeGrid = () => {
    setSelectedEmployee(null)
    setShowPinScreen(false)
    setEnteredPin("")
    setPinError(false)
    setIsLoggingIn(false)
  }

  // --- UTILITY FUNCTIONS ---
  const formatTime = (date) => date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
  const formatDate = (date) => date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
  
  const selectedEmployeeData = employees.find((emp) => emp.id === selectedEmployee)

  // --- RENDER LOGIC ---

  // PIN Entry Screen
  if (showPinScreen && selectedEmployeeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <Button onClick={handleBackToEmployeeGrid} variant="outline" className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <div className="text-right">
              <div className="text-xl font-mono font-bold text-blue-400">{formatTime(currentTime)}</div>
              <div className="text-xs text-gray-300">{formatDate(currentTime)}</div>
            </div>
          </div>

          <div className="text-center mb-6">
            <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-gray-700">
              <AvatarImage src={selectedEmployeeData.avatar} alt={selectedEmployeeData.name} />
              <AvatarFallback className="bg-blue-900 text-blue-300 text-2xl"><User className="h-12 w-12" /></AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold text-white mb-2">{selectedEmployeeData.name}</h2>
            <Badge variant="secondary">{selectedEmployeeData.role}</Badge>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4 text-center">
             <p className="text-gray-300 mb-4">Enter PIN</p>
            <div className="flex justify-center items-center gap-3 h-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className={`w-4 h-4 rounded-full border-2 transition-colors ${index < enteredPin.length ? "bg-blue-400 border-blue-400" : "border-gray-600"}`} />
              ))}
            </div>
            {pinError && <p className="text-red-400 text-center text-sm mt-2">Incorrect PIN. Please try again.</p>}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
              <Button key={digit} onClick={() => handlePinDigit(digit.toString())} className="h-20 text-3xl font-bold bg-gray-700 hover:bg-gray-600" disabled={isLoggingIn}>
                {digit}
              </Button>
            ))}
            <Button onClick={handlePinClear} className="h-20 text-lg bg-yellow-600 hover:bg-yellow-700" disabled={isLoggingIn}>Clear</Button>
            <Button onClick={() => handlePinDigit("0")} className="h-20 text-3xl font-bold bg-gray-700 hover:bg-gray-600" disabled={isLoggingIn}>0</Button>
            <Button onClick={handlePinDelete} className="h-20 bg-yellow-600 hover:bg-yellow-700" disabled={isLoggingIn}><Delete className="h-8 w-8" /></Button>
          </div>

          <div className="mt-4">
            <Button onClick={handlePinConfirm} disabled={enteredPin.length === 0 || isLoggingIn} className="w-full h-20 text-xl bg-green-600 hover:bg-green-700 disabled:opacity-50">
              {isLoggingIn ? <Loader2 className="h-8 w-8 animate-spin" /> : "Confirm PIN"}
            </Button>
          </div>
        </div>
        {isLoggingIn && !pinError && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <Card className="bg-gray-800 border-gray-700 p-8"><CardContent className="text-center">
              <div className="text-green-400 text-6xl mb-4">✓</div>
              <h3 className="text-2xl font-bold text-white mb-2">Login Successful!</h3>
              <p className="text-gray-300">Welcome, {selectedEmployeeData.name}</p>
            </CardContent></Card>
          </div>
        )}
      </div>
    )
  }

  // Main Employee Selection Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-lg"><span className="text-white font-bold text-xl">P</span></div>
            <div>
              <h1 className="text-2xl font-bold text-white">POS System</h1>
              <p className="text-gray-300">Employee Clock-In</p>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-4 text-right">
            <div className="text-2xl font-mono font-bold text-blue-400">{formatTime(currentTime)}</div>
            <div className="text-sm text-gray-300">{formatDate(currentTime)}</div>
          </div>
        </div>

        <div className="flex justify-end mb-6">
          <Button onClick={handleManagerLogin} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg" size="lg">
            <Shield className="mr-2 h-5 w-5" /> Manager Login
          </Button>
        </div>
        
        {/* Step 3: Handle Loading and Error states for the grid */}
        {isLoading ? (
            <div className="text-center text-white py-20">
                <Loader2 className="h-12 w-12 mx-auto animate-spin text-blue-400" />
                <p className="mt-4 text-lg">Loading Employees...</p>
            </div>
        ) : apiError ? (
            <div className="text-center bg-red-900 border border-red-700 text-white p-8 rounded-lg">
                <h3 className="text-2xl font-bold mb-2">Error</h3>
                <p>{apiError}</p>
            </div>
        ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {employees.map((employee) => (
                <Card key={employee.id} className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 bg-gray-800 border-gray-700 text-white hover:bg-gray-700" onClick={() => handleEmployeeSelect(employee.id)}>
                  <CardContent className="p-4 text-center">
                    <Avatar className="h-16 w-16 mx-auto mb-3 border-2 border-gray-600">
                      <AvatarImage src={employee.avatar} alt={employee.name} />
                      <AvatarFallback className="bg-blue-900 text-blue-300"><User className="h-8 w-8" /></AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-white mb-1 text-sm">{employee.name}</h3>
                    <Badge variant="secondary" className="text-xs">{employee.role}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
        )}

      </div>
    </div>
  )
}
