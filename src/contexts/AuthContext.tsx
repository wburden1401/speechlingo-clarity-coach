
import React, { createContext, useContext, useState, useEffect } from "react";
import { saveUserData, loadUserData, clearStoredData } from "@/lib/localStorage";
import { User } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { mockUser } from "@/lib/data";

interface AuthContextProps {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Simple in-memory storage for demo purposes
const userStore: Record<string, { user: User; password: string }> = {};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is already logged in
    const storedUser = loadUserData();
    if (storedUser) {
      setCurrentUser(storedUser);
    }
    setIsLoading(false);
  }, []);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo: check if user exists in our memory store
      const userRecord = Object.values(userStore).find(
        record => record.user.email === email && record.password === password
      );
      
      if (userRecord) {
        setCurrentUser(userRecord.user);
        saveUserData(userRecord.user);
        toast({
          title: "Login successful",
          description: `Welcome back, ${userRecord.user.name}!`,
        });
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      const emailExists = Object.values(userStore).some(
        record => record.user.email === email
      );
      
      if (emailExists) {
        throw new Error("Email already in use");
      }
      
      // Create new user based on mock user template
      const newUser: User = {
        ...mockUser,
        id: `user_${Date.now()}`,
        name,
        email,
        createdAt: new Date().toISOString(),
      };
      
      // Store in our in-memory database
      userStore[newUser.id] = { user: newUser, password };
      
      setCurrentUser(newUser);
      saveUserData(newUser);
      
      toast({
        title: "Account created",
        description: `Welcome to SpeechLingo, ${name}!`,
      });
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive", 
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    setCurrentUser(null);
    clearStoredData();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };
  
  const value: AuthContextProps = {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    login,
    signup,
    logout,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
