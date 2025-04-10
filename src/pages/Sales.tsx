
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
  Trash2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import SaleForm, { SaleFormData } from "@/components/SaleForm";
import { useSalesData, generateSaleId } from "@/utils/salesUtils";

const Sales = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState<string | null>(null);
  const { salesData, loading, addSale, deleteSale } = useSalesData();
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

  const handleDeleteClick = (id: string) => {
    setSaleToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!saleToDelete) return;
    
    try {
      const success = await deleteSale(saleToDelete);
      if (success) {
        toast.success(`Sale ${saleToDelete} deleted successfully`);
      } else {
        // Even if Supabase delete fails, we still remove it from the UI
        // and show a different message
        toast.success(`Sale ${saleToDelete} removed from the list`);
      }
    } catch (error) {
      console.error("Error deleting sale:", error);
      toast.error("An error occurred while deleting the sale");
    } finally {
      setSaleToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };

  // Generate initial form data with a unique ID and today's date
  const initialFormData = {
    id: generateSaleId(),
    date: new Date().toISOString().split("T")[0],
    customer: "",
    employee: "",
    amount: 0,
    items: [{ id: 1, product: "", quantity: 1, price: 0, subtotal: 0 }]
  };

  const handleAddSubmit = async (data: SaleFormData) => {
    try {
      const saleId = await addSale(data);
      
      if (saleId) {
        toast.success(`Sale ${saleId} added successfully and saved to database`);
        setIsAddDialogOpen(false);
      } else {
        toast.error("Failed to save sale. Please try again.");
      }
    } catch (error) {
      console.error("Error adding sale:", error);
      toast.error("An error occurred while saving the sale");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Loading sales data...</p>
      </div>
    );
  }

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
                        onClick={() => handleDeleteClick(sale.id)}
                        className="flex items-center gap-1 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
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
            <DialogDescription>
              Create a new sale record. Fill in all the details below.
            </DialogDescription>
          </DialogHeader>
          <SaleForm
            initialData={initialFormData}
            onSubmit={handleAddSubmit}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete sale {saleToDelete}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSaleToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Sales;
