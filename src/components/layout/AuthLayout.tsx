
import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  footer?: ReactNode;
}

const AuthLayout = ({ 
  children, 
  title, 
  description,
  footer
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <div className="flex justify-center items-center">
              <img src="/lovable-uploads/d8049df2-619a-44e5-9cd8-c54416c17875.png" alt="PetTouch" className="h-14 w-14" />
            </div>
            <h1 className="text-3xl font-bold text-primary mt-3">التبليغ عن حيوان</h1>
          </Link>
          <h2 className="text-2xl font-bold mt-6 ar">{title}</h2>
          {description && <p className="text-muted-foreground mt-2 ar">{description}</p>}
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          {children}
        </div>
        
        {footer && (
          <div className="text-center text-sm text-muted-foreground">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthLayout;
