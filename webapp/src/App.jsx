import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/auth-context";
import ProtectedRoute from "./components/protected-route";
import Login from "./pages/auth/login";
import VendorRegistration from "./pages/auth/vendor-registration";
import CoupleRegistration from "./pages/auth/couple-registration";
import DashboardLayout from "./layouts/dashboard-layout";

// Vendor Dashboard Pages
import VendorOverview from "./pages/dashboard/vendor/overview";
import VendorProfile from "./pages/dashboard/vendor/profile";
import VendorServices from "./pages/dashboard/vendor/services";
import VendorBookings from "./pages/dashboard/vendor/bookings";
import VendorPortfolio from "./pages/dashboard/vendor/portfolio";

// Couple Dashboard Pages
import CoupleOverview from "./pages/dashboard/couple/overview";
import CoupleProfile from "./pages/dashboard/couple/profile";
import CoupleVendors from "./pages/dashboard/couple/vendors";
import CoupleBookings from "./pages/dashboard/couple/bookings";
import CoupleWedding from "./pages/dashboard/couple/wedding";
import CoupleTasks from "./pages/dashboard/couple/tasks";
import VendorDetails from "./pages/dashboard/couple/vendor-details";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register/vendor" element={<VendorRegistration />} />
          <Route path="/register/couple" element={<CoupleRegistration />} />

          {/* Vendor Dashboard Routes */}
          <Route
            path="/dashboard/vendor"
            element={
              <ProtectedRoute requiredUserType="vendor">
                <DashboardLayout userType="vendor" />
              </ProtectedRoute>
            }
          >
            <Route index element={<VendorOverview />} />
            <Route path="profile" element={<VendorProfile />} />
            <Route path="services" element={<VendorServices />} />
            <Route path="bookings" element={<VendorBookings />} />
            <Route path="portfolio" element={<VendorPortfolio />} />
          </Route>

          {/* Couple Dashboard Routes */}
          <Route
            path="/dashboard/couple"
            element={
              <ProtectedRoute requiredUserType="couple">
                <DashboardLayout userType="couple" />
              </ProtectedRoute>
            }
          >
            <Route index element={<CoupleOverview />} />
            <Route path="profile" element={<CoupleProfile />} />
            <Route path="vendors" element={<CoupleVendors />} />
            <Route path="vendors/:vendorId" element={<VendorDetails />} />
            <Route path="bookings" element={<CoupleBookings />} />
            <Route path="wedding" element={<CoupleWedding />} />
            <Route path="tasks" element={<CoupleTasks />} />
          </Route>

          {/* Redirect root to login page */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
