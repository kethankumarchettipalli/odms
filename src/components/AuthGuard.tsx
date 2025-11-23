import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: 'donor' | 'admin' | 'patient' | 'superadmin'
  redirectTo?: string
}

export const AuthGuard = ({ children, requiredRole, redirectTo = '/login' }: AuthGuardProps) => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate(redirectTo)
        return
      }

      if (requiredRole && user?.role !== requiredRole) {
        // Redirect to appropriate dashboard based on actual role
        switch (user?.role) {
          case 'donor':
            navigate('/dashboard/donor')
            break
          case 'admin':
            navigate('/dashboard/admin')
            break
          case 'patient':
            navigate('/dashboard/patient')
            break
          case 'superadmin':
            navigate('/dashboard/super-admin')
            break
          default:
            navigate('/login')
        }
        return
      }
    }
  }, [user, loading, requiredRole, navigate, redirectTo])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null
  }

  return <>{children}</>
}