"use client";

import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import {
  Home,
  User,
  Calendar,
  LogOut,
  Menu,
  X,
  ShoppingBag,
  Heart,
  MessageSquare,
  Users,
  BarChart,
  Settings,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const vendorNavItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard/vendor" },
  { icon: Calendar, label: "Bookings", path: "/dashboard/vendor/bookings" },
  { icon: User, label: "Profile", path: "/dashboard/vendor/profile" },
];

const coupleNavItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard/couple" },
  { icon: Heart, label: "Find Vendors", path: "/dashboard/couple/vendors" },
  { icon: Calendar, label: "Bookings", path: "/dashboard/couple/bookings" },
  { icon: PlusCircle, label: "Wedding", path: "/dashboard/couple/wedding" },
  { icon: ShoppingBag, label: "Tasks", path: "/dashboard/couple/tasks" },
  { icon: User, label: "Profile", path: "/dashboard/couple/profile" },
];

const adminNavItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard/admin/overview" },
  { icon: Users, label: "Users", path: "/dashboard/admin/users" },
  { icon: ShoppingBag, label: "Vendors", path: "/dashboard/admin/vendors" },
  { icon: MessageSquare, label: "Disputes", path: "/dashboard/admin/disputes" },
  { icon: Settings, label: "Settings", path: "/dashboard/admin/settings" },
];

function DashboardLayout({ userType }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();

  let navItems;
  if (userType === "vendor") {
    navItems = vendorNavItems;
  } else if (userType === "admin") {
    navItems = adminNavItems;
  } else {
    navItems = coupleNavItems;
  }
  const dashboardTitle = "Till Card Declines";

  const handleLogout = () => {
    // Log the user out and redirect to login page
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
      `}
      >
        <div className="flex flex-col h-full">
          <div className="px-6 py-5 border-b flex items-center">
            <div>
              <h1 className="text-base font-semibold">{dashboardTitle}</h1>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center px-3 py-2 rounded-md text-sm transition-colors
                    ${
                      isActive
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className={`
        flex-1 flex flex-col overflow-hidden
        ${sidebarOpen ? "lg:ml-64" : ""}
      `}
      >
        {/* Header */}
        <header className="h-16 border-b flex items-center px-6">
          <h1 className="text-xl font-semibold">
            {navItems.find((item) => item.path === location.pathname)?.label ||
              "Dashboard"}
          </h1>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
