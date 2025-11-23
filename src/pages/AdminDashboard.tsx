import { useState, useEffect } from "react";
import { Button } from "@/components/ui/enhanced-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  Heart, 
  Users, 
  Clock, 
  Search,
  Filter,
  Download,
  CheckCircle,
  X,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  getAllDonors, 
  getAllOrganRequests, 
  updateRequestStatus, 
  deleteDonor,
  DonorData,
  OrganRequest
} from "@/lib/firebaseAuth";

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("overview");
  const [donors, setDonors] = useState<DonorData[]>([]);
  const [requests, setRequests] = useState<OrganRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [organMatches, setOrganMatches] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [donorsData, requestsData] = await Promise.all([
        getAllDonors(),
        getAllOrganRequests()
      ]);
      setDonors(donorsData);
      setRequests(requestsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      await updateRequestStatus(requestId, 'Approved');
      setRequests(requests.map(req => 
        req.id === requestId ? { ...req, status: 'Approved' } : req
      ));
      toast({
        title: "Request Approved",
        description: "The organ request has been approved."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve request",
        variant: "destructive"
      });
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await updateRequestStatus(requestId, 'Rejected');
      setRequests(requests.map(req => 
        req.id === requestId ? { ...req, status: 'Rejected' } : req
      ));
      toast({
        title: "Request Rejected",
        description: "The organ request has been rejected."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject request",
        variant: "destructive"
      });
    }
  };

  const handleDeleteDonor = async (donorId: string) => {
    if (!confirm('Are you sure you want to delete this donor?')) return;
    
    try {
      await deleteDonor(donorId);
      setDonors(donors.filter(donor => donor.id !== donorId));
      toast({
        title: "Donor Deleted",
        description: "The donor has been removed from the system."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete donor",
        variant: "destructive"
      });
    }
  };

  const performOrganMatching = () => {
    const matches: any[] = [];
    
    requests.filter(req => req.status === 'Pending').forEach(request => {
      donors.forEach(donor => {
        if (donor.bloodType === request.bloodType && donor.organs?.includes(request.requiredOrgan)) {
          const compatibility = calculateCompatibility(donor, request);
          if (compatibility > 70) { // Minimum 70% compatibility
            matches.push({
              donorName: donor.name,
              donorId: donor.id,
              patientName: request.patientName,
              requestId: request.id,
              organType: request.requiredOrgan,
              bloodType: request.bloodType,
              compatibility
            });
          }
        }
      });
    });
    
    setOrganMatches(matches);
    toast({
      title: "Matching Complete",
      description: `Found ${matches.length} potential matches.`,
    });
  };

  const calculateCompatibility = (donor: DonorData, request: OrganRequest): number => {
    let score = 0;
    
    // Blood type match (most important)
    if (donor.bloodType === request.bloodType) score += 40;
    
    // Organ availability
    if (donor.organs?.includes(request.requiredOrgan)) score += 30;
    
    // Age compatibility (if available)
    const donorAge = donor.dateOfBirth ? 
      new Date().getFullYear() - new Date(donor.dateOfBirth).getFullYear() : 30;
    const ageDiff = Math.abs(donorAge - request.age);
    if (ageDiff <= 10) score += 20;
    else if (ageDiff <= 20) score += 10;
    
    // Urgency (high urgency gets priority)
    if (request.urgencyLevel === 'High') score += 10;
    
    return Math.min(score, 100);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning">Pending</Badge>;
      case "Approved":
        return <Badge variant="outline" className="bg-success/10 text-success border-success">Approved</Badge>;
      case "Rejected":
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive">Rejected</Badge>;
      case "High":
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive">High</Badge>;
      case "Medium":
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning">Medium</Badge>;
      case "Low":
        return <Badge variant="outline" className="bg-success/10 text-success border-success">Low</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage organ donors, recipients, and transplant logistics
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="card-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-foreground">
                      {donors.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Donors</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Heart className="h-8 w-8 text-secondary" fill="currentColor" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-foreground">
                      {requests.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Requests</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-8 w-8 text-success" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-foreground">
                      {requests.filter(req => req.status === 'Approved').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Approved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 bg-muted/30 p-1 rounded-lg w-fit">
            {["overview", "donors", "requests"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-medical capitalize ${
                  selectedTab === tab
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {selectedTab === "overview" && (
            <div className="space-y-6">
              {/* Organ Matching */}
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-primary" fill="currentColor" />
                    Automatic Organ Matching
                  </CardTitle>
                  <CardDescription>AI-powered matching between available organs and pending requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button 
                      onClick={() => performOrganMatching()}
                      className="mb-4"
                    >
                      Run Organ Matching Algorithm
                    </Button>
                    
                    {organMatches.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-foreground">Potential Matches Found:</h4>
                        {organMatches.map((match, index) => (
                          <div key={index} className="border border-success/20 rounded-lg p-3 bg-success/5">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-foreground">
                                  {match.donorName} → {match.patientName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {match.organType} • Blood Type: {match.bloodType} • Compatibility: {match.compatibility}%
                                </p>
                              </div>
                              <Badge variant="outline" className="bg-success/10 text-success border-success">
                                Match Found
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="card-shadow">
                  <CardHeader>
                    <CardTitle>Recent Donors</CardTitle>
                    <CardDescription>Latest donor registrations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {donors.slice(0, 5).map((donor) => (
                        <div key={donor.id} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-success rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium">{donor.name}</p>
                            <p className="text-xs text-muted-foreground">{donor.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-shadow">
                  <CardHeader>
                    <CardTitle>Pending Requests</CardTitle>
                    <CardDescription>Requests awaiting approval</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {requests.filter(req => req.status === 'Pending').slice(0, 5).map((request) => (
                        <div key={request.id} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-warning rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium">{request.patientName}</p>
                            <p className="text-xs text-muted-foreground">
                              {request.requiredOrgan} - {request.urgencyLevel} priority
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {selectedTab === "donors" && (
            <Card className="card-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Registered Donors</CardTitle>
                    <CardDescription>Manage and review organ donor profiles</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search donors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Donor</TableHead>
                      <TableHead>Blood Type</TableHead>
                      <TableHead>Organs</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donors
                      .filter(donor => 
                        donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        donor.email.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((donor) => (
                      <TableRow key={donor.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{donor.name}</p>
                            <p className="text-sm text-muted-foreground">{donor.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{donor.bloodType || 'N/A'}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {donor.organs?.slice(0, 2).map((organ) => (
                              <Badge key={organ} variant="secondary" className="text-xs">
                                {organ}
                              </Badge>
                            ))}
                            {(donor.organs?.length || 0) > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{(donor.organs?.length || 0) - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{donor.phone || 'N/A'}</TableCell>
                        <TableCell>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteDonor(donor.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {selectedTab === "requests" && (
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Organ Requests</CardTitle>
                <CardDescription>Patients waiting for organ transplants</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Organ Needed</TableHead>
                      <TableHead>Blood Type</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead>Hospital</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.patientName}</p>
                            <p className="text-sm text-muted-foreground">Age: {request.age}</p>
                          </div>
                        </TableCell>
                        <TableCell>{request.requiredOrgan}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{request.bloodType}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(request.urgencyLevel)}</TableCell>
                        <TableCell className="text-sm">{request.hospitalName}</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>
                          {request.status === 'Pending' && (
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleApproveRequest(request.id)}
                                className="text-success hover:bg-success/10"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleRejectRequest(request.id)}
                                className="text-destructive hover:bg-destructive/10"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;