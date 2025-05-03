import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AuthLayout from "@/components/layout/AuthLayout";
import { signUp } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (user && !loading) {
      // Default to regular user dashboard on registration
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn("Loading state persisted for too long. Redirecting to login.");
        navigate('/login');
      }
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timeout);
  }, [loading, navigate]);

  const form = useForm<RegisterFormValues>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    if (values.password !== values.confirmPassword) {
      form.setError("confirmPassword", {
        type: "manual",
        message: "كلمات المرور غير متطابقة",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await signUp(values.email, values.password);
      
      if (response) {
        toast({
          title: "تم التسجيل بنجاح!",
          description: "يرجى التحقق من بريدك الإلكتروني لتأكيد حسابك.",
        });
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "فشل التسجيل",
        description: "يرجى المحاولة مرة أخرى أو استخدام بريد إلكتروني مختلف.",
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
        title="إنشاء حساب جديد"
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
        description="Please wait while we verify your account."
      >
        <div className="flex items-center justify-center p-8">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="اشتراك جديد"
      description="قم بإنشاء حساب للبدء في حماية حيواناتك الأليفة"
      footer={
        <div className="ar">
          لديك حساب بالفعل؟{" "}
          <Link to="/login" className="text-primary hover:underline font-medium">
            تسجيل الدخول
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
            rules={{
              required: "كلمة المرور مطلوبة",
              minLength: {
                value: 8,
                message: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="ar">كلمة المرور</FormLabel>
                <FormControl>
                  <Input {...field} type="password" autoComplete="new-password" />
                </FormControl>
                <FormDescription className="ar">
                  يجب أن تتكون كلمة المرور من 8 أحرف على الأقل
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            rules={{ required: "يرجى تأكيد كلمة المرور" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="ar">تأكيد كلمة المرور</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "جاري إنشاء الحساب..." : "اشتراك جديد"}
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
};

export default Register;
