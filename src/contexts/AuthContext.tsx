import React, { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getCurrentUserData,
  UserData,
  DonorData,
  PatientData,
  AdminData
} from '@/lib/firebaseAuth'

interface AuthContextType {
  user: UserData | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, userData: Partial<DonorData | PatientData | AdminData>) => Promise<void>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser)
      
      if (firebaseUser) {
        try {
          const userData = await getCurrentUserData(firebaseUser)
          // Handle super admin email
          if (firebaseUser.email === 'kokkiligaddadivyacharan2007@gmail.com') {
            userData.role = 'superadmin'
          }
          setUser(userData)
        } catch (error) {
          console.error('Failed to get user data:', error)
          setUser(null)
        }
      } else {
        setUser(null)
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { userData } = await loginUser(email, password)
    // Handle super admin email
    if (email === 'kokkiligaddadivyacharan2007@gmail.com') {
      userData.role = 'superadmin'
    }
    setUser(userData)
  }

  const signUp = async (email: string, password: string, userData: Partial<DonorData | PatientData | AdminData>) => {
    const { userData: newUserData } = await registerUser(email, password, userData)
    setUser(newUserData as UserData)
  }

  const signOut = async () => {
    await logoutUser()
    setUser(null)
  }

  const refreshUser = async () => {
    if (firebaseUser) {
      try {
        const userData = await getCurrentUserData(firebaseUser)
        if (firebaseUser.email === 'kokkiligaddadivyacharan2007@gmail.com') {
          userData.role = 'superadmin'
        }
        setUser(userData)
      } catch (error) {
        console.error('Failed to refresh user:', error)
        await signOut()
      }
    }
  }

  const value = {
    user,
    firebaseUser,
    loading,
    signIn,
    signUp,
    signOut,
    refreshUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}