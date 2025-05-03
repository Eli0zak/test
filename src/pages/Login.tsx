import { useState, useEffect } from "react";
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

interface LoginFormValues {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (user && !loading) {
      // Check if user is admin based on email
      const isAdmin = user.email?.includes('admin');
      navigate(isAdmin ? '/admin/dashboard' : '/dashboard');
    }
  }, [user, loading, navigate]);

  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      const response = await signIn(values.email, values.password);
      
      if (response) {
        toast({
          title: "تم تسجيل الدخول بنجاح!",
          description: "أهلاً بك مجدداً",
        });
        
        // Check if user is admin based on email
        const isAdmin = values.email.includes('admin');
        navigate(isAdmin ? '/admin/dashboard' : '/dashboard');
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "فشل تسجيل الدخول",
        description: "يرجى التحقق من بيانات الاعتماد والمحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render the form while checking authentication
  if (loading) {
    return (
      <AuthLayout
        title="مرحباً بك مجدداً"
        description="جاري التحقق من حالة تسجيل الدخول..."
      >
        <div className="flex items-center justify-center p-8">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      </AuthLayout>
    );
  }

  if (!user) {
    return (
      <AuthLayout
        title="Loading..."
        description="Please wait while we verify your login."
      >
        <div className="flex items-center justify-center p-8">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="تسجيل الدخول"
      description="قم بتسجيل الدخول للوصول إلى حسابك"
      footer={
        <div className="ar">
          ليس لديك حساب؟{" "}
          <Link to="/register" className="text-primary hover:underline font-medium">
            اشتراك جديد
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
              required: "البريد الإلكتروني مطلوب",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "بريد إلكتروني غير صالح",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="ar">البريد الإلكتروني</FormLabel>
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
            rules={{ required: "كلمة المرور مطلوبة" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="ar">كلمة المرور</FormLabel>
                <FormControl>
                  <Input {...field} type="password" autoComplete="current-password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
};

export default Login;
