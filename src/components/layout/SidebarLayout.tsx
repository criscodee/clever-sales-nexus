
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Sales",
      path: "/sales",
      icon: <ShoppingCart size={20} />,
    },
    {
      name: "Customers",
      path: "/customers",
      icon: <Users size={20} />,
    },
    {
      name: "Products",
      path: "/products",
      icon: <Package size={20} />,
    },
    {
      name: "Employees",
      path: "/employees",
      icon: <User size={20} />,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: <BarChart3 size={20} />,
    },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out h-screen fixed z-30 lg:relative",
          sidebarOpen ? "w-64" : "w-0 lg:w-20"
        )}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
          <div className={cn("flex items-center", !sidebarOpen && "lg:justify-center")}>
            {sidebarOpen ? (
              <>
                <span className="text-xl font-bold">SalesNexus</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="ml-auto text-sidebar-foreground lg:hidden"
                >
                  <X size={20} />
                </Button>
              </>
            ) : (
              <span className="text-xl font-bold hidden lg:block">SN</span>
            )}
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className={cn("p-2", !sidebarOpen && "hidden lg:block")}>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-2.5 rounded-md hover:bg-sidebar-accent transition-colors",
                    location.pathname === item.path && "bg-sidebar-accent text-sidebar-accent-foreground",
                    !sidebarOpen && "lg:justify-center"
                  )}
                >
                  <span className="mr-3 lg:mr-0">{item.icon}</span>
                  {(sidebarOpen || window.innerWidth < 1024) && (
                    <span>{item.name}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-border flex items-center px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-4 lg:hidden"
          >
            <Menu size={20} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-4 hidden lg:flex"
          >
            <Menu size={20} />
          </Button>

          <div className="ml-auto flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center">
                  <span className="mr-2 font-medium">{user?.name}</span>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                  <LogOut size={16} className="mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default SidebarLayout;
