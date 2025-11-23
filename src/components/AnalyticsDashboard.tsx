import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts'
import { getAllUsers, deleteUser, UserData } from '@/lib/firebaseAuth'
import { 
  Users, 
  Heart, 
  UserCheck, 
  Activity, 
  TrendingUp, 
  Trash2, 
  AlertTriangle,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react'

interface AnalyticsData {
  users: UserData[]
  roleDistribution: { role: string; count: number; color: string }[]
  monthlyGrowth: { month: string; users: number }[]
  totalStats: {
    totalUsers: number
    totalDonors: number
    totalPatients: number
    totalAdmins: number
  }
}

export const AnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const { toast } = useToast()

  const roleColors = {
    donor: '#10b981', // emerald-500
    patient: '#3b82f6', // blue-500
    admin: '#f59e0b', // amber-500
    superadmin: '#ef4444' // red-500
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const users = await getAllUsers()
      
      // Calculate role distribution
      const roleCount = users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const roleDistribution = Object.entries(roleCount).map(([role, count]) => ({
        role: role.charAt(0).toUpperCase() + role.slice(1),
        count,
        color: roleColors[role as keyof typeof roleColors] || '#6b7280'
      }))

      // Generate mock monthly growth data (in real app, this would come from user creation dates)
      const monthlyGrowth = [
        { month: 'Jan', users: 45 },
        { month: 'Feb', users: 52 },
        { month: 'Mar', users: 61 },
        { month: 'Apr', users: 58 },
        { month: 'May', users: 67 },
        { month: 'Jun', users: users.length }
      ]

      const totalStats = {
        totalUsers: users.length,
        totalDonors: users.filter(u => u.role === 'donor').length,
        totalPatients: users.filter(u => u.role === 'patient').length,
        totalAdmins: users.filter(u => u.role === 'admin' || u.role === 'superadmin').length
      }

      setAnalytics({
        users,
        roleDistribution,
        monthlyGrowth,
        totalStats
      })
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to permanently delete ${userName}'s account? This action cannot be undone.`)) {
      return
    }

    try {
      await deleteUser(userId)
      await fetchAnalytics() // Refresh data
      setSelectedUser(null)
      toast({
        title: "Success",
        description: `${userName}'s account has been deleted`,
      })
    } catch (error) {
      console.error('Failed to delete user:', error)
      toast({
        title: "Error",
        description: "Failed to delete user account",
        variant: "destructive"
      })
    }
  }

  const formatPercentage = (value: number, total: number) => {
    return ((value / total) * 100).toFixed(1)
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="h-64 bg-muted rounded"></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="h-64 bg-muted rounded"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-shadow bg-gradient-to-br from-primary-soft to-background border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold text-primary">{analytics.totalStats.totalUsers}</p>
              </div>
              <Users className="h-12 w-12 text-primary opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow bg-gradient-to-br from-success/10 to-background border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Donors</p>
                <p className="text-3xl font-bold text-success">{analytics.totalStats.totalDonors}</p>
                <p className="text-xs text-muted-foreground">
                  {formatPercentage(analytics.totalStats.totalDonors, analytics.totalStats.totalUsers)}% of users
                </p>
              </div>
              <Heart className="h-12 w-12 text-success opacity-80" fill="currentColor" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow bg-gradient-to-br from-accent/10 to-background border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Patients</p>
                <p className="text-3xl font-bold text-accent">{analytics.totalStats.totalPatients}</p>
                <p className="text-xs text-muted-foreground">
                  {formatPercentage(analytics.totalStats.totalPatients, analytics.totalStats.totalUsers)}% of users
                </p>
              </div>
              <UserCheck className="h-12 w-12 text-accent opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow bg-gradient-to-br from-warning/10 to-background border-warning/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Admins</p>
                <p className="text-3xl font-bold text-warning">{analytics.totalStats.totalAdmins}</p>
                <p className="text-xs text-muted-foreground">
                  {formatPercentage(analytics.totalStats.totalAdmins, analytics.totalStats.totalUsers)}% of users
                </p>
              </div>
              <Activity className="h-12 w-12 text-warning opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role Distribution Pie Chart */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChartIcon className="h-5 w-5 mr-2 text-primary" />
              User Role Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.roleDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="count"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {analytics.roleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Growth */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              User Growth Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.monthlyGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Breakdown Bar Chart */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-primary" />
            Detailed Role Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.roleDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="role" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {analytics.roleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* User Management */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-primary" />
            User Account Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.users.map((user) => (
              <div 
                key={user.id} 
                className={`flex items-center justify-between p-4 border rounded-lg transition-all cursor-pointer ${
                  selectedUser?.id === user.id 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      {user.createdAt && (
                        <p className="text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <Badge 
                      variant="outline" 
                      style={{ 
                        borderColor: roleColors[user.role as keyof typeof roleColors],
                        color: roleColors[user.role as keyof typeof roleColors]
                      }}
                    >
                      {user.role}
                    </Badge>
                  </div>
                </div>
                
                {selectedUser?.id === user.id && (
                  <div className="flex items-center space-x-2">
                    <Alert className="max-w-sm">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        Account deletion is permanent and cannot be undone.
                      </AlertDescription>
                    </Alert>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteUser(user.id, user.name)
                      }}
                      className="flex items-center space-x-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Account</span>
                    </Button>
                  </div>
                )}
              </div>
            ))}
            
            {analytics.users.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No users found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}