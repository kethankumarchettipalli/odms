import { Link } from "react-router-dom";
import { Button } from "@/components/ui/enhanced-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  Heart, 
  Users, 
  Clock, 
  Shield,
  CheckCircle,
  X,
  ArrowRight,
  Stethoscope,
  Award,
  Globe
} from "lucide-react";

const About = () => {
  const howItWorksSteps = [
    {
      step: 1,
      title: "Registration",
      description: "Sign up as an organ donor online or at your local DMV. Choose which organs and tissues you want to donate.",
      icon: Users,
    },
    {
      step: 2,
      title: "Medical Evaluation",
      description: "When the time comes, medical professionals evaluate organ viability and compatibility with waiting recipients.",
      icon: Stethoscope,
    },
    {
      step: 3,
      title: "Matching Process",
      description: "Organs are matched to recipients based on blood type, tissue compatibility, medical urgency, and geographic location.",
      icon: Heart,
    },
    {
      step: 4,
      title: "Transport & Transplant",
      description: "Organs are carefully transported to recipient hospitals where life-saving transplant surgeries are performed.",
      icon: Clock,
    },
  ];

  const faqs = [
    {
      question: "Who can become an organ donor?",
      answer: "Almost anyone can be an organ donor regardless of age, race, or medical history. Medical professionals determine organ viability at the time of death based on specific medical criteria.",
    },
    {
      question: "Does organ donation affect funeral arrangements?",
      answer: "No, organ donation does not interfere with funeral arrangements or viewing. The body is treated with respect and care throughout the donation process.",
    },
    {
      question: "Can I specify which organs to donate?",
      answer: "Yes, you can choose to donate specific organs and tissues. You can specify your preferences during registration and update them at any time.",
    },
    {
      question: "Is there an age limit for organ donation?",
      answer: "There is no strict age limit. Medical professionals evaluate each potential donor individually to determine which organs and tissues are viable for transplantation.",
    },
    {
      question: "Will my family know about my decision to donate?",
      answer: "It's important to discuss your decision with your family. While your registration is legally binding, involving your family helps ensure your wishes are respected.",
    },
    {
      question: "How are organs allocated to recipients?",
      answer: "Organs are allocated based on medical compatibility, urgency, time on waiting list, and geographic location. The process is managed by national organ allocation systems.",
    },
  ];

  const mythsVsFacts = [
    {
      myth: "Doctors won't try as hard to save my life if I'm a donor",
      fact: "Medical teams treating patients are completely separate from transplant teams. Your care is never compromised by your donor status.",
      mythIcon: X,
      factIcon: CheckCircle,
    },
    {
      myth: "Organ donation is against my religion",
      fact: "Most major religions support organ donation as an act of charity and compassion. Consult your religious leader if you have concerns.",
      mythIcon: X,
      factIcon: CheckCircle,
    },
    {
      myth: "Rich or famous people get organs faster",
      fact: "Organ allocation is based strictly on medical criteria, not social status or ability to pay. The system is designed to be fair and equitable.",
      mythIcon: X,
      factIcon: CheckCircle,
    },
    {
      myth: "I'm too old to donate organs",
      fact: "Age alone doesn't disqualify you from donation. Organs from donors over 70 have been successfully transplanted.",
      mythIcon: X,
      factIcon: CheckCircle,
    },
  ];

  const statistics = [
    { number: "107,000+", label: "People on waiting list", icon: Users },
    { number: "17", label: "People die daily waiting", icon: Clock },
    { number: "1", label: "Donor can save 8 lives", icon: Heart },
    { number: "95%", label: "Families say yes when they know wishes", icon: Shield },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="flex-1">
        {/* Hero Section */}
        <section className="py-16 medical-gradient">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Understanding Organ Donation
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Learn how organ donation works, dispel common myths, and discover how 
              one person's decision can save and improve multiple lives.
            </p>
            <Button variant="outline" size="xl" className="bg-white text-primary hover:bg-white/90" asChild>
              <Link to="/register">
                Become a Donor Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Statistics */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              The Need is Real
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {statistics.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="medical-gradient rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-8 w-8 text-white" fill={stat.icon === Heart ? "currentColor" : "none"} />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">{stat.number}</div>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorksSteps.map((step, index) => (
                <Card key={index} className="card-shadow text-center border-0">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full bg-primary-soft flex items-center justify-center mx-auto mb-4">
                      <step.icon className="h-8 w-8 text-primary" fill={step.icon === Heart ? "currentColor" : "none"} />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4 -mt-2">
                      <span className="text-sm font-bold">{step.step}</span>
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Myths vs Facts */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Myths vs Facts
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Let's address common misconceptions about organ donation with factual information.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {mythsVsFacts.map((item, index) => (
                <Card key={index} className="card-shadow">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* Myth */}
                      <div className="flex items-start space-x-3 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                        <item.mythIcon className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-destructive mb-1">Myth</h4>
                          <p className="text-sm text-foreground">{item.myth}</p>
                        </div>
                      </div>
                      
                      {/* Fact */}
                      <div className="flex items-start space-x-3 p-4 bg-success/5 rounded-lg border border-success/20">
                        <item.factIcon className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-success mb-1">Fact</h4>
                          <p className="text-sm text-foreground">{item.fact}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-muted-foreground">
                Get answers to common questions about organ donation.
              </p>
            </div>
            
            <Card className="card-shadow">
              <CardContent className="pt-6">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Your Impact Matters
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  When you register as an organ donor, you join a community of heroes 
                  who have made the decision to help others. Your choice can:
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Save up to 8 lives through organ donation</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Restore sight to 2 people through cornea donation</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Help heal 75+ people through tissue donation</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Advance medical research and training</span>
                  </li>
                </ul>
                <Button variant="medical" size="lg" asChild>
                  <Link to="/register">
                    Join the Heroes
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card className="card-shadow">
                  <CardContent className="pt-6 text-center">
                    <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="font-bold text-2xl text-foreground mb-2">1M+</h3>
                    <p className="text-sm text-muted-foreground">Lives Saved</p>
                  </CardContent>
                </Card>
                <Card className="card-shadow">
                  <CardContent className="pt-6 text-center">
                    <Globe className="h-12 w-12 text-secondary mx-auto mb-4" />
                    <h3 className="font-bold text-2xl text-foreground mb-2">50+</h3>
                    <p className="text-sm text-muted-foreground">Countries</p>
                  </CardContent>
                </Card>
                <Card className="card-shadow">
                  <CardContent className="pt-6 text-center">
                    <Heart className="h-12 w-12 text-accent mx-auto mb-4" fill="currentColor" />
                    <h3 className="font-bold text-2xl text-foreground mb-2">24/7</h3>
                    <p className="text-sm text-muted-foreground">Coordination</p>
                  </CardContent>
                </Card>
                <Card className="card-shadow">
                  <CardContent className="pt-6 text-center">
                    <Shield className="h-12 w-12 text-warning mx-auto mb-4" />
                    <h3 className="font-bold text-2xl text-foreground mb-2">100%</h3>
                    <p className="text-sm text-muted-foreground">Confidential</p>
                  </CardContent>
                </Card>
              </div>
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
              Registration takes less than 5 minutes, but your decision 
              can impact lives for generations to come.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="xl" className="bg-white text-primary hover:bg-white/90" asChild>
                <Link to="/register">Register as a Donor</Link>
              </Button>
              <Button variant="ghost" size="xl" className="text-white hover:bg-white/10" asChild>
                <Link to="/contact">Have Questions?</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default About;