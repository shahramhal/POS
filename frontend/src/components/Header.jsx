import Button from "./ui/Button"
import { Shield, ArrowLeft } from 'lucide-react'

const Header = ({ 
  currentTime, 
  formatTime, 
  formatDate, 
  onManagerLogin, 
  showBackButton = false, 
  onBack 
}) => {
  return (
    <>
      {/* Header with Logo and Time */}
      <div className="flex justify-between items-center mb-8">
        {/* Logo Section or Back Button */}
        <div className="flex items-center gap-3">
          {showBackButton ? (
            <Button
              onClick={onBack}
              variant="outline"
              className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          ) : (
            <>
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Restaurant Name</h1>
                <p className="text-gray-300">Employee Clock-In</p>
              </div>
            </>
          )}
        </div>

        {/* Time Display */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-4 text-right">
          <div className="text-2xl font-mono font-bold text-blue-400">{formatTime(currentTime)}</div>
          <div className="text-sm text-gray-300">{formatDate(currentTime)}</div>
        </div>
      </div>

      {/* Manager Login Button */}
      {!showBackButton && (
        <div className="flex justify-end mb-6">
          <Button
            onClick={onManagerLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg"
            size="lg"
          >
            <Shield className="mr-2 h-5 w-5" />
            Manager Login
          </Button>
        </div>
      )}
    </>
  )
}

export default Header
