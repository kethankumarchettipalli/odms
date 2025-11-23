import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getAllDonors, getAllOrganRequests, updateRequestStatus, DonorData, OrganRequest } from '@/lib/firebaseAuth';
import { Heart, Users, AlertCircle, CheckCircle, Clock, MapPin } from 'lucide-react';

interface OrganMatch {
  request: OrganRequest;
  compatibleDonors: DonorData[];
  matchScore: number;
  urgencyLevel: 'High' | 'Medium' | 'Low';
  timeOnList: number; // days
}

interface MatchingRules {
  bloodTypeCompatibility: boolean;
  ageRange: number; // +/- years
  geographicPreference: boolean;
  urgencyWeight: number; // 1-10
  timeWeight: number; // 1-10
}

const DEFAULT_MATCHING_RULES: MatchingRules = {
  bloodTypeCompatibility: true,
  ageRange: 15,
  geographicPreference: true,
  urgencyWeight: 8,
  timeWeight: 6
};

const BLOOD_COMPATIBILITY = {
  'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], // Universal donor
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+'] // Universal recipient receives from AB+ only
};

export const OrganMatchingSystem: React.FC = () => {
  const [matches, setMatches] = useState<OrganMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchingRules, setMatchingRules] = useState<MatchingRules>(DEFAULT_MATCHING_RULES);
  const [processingMatch, setProcessingMatch] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    performMatching();
  }, [matchingRules]);

  const performMatching = async () => {
    try {
      setLoading(true);
      
      const [donors, requests] = await Promise.all([
        getAllDonors(),
        getAllOrganRequests()
      ]);

      const pendingRequests = requests.filter(req => req.status === 'Pending');
      const matchResults: OrganMatch[] = [];

      for (const request of pendingRequests) {
        const compatibleDonors = donors.filter(donor => 
          isCompatibleDonor(donor, request)
        );

        if (compatibleDonors.length > 0) {
          const timeOnList = Math.floor(
            (Date.now() - new Date(request.createdAt).getTime()) / (1000 * 60 * 60 * 24)
          );

          const match: OrganMatch = {
            request,
            compatibleDonors,
            matchScore: calculateMatchScore(request, compatibleDonors, timeOnList),
            urgencyLevel: request.urgencyLevel,
            timeOnList
          };

          matchResults.push(match);
        }
      }

      // Sort by match score (higher is better)
      matchResults.sort((a, b) => b.matchScore - a.matchScore);
      setMatches(matchResults);

    } catch (error) {
      console.error('Error performing organ matching:', error);
      toast({
        title: "Error",
        description: "Failed to perform organ matching",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const isCompatibleDonor = (donor: DonorData, request: OrganRequest): boolean => {
    // Check if donor has the required organ
    if (!donor.organs?.includes(request.requiredOrgan.toLowerCase())) {
      return false;
    }

    // Check blood type compatibility
    if (matchingRules.bloodTypeCompatibility && donor.bloodType && request.bloodType) {
      const compatibleTypes = BLOOD_COMPATIBILITY[donor.bloodType as keyof typeof BLOOD_COMPATIBILITY];
      if (!compatibleTypes?.includes(request.bloodType)) {
        return false;
      }
    }

    // Check age range if donor has age information
    if (matchingRules.ageRange > 0 && donor.dateOfBirth && request.age) {
      const donorAge = new Date().getFullYear() - new Date(donor.dateOfBirth).getFullYear();
      const ageDifference = Math.abs(donorAge - request.age);
      if (ageDifference > matchingRules.ageRange) {
        return false;
      }
    }

    return true;
  };

  const calculateMatchScore = (request: OrganRequest, donors: DonorData[], timeOnList: number): number => {
    let score = 0;

    // Base score for having compatible donors
    score += donors.length * 10;

    // Urgency bonus
    const urgencyBonus = {
      'High': 30,
      'Medium': 20,
      'Low': 10
    };
    score += urgencyBonus[request.urgencyLevel] * (matchingRules.urgencyWeight / 10);

    // Time on list bonus (longer wait = higher priority)
    score += Math.min(timeOnList * 2, 50) * (matchingRules.timeWeight / 10);

    // Blood type exact match bonus
    const exactMatches = donors.filter(d => d.bloodType === request.bloodType);
    score += exactMatches.length * 5;

    return Math.round(score);
  };

  const handleApproveMatch = async (requestId: string, donorId: string) => {
    try {
      setProcessingMatch(requestId);
      
      await updateRequestStatus(requestId, 'Approved');
      
      toast({
        title: "Match Approved",
        description: "Organ request has been approved and donor notified",
      });

      // Refresh matches
      await performMatching();
      
    } catch (error) {
      console.error('Error approving match:', error);
      toast({
        title: "Error",
        description: "Failed to approve organ match",
        variant: "destructive"
      });
    } finally {
      setProcessingMatch(null);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High': return 'bg-destructive/10 text-destructive border-destructive';
      case 'Medium': return 'bg-warning/10 text-warning border-warning';
      case 'Low': return 'bg-success/10 text-success border-success';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <Card className="card-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
            <span>Performing organ matching...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Matching Summary */}
      <Card className="card-shadow bg-gradient-to-r from-primary-soft to-background border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="h-5 w-5 mr-2 text-primary" fill="currentColor" />
            Automated Organ Matching System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{matches.length}</p>
              <p className="text-sm text-muted-foreground">Potential Matches</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-warning">
                {matches.filter(m => m.urgencyLevel === 'High').length}
              </p>
              <p className="text-sm text-muted-foreground">High Priority</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success">
                {matches.reduce((acc, m) => acc + m.compatibleDonors.length, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Compatible Donors</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Matching Rules Configuration */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Matching Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Blood Type Compatibility</label>
              <div className="flex items-center space-x-2 mt-1">
                <input
                  type="checkbox"
                  checked={matchingRules.bloodTypeCompatibility}
                  onChange={(e) => setMatchingRules(prev => ({
                    ...prev,
                    bloodTypeCompatibility: e.target.checked
                  }))}
                  className="rounded"
                />
                <span className="text-sm">Enforce compatibility rules</span>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Age Range (±years)</label>
              <input
                type="number"
                min="0"
                max="50"
                value={matchingRules.ageRange}
                onChange={(e) => setMatchingRules(prev => ({
                  ...prev,
                  ageRange: parseInt(e.target.value) || 0
                }))}
                className="mt-1 w-full px-3 py-1 border rounded text-sm"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Urgency Weight (1-10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={matchingRules.urgencyWeight}
                onChange={(e) => setMatchingRules(prev => ({
                  ...prev,
                  urgencyWeight: parseInt(e.target.value)
                }))}
                className="mt-1 w-full"
              />
              <span className="text-xs text-muted-foreground">
                Current: {matchingRules.urgencyWeight}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Matches List */}
      <div className="space-y-4">
        {matches.length === 0 ? (
          <Card className="card-shadow">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Matches Found</h3>
              <p className="text-muted-foreground">
                There are currently no compatible donor-recipient matches. 
                Adjust the matching rules or wait for new registrations.
              </p>
            </CardContent>
          </Card>
        ) : (
          matches.map((match, index) => (
            <Card key={match.request.id} className="card-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </span>
                    {match.request.patientName} - {match.request.requiredOrgan}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getUrgencyColor(match.urgencyLevel)}>
                      {match.urgencyLevel} Priority
                    </Badge>
                    <Badge variant="secondary">
                      Score: {match.matchScore}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Patient Details */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Users className="h-4 w-4 mr-2 text-primary" />
                      Patient Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Age:</span>
                        <span>{match.request.age} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Blood Type:</span>
                        <span>{match.request.bloodType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Hospital:</span>
                        <span>{match.request.hospitalName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time on List:</span>
                        <span>{match.timeOnList} days</span>
                      </div>
                    </div>
                  </div>

                  {/* Compatible Donors */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Heart className="h-4 w-4 mr-2 text-success" fill="currentColor" />
                      Compatible Donors ({match.compatibleDonors.length})
                    </h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {match.compatibleDonors.slice(0, 3).map(donor => (
                        <div key={donor.id} className="bg-muted/30 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-sm">{donor.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {donor.bloodType} • Age: {donor.dateOfBirth ? 
                                  new Date().getFullYear() - new Date(donor.dateOfBirth).getFullYear() 
                                  : 'N/A'}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleApproveMatch(match.request.id, donor.id)}
                              disabled={processingMatch === match.request.id}
                              className="bg-success hover:bg-success/90"
                            >
                              {processingMatch === match.request.id ? (
                                <Clock className="h-3 w-3 animate-spin" />
                              ) : (
                                <CheckCircle className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                      {match.compatibleDonors.length > 3 && (
                        <p className="text-xs text-muted-foreground text-center">
                          +{match.compatibleDonors.length - 3} more donors available
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};