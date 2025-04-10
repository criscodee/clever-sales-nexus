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
import { useSalesData } from "@/utils/salesUtils";

const Dashboard = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { addSale } = useSalesData();
  const navigate = useNavigate();

  const handleAddSubmit = (data: SaleFormData) => {
    const saleId = addSale(data);
    toast.success(`Sale ${saleId} added successfully`);
    setIsAddDialogOpen(false);
    navigate("/sales");
  };

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
                <p className="text-3xl font-bold">$45,231.89</p>
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
                <p className="text-3xl font-bold">+2350</p>
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
                <p className="text-3xl font-bold">+573</p>
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
              You made 265 sales this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Customer {item}</p>
                      <p className="text-sm text-muted-foreground">
                        customer{item}@example.com
                      </p>
                    </div>
                  </div>
                  <div className="font-medium">+${Math.floor(Math.random() * 1000)}.00</div>
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
              {["Product A", "Product B", "Product C", "Product D", "Product E"].map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{product}</p>
                      <p className="text-sm text-muted-foreground">
                        Category {index + 1}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">${Math.floor(Math.random() * 1000)}.00</p>
                    <p className="text-muted-foreground">{Math.floor(Math.random() * 100)} sold</p>
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
            onSubmit={handleAddSubmit}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
