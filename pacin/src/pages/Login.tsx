import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, User, Lock, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Login form schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Registration form schema
const registerSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phoneNumber: z.string().min(10, { message: "Phone number must be at least 10 digits" })
    .regex(/^[0-9+]+$/, { message: "Please enter a valid phone number" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const Login = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = (values: LoginFormValues) => {
    setIsSubmitting(true);
    
    // Simulate login
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Check if credentials are valid
      if (values.email === "test@example.com" && values.password === "password123") {
        toast({
          title: "Login Successful",
          description: "Welcome back to Maskani!",
        });
        
        loginForm.reset();
        // In a real application, redirect to dashboard or home page
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
    }, 1500);
  };
  
  const onRegisterSubmit = (values: RegisterFormValues) => {
    setIsSubmitting(true);
    
    // Simulate registration
    setTimeout(() => {
      setIsSubmitting(false);
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully!",
      });
      
      registerForm.reset();
      
      // In a real application, redirect to login or onboarding
    }, 1500);
  };

  const switchToRegister = () => {
    document.querySelector('[data-value="register"]')?.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
  };

  const switchToLogin = () => {
    document.querySelector('[data-value="login"]')?.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8">
            <div className="text-center mb-8">
              <Link to="/" className="text-3xl font-bold inline-block">
                <span className="text-gray-700">Mask</span>
                <span className="text-maskani-primary">ani</span>
              </Link>
              <p className="text-gray-600 mt-2">
                Find your perfect student housing
              </p>
            </div>
            
            <Tabs defaultValue="login">
              <TabsList className="grid grid-cols-2 w-full mb-8">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                placeholder="Enter your email"
                                {...field}
                                className="pl-10" 
                              />
                            </FormControl>
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Password</FormLabel>
                            <a href="#" className="text-sm text-maskani-primary hover:underline">
                              Forgot password?
                            </a>
                          </div>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="pl-10 pr-10"
                                {...field} 
                              />
                            </FormControl>
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <button 
                              type="button" 
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? 
                                <EyeOff className="h-5 w-5" /> : 
                                <Eye className="h-5 w-5" />
                              }
                            </button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button
                      type="submit"
                      className="w-full bg-maskani-primary hover:bg-maskani-primary/90 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Logging in..." : "Login"}
                    </Button>
                    
                    <div className="mt-6 text-center text-sm text-gray-500">
                      Don't have an account?{" "}
                      <button
                        type="button"
                        className="text-maskani-primary hover:underline"
                        onClick={switchToRegister}
                      >
                        Sign up
                      </button>
                    </div>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input 
                                  placeholder="First name"
                                  className="pl-10"
                                  {...field} 
                                />
                              </FormControl>
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input 
                                  placeholder="Last name"
                                  className="pl-10"
                                  {...field} 
                                />
                              </FormControl>
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                placeholder="Enter your email"
                                className="pl-10"
                                {...field} 
                              />
                            </FormControl>
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                placeholder="Enter your phone number"
                                className="pl-10"
                                type="tel"
                                {...field} 
                              />
                            </FormControl>
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a password"
                                className="pl-10 pr-10"
                                {...field} 
                              />
                            </FormControl>
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <button 
                              type="button" 
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? 
                                <EyeOff className="h-5 w-5" /> : 
                                <Eye className="h-5 w-5" />
                              }
                            </button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                className="pl-10 pr-10"
                                {...field} 
                              />
                            </FormControl>
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <button 
                              type="button" 
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? 
                                <EyeOff className="h-5 w-5" /> : 
                                <Eye className="h-5 w-5" />
                              }
                            </button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button
                      type="submit"
                      className="w-full bg-maskani-primary hover:bg-maskani-primary/90 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating account..." : "Create Account"}
                    </Button>
                    
                    <div className="mt-6 text-center text-sm text-gray-500">
                      Already have an account?{" "}
                      <button
                        type="button"
                        className="text-maskani-primary hover:underline"
                        onClick={switchToLogin}
                      >
                        Sign in
                      </button>
                    </div>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
              By continuing, you agree to Maskani's{" "}
              <a href="#" className="text-maskani-primary hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-maskani-primary hover:underline">
                Privacy Policy
              </a>
              .
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
