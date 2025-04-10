
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, DollarSign, ShoppingCart, Users, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import SaleForm, { SaleFormData } from "@/components/SaleForm";
import { toast } from "sonner";
import { 
  useSalesData, 
  generateSaleId,
  calculateTotalRevenue,
  countUniqueCustomers,
  calculateTopProducts,
  TopProduct
} from "@/utils/salesUtils";

const Dashboard = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { salesData, loading, addSale } = useSalesData();
  const navigate = useNavigate();

  // Generate initial form data with a unique ID and today's date
  const initialFormData = {
    id: generateSaleId(salesData),
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
        navigate("/sales");
      } else {
        toast.error("Failed to save sale. Please try again.");
      }
    } catch (error) {
      console.error("Error adding sale:", error);
      toast.error("An error occurred while saving the sale");
    }
  };

  // Get the 5 most recent sales for the dashboard display
  const recentSales = salesData.slice(0, 5);

  // Calculate top products from sales data
  const topProducts = calculateTopProducts(salesData);

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
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Sale
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Revenue Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Revenue
                </p>
                <p className="text-3xl font-bold">
                  ${calculateTotalRevenue(salesData).toFixed(2)}
                </p>
              </div>
              <div className="bg-primary/20 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+20.1%</span> from last month
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sales Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Sales
                </p>
                <p className="text-3xl font-bold">+{salesData.length}</p>
              </div>
              <div className="bg-primary/20 p-3 rounded-full">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+12.2%</span> from last month
              </p>
            </div>
          </CardContent>
        </Card>

        {/* New Customers Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  New Customers
                </p>
                <p className="text-3xl font-bold">+{countUniqueCustomers(salesData)}</p>
              </div>
              <div className="bg-primary/20 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+4.5%</span> from last month
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Reports Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Reports
                </p>
                <p className="text-3xl font-bold">25</p>
              </div>
              <div className="bg-primary/20 p-3 rounded-full">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-muted-foreground">
                <span className="text-red-500">-8.1%</span> from last month
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Sales */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>
              You made {salesData.length} sales this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{sale.customer}</p>
                      <p className="text-sm text-muted-foreground">
                        {sale.id} - {sale.date}
                      </p>
                    </div>
                  </div>
                  <div className="font-medium">${sale.amount.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>
              Your top selling products this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">${product.revenue.toFixed(2)}</p>
                    <p className="text-muted-foreground">{product.sold} sold</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Sale Dialog */}
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
    </div>
  );
};

export default Dashboard;
