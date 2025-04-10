
import { SaleFormData } from "@/components/SaleForm";
import { useState, useEffect } from "react";

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

// Custom hook to manage sales data
export const useSalesData = () => {
  const [salesData, setSalesData] = useState(initialSalesData);

  const addSale = (newSale: SaleFormData) => {
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
    
    setSalesData(prev => [formattedSale, ...prev]);
    return formattedSale.id;
  };

  return {
    salesData,
    setSalesData,
    addSale
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
