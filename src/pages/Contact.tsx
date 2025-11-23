import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ChatBot } from "@/components/ChatBot";
import { 
  Heart, 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle,
  AlertCircle,
  Users,
  Stethoscope,
  Headphones
} from "lucide-react";

const Contact = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const contactMethods = [
    {
      icon: Phone,
      title: "Emergency Hotline",
      description: "24/7 emergency organ coordination",
      contact: "1-800-ORGAN-1",
      subtext: "For urgent medical situations",
      color: "text-destructive",
    },
    {
      icon: Mail,
      title: "General Information",
      description: "Questions about organ donation",
      contact: "info@organconnect.org",
      subtext: "Response within 24 hours",
      color: "text-primary",
    },
    {
      icon: Headphones,
      title: "Support Line",
      description: "Donor and family support",
      contact: "1-800-SUPPORT",
      subtext: "Monday - Friday, 8AM - 6PM",
      color: "text-secondary",
    },
    {
      icon: Users,
      title: "Hospital Coordination",
      description: "Medical professional inquiries",
      contact: "medical@organconnect.org",
      subtext: "For healthcare providers",
      color: "text-accent",
    },
  ];

  const faqs = [
    {
      question: "How do I register as an organ donor?",
      answer: "You can register online through our platform or at your local DMV. The process takes just a few minutes.",
    },
    {
      question: "Can I change my donation preferences?",
      answer: "Yes, you can update your preferences anytime by logging into your donor account.",
    },
    {
      question: "What if I have a medical condition?",
      answer: "Medical professionals evaluate each potential donor individually. Many conditions don't prevent donation.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-12 w-12 text-primary mr-3" fill="currentColor" />
              <h1 className="text-4xl font-bold text-foreground">Get in Touch</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Have questions about organ donation? Need support? We're here to help 24/7. 
              Reach out to our dedicated team of professionals.
            </p>
          </div>

          {/* Emergency Notice */}
          <Card className="mb-8 bg-destructive/5 border-destructive/20">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-destructive mb-2">Medical Emergency?</h3>
                  <p className="text-sm text-foreground mb-3">
                    If you have a medical emergency requiring immediate organ transplant coordination, 
                    please call our emergency hotline immediately or dial 911.
                  </p>
                  <Button variant="destructive" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Emergency Line: 1-800-ORGAN-1
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* AI Chat Support */}
            <div>
              <Card className="card-shadow bg-gradient-to-br from-primary-soft to-background border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2 text-primary" />
                    AI-Powered Support Chat
                  </CardTitle>
                  <CardDescription>
                    Get instant answers to your organ donation questions with our Gemini 1.5 Flash-powered assistant.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-background rounded-lg p-4 border border-primary/20">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <MessageCircle className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">AI Organ Donation Assistant</p>
                        <p className="text-sm text-muted-foreground">Powered by Gemini 1.5 Flash</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <p>• Registration guidance and eligibility</p>
                      <p>• Medical questions and procedures</p>
                      <p>• Legal and ethical information</p>
                      <p>• Family support and counseling</p>
                      <p>• Emergency protocols and contacts</p>
                    </div>
                    
                    <Button 
                      onClick={() => setIsChatOpen(true)}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Start AI Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Contact Methods */}
              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <Card key={index} className="card-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 ${method.color}`}>
                          <method.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">{method.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                          <p className="font-medium text-foreground">{method.contact}</p>
                          <p className="text-xs text-muted-foreground">{method.subtext}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>


              {/* Quick FAQs */}
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>Quick Answers</CardTitle>
                  <CardDescription>Common questions we receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="space-y-2">
                      <h4 className="font-medium text-sm text-foreground">{faq.question}</h4>
                      <p className="text-xs text-muted-foreground">{faq.answer}</p>
                      {index < faqs.length - 1 && <hr className="border-border" />}
                    </div>
                  ))}
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </div>

      {/* Chat Bot */}
      <ChatBot isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />

      <Footer />
    </div>
  );
};

export default Contact;