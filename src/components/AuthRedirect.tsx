import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export const AuthRedirect = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) {
      // Redirect authenticated users to their appropriate dashboard
      switch (user.role) {
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
          navigate('/')
      }
    }
  }, [user, loading, navigate])

  return null
}