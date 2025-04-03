
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, PlusCircle } from "lucide-react";

// Mock data for employees
const employeesData = [
  {
    id: "E001",
    name: "John Smith",
    position: "Sales Manager",
    email: "john.smith@company.com",
    phone: "(555) 123-4567",
    startDate: "2020-03-15",
  },
  {
    id: "E002",
    name: "Jane Doe",
    position: "Sales Representative",
    email: "jane.doe@company.com",
    phone: "(555) 987-6543",
    startDate: "2020-06-22",
  },
  {
    id: "E003",
    name: "Michael Johnson",
    position: "Sales Representative",
    email: "michael.johnson@company.com",
    phone: "(555) 234-5678",
    startDate: "2021-01-10",
  },
  {
    id: "E004",
    name: "Sarah Williams",
    position: "Sales Representative",
    email: "sarah.williams@company.com",
    phone: "(555) 876-5432",
    startDate: "2021-04-05",
  },
  {
    id: "E005",
    name: "David Brown",
    position: "Sales Representative",
    email: "david.brown@company.com",
    phone: "(555) 345-6789",
    startDate: "2021-09-18",
  },
  {
    id: "E006",
    name: "Emily Davis",
    position: "Sales Assistant",
    email: "emily.davis@company.com",
    phone: "(555) 654-3210",
    startDate: "2022-02-14",
  },
  {
    id: "E007",
    name: "Robert Wilson",
    position: "Sales Representative",
    email: "robert.wilson@company.com",
    phone: "(555) 432-1098",
    startDate: "2022-05-30",
  },
];

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmployees = employeesData.filter((employee) =>
    Object.values(employee).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Employee
        </Button>
      </div>

      <div className="flex items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search employees..."
            className="pl-8 w-full md:max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Start Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No employees found.
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.id}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.phone}</TableCell>
                  <TableCell>{employee.startDate}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Employees;
