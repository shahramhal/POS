// Mock employee data with PINs
const employees = [
  { id: 1, name: "Sarah Johnson", role: "Cashier", avatar: "https://via.placeholder.com/80", pin: "1234" },
  { id: 2, name: "Mike Chen", role: "Sales Associate", avatar: "https://via.placeholder.com/80", pin: "5678" },
  { id: 3, name: "Emily Davis", role: "Supervisor", avatar: "https://via.placeholder.com/80", pin: "9999" },
  { id: 4, name: "James Wilson", role: "Stock Clerk", avatar: "https://via.placeholder.com/80", pin: "1111" },
  { id: 5, name: "Lisa Rodriguez", role: "Customer Service", avatar: "https://via.placeholder.com/80", pin: "2222" },
  { id: 6, name: "David Kim", role: "Cashier", avatar: "https://via.placeholder.com/80", pin: "3333" },
  { id: 7, name: "Anna Thompson", role: "Sales Associate", avatar: "https://via.placeholder.com/80", pin: "4444" },
  { id: 8, name: "Robert Martinez", role: "Maintenance", avatar: "https://via.placeholder.com/80", pin: "5555" },
  { id: 9, name: "Jennifer Lee", role: "Assistant Manager", avatar: "https://via.placeholder.com/80", pin: "6666" },
  { id: 10, name: "Chris Brown", role: "Security", avatar: "https://via.placeholder.com/80", pin: "7777" },
  { id: 11, name: "Maria Garcia", role: "Cashier", avatar: "https://via.placeholder.com/80", pin: "8888" },
  { id: 12, name: "Kevin Taylor", role: "Stock Clerk", avatar: "https://via.placeholder.com/80", pin: "0000" },
]

// Mock time tracking data
let timeRecords = []

export const employeeService = {
  // Get all employees
  getAllEmployees: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(employees)
      }, 100)
    })
  },

  // Authenticate employee with PIN
  authenticateEmployee: async (employeeId, pin) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const employee = employees.find(emp => emp.id === employeeId && emp.pin === pin)
        resolve(employee || null)
      }, 500)
    })
  },

  // Clock in employee
  clockIn: async (employeeId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const employee = employees.find(emp => emp.id === employeeId)
        if (employee) {
          const record = {
            id: Date.now(),
            employeeId,
            employeeName: employee.name,
            clockIn: new Date(),
            clockOut: null,
          }
          timeRecords.push(record)
          resolve({ success: true, record })
        } else {
          resolve({ success: false, error: "Employee not found" })
        }
      }, 300)
    })
  },

  // Clock out employee
  clockOut: async (employeeId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const recordIndex = timeRecords.findIndex(
          record => record.employeeId === employeeId && !record.clockOut
        )
        
        if (recordIndex !== -1) {
          timeRecords[recordIndex].clockOut = new Date()
          resolve({ success: true, record: timeRecords[recordIndex] })
        } else {
          resolve({ success: false, error: "No active clock-in found" })
        }
      }, 300)
    })
  },

  // Get employee time records
  getTimeRecords: async (employeeId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const records = timeRecords.filter(record => record.employeeId === employeeId)
        resolve(records)
      }, 200)
    })
  },

  // Get all time records (for managers)
  getAllTimeRecords: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(timeRecords)
      }, 200)
    })
  }
}
