import { Link } from "react-router-dom";
import { Button } from "@/components/ui/enhanced-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Heart, Users, Clock, Shield, ArrowRight, CheckCircle } from "lucide-react";

const Index = () => {
  const stats = [
    { label: "Lives Saved", value: "150,000+", icon: Heart },
    { label: "Registered Donors", value: "50,000+", icon: Users },
    { label: "Average Wait Time", value: "2.5 years", icon: Clock },
    { label: "Success Rate", value: "94%", icon: Shield },
  ];

  const benefits = [
    "Save up to 8 lives with organ donation",
    "Help restore sight through cornea donation",
    "Advance medical research and education",
    "Leave a lasting legacy of compassion",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pastel-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Give the
                <span className="medical-gradient bg-clip-text text-transparent"> Gift of Life</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Join thousands of heroes who have registered as organ donors. 
                One decision can save multiple lives and bring hope to families waiting for a miracle.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/register">
                    Become a Donor Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="xl" asChild>
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
              
              {/* Quick Benefits */}
              <div className="mt-12 space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="text-sm text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="medical-gradient rounded-3xl p-8 text-white floating-shadow">
                <div className="text-center">
                  <Heart className="h-16 w-16 mx-auto mb-4" fill="currentColor" />
                  <h3 className="text-2xl font-bold mb-2">Every 10 Minutes</h3>
                  <p className="text-white/90 mb-6">
                    Someone is added to the organ transplant waiting list
                  </p>
                  <div className="bg-white/20 rounded-xl p-4">
                    <p className="text-sm text-white/80">
                      "Because of my donor, I was able to see my daughter graduate. 
                      Organ donation gave me a second chance at life."
                    </p>
                    <p className="text-xs text-white/70 mt-2">- Sarah M., Heart Recipient</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="medical-gradient rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How Organ Donation Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Understanding the process helps you make an informed decision about this life-saving gift.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-shadow border-0">
              <CardHeader className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary-soft flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <CardTitle>Register to Donate</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Sign up online or at your local DMV. Choose which organs and tissues you'd like to donate.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="card-shadow border-0">
              <CardHeader className="text-center">
                <div className="w-12 h-12 rounded-full bg-secondary-soft flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-secondary">2</span>
                </div>
                <CardTitle>Medical Evaluation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  When the time comes, medical professionals evaluate organ viability and match with recipients.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="card-shadow border-0">
              <CardHeader className="text-center">
                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-success">3</span>
                </div>
                <CardTitle>Save Lives</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Your donation gives recipients a second chance at life and brings hope to their families.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 medical-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Save Lives?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join our community of life-savers. Registration takes less than 5 minutes, 
            but your impact will last forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="xl" className="bg-white text-primary hover:bg-white/90" asChild>
              <Link to="/register">Register Now</Link>
            </Button>
            <Button variant="ghost" size="xl" className="text-white hover:bg-white/10" asChild>
              <Link to="/login">Already Registered? Login</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;