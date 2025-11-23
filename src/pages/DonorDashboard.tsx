import { useState, useEffect } from "react";
import { Button } from "@/components/ui/enhanced-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  Heart, 
  Download, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail,
  CheckCircle,
  Clock,
  User,
  Shield
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DonorData } from "@/lib/firebaseAuth";

const DonorDashboard = () => {
  const { user } = useAuth();
  const [donorData, setDonorData] = useState<DonorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonorData = async () => {
      if (user) {
        try {
          const donorDoc = await getDoc(doc(db, 'users', user.id));
          if (donorDoc.exists()) {
            setDonorData(donorDoc.data() as DonorData);
          }
        } catch (error) {
          console.error('Error fetching donor data:', error);
        }
      }
      setLoading(false);
    };

    fetchDonorData();
  }, [user]);

  const pledgedOrgans = donorData?.organs || [];

  const handleDownloadCertificate = () => {
    console.log("Downloading donor certificate...");
  };

  if (loading || !donorData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Welcome back, {donorData.name}!
                </h1>
                <p className="text-muted-foreground">
                  Thank you for being a registered organ donor. Your generosity can save lives.
                </p>
              </div>
              <Badge variant="outline" className="bg-success/10 text-success border-success">
                <CheckCircle className="h-4 w-4 mr-1" />
                Active Donor
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="card-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Heart className="h-8 w-8 text-primary" fill="currentColor" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-foreground">{pledgedOrgans.length}</p>
                        <p className="text-sm text-muted-foreground">Pledged Organs</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Calendar className="h-8 w-8 text-secondary" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-foreground">
                          {donorData.createdAt ? (
                            donorData.createdAt instanceof Date 
                              ? donorData.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
                              : typeof donorData.createdAt === 'object' && 'seconds' in donorData.createdAt
                                ? new Date((donorData.createdAt as any).seconds * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
                                : new Date(donorData.createdAt as any).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
                          ) : 'N/A'}
                        </p>
                        <p className="text-sm text-muted-foreground">Registered Since</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Shield className="h-8 w-8 text-accent" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-foreground">{donorData.bloodType || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">Blood Type</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Pledged Organs */}
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-primary" fill="currentColor" />
                    Pledged Organs & Tissues
                  </CardTitle>
                  <CardDescription>
                    Organs and tissues you've committed to donate
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pledgedOrgans.map((organ, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/20"
                      >
                        <div>
                          <h4 className="font-medium text-foreground">{organ}</h4>
                          <p className="text-sm text-muted-foreground">
                            Available for donation
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-success/10 text-success border-success">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Donor Information */}
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    Donor Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{donorData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{donorData.email}</p>
                  </div>
                  {donorData.phone && (
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{donorData.phone}</p>
                    </div>
                  )}
                  {donorData.emergencyContact && (
                    <div>
                      <p className="text-sm text-muted-foreground">Emergency Contact</p>
                      <p className="font-medium">{donorData.emergencyContact}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="medical" 
                    className="w-full justify-start" 
                    onClick={handleDownloadCertificate}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Certificate
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Update Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Heart className="h-4 w-4 mr-2" />
                    Modify Organ Selection
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DonorDashboard;