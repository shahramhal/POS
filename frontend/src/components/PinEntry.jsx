import { useState } from "react"
import { useTime } from "../hooks/useTime"
import Button from "./ui/Button"
import Card from "./ui/Card"
import Avatar from "./ui/Avatar"
import Badge from "./ui/Badge"
import { User, Delete, ArrowLeft } from 'lucide-react'

const PinEntry = ({ employee, onPinSubmit, onBack }) => {
  const [enteredPin, setEnteredPin] = useState("")
  const [pinError, setPinError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { currentTime, formatTime, formatDate } = useTime()

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

  const handlePinConfirm = async () => {
    if (enteredPin.length === 0) return

    setIsSubmitting(true)
    const result = await onPinSubmit(enteredPin)
    
    if (!result.success) {
      setPinError(true)
      setEnteredPin("")
    }
    setIsSubmitting(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back button and time */}
      <div className="flex justify-between items-center mb-8">
        <Button onClick={onBack} variant="outline" className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="text-right">
          <div className="text-xl font-mono font-bold text-blue-400">{formatTime(currentTime)}</div>
          <div className="text-xs text-gray-300">{formatDate(currentTime)}</div>
        </div>
      </div>

      {/* Employee Info */}
      <div className="text-center mb-8">
        <Avatar className="h-24 w-24 mx-auto mb-4">
          <img
            src={employee.avatar || "/placeholder.svg"}
            alt={employee.name}
            className="aspect-square h-full w-full object-cover"
          />
          <div className="bg-blue-900 text-blue-300 text-2xl flex h-full w-full items-center justify-center rounded-full">
            <User className="h-12 w-12" />
          </div>
        </Avatar>
        <h2 className="text-2xl font-bold text-white mb-2">{employee.name}</h2>
        <Badge variant="secondary" className="mb-4">
          {employee.role}
        </Badge>
        <p className="text-gray-300">Enter your PIN to clock in</p>
      </div>

      {/* PIN Display */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
        <div className="flex justify-center items-center gap-3 mb-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full border-2 ${
                index < enteredPin.length ? "bg-blue-400 border-blue-400" : "border-gray-600"
              }`}
            />
          ))}
        </div>
        {pinError && <p className="text-red-400 text-center text-sm">Incorrect PIN. Please try again.</p>}
      </div>

      {/* PIN Keypad */}
      <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <Button
            key={digit}
            onClick={() => handlePinDigit(digit.toString())}
            className="h-16 text-2xl font-bold bg-gray-700 hover:bg-gray-600 border border-gray-600"
            disabled={isSubmitting}
          >
            {digit}
          </Button>
        ))}

        <Button
          onClick={handlePinClear}
          className="h-16 bg-red-600 hover:bg-red-700 border border-red-500"
          disabled={isSubmitting}
        >
          Clear
        </Button>

        <Button
          onClick={() => handlePinDigit("0")}
          className="h-16 text-2xl font-bold bg-gray-700 hover:bg-gray-600 border border-gray-600"
          disabled={isSubmitting}
        >
          0
        </Button>

        <Button
          onClick={handlePinDelete}
          className="h-16 bg-yellow-600 hover:bg-yellow-700 border border-yellow-500"
          disabled={isSubmitting}
        >
          <Delete className="h-6 w-6" />
        </Button>
      </div>

      {/* Confirm Button */}
      <div className="mt-6 text-center">
        <Button
          onClick={handlePinConfirm}
          disabled={enteredPin.length === 0 || isSubmitting}
          className="px-8 py-3 text-lg bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
          {isSubmitting ? "Verifying..." : "Confirm PIN"}
        </Button>
      </div>
    </div>
  )
}

export default PinEntry