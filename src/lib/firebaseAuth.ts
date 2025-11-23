import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, addDoc, query, where, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'donor' | 'patient' | 'admin' | 'superadmin';
  createdAt: Date;
}

export interface DonorData extends UserData {
  role: 'donor';
  phone?: string;
  bloodType?: string;
  dateOfBirth?: string;
  emergencyContact?: string;
  organs?: string[];
}

export interface PatientData extends UserData {
  role: 'patient';
  age?: number;
  bloodType?: string;
}

export interface AdminData extends UserData {
  role: 'admin';
  department?: string;
  hospitalName?: string;
}

export interface OrganRequest {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  bloodType: string;
  requiredOrgan: string;
  hospitalName: string;
  urgencyLevel: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: Date;
}

export const registerUser = async (
  email: string, 
  password: string, 
  userData: Partial<DonorData | PatientData | AdminData> & { role?: 'donor' | 'patient' | 'admin' | 'superadmin' }
) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  const userDoc = {
    id: user.uid,
    email: user.email!,
    createdAt: new Date(),
    ...userData
  };
  
  await setDoc(doc(db, 'users', user.uid), userDoc);
  return { user, userData: userDoc };
};

export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (!userDoc.exists()) {
    throw new Error('User data not found');
  }
  
  return { user, userData: userDoc.data() as UserData };
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const getCurrentUserData = async (user: User) => {
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (!userDoc.exists()) {
    throw new Error('User data not found');
  }
  return userDoc.data() as UserData;
};

export const createOrganRequest = async (requestData: Omit<OrganRequest, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(collection(db, 'requests'), {
    ...requestData,
    createdAt: new Date()
  });
  return docRef.id;
};

export const getOrganRequestsByPatient = async (patientId: string) => {
  const q = query(collection(db, 'requests'), where('patientId', '==', patientId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as OrganRequest));
};

export const getAllOrganRequests = async () => {
  const querySnapshot = await getDocs(collection(db, 'requests'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as OrganRequest));
};

export const updateRequestStatus = async (requestId: string, status: string) => {
  await updateDoc(doc(db, 'requests', requestId), { status });
};

export const getAllDonors = async () => {
  const q = query(collection(db, 'users'), where('role', '==', 'donor'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DonorData));
};

export const getAllUsers = async () => {
  const querySnapshot = await getDocs(collection(db, 'users'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserData));
};

export const updateUserRole = async (userId: string, role: string) => {
  await updateDoc(doc(db, 'users', userId), { role });
};

export const deleteUser = async (userId: string) => {
  await deleteDoc(doc(db, 'users', userId));
};

export const updateUserProfile = async (userId: string, updates: Partial<UserData>) => {
  await updateDoc(doc(db, 'users', userId), updates);
};

export const deleteDonor = async (donorId: string) => {
  await deleteDoc(doc(db, 'users', donorId));
};