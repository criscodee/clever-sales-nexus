
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-6 max-w-md">
        <h1 className="text-5xl font-bold text-primary mb-6">404</h1>
        <p className="text-xl text-foreground mb-8">Oops! We couldn't find the page you're looking for.</p>
        <p className="text-muted-foreground mb-8">
          The page at <code className="bg-muted px-2 py-1 rounded">{location.pathname}</code> doesn't exist.
        </p>
        <Button asChild size="lg">
          <Link to="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
