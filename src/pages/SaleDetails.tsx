import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { SaleFormData } from "@/components/SaleForm";
import { supabase } from "@/integrations/supabase/client";
import { SalesItemRow, SalesRecordRow } from "@/types/supabase";
import { initialSalesData } from "@/utils/salesUtils";

const SaleDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sale, setSale] = useState<SaleFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchSaleDetails(id);
    }
  }, [id]);

  const fetchSaleDetails = async (saleId: string) => {
    try {
      setLoading(true);
      
      // Check if the sale exists in the mock data
      const mockSale = initialSalesData.find(sale => sale.id === saleId);
      
      // Fetch the sale record from Supabase
      const { data: saleRecord, error: saleError } = await supabase
        .from('sales_records')
        .select('*')
        .eq('id', saleId)
        .single() as { data: SalesRecordRow | null, error: any };
      
      if (saleError) {
        console.error('Error fetching sale record:', saleError);
        // If no data in Supabase or there's an error, fall back to mock data
        if (mockSale) {
          setSale(mockSale);
        } else {
          setSale(getMockSaleById(saleId));
        }
        setLoading(false);
        return;
      }
      
      // Fetch the sale items
      const { data: saleItems, error: itemsError } = await supabase
        .from('sales_items')
        .select('*')
        .eq('sale_id', saleId) as { data: SalesItemRow[] | null, error: any };
      
      if (itemsError) {
        console.error('Error fetching sale items:', itemsError);
      }
      
      // Format the sale data
      const formattedSale: SaleFormData = {
        id: saleRecord!.id,
        date: saleRecord!.date,
        customer: saleRecord!.customer,
        employee: saleRecord!.employee,
        amount: saleRecord!.amount,
        items: saleItems?.map((item, index) => ({
          id: index + 1,
          product: item.product,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal
        })) || []
      };
      
      setSale(formattedSale);
    } catch (error) {
      console.error('Error in fetchSaleDetails:', error);
      // Fall back to mock data if there's an error
      const mockSale = initialSalesData.find(sale => sale.id === saleId);
      if (mockSale) {
        setSale(mockSale);
      } else {
        setSale(getMockSaleById(saleId));
      }
    } finally {
      setLoading(false);
    }
  };

  // Mock data for sales details if not available in Supabase
  const getMockSaleById = (saleId: string) => {
    const sale = {
      id: saleId,
      date: saleId === "S001" 
        ? "2023-09-01"
        : saleId === "S002"
        ? "2023-09-03" 
        : "2023-09-05",
      customer: saleId === "S001" 
        ? "Acme Corp"
        : saleId === "S002"
        ? "Globex Inc" 
        : "Stark Industries",
      employee: saleId === "S001" 
        ? "John Smith"
        : saleId === "S002"
        ? "Jane Doe" 
        : "Michael Johnson",
      amount: saleId === "S001" 
        ? 1200.50
        : saleId === "S002"
        ? 850.75 
        : 3200.00,
      items: [
        {
          id: 1,
          product: saleId === "S001" ? "Laptop" : "Desktop PC",
          quantity: saleId === "S001" ? 2 : 1,
          price: saleId === "S001" ? 500 : 800,
          subtotal: saleId === "S001" ? 1000 : 800
        },
        {
          id: 2,
          product: saleId === "S001" ? "Monitor" : "Keyboard",
          quantity: saleId === "S001" ? 1 : 2,
          price: saleId === "S001" ? 200.50 : 25.37,
          subtotal: saleId === "S001" ? 200.50 : 50.75
        },
      ]
    };
    
    if (saleId !== "S001" && saleId !== "S002") {
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

  const updateItemPrice = async (index: number, price: number) => {
    if (!sale || !id) return;
    
    const updatedItems = [...sale.items];
    updatedItems[index] = {
      ...updatedItems[index],
      price
    };
    
    setSale({
      ...sale,
      items: updatedItems
    });
    
    // Update in Supabase if this is a real sale (not mock data)
    try {
      const item = sale.items[index];
      const { error } = await supabase
        .from('sales_items')
        .update({ price })
        .eq('sale_id', id)
        .eq('product', item.product)
        .eq('quantity', item.quantity) as { data: any, error: any };
      
      if (error) {
        console.error('Error updating item price:', error);
      } else {
        toast.success("Price updated");
      }
    } catch (error) {
      console.error('Error in updateItemPrice:', error);
    }
  };

  const updateItemSubtotal = async (index: number, subtotal: number) => {
    if (!sale || !id) return;
    
    const updatedItems = [...sale.items];
    updatedItems[index] = {
      ...updatedItems[index],
      subtotal
    };
    
    // Update total amount
    const totalAmount = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
    
    setSale({
      ...sale,
      items: updatedItems,
      amount: totalAmount
    });
    
    // Update in Supabase if this is a real sale (not mock data)
    try {
      const item = sale.items[index];
      
      // Update the item
      const { error: itemError } = await supabase
        .from('sales_items')
        .update({ subtotal })
        .eq('sale_id', id)
        .eq('product', item.product)
        .eq('quantity', item.quantity) as { data: any, error: any };
      
      if (itemError) {
        console.error('Error updating item subtotal:', itemError);
      } else {
        // Update the total amount in the sale record
        const { error: saleError } = await supabase
          .from('sales_records')
          .update({ amount: totalAmount })
          .eq('id', id) as { data: any, error: any };
        
        if (saleError) {
          console.error('Error updating sale amount:', saleError);
        } else {
          toast.success("Subtotal updated");
        }
      }
    } catch (error) {
      console.error('Error in updateItemSubtotal:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!sale) {
    return <div className="text-center text-red-500">Sale not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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
                {sale.items.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.product}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        $
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => updateItemPrice(index, parseFloat(e.target.value) || 0)}
                          className="w-20 text-right ml-1 h-8"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        $
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.subtotal}
                          onChange={(e) => updateItemSubtotal(index, parseFloat(e.target.value) || 0)}
                          className="w-24 text-right ml-1 h-8"
                        />
                      </div>
                    </TableCell>
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
