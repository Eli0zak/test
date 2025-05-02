
import { ReactNode } from "react";

interface TagLayoutProps {
  children: ReactNode;
}

const TagLayout = ({ children }: TagLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pet-purple-light/50 to-background">
      <div className="mx-auto max-w-md p-4 pt-8">
        <header className="mb-6 text-center">
          <div className="inline-block bg-white p-3 rounded-full shadow-md">
            <h1 className="text-2xl font-bold text-pet-purple">PetTouch</h1>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} PetTouch. All rights reserved.</p>
          <p className="mt-1">
            <a href="/" className="text-pet-purple hover:underline">
              Get PetTouch for your pets
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default TagLayout;
