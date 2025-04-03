
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, LineChart, PieChart, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="hidden md:flex">
            <Calendar className="mr-2 h-4 w-4" />
            Select Date Range
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sales">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Sales Overview</CardTitle>
                  <LineChart className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>Monthly sales performance</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-80 flex items-center justify-center bg-muted/20">
                  <p className="text-muted-foreground">Sales chart visualization would go here</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Sales by Category</CardTitle>
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>Distribution of sales by product category</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-80 flex items-center justify-center bg-muted/20">
                  <p className="text-muted-foreground">Category distribution chart would go here</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Sales Trends</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardDescription>Year-to-date sales performance</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-80 flex items-center justify-center bg-muted/20">
                <p className="text-muted-foreground">Sales trends visualization would go here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>Best performing products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-muted/20">
                <p className="text-muted-foreground">Product performance visualization would go here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Demographics</CardTitle>
              <CardDescription>Breakdown by customer segments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-muted/20">
                <p className="text-muted-foreground">Customer demographics visualization would go here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
