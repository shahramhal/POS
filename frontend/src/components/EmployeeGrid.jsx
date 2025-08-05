import Card from "./ui/Card"
import Avatar from "./ui/Avatar"
import Badge from "./ui/Badge"
import { User } from 'lucide-react'

const EmployeeGrid = ({ employees, onEmployeeSelect }) => {
  return (
    <>
      {/* Employee Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {employees.map((employee) => (
          <Card
            key={employee.id}
            className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            onClick={() => onEmployeeSelect(employee)}
          >
            <div className="p-4 text-center">
              <Avatar className="h-16 w-16 mx-auto mb-3">
                <img
                  src={employee.avatar || "/placeholder.svg"}
                  alt={employee.name}
                  className="aspect-square h-full w-full object-cover"
                />
                <div className="bg-blue-900 text-blue-300 flex h-full w-full items-center justify-center rounded-full">
                  <User className="h-8 w-8" />
                </div>
              </Avatar>
              <h3 className="font-semibold text-white mb-1 text-sm">{employee.name}</h3>
              <Badge variant="secondary" className="text-xs">
                {employee.role}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Instructions */}
      <div className="text-center mt-8">
        <p className="text-gray-300 text-lg">Select your name to clock in or out</p>
        <p className="text-gray-400 text-sm mt-2">
          Don't see your name? Contact your manager or use the Manager Login above.
        </p>
      </div>
    </>
  )
}

export default EmployeeGrid
