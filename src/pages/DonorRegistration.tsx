import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserProfile } from '@/lib/firebaseAuth';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Heart, UserCheck, Shield, Clock } from 'lucide-react';

const AVAILABLE_ORGANS = [
  { id: 'heart', name: 'Heart', description: 'Can save 1 life' },
  { id: 'kidneys', name: 'Kidneys (both)', description: 'Can save 2 lives' },
  { id: 'liver', name: 'Liver', description: 'Can save 1-2 lives' },
  { id: 'lungs', name: 'Lungs (both)', description: 'Can save 2 lives' },
  { id: 'pancreas', name: 'Pancreas', description: 'Can help diabetic patients' },
  { id: 'intestines', name: 'Intestines', description: 'Can help 1 patient' },
  { id: 'corneas', name: 'Corneas', description: 'Can restore sight to 2 people' },
  { id: 'skin', name: 'Skin', description: 'Can help burn victims' },
  { id: 'bone', name: 'Bone', description: 'Can help multiple patients' },
  { id: 'heart_valves', name: 'Heart Valves', description: 'Can help heart patients' }
];

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const DonorRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bloodType: '',
    dateOfBirth: '',
    emergencyContact: '',
    medicalHistory: '',
    selectedOrgans: [] as string[],
    consentAgreement: false,
    familyNotified: false
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.bloodType) newErrors.bloodType = 'Blood type is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.emergencyContact.trim()) newErrors.emergencyContact = 'Emergency contact is required';
    if (formData.selectedOrgans.length === 0) newErrors.selectedOrgans = 'Please select at least one organ to donate';
    if (!formData.consentAgreement) newErrors.consentAgreement = 'You must agree to the consent terms';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOrganToggle = (organId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedOrgans: prev.selectedOrgans.includes(organId)
        ? prev.selectedOrgans.filter(id => id !== organId)
        : [...prev.selectedOrgans, organId]
    }));
    
    // Clear organ selection error when user makes a selection
    if (errors.selectedOrgans) {
      setErrors(prev => ({ ...prev, selectedOrgans: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to register as a donor",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      await updateUserProfile(user.id, {
        ...formData,
        role: 'donor',
        organs: formData.selectedOrgans,
        donorRegistrationDate: new Date(),
        isActive: true
      } as any);

      toast({
        title: "Registration Successful!",
        description: "You have been successfully registered as an organ donor.",
      });

      // Navigate to donor dashboard
      navigate('/dashboard/donor');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "There was an error registering you as a donor. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-12 w-12 text-primary mr-3" fill="currentColor" />
              <h1 className="text-4xl font-bold text-foreground">Become an Organ Donor</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of heroes who have chosen to save lives through organ donation. 
              Your registration can help save up to 8 lives and improve many more.
            </p>
          </div>

          {/* Registration Form */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCheck className="h-5 w-5 mr-2 text-primary" />
                Donor Registration Form
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className={errors.name ? 'border-destructive' : ''}
                    />
                    {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className={errors.phone ? 'border-destructive' : ''}
                    />
                    {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <Label htmlFor="bloodType">Blood Type *</Label>
                    <Select
                      value={formData.bloodType}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, bloodType: value }))}
                    >
                      <SelectTrigger className={errors.bloodType ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                      <SelectContent>
                        {BLOOD_TYPES.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.bloodType && <p className="text-sm text-destructive mt-1">{errors.bloodType}</p>}
                  </div>

                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      className={errors.dateOfBirth ? 'border-destructive' : ''}
                    />
                    {errors.dateOfBirth && <p className="text-sm text-destructive mt-1">{errors.dateOfBirth}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact *</Label>
                  <Input
                    id="emergencyContact"
                    placeholder="Name and phone number"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                    className={errors.emergencyContact ? 'border-destructive' : ''}
                  />
                  {errors.emergencyContact && <p className="text-sm text-destructive mt-1">{errors.emergencyContact}</p>}
                </div>

                <div>
                  <Label htmlFor="medicalHistory">Medical History (Optional)</Label>
                  <Textarea
                    id="medicalHistory"
                    placeholder="Any relevant medical conditions, surgeries, or medications..."
                    value={formData.medicalHistory}
                    onChange={(e) => setFormData(prev => ({ ...prev, medicalHistory: e.target.value }))}
                    rows={3}
                  />
                </div>

                {/* Organ Selection */}
                <div>
                  <Label className="text-base font-semibold">Organs and Tissues to Donate *</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select the organs and tissues you would like to donate. You can change these preferences anytime.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {AVAILABLE_ORGANS.map(organ => (
                      <div 
                        key={organ.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          formData.selectedOrgans.includes(organ.id)
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => handleOrganToggle(organ.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            checked={formData.selectedOrgans.includes(organ.id)}
                            onChange={() => handleOrganToggle(organ.id)}
                            className="mt-1"
                          />
                          <div>
                            <h4 className="font-medium">{organ.name}</h4>
                            <p className="text-sm text-muted-foreground">{organ.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.selectedOrgans && <p className="text-sm text-destructive mt-2">{errors.selectedOrgans}</p>}
                </div>

                {/* Consent and Agreement */}
                <div className="space-y-4 bg-muted/30 p-6 rounded-lg">
                  <h3 className="font-semibold flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-primary" />
                    Consent and Legal Agreement
                  </h3>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={formData.familyNotified}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, familyNotified: !!checked }))}
                    />
                    <div>
                      <Label className="text-sm">
                        I have informed my family about my decision to donate organs
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        While not required, family awareness helps ensure your wishes are honored
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={formData.consentAgreement}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, consentAgreement: !!checked }))}
                      className={errors.consentAgreement ? 'border-destructive' : ''}
                    />
                    <div>
                      <Label className="text-sm">
                        I consent to organ donation and understand the process *
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        By checking this box, I give my consent for organ and tissue donation 
                        according to my selections above, and I understand that:
                      </p>
                      <ul className="text-xs text-muted-foreground mt-2 space-y-1 ml-4">
                        <li>• Medical professionals will determine organ viability</li>
                        <li>• Donation will only occur after legal declaration of death</li>
                        <li>• My body will be treated with dignity and respect</li>
                        <li>• I can modify or withdraw consent at any time</li>
                      </ul>
                    </div>
                  </div>
                  {errors.consentAgreement && <p className="text-sm text-destructive mt-1">{errors.consentAgreement}</p>}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/register')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {loading ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      <>
                        <Heart className="h-4 w-4 mr-2" fill="currentColor" />
                        Complete Registration
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DonorRegistration;