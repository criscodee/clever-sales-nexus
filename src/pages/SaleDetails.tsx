
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Mock data for sales details
const getSaleById = (id: string) => {
  const sale = {
    id: id,
    date: id === "S001" 
      ? "2023-09-01"
      : id === "S002"
      ? "2023-09-03" 
      : "2023-09-05",
    customer: id === "S001" 
      ? "Acme Corp"
      : id === "S002"
      ? "Globex Inc" 
      : "Stark Industries",
    employee: id === "S001" 
      ? "John Smith"
      : id === "S002"
      ? "Jane Doe" 
      : "Michael Johnson",
    amount: id === "S001" 
      ? 1200.50
      : id === "S002"
      ? 850.75 
      : 3200.00,
    items: [
      {
        id: 1,
        product: id === "S001" ? "Laptop" : "Desktop PC",
        quantity: id === "S001" ? 2 : 1,
        price: id === "S001" ? 500 : 800,
        subtotal: id === "S001" ? 1000 : 800
      },
      {
        id: 2,
        product: id === "S001" ? "Monitor" : "Keyboard",
        quantity: id === "S001" ? 1 : 2,
        price: id === "S001" ? 200.50 : 25.37,
        subtotal: id === "S001" ? 200.50 : 50.75
      },
    ]
  };
  
  if (id !== "S001" && id !== "S002") {
    // Add a random third item for other IDs
    sale.items.push({
      id: 3,
      product: "Software License",
      quantity: 10,
      price: 235,
      subtotal: 2350
    });
  }
  
  return sale;
};

const SaleDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sale, setSale] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // In a real app, this would be an API call
      const saleData = getSaleById(id);
      setSale(saleData);
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!sale) {
    return <div className="text-center text-red-500">Sale not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/sales")}
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sales
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Sale Details: {sale.id}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sale Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="font-medium">Sale ID:</dt>
                <dd>{sale.id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Date:</dt>
                <dd>{sale.date}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Customer:</dt>
                <dd>{sale.customer}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Employee:</dt>
                <dd>{sale.employee}</dd>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <dt>Total Amount:</dt>
                <dd>${sale.amount.toFixed(2)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sale.items.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.product}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${item.subtotal.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-bold">Total:</TableCell>
                  <TableCell className="text-right font-bold">${sale.amount.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SaleDetails;
