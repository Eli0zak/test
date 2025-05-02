import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AuthLayout from "@/components/layout/AuthLayout";
import { signIn } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

interface LoginFormValues {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading } = useAuth();
  
  // Check if user is already logged in and redirect if needed
  useEffect(() => {
    if (user && !loading) {
      // Check user role to determine which dashboard to show
      const isAdmin = user.email?.includes('admin');
      navigate(isAdmin ? '/admin/dashboard' : '/dashboard');
    }
  }, [user, loading, navigate]);

  // Don't render the form while checking authentication
  if (loading) {
    return (
      <AuthLayout
        title="Welcome back"
        description="Checking your authentication status..."
      >
        <div className="flex items-center justify-center p-8">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-pet-purple"></div>
        </div>
      </AuthLayout>
    );
  }

  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Updated error handling and loading spinner for better user feedback
  const onSubmit = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      const user = await signIn(values.email, values.password);
      
      if (user) {
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
        
        const isAdmin = user.email?.includes('admin');
        navigate(isAdmin ? '/admin/dashboard' : '/dashboard');
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to access your PetTouch account"
      footer={
        <div>
          Don't have an account?{" "}
          <Link to="/register" className="text-pet-purple hover:underline font-medium">
            Sign up
          </Link>
        </div>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" autoComplete="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            rules={{ required: "Password is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" autoComplete="current-password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
};

export default Login;
