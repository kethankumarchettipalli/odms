import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/enhanced-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { OrganTrackingMap } from "@/components/OrganTrackingMap";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Truck, 
  Heart,
  User,
  Building,
  Phone,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const TrackOrgan = () => {
  const { id } = useParams();

  // Mock data centered on Andhra Pradesh with registered AP donors
  const organData = {
    id: "TRN-001",
    organType: "Heart",
    donorName: "Ramesh Kumar",
    donorId: "DON-AP-001",
    recipientHospital: "Apollo Hospitals, Hyderabad",
    recipientLocation: "Hyderabad, Andhra Pradesh",
    status: "In Transit",
    progress: 75,
    estimatedArrival: "2024-01-20T14:30:00",
    actualDeparture: "2024-01-20T10:15:00",
    transportMethod: "Emergency Ambulance",
    currentLocation: "En route to Hyderabad",
    transportTeam: "AP Medical Transport Team",
    emergencyContact: "+91-800-ORGAN-1",
    trackingUpdates: [
      {
        time: "10:15 AM",
        status: "Departed",
        location: "Vijayawada Medical Center, AP",
        description: "Heart successfully retrieved and packaged for transport"
      },
      {
        time: "11:00 AM", 
        status: "En Route",
        location: "Guntur Highway, AP",
        description: "Transport ambulance on NH16, conditions optimal"
      },
      {
        time: "12:30 PM",
        status: "In Transit",
        location: "Approaching Hyderabad, AP", 
        description: "Approaching destination, surgical team notified"
      },
      {
        time: "2:30 PM",
        status: "Expected",
        location: "Apollo Hospitals, Hyderabad",
        description: "Expected arrival for transplant procedure"
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Transit":
        return "bg-primary/10 text-primary border-primary";
      case "Departed":
        return "bg-success/10 text-success border-success";
      case "En Route":
        return "bg-warning/10 text-warning border-warning";
      case "Expected":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/dashboard/admin" 
              className="inline-flex items-center text-muted-foreground hover:text-primary transition-medical mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Organ Transport Tracking
                </h1>
                <p className="text-muted-foreground">
                  Real-time tracking for transport ID: {organData.id}
                </p>
              </div>
              <Badge 
                variant="outline" 
                className={`text-base px-4 py-2 ${getStatusColor(organData.status)}`}
              >
                {organData.status}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Map Placeholder */}
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-primary" />
                    Live Location Tracking
                  </CardTitle>
                  <CardDescription>
                    Real-time GPS tracking of organ transport with Leaflet.js integration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 rounded-lg overflow-hidden">
                    <OrganTrackingMap trackingId={organData.id} />
                  </div>
                  <div className="mt-4 bg-background/80 rounded-lg p-4 border border-border">
                    <p className="text-sm text-foreground font-medium">Current Location:</p>
                    <p className="text-sm text-muted-foreground">{organData.currentLocation}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                      <span className="text-xs text-success">Live tracking active</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progress Tracking */}
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="h-5 w-5 mr-2 text-primary" />
                    Transport Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Transport Progress</span>
                      <span className="text-sm text-muted-foreground">{organData.progress}%</span>
                    </div>
                    <Progress value={organData.progress} className="h-3" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Departed: {new Date(organData.actualDeparture).toLocaleTimeString()}</span>
                      <span>ETA: {new Date(organData.estimatedArrival).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-primary" />
                    Transport Timeline
                  </CardTitle>
                  <CardDescription>
                    Step-by-step tracking of organ transport progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {organData.trackingUpdates.map((update, index) => {
                      const isCompleted = index < 3;
                      const isCurrent = index === 2;
                      
                      return (
                        <div key={index} className="flex items-start space-x-4">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            isCompleted 
                              ? isCurrent 
                                ? "bg-primary" 
                                : "bg-success"
                              : "bg-muted"
                          }`}>
                            {isCompleted ? (
                              isCurrent ? (
                                <Truck className="h-4 w-4 text-white" />
                              ) : (
                                <CheckCircle className="h-4 w-4 text-white" />
                              )
                            ) : (
                              <Clock className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className={`font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {update.status}
                              </h4>
                              <span className={`text-sm ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {update.time}
                              </span>
                            </div>
                            <p className={`text-sm ${isCompleted ? 'text-muted-foreground' : 'text-muted-foreground/70'}`}>
                              {update.location}
                            </p>
                            <p className={`text-sm ${isCompleted ? 'text-foreground' : 'text-muted-foreground/70'}`}>
                              {update.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Organ Details */}
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-primary" fill="currentColor" />
                    Organ Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Organ Type</p>
                    <p className="font-medium text-lg">{organData.organType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Transport ID</p>
                    <p className="font-mono text-sm">{organData.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Transport Method</p>
                    <div className="flex items-center space-x-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span>{organData.transportMethod}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Transport Team</p>
                    <p className="font-medium">{organData.transportTeam}</p>
                  </div>
                </CardContent>
              </Card>

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
                    <p className="text-sm text-muted-foreground">Donor Name</p>
                    <p className="font-medium">{organData.donorName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Donor ID</p>
                    <p className="font-mono text-sm">{organData.donorId}</p>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Donor information is protected by medical privacy laws
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Recipient Hospital */}
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="h-5 w-5 mr-2 text-primary" />
                    Recipient Hospital
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Hospital</p>
                    <p className="font-medium">{organData.recipientHospital}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{organData.recipientLocation}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Arrival</p>
                    <p className="font-medium">
                      {new Date(organData.estimatedArrival).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card className="bg-warning/5 border-warning/20 card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center text-warning">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Emergency Contact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      For urgent transport updates or emergencies:
                    </p>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-warning" />
                      <span className="font-medium">{organData.emergencyContact}</span>
                    </div>
                    <Button variant="warning" size="sm" className="w-full">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Emergency Line
                    </Button>
                  </div>
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

export default TrackOrgan;