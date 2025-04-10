
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { generateSaleId, calculateSubtotal } from "@/utils/salesUtils";

export type SaleFormData = {
  id: string;
  date: string;
  customer: string;
  employee: string;
  amount: number;
  items: {
    id: number;
    product: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
};

interface SaleFormProps {
  initialData?: SaleFormData;
  onSubmit: (data: SaleFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const SaleForm = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isEditing = false 
}: SaleFormProps) => {
  const defaultInitialData = {
    id: generateSaleId(),
    date: new Date().toISOString().split("T")[0],
    customer: "",
    employee: "",
    amount: 0,
    items: [{ id: 1, product: "", quantity: 1, price: 0, subtotal: 0 }]
  };

  const [items, setItems] = useState<SaleFormData["items"]>(
    initialData?.items || defaultInitialData.items
  );

  const form = useForm<SaleFormData>({
    defaultValues: initialData || defaultInitialData
  });

  // Update amount when items change
  useEffect(() => {
    const total = items.reduce((sum, item) => sum + Number(item.subtotal), 0);
    form.setValue("amount", Number(total.toFixed(2)));
  }, [items, form]);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: items.length + 1,
        product: "",
        quantity: 1,
        price: 0,
        subtotal: 0
      }
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    } else {
      toast.error("At least one item is required");
    }
  };

  const updateItemPrice = (index: number, price: number) => {
    const newItems = [...items];
    newItems[index].price = price;
    
    // Update the subtotal based on quantity
    newItems[index].subtotal = calculateSubtotal(price, newItems[index].quantity);
    
    setItems(newItems);
  };

  const updateItemQuantity = (index: number, quantity: number) => {
    const newItems = [...items];
    newItems[index].quantity = quantity;
    
    // Update the subtotal based on price
    newItems[index].subtotal = calculateSubtotal(newItems[index].price, quantity);
    
    setItems(newItems);
  };

  const updateItemProduct = (index: number, product: string) => {
    const newItems = [...items];
    newItems[index].product = product;
    setItems(newItems);
  };

  const updateItemSubtotal = (index: number, subtotal: number) => {
    const newItems = [...items];
    newItems[index].subtotal = subtotal;
    setItems(newItems);
  };

  const handleSubmit = form.handleSubmit((data) => {
    // Validate items have products
    if (items.some(item => !item.product.trim())) {
      toast.error("Please enter product names for all items");
      return;
    }
    
    // Combine form data with items
    const completeData = {
      ...data,
      items: items.map(item => ({
        ...item,
        // Ensure numeric values are properly formatted
        quantity: Number(item.quantity),
        price: Number(item.price),
        subtotal: Number(item.subtotal)
      }))
    };
    
    onSubmit(completeData);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sale ID</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="S001" 
                    readOnly={isEditing}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Customer name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="employee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Employee name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Items</h3>
            <Button type="button" variant="outline" onClick={addItem}>
              Add Item
            </Button>
          </div>

          {items.map((item, index) => (
            <div key={item.id} className="border p-4 rounded-md space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <FormLabel>Product</FormLabel>
                  <Input
                    value={item.product}
                    onChange={(e) => updateItemProduct(index, e.target.value)}
                    placeholder="Product name"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <FormLabel>Quantity</FormLabel>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => {
                        const quantity = parseInt(e.target.value) || 0;
                        updateItemQuantity(index, quantity);
                      }}
                    />
                  </div>
                  
                  <div>
                    <FormLabel>Price</FormLabel>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => {
                        const price = parseFloat(e.target.value) || 0;
                        updateItemPrice(index, price);
                      }}
                    />
                  </div>
                  
                  <div>
                    <FormLabel>Subtotal</FormLabel>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.subtotal}
                      onChange={(e) => {
                        const subtotal = parseFloat(e.target.value) || 0;
                        updateItemSubtotal(index, subtotal);
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => removeItem(index)}
                  className="text-destructive hover:text-destructive"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel className="text-lg font-bold">Total Amount</FormLabel>
                <Input
                  {...field}
                  value={field.value.toFixed(2)}
                  className="w-48 text-right font-bold"
                  readOnly
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? "Update Sale" : "Add Sale"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SaleForm;
