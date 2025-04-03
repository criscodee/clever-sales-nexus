
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

// Mock data for customers
const customersData = [
  {
    id: "C001",
    name: "Acme Corporation",
    contact: "John Smith",
    email: "john.smith@acme.com",
    phone: "(555) 123-4567",
    status: "Active",
  },
  {
    id: "C002",
    name: "Globex Inc",
    contact: "Jane Doe",
    email: "jane.doe@globex.com",
    phone: "(555) 987-6543",
    status: "Active",
  },
  {
    id: "C003",
    name: "Stark Industries",
    contact: "Tony Stark",
    email: "tony@starkindustries.com",
    phone: "(555) 111-2222",
    status: "Active",
  },
  {
    id: "C004",
    name: "Wayne Enterprises",
    contact: "Bruce Wayne",
    email: "bruce@wayneent.com",
    phone: "(555) 333-4444",
    status: "Active",
  },
  {
    id: "C005",
    name: "LexCorp",
    contact: "Lex Luthor",
    email: "lex@lexcorp.com",
    phone: "(555) 555-6666",
    status: "Inactive",
  },
  {
    id: "C006",
    name: "Umbrella Corporation",
    contact: "Albert Wesker",
    email: "wesker@umbrella.com",
    phone: "(555) 777-8888",
    status: "Inactive",
  },
  {
    id: "C007",
    name: "Oscorp",
    contact: "Norman Osborn",
    email: "norman@oscorp.com",
    phone: "(555) 999-0000",
    status: "Active",
  },
];

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customersData.filter((customer) =>
    Object.values(customer).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </div>

      <div className="flex items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers..."
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
              <TableHead>Contact</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No customers found.
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.id}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.contact}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        customer.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {customer.status}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Customers;
