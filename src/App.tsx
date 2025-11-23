import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthGuard } from "@/components/AuthGuard";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import DonorDashboard from "./pages/DonorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AccountSettings from "./pages/AccountSettings";
import TrackOrgan from "./pages/TrackOrgan";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard/donor" 
            element={
              <AuthGuard requiredRole="donor">
                <DonorDashboard />
              </AuthGuard>
            } 
          />
          <Route 
            path="/dashboard/admin" 
            element={
              <AuthGuard requiredRole="admin">
                <AdminDashboard />
              </AuthGuard>
            } 
          />
          <Route 
            path="/dashboard/patient" 
            element={
              <AuthGuard requiredRole="patient">
                <PatientDashboard />
              </AuthGuard>
            } 
          />
          <Route 
            path="/dashboard/super-admin" 
            element={
              <AuthGuard requiredRole="superadmin">
                <SuperAdminDashboard />
              </AuthGuard>
            } 
          />
          <Route path="/account" element={
            <AuthGuard>
              <AccountSettings />
            </AuthGuard>
          } />
          <Route path="/track-organ/:id?" element={<TrackOrgan />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
