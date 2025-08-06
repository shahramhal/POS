import { useAuth } from "../hooks/useAuth"
import { useTime } from "../hooks/useTime"
import Button from "./ui/Button"
import Card from "./ui/Card"
import Avatar from "./ui/Avatar"
import Badge from "./ui/Badge"
import { LogOut, Clock, User, Shield } from 'lucide-react'

const Dashboard = () => {
  const { user, logout, clockIn, clockOut } = useAuth()
  const { currentTime, formatTime, formatDate } = useTime()

  const handleClockIn = async () => {
    const result = await clockIn()
    if (result.success) {
      alert("Clocked in successfully!")
    } else {
      alert("Failed to clock in: " + result.error)
    }
  }

  const handleClockOut = async () => {
    const result = await clockOut()
    if (result.success) {
      alert("Clocked out successfully!")
    } else {
      alert("Failed to clock out: " + result.error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Restaurant POS</h1>
              <p className="text-gray-300">Employee Dashboard</p>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-4 text-right">
            <div className="text-2xl font-mono font-bold text-blue-400">{formatTime(currentTime)}</div>
            <div className="text-sm text-gray-300">{formatDate(currentTime)}</div>
          </div>
        </div>

        {/* User Info Card */}
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-20 w-20">
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                  className="aspect-square h-full w-full object-cover"
                />
                <div className="bg-blue-900 text-blue-300 flex h-full w-full items-center justify-center rounded-full">
                  <User className="h-10 w-10" />
                </div>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                <Badge variant="secondary" className="mb-2">
                  {user.role}
                </Badge>
                <p className="text-gray-300">Employee ID: {user.id}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 flex-wrap">
              <Button
                onClick={handleClockIn}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
              >
                <Clock className="mr-2 h-5 w-5" />
                Clock In
              </Button>
              
              <Button
                onClick={handleClockOut}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3"
              >
                <Clock className="mr-2 h-5 w-5" />
                Clock Out
              </Button>
              
              <Button
                onClick={logout}
                variant="outline"
                className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 px-6 py-3"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <div className="p-6 text-center">
              <Clock className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Time Tracking</h3>
              <p className="text-gray-300 text-sm">View your work hours and time records</p>
            </div>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <div className="p-6 text-center">
              <User className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Profile</h3>
              <p className="text-gray-300 text-sm">Update your personal information</p>
            </div>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <div className="p-6 text-center">
              <Shield className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Settings</h3>
              <p className="text-gray-300 text-sm">Change your PIN and preferences</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard