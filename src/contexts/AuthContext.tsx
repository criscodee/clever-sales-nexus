
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: "admin" | "sales" | "manager";
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          try {
            // Manually create a user profile object without querying the profiles table
            const userData: UserProfile = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata.name || session.user.email?.split('@')[0] || 'User',
              role: (session.user.user_metadata.role as "admin" | "sales" | "manager") || 'sales'
            };
            
            setUser(userData);
          } catch (error) {
            console.error("Error setting user data:", error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // Check for existing session on mount
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        try {
          // Manually create a user profile object without querying the profiles table
          const userData: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata.name || session.user.email?.split('@')[0] || 'User',
            role: (session.user.user_metadata.role as "admin" | "sales" | "manager") || 'sales'
          };
          
          setUser(userData);
        } catch (error) {
          console.error("Error setting user data:", error);
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        toast.success("Login successful");
        return true;
      }
      
      return false;
    } catch (error: any) {
      toast.error(error.message || "An error occurred during login");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Sign up with Supabase and include name in user metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'sales' // Default role
          }
        }
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        toast.success("Account created successfully");
        return true;
      }
      
      return false;
    } catch (error: any) {
      toast.error(error.message || "An error occurred during signup");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast.error(error.message);
    } else {
      setUser(null);
      toast.success("Logged out successfully");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
