import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getAnimalById, recordAnimalScan } from "@/lib/supabase";
import { Animal } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PawPrint, Phone, Mail, AlertTriangle, Home } from "lucide-react";

const TagPage = () => {
  const { id } = useParams<{ id: string }>();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimal = async () => {
      setLoading(true);
      try {
        if (!id) {
          setError("معرف الحيوان غير صالح");
          setLoading(false);
          return;
        }

        const animalData = await getAnimalById(id);
        
        if (!animalData) {
          setError("لم يتم العثور على الحيوان");
          setLoading(false);
          return;
        }

        // Record that the animal was scanned
        await recordAnimalScan(id);
        
        // Set the animal data
        setAnimal(animalData);
      } catch (error) {
        console.error("Error fetching animal:", error);
        setError("حدث خطأ أثناء جلب بيانات الحيوان");
      } finally {
        setLoading(false);
      }
    };

    fetchAnimal();
  }, [id]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn("Loading state persisted for too long. Redirecting to error page.");
        setError("حدثت مشكلة في تحميل البيانات. يرجى المحاولة لاحقًا.");
        setLoading(false);
      }
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timeout);
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-purple-600 flex flex-col items-center justify-center text-white p-4" dir="rtl">
        <div className="flex items-center justify-center">
          <img src="/lovable-uploads/d8049df2-619a-44e5-9cd8-c54416c17875.png" alt="PetTouch" className="h-16 w-16" />
        </div>
        <h1 className="text-2xl font-bold mt-4 mb-2">التبليغ عن حيوان</h1>
        <p>جاري التحميل...</p>
        <div className="mt-4 w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !animal) {
    return (
      <div className="min-h-screen bg-purple-600 flex flex-col items-center justify-center text-white p-4" dir="rtl">
        <div className="flex items-center justify-center">
          <img src="/lovable-uploads/d8049df2-619a-44e5-9cd8-c54416c17875.png" alt="PetTouch" className="h-16 w-16" />
        </div>
        <h1 className="text-2xl font-bold mt-4">التبليغ عن حيوان</h1>
        <div className="max-w-md w-full bg-white text-gray-800 rounded-lg p-6 mt-8 shadow-lg">
          <div className="flex flex-col items-center text-center">
            <AlertTriangle size={64} className="text-red-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">خطأ</h2>
            <p className="text-gray-600">{error || "حدث خطأ غير معروف"}</p>
            <Button asChild className="mt-6">
              <Link to="/">العودة إلى الصفحة الرئيسية</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-600 flex flex-col items-center p-4" dir="rtl">
      <div className="flex items-center justify-center mb-8 mt-6">
        <img src="/lovable-uploads/d8049df2-619a-44e5-9cd8-c54416c17875.png" alt="PetTouch" className="h-16 w-16 mr-4" />
        <div className="text-white">
          <h1 className="text-2xl font-bold">التبليغ عن حيوان</h1>
          <p>كيف تريد التبليغ؟</p>
        </div>
      </div>

      <Card className="max-w-lg w-full mb-4">
        <CardContent className="py-6">
          <div className="flex items-center justify-center mb-4">
            {animal.image_url ? (
              <img 
                src={animal.image_url} 
                alt={animal.name}
                className="w-32 h-32 object-cover rounded-full border-4 border-primary"
              />
            ) : (
              <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center">
                <PawPrint className="w-16 h-16 text-white" />
              </div>
            )}
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-1">{animal.name}</h2>
            <p className="text-gray-500">{animal.type}</p>
            <div className="mt-2">
              <span className="inline-block bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                العمر: {animal.age} سنوات
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="text-lg font-semibold mb-3">معلومات إضافية</h3>
            <p className="text-gray-700 mb-4">{animal.notes || "لا توجد ملاحظات إضافية."}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="max-w-lg w-full mb-4">
        <CardContent className="py-6">
          <h3 className="text-xl font-bold mb-4">تبليغ باستخدام علامة NFC</h3>
          <p className="text-gray-600">إذا كان الحيوان يحمل علامة PetTouch، قم بمسحها هنا.</p>
          <Button className="w-full mt-4">مسح العلامة</Button>
        </CardContent>
      </Card>

      <Card className="max-w-lg w-full">
        <CardContent className="py-6">
          <h3 className="text-xl font-bold mb-4">تبليغ بدون علامة NFC</h3>
          <p className="text-gray-600">إذا عثرت على حيوان لا يحمل علامة، يمكنك التبليغ عنه هنا.</p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Button variant="outline" className="flex items-center justify-center">
              <Phone size={18} className="ml-2" /> اتصال
            </Button>
            <Button variant="outline" className="flex items-center justify-center">
              <Mail size={18} className="ml-2" /> بريد إلكتروني
            </Button>
          </div>
        </CardContent>
      </Card>

      <Button asChild variant="ghost" className="mt-8 text-white">
        <Link to="/" className="flex items-center">
          <Home size={18} className="ml-2" /> العودة للرئيسية
        </Link>
      </Button>
      
      <footer className="mt-auto py-4 text-center text-white/80 text-sm">
        © {new Date().getFullYear()} PetTouch. جميع الحقوق محفوظة.
      </footer>
    </div>
  );
};

export default TagPage;
