import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { 
  Search, 
  PlusCircle, 
  Eye, 
  Edit,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import SaleForm, { SaleFormData } from "@/components/SaleForm";

// Mock data for sales
const salesData = [
  {
    id: "S001",
    date: "2023-09-01",
    customer: "Acme Corp",
    employee: "John Smith",
    amount: 1200.50,
    items: [
      {
        id: 1,
        product: "Laptop",
        quantity: 2,
        price: 500,
        subtotal: 1000
      },
      {
        id: 2,
        product: "Monitor",
        quantity: 1,
        price: 200.50,
        subtotal: 200.50
      },
    ]
  },
  {
    id: "S002",
    date: "2023-09-03",
    customer: "Globex Inc",
    employee: "Jane Doe",
    amount: 850.75,
  },
  {
    id: "S003",
    date: "2023-09-05",
    customer: "Stark Industries",
    employee: "Michael Johnson",
    amount: 3200.00,
  },
  {
    id: "S004",
    date: "2023-09-07",
    customer: "Wayne Enterprises",
    employee: "Sarah Williams",
    amount: 1750.25,
  },
  {
    id: "S005",
    date: "2023-09-10",
    customer: "LexCorp",
    employee: "David Brown",
    amount: 950.00,
  },
  {
    id: "S006",
    date: "2023-09-12",
    customer: "Umbrella Corp",
    employee: "Emily Davis",
    amount: 2100.50,
  },
  {
    id: "S007",
    date: "2023-09-15",
    customer: "Cyberdyne Systems",
    employee: "Robert Wilson",
    amount: 1500.00,
  },
  {
    id: "S008",
    date: "2023-09-18",
    customer: "Oscorp",
    employee: "Jennifer Lee",
    amount: 3750.25,
  },
];

const Sales = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentSale, setCurrentSale] = useState<SaleFormData | null>(null);
  const navigate = useNavigate();

  const filteredSales = salesData.filter((sale) => {
    return (
      searchTerm === "" ||
      sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.employee.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleViewDetails = (id: string) => {
    navigate(`/sales/${id}`);
  };

  const handleEdit = (sale: SaleFormData) => {
    setCurrentSale(sale);
    setIsEditDialogOpen(true);
  };

  const handleAddSubmit = (data: SaleFormData) => {
    console.log("Add sale:", data);
    toast.success(`Sale ${data.id} added successfully`);
    setIsAddDialogOpen(false);
  };

  const handleEditSubmit = (data: SaleFormData) => {
    console.log("Update sale:", data);
    toast.success(`Sale ${data.id} updated successfully`);
    setIsEditDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Sales</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Sale
        </Button>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search sales..."
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
              <TableHead className="w-[100px]">Sale ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No sales found.
                </TableCell>
              </TableRow>
            ) : (
              filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.id}</TableCell>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell>{sale.customer}</TableCell>
                  <TableCell>{sale.employee}</TableCell>
                  <TableCell className="text-right">
                    ${sale.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(sale.id)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Details</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(sale)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Add New Sale</DialogTitle>
          </DialogHeader>
          <SaleForm
            onSubmit={handleAddSubmit}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Edit Sale</DialogTitle>
          </DialogHeader>
          {currentSale && (
            <SaleForm
              initialData={currentSale}
              onSubmit={handleEditSubmit}
              onCancel={() => setIsEditDialogOpen(false)}
              isEditing
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sales;
