
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { Card } from '@/components/ui/card';
import { Mic } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // If user is already authenticated, redirect to home
  if (isAuthenticated) {
    navigate('/');
    return null;
  }
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Mic className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-2">SpeechLingo</h1>
        <p className="text-muted-foreground text-center mb-8">
          Your personal speech clarity coach
        </p>
        
        <Card className="p-6">
          <div className="flex justify-between mb-6">
            <button
              className={`px-4 py-2 ${
                isLogin ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'
              }`}
              onClick={() => setIsLogin(true)}
            >
              Log In
            </button>
            <button
              className={`px-4 py-2 ${
                !isLogin ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'
              }`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>
          
          {isLogin ? <LoginForm /> : <SignupForm />}
        </Card>
        
        <p className="text-center text-sm text-muted-foreground mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
