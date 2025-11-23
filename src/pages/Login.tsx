import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/enhanced-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Heart, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { AuthRedirect } from "@/components/AuthRedirect";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, user } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await signIn(formData.email, formData.password);
      
      toast({
        title: "Welcome Back!",
        description: "Redirecting to your dashboard...",
      });
      
      // Navigation will be handled by auth state change
      setTimeout(() => {
        if (formData.email === 'kokkiligaddadivyacharan2007@gmail.com') {
          navigate('/dashboard/super-admin');
        } else {
          // Let AuthGuard handle the redirect based on user role
          navigate('/dashboard/donor'); // Will redirect based on actual role
        }
      }, 100);
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AuthRedirect />
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-muted-foreground hover:text-primary transition-medical mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-10 w-10 text-primary mr-3" fill="currentColor" />
              <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
            </div>
            <p className="text-muted-foreground">
              Sign in to access your organ donation dashboard
            </p>
          </div>

          <Card className="card-shadow">
            <CardHeader className="text-center pb-2">
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" variant="medical" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>

                <div className="text-center space-y-2">
                  <Link 
                    to="#" 
                    className="text-sm text-primary hover:underline transition-medical"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </form>

              <div className="mt-6 pt-6 border-t border-border">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Don't have an account?
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/register">
                      <Heart className="h-4 w-4 mr-2" />
                      Become a Donor
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Credentials */}
          <Card className="mt-6 bg-primary-soft border-primary/20">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-primary mb-3">Demo Credentials</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Donor:</strong> donor@demo.com / password123
                </div>
                <div>
                  <strong>Admin:</strong> admin@demo.com / password123
                </div>
                <div>
                  <strong>Patient:</strong> patient@demo.com / password123
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;