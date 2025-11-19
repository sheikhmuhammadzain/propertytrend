import React, { useState, useEffect } from 'react'
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiService } from '@/services/apiServices';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context';
import { useNavigate } from 'react-router-dom';


interface AuthProps {
  mode?: 'signup' | 'signin';
}

interface ValidationErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const Auth: React.FC<AuthProps> = ({ mode = 'signup' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Full Name validation (only for signup)
    if (isSignup && !fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm Password validation (only for signup)
    if (isSignup && !confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (isSignup && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      
      if (isSignup) {
        const response = await apiService.signup({ fullName, email, password });

        if (response.success) {
          toast({
            title: "Account Created Successfully. Visit your email to verify your account.",
            description: "Welcome! Your account has been created successfully.",
            variant: "default",
          });
        } else {
          toast({
            title: "Signup Failed",
            description: response.message || "An error occurred during signup. Please try again.",
            variant: "destructive",
          });
        }
      } else {        
        const response = await apiService.signin({ email, password });
        if (response.success) {
          const { access_token, user } = response.data;
          
            if (access_token && user) {
              login(access_token, user);
              
              toast({
                title: "Welcome Back!",
                description: "You have successfully signed in.",
                variant: "default",
              });
              
              navigate('/charts');
            } else {
            toast({
              title: "Sign In Failed",
              description: "Invalid response format. Please try again.",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Sign In Failed",
            description: response.message || "Invalid email or password. Please try again.",
            variant: "destructive",
          });
        }
      }
        
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFullName('');
      setErrors({});
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    
    try {
      if (isSignup) {
        // Google signup logic
        console.log('Google signup attempt');
        // Here you would typically call your Google signup API
        // await signupWithGoogle();
      } else {
        // Google signin logic
        console.log('Google signin attempt');
        // Here you would typically call your Google signin API
        // await signinWithGoogle();
      }
    } catch (error) {
      console.error('Google authentication error:', error);
      toast({
        title: "Google Authentication Error",
        description: "An error occurred during Google authentication. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClassName = (fieldName: keyof ValidationErrors) => {
    const baseClasses = "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";
    const hasError = errors[fieldName];
    
    if (hasError) {
      return `${baseClasses} border-red-500 focus:ring-red-500`;
    }
    
    return `${baseClasses} border-gray-200`;
  };

  const isSignup = mode === 'signup';

  return (
    <div className="min-h-screen bg-[#F2F1EF] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <h1 className="text-headline-lg bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent">
              The Refined Report
              </h1>
            </div>
            <h2 className="text-subheadline-lg text-gray-800">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-body-md text-gray-600 mt-2">
              {isSignup 
                ? 'Join us to explore housing market insights' 
                : 'Sign in to access your dashboard'
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignup && (
              <div>
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) {
                      setErrors(prev => ({ ...prev, fullName: undefined }));
                    }
                  }}
                  className={getInputClassName('fullName')}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>
            )}

            <div>
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors(prev => ({ ...prev, email: undefined }));
                  }
                }}
                className={getInputClassName('email')}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors(prev => ({ ...prev, password: undefined }));
                  }
                }}
                className={getInputClassName('password')}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {isSignup && (
              <div>
                <Input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) {
                      setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                    }
                  }}
                  className={getInputClassName('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-black via-gray-700 to-gray-500 hover:from-gray-800 hover:via-gray-600 hover:to-gray-400 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  <span className="font-subheadline">{isSignup ? 'Creating Account...' : 'Signing In...'}</span>
                </div>
              ) : (
                <span className="font-subheadline">{isSignup ? 'Create Account' : 'Sign In'}</span>
              )}
            </Button>

            {/* <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-body">Or continue with</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              type="button"
              disabled={isGoogleLoading}
              onClick={handleGoogleAuth}
              className="w-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGoogleLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700 mr-2"></div>
                  <span className="font-subheadline">{isSignup ? 'Signing up with Google...' : 'Signing in with Google...'}</span>
                </div>
              ) : (
                <>
                  <FcGoogle className="mr-2 h-5 w-5" />
                  <span className="font-subheadline">{isSignup ? 'Sign up with Google' : 'Sign in with Google'}</span>
                </>
              )}
            </Button> */}
          </form>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-body-sm">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}
              <a
                href={isSignup ? '/login' : '/signup'}
                className="text-blue-600 font-subheadline hover:underline ml-1 transition-colors duration-200"
              >
                {isSignup ? 'Sign in' : 'Sign up'}
              </a>
            </p>
          </div>

          {/* {isSignup && (
            <div className="text-center mt-4">
              <p className="text-xs text-gray-500">
                By signing up, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </p>
            </div>
          )} */}
        </div>
      </div>
    </div>
  )
}

export default Auth
