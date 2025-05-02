import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-pet-purple">PetTouch</span>
          </div>
          <nav className="ml-auto flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Log in
            </Link>
            <Button asChild>
              <Link to="/register">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero section */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
                Keep Your Pets Safe and Connected
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                PetTouch helps you keep track of your pets with smart tags that
                connect to a digital profile containing all their essential
                information.
              </p>
              <div className="mt-8">
                <Button asChild size="lg" className="px-8 rounded-full">
                  <Link to="/register">Create Your Account</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Plans section */}
        <section className="py-16 px-6 bg-muted">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Choose the Right Plan for You</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mt-3">
                We offer different plans to meet your needs. Start with our free
                Basic plan and upgrade anytime.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-10">
              {/* Basic Plan */}
              <Card className="border-2 overflow-hidden">
                <div className="bg-slate-100 py-3 text-center">
                  <h3 className="text-lg font-bold">Basic</h3>
                </div>
                <CardContent className="pt-6">
                  <div className="text-center mb-4">
                    <p className="text-3xl font-bold">$0</p>
                    <p className="text-sm text-muted-foreground">Free forever</p>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>One pet profile</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>Basic pet information</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>QR code tag access</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/register">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Comfort Plan */}
              <Card className="border-2 border-pet-purple overflow-hidden relative">
                <div className="absolute top-0 right-0 bg-pet-purple text-white text-xs py-1 px-3 rounded-bl-lg">
                  Most Popular
                </div>
                <div className="bg-pet-purple/10 py-3 text-center">
                  <h3 className="text-lg font-bold text-pet-purple">Comfort</h3>
                </div>
                <CardContent className="pt-6">
                  <div className="text-center mb-4">
                    <p className="text-3xl font-bold">$5</p>
                    <p className="text-sm text-muted-foreground">per month</p>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>Up to 3 pet profiles</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>Detailed pet information</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>Custom pet photo</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>Email notifications when scanned</span>
                    </li>
                  </ul>
                  <Button className="w-full" asChild>
                    <Link to="/register">Choose Comfort</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* VIP Plan */}
              <Card className="border-2 overflow-hidden">
                <div className="bg-amber-100 py-3 text-center">
                  <h3 className="text-lg font-bold text-amber-700">VIP</h3>
                </div>
                <CardContent className="pt-6">
                  <div className="text-center mb-4">
                    <p className="text-3xl font-bold">$12</p>
                    <p className="text-sm text-muted-foreground">per month</p>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>Unlimited pet profiles</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>All Comfort plan features</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>WhatsApp notifications</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>Location tracking when scanned</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>Early access to new features</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/register">Choose VIP</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 px-6">
        <div className="container mx-auto">
          <div className="text-center">
            <p className="text-muted-foreground">
              © {new Date().getFullYear()} PetTouch. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
