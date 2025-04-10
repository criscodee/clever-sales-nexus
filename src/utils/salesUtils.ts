
import { SaleFormData } from "@/components/SaleForm";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SalesItemRow, SalesRecordRow } from "@/types/supabase";

// Mock data for sales
export const initialSalesData = [
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
    items: [
      {
        id: 1,
        product: "Desktop PC",
        quantity: 1,
        price: 800,
        subtotal: 800
      },
      {
        id: 2,
        product: "Keyboard",
        quantity: 2,
        price: 25.37,
        subtotal: 50.75
      },
    ]
  },
  {
    id: "S003",
    date: "2023-09-05",
    customer: "Stark Industries",
    employee: "Michael Johnson",
    amount: 3200.00,
    items: [
      {
        id: 1,
        product: "Server",
        quantity: 1,
        price: 2500,
        subtotal: 2500
      },
      {
        id: 2,
        product: "Software License",
        quantity: 5,
        price: 140,
        subtotal: 700
      },
    ]
  },
  {
    id: "S004",
    date: "2023-09-07",
    customer: "Wayne Enterprises",
    employee: "Sarah Williams",
    amount: 1750.25,
    items: [
      {
        id: 1,
        product: "Tablet",
        quantity: 3,
        price: 350,
        subtotal: 1050
      },
      {
        id: 2,
        product: "Case",
        quantity: 3,
        price: 25,
        subtotal: 75
      },
      {
        id: 3,
        product: "Screen Protector",
        quantity: 5,
        price: 15,
        subtotal: 75
      },
    ]
  },
  {
    id: "S005",
    date: "2023-09-10",
    customer: "LexCorp",
    employee: "David Brown",
    amount: 950.00,
    items: [
      {
        id: 1,
        product: "Printer",
        quantity: 1,
        price: 750,
        subtotal: 750
      },
      {
        id: 2,
        product: "Ink Cartridges",
        quantity: 4,
        price: 50,
        subtotal: 200
      },
    ]
  },
  {
    id: "S006",
    date: "2023-09-12",
    customer: "Umbrella Corp",
    employee: "Emily Davis",
    amount: 2100.50,
    items: [] // Initialize with empty array instead of undefined
  },
  {
    id: "S007",
    date: "2023-09-15",
    customer: "Cyberdyne Systems",
    employee: "Robert Wilson",
    amount: 1500.00,
    items: [] // Initialize with empty array instead of undefined
  },
  {
    id: "S008",
    date: "2023-09-18",
    customer: "Oscorp",
    employee: "Jennifer Lee",
    amount: 3750.25,
    items: [] // Initialize with empty array instead of undefined
  },
];

// Custom hook to manage sales data
export const useSalesData = () => {
  const [salesData, setSalesData] = useState<SaleFormData[]>(initialSalesData);
  const [loading, setLoading] = useState(true);

  // Fetch sales data from Supabase on component mount
  useEffect(() => {
    fetchSalesData();
  }, []);

  // Fetch sales data from Supabase
  const fetchSalesData = async () => {
    try {
      setLoading(true);
      
      // Fetch all sales records
      const { data: salesRecords, error: salesError } = await supabase
        .from('sales_records')
        .select('*')
        .order('created_at', { ascending: false }) as { data: SalesRecordRow[] | null, error: any };
      
      if (salesError) {
        console.error('Error fetching sales records:', salesError);
        return;
      }
      
      // For each sale, fetch its items
      const salesWithItems = await Promise.all(
        (salesRecords || []).map(async (sale) => {
          const { data: items, error: itemsError } = await supabase
            .from('sales_items')
            .select('*')
            .eq('sale_id', sale.id) as { data: SalesItemRow[] | null, error: any };
          
          if (itemsError) {
            console.error('Error fetching sale items:', itemsError);
            return {
              ...sale,
              items: []
            };
          }
          
          return {
            ...sale,
            items: items || []
          };
        })
      );
      
      // If we have data from Supabase, use it. Otherwise, use initial data
      if (salesWithItems.length > 0) {
        setSalesData(salesWithItems as SaleFormData[]);
      }
    } catch (error) {
      console.error('Error in fetchSalesData:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save a new sale to Supabase
  const saveSaleToSupabase = async (sale: SaleFormData) => {
    try {
      // First, insert the sale record
      const { data: saleRecord, error: saleError } = await supabase
        .from('sales_records')
        .insert({
          id: sale.id,
          date: sale.date,
          customer: sale.customer,
          employee: sale.employee,
          amount: sale.amount
        })
        .select()
        .single() as { data: SalesRecordRow | null, error: any };
      
      if (saleError) {
        console.error('Error inserting sale record:', saleError);
        return null;
      }
      
      // Then, insert all sale items
      if (sale.items && sale.items.length > 0) {
        const saleItems = sale.items.map(item => ({
          sale_id: sale.id,
          product: item.product,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal
        }));
        
        const { error: itemsError } = await supabase
          .from('sales_items')
          .insert(saleItems) as { data: any, error: any };
        
        if (itemsError) {
          console.error('Error inserting sale items:', itemsError);
          // Consider rolling back the sale record here
          return null;
        }
      }
      
      // Return the ID of the created sale
      return sale.id;
    } catch (error) {
      console.error('Error in saveSaleToSupabase:', error);
      return null;
    }
  };

  const addSale = async (newSale: SaleFormData) => {
    // Ensure all numeric values are properly formatted
    const formattedSale = {
      ...newSale,
      amount: Number(newSale.amount),
      items: newSale.items ? newSale.items.map(item => ({
        ...item,
        quantity: Number(item.quantity),
        price: Number(item.price),
        subtotal: Number(item.subtotal)
      })) : []
    };
    
    // Save to Supabase first
    const saleId = await saveSaleToSupabase(formattedSale);
    
    if (saleId) {
      // If successful, update local state
      setSalesData(prev => [formattedSale, ...prev]);
    }
    
    return saleId;
  };

  return {
    salesData,
    loading,
    setSalesData,
    addSale,
    fetchSalesData
  };
};

// Generate a unique sale ID
export const generateSaleId = () => {
  return `S${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
};

// Calculate subtotal based on price and quantity
export const calculateSubtotal = (price: number, quantity: number) => {
  return Number((price * quantity).toFixed(2));
};

// Calculate total revenue from sales data
export const calculateTotalRevenue = (salesData: SaleFormData[]): number => {
  return salesData.reduce((sum, sale) => sum + Number(sale.amount), 0);
};

// Count unique customers
export const countUniqueCustomers = (salesData: SaleFormData[]): number => {
  const uniqueCustomers = new Set(salesData.map(sale => sale.customer));
  return uniqueCustomers.size;
};

// Type for top product
export type TopProduct = {
  name: string;
  category: string;
  sold: number;
  revenue: number;
};

// Calculate top products
export const calculateTopProducts = (salesData: SaleFormData[]): TopProduct[] => {
  const productMap = new Map<string, TopProduct>();
  
  // Process all sales with items
  salesData.forEach(sale => {
    if (sale.items && sale.items.length > 0) {
      sale.items.forEach(item => {
        if (!item.product) return;
        
        const existing = productMap.get(item.product);
        if (existing) {
          existing.sold += item.quantity;
          existing.revenue += item.subtotal;
        } else {
          productMap.set(item.product, {
            name: item.product,
            category: `Category ${Math.floor(Math.random() * 5) + 1}`,
            sold: item.quantity,
            revenue: item.subtotal
          });
        }
      });
    }
  });
  
  // Sort by revenue and take top 5
  return Array.from(productMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
};
