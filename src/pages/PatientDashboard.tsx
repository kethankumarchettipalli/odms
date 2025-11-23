import { useState, useEffect } from "react";
import { Button } from "@/components/ui/enhanced-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Heart, Clock, FileText, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { createOrganRequest, getOrganRequestsByPatient, OrganRequest } from "@/lib/firebaseAuth";

const PatientDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [requests, setRequests] = useState<OrganRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    bloodType: "",
    requiredOrgan: "",
    hospitalName: "",
    urgencyLevel: "",
  });

  useEffect(() => {
    if (user) {
      loadRequests();
    }
  }, [user]);

  const loadRequests = async () => {
    if (!user) return;
    
    try {
      const userRequests = await getOrganRequestsByPatient(user.id);
      setRequests(userRequests);
    } catch (error) {
      console.error('Error loading requests:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to submit a request.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.age || !formData.bloodType || !formData.requiredOrgan || !formData.hospitalName || !formData.urgencyLevel) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await createOrganRequest({
        patientId: user.id,
        patientName: formData.name,
        age: parseInt(formData.age),
        bloodType: formData.bloodType,
        requiredOrgan: formData.requiredOrgan,
        hospitalName: formData.hospitalName,
        urgencyLevel: formData.urgencyLevel as 'Low' | 'Medium' | 'High',
        status: 'Pending'
      });

      toast({
        title: "Request Submitted",
        description: "Your organ request has been submitted successfully. We will contact you soon.",
      });

      // Reset form and reload requests
      setFormData({
        name: "",
        age: "",
        bloodType: "",
        requiredOrgan: "",
        hospitalName: "",
        urgencyLevel: "",
      });

      await loadRequests();
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit organ request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Approved":
        return "text-green-600 bg-green-50 border-green-200";
      case "Rejected":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "High":
        return "text-red-600";
      case "Medium":
        return "text-yellow-600";
      case "Low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Heart className="h-8 w-8 text-primary mr-3" fill="currentColor" />
              <h1 className="text-3xl font-bold text-foreground">Patient Dashboard</h1>
            </div>
            <p className="text-muted-foreground">
              Submit organ requests and track your medical journey with us.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Organ Request Form */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  Submit Organ Request
                </CardTitle>
                <CardDescription>
                  Fill out this form to request an organ transplant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="Enter your age"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        required
                        min="1"
                        max="120"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bloodType">Blood Type</Label>
                      <Input
                        id="bloodType"
                        type="text"
                        placeholder="e.g., O+, A-, B+, AB-"
                        value={formData.bloodType}
                        onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="requiredOrgan">Required Organ</Label>
                      <Input
                        id="requiredOrgan"
                        type="text"
                        placeholder="e.g., Heart, Kidney, Liver"
                        value={formData.requiredOrgan}
                        onChange={(e) => setFormData({ ...formData, requiredOrgan: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="hospitalName">Hospital Name</Label>
                    <Input
                      id="hospitalName"
                      type="text"
                      placeholder="Enter your preferred hospital"
                      value={formData.hospitalName}
                      onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="urgencyLevel">Urgency Level</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, urgencyLevel: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select urgency level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" variant="medical" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? "Submitting..." : "Submit Request"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Previous Requests */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  Previous Requests
                </CardTitle>
                <CardDescription>
                  Track the status of your submitted organ requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {requests.map((request) => (
                    <div
                      key={request.id}
                      className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-muted-foreground mr-2" />
                          <span className="font-medium">{request.requiredOrgan}</span>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Blood Type:</span> {request.bloodType}
                        </div>
                        <div>
                          <span className="font-medium">Urgency:</span>{" "}
                          <span className={getUrgencyColor(request.urgencyLevel)}>
                            {request.urgencyLevel}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Hospital:</span> {request.hospitalName}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Request ID: {request.id}
                      </div>
                    </div>
                  ))}

                  {requests.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No previous requests found.</p>
                      <p className="text-sm">Submit your first organ request using the form.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PatientDashboard;