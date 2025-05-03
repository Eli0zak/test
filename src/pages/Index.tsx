
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, CreditCard, MapPin } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-primary text-white py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <Link to="/" className="flex items-center">
            <img src="/lovable-uploads/d8049df2-619a-44e5-9cd8-c54416c17875.png" alt="PetTouch" className="h-10 w-10" />
            <span className="text-xl font-bold ml-2">PetTouch</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/" className="font-medium text-white hover:text-white/80">الرئيسية</Link>
            <Link to="/" className="font-medium text-white hover:text-white/80">لوحة التحكم</Link>
            <Link to="/login" className="font-medium text-white hover:text-white/80">تسجيل الدخول</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 ar">حماية حيواناتك الأليفة أصبح أسهل</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto ar">
              مع PetTouch، يمكنك تتبع حيواناتك الأليفة والعثور عليها بسرعة إذا ضاعت.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg">
                <Link to="/register">ابدأ الآن</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary ar">الميزات الرئيسية</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="feature-card">
              <div className="flex justify-center mb-6">
                <Bell size={48} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 ar">إشعارات فورية</h3>
              <p className="text-muted-foreground ar">تنبيهات فورية إذا ابتعد الحيوان عن المنطقة المحددة.</p>
            </div>
            
            <div className="feature-card">
              <div className="flex justify-center mb-6">
                <CreditCard size={48} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 ar">ملف تعريف الحيوان</h3>
              <p className="text-muted-foreground ar">احفظ كل معلومات حيوانك في مكان واحد يسهل الوصول إليه.</p>
            </div>
            
            <div className="feature-card">
              <div className="flex justify-center mb-6">
                <MapPin size={48} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 ar">تتبع الموقع</h3>
              <p className="text-muted-foreground ar">اعرف مكان حيوانك الأليف باستخدام تقنية NFC و GPS.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary ar">خطط الاشتراك</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <Card className="border-2 overflow-hidden">
              <div className="py-6 text-center border-b">
                <h3 className="text-2xl font-bold ar">الأساسية</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-primary">$60</span>
                  <span className="text-muted-foreground">/سنة</span>
                </div>
              </div>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  <li className="flex ar">
                    <span className="mr-2">✓</span>
                    <span>علامة NFC واحدة</span>
                  </li>
                  <li className="flex ar">
                    <span className="mr-2">✓</span>
                    <span>ملف تعريف واحد</span>
                  </li>
                  <li className="flex ar">
                    <span className="mr-2">✓</span>
                    <span>دعم أساسي</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 subscribe-button">
                  اشترك الآن
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="border-2 border-primary overflow-hidden shadow-lg">
              <div className="py-6 text-center border-b bg-primary/10">
                <h3 className="text-2xl font-bold text-primary ar">المميزة</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-primary">$120</span>
                  <span className="text-muted-foreground">/سنة</span>
                </div>
              </div>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  <li className="flex ar">
                    <span className="mr-2">✓</span>
                    <span>4 علامات NFC</span>
                  </li>
                  <li className="flex ar">
                    <span className="mr-2">✓</span>
                    <span>ملفات متعددة</span>
                  </li>
                  <li className="flex ar">
                    <span className="mr-2">✓</span>
                    <span>دعم 24/7</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 subscribe-button">
                  اشترك الآن
                </Button>
              </CardContent>
            </Card>

            {/* Family Plan */}
            <Card className="border-2 overflow-hidden">
              <div className="py-6 text-center border-b">
                <h3 className="text-2xl font-bold ar">العائلية</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-primary">$200</span>
                  <span className="text-muted-foreground">/سنة</span>
                </div>
              </div>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  <li className="flex ar">
                    <span className="mr-2">✓</span>
                    <span>10 علامات NFC</span>
                  </li>
                  <li className="flex ar">
                    <span className="mr-2">✓</span>
                    <span>ملفات غير محدودة</span>
                  </li>
                  <li className="flex ar">
                    <span className="mr-2">✓</span>
                    <span>دعم VIP</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 subscribe-button">
                  اشترك الآن
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary ar">تواصل معنا</h2>
          
          <div className="text-center">
            <p className="text-lg mb-6 ar">لأي استفسار، تواصل معنا عبر:</p>
            <div className="flex justify-center items-center gap-4 flex-wrap">
              <Link to="mailto:info@pettouch.com" className="flex items-center text-primary hover:underline">
                <span className="ml-2">✉️</span>
                info@pettouch.com
              </Link>
              <Link to="tel:+1234567890" className="flex items-center text-primary hover:underline">
                <span className="ml-2">📞</span>
                +1234567890
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-8 mt-auto">
        <div className="container mx-auto text-center">
          <p>© {new Date().getFullYear()} PetTouch. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
