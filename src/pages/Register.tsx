import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/enhanced-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Heart, ArrowLeft, Shield, CheckCircle, User, Building, Users, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";


type UserRole = 'donor' | 'patient' | 'admin';

const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [step, setStep] = useState<'role' | 'form'>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedOrgans, setSelectedOrgans] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    bloodType: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    emergencyContact: "",
    emergencyPhone: "",
    medicalHistory: "",
    // Admin specific fields
    department: "",
    hospitalName: "",
    adminId: "",
    agreeToTerms: false,
    agreeToContact: false,
  });

  const roleOptions = [
    {
      id: 'donor' as UserRole,
      title: 'Organ Donor',
      description: 'Register to donate organs and save lives',
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      borderColor: 'border-red-200 dark:border-red-800'
    },
    {
      id: 'patient' as UserRole,
      title: 'Patient',
      description: 'Register to access organ transplant services',
      icon: User,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      id: 'admin' as UserRole,
      title: 'Hospital Admin',
      description: 'Manage organ requests and transplant operations',
      icon: Building,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      borderColor: 'border-purple-200 dark:border-purple-800'
    }
  ];

  const organs = [
    { id: "heart", label: "Heart", description: "Can save 1 life" },
    { id: "lungs", label: "Lungs", description: "Can save 2 lives" },
    { id: "liver", label: "Liver", description: "Can save 1 life" },
    { id: "kidneys", label: "Kidneys", description: "Can save 2 lives" },
    { id: "pancreas", label: "Pancreas", description: "Can save 1 life" },
    { id: "intestines", label: "Intestines", description: "Can save 1 life" },
    { id: "corneas", label: "Corneas", description: "Can restore sight to 2 people" },
    { id: "tissue", label: "Tissue", description: "Can help 75+ people" },
  ];

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep('form');
  };

  const handleOrganToggle = (organId: string) => {
    setSelectedOrgans(prev =>
      prev.includes(organId)
        ? prev.filter(id => id !== organId)
        : [...prev, organId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }

    // Role-specific validation
    if (selectedRole === 'donor' && selectedOrgans.length === 0) {
      toast({
        title: "Select Organs",
        description: "Please select at least one organ or tissue to donate.",
        variant: "destructive",
      });
      return;
    }

    if (selectedRole === 'admin' && (!formData.department || !formData.hospitalName || !formData.adminId)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required admin fields.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`;
      
      // Prepare registration data based on role
      const registrationData: any = {
        name: fullName,
        email: formData.email,
        password: formData.password,
        role: selectedRole!
      };

      // Add role-specific data
      if (selectedRole === 'donor') {
        Object.assign(registrationData, {
          bloodType: formData.bloodType,
          organs: selectedOrgans,
          emergencyContact: formData.emergencyContact,
          emergencyPhone: formData.emergencyPhone,
          medicalHistory: formData.medicalHistory,
          dateOfBirth: formData.dateOfBirth,
          address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`
        });
      } else if (selectedRole === 'patient') {
        Object.assign(registrationData, {
          bloodType: formData.bloodType,
          hospitalName: formData.hospitalName
        });
      } else if (selectedRole === 'admin') {
        Object.assign(registrationData, {
          department: formData.department || 'General',
          hospitalName: formData.hospitalName || 'General Hospital'
        });
      }

      await signUp(registrationData.email, registrationData.password, registrationData);

      toast({
        title: "Registration Successful!",
        description: `Thank you for registering as a ${selectedRole}. Please check your email to verify your account.`,
      });

      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderRoleSelection = () => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <Link 
          to="/" 
          className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        <div className="flex items-center justify-center mb-6">
          <Users className="h-12 w-12 text-primary mr-3" />
          <h1 className="text-4xl font-bold text-foreground">Join Our Community</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose how you'd like to participate in our organ donation and transplant network
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {roleOptions.map((role) => {
          const IconComponent = role.icon;
          return (
            <Card 
              key={role.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 ${role.borderColor} ${role.bgColor}`}
              onClick={() => handleRoleSelect(role.id)}
            >
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className={`p-4 rounded-full bg-white dark:bg-gray-800 shadow-md`}>
                    <IconComponent className={`h-8 w-8 ${role.color}`} fill={role.id === 'donor' ? 'currentColor' : 'none'} />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold">{role.title}</CardTitle>
                <CardDescription className="text-center text-sm">
                  {role.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button className="w-full" variant="outline">
                  Select <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderRegistrationForm = () => {
    const selectedRoleOption = roleOptions.find(r => r.id === selectedRole);
    const IconComponent = selectedRoleOption?.icon || User;

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <button 
            onClick={() => setStep('role')}
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Change Role
          </button>
          <div className="flex items-center justify-center mb-4">
            <IconComponent className={`h-10 w-10 mr-3 ${selectedRoleOption?.color}`} fill={selectedRole === 'donor' ? 'currentColor' : 'none'} />
            <h1 className="text-3xl font-bold text-foreground">
              Register as {selectedRoleOption?.title}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            {selectedRoleOption?.description}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-primary" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="bloodType">Blood Type *</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, bloodType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin-specific fields */}
          {selectedRole === 'admin' && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2 text-primary" />
                  Hospital Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hospitalName">Hospital Name *</Label>
                    <Input
                      id="hospitalName"
                      value={formData.hospitalName}
                      onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department *</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      placeholder="e.g., Transplant Unit"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="adminId">Admin ID *</Label>
                  <Input
                    id="adminId"
                    value={formData.adminId}
                    onChange={(e) => setFormData({ ...formData, adminId: e.target.value })}
                    placeholder="Your hospital admin ID"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Organ Selection - Only for donors */}
          {selectedRole === 'donor' && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-primary" fill="currentColor" />
                  Organs & Tissues to Donate
                </CardTitle>
                <CardDescription>
                  Select which organs and tissues you're willing to donate.
                </CardDescription>
              </CardHeader>
              <CardContent>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {organs.map((organ) => (
      <label
        key={organ.id}
        className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-all"
      >
        <input
          type="checkbox"
          value={organ.id}
          checked={selectedOrgans.includes(organ.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedOrgans([...selectedOrgans, organ.id])
            } else {
              setSelectedOrgans(selectedOrgans.filter(o => o !== organ.id))
            }
          }}
          className="h-4 w-4"
        />
        <div>
          <h4 className="font-medium text-foreground">{organ.label}</h4>
          <p className="text-sm text-muted-foreground">{organ.description}</p>
        </div>
      </label>
    ))}
  </div>
</CardContent>
            </Card>
          )}

          {/* Emergency Contact */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                    required
                  />
                </div>
              </div>
              {selectedRole === 'donor' && (
                <div>
                  <Label htmlFor="medicalHistory">Medical History (Optional)</Label>
                  <Textarea
                    id="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                    placeholder="Any relevant medical conditions or allergies..."
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Terms and Conditions */}
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, agreeToTerms: checked as boolean })
                    }
                  />
                  <label htmlFor="agreeToTerms" className="text-sm leading-5">
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                    . *
                  </label>
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeToContact"
                    checked={formData.agreeToContact}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, agreeToContact: checked as boolean })
                    }
                  />
                  <label htmlFor="agreeToContact" className="text-sm leading-5">
                    I agree to be contacted for organ donation coordination and updates.
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : `Register as ${selectedRoleOption?.title}`}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="flex-1 py-12">
        {step === 'role' ? renderRoleSelection() : renderRegistrationForm()}
      </div>

      <Footer />
    </div>
  );
};

export default Register;