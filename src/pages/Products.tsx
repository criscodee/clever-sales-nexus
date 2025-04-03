
import { useState } from "react";
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
import { Search, PlusCircle } from "lucide-react";

// Mock data for products
const productsData = [
  {
    id: "P001",
    name: "Laptop Pro 15",
    category: "Electronics",
    price: 1299.99,
    stock: 45,
    status: "In Stock",
  },
  {
    id: "P002",
    name: "Wireless Headphones",
    category: "Audio",
    price: 199.95,
    stock: 78,
    status: "In Stock",
  },
  {
    id: "P003",
    name: "Smartphone X",
    category: "Electronics",
    price: 899.00,
    stock: 23,
    status: "In Stock",
  },
  {
    id: "P004",
    name: "Smart Watch 4",
    category: "Wearables",
    price: 349.99,
    stock: 12,
    status: "Low Stock",
  },
  {
    id: "P005",
    name: "Bluetooth Speaker",
    category: "Audio",
    price: 129.95,
    stock: 0,
    status: "Out of Stock",
  },
  {
    id: "P006",
    name: "Tablet Air",
    category: "Electronics",
    price: 449.99,
    stock: 34,
    status: "In Stock",
  },
  {
    id: "P007",
    name: "Wireless Mouse",
    category: "Accessories",
    price: 59.99,
    stock: 56,
    status: "In Stock",
  },
  {
    id: "P008",
    name: "Mechanical Keyboard",
    category: "Accessories",
    price: 149.99,
    stock: 7,
    status: "Low Stock",
  },
];

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = productsData.filter((product) =>
    Object.values(product).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="flex items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
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
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right">
                    ${product.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">{product.stock}</TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        product.status === "In Stock"
                          ? "bg-green-100 text-green-800"
                          : product.status === "Low Stock"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.status}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Products;
