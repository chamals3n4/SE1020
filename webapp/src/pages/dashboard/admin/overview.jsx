import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Store, 
  Calendar, 
  AlertCircle, 
  CheckCircle,
  Clock,
  BarChart
} from "lucide-react";
import { adminService } from "@/services/api";

export default function AdminOverview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalCouples: 0,
    totalBookings: 0,
    pendingApprovals: 0,
    activeDisputes: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminService.getStats();
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return <div className="py-10 text-center">Loading dashboard stats...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of platform statistics and pending actions
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalVendors} vendors, {stats.totalCouples} couples
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              Across all vendors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$124,500</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold mt-6">Pending Actions</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Vendor Approvals</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">{stats.pendingApprovals}</div>
            <p className="text-xs text-amber-700">
              Vendors waiting for approval
            </p>
            <button
              onClick={() => window.location.href = "/dashboard/admin/vendors"}
              className="mt-2 px-4 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-md text-xs font-medium transition-colors"
            >
              Review Vendors
            </button>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Disputes</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{stats.activeDisputes}</div>
            <p className="text-xs text-red-700">
              Disputes requiring attention
            </p>
            <button
              onClick={() => window.location.href = "/dashboard/admin/disputes"}
              className="mt-2 px-4 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-md text-xs font-medium transition-colors"
            >
              Resolve Disputes
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
