import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowUp,
  ArrowDown,
  TrendingUp,
  Calendar,
  Users,
  Heart,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  taskService,
  bookingService,
  vendorService,
  weddingService,
} from "@/services/api";
import { format, isAfter, isBefore, isToday, differenceInDays } from "date-fns";

function CoupleOverview() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [vendorBookings, setVendorBookings] = useState([]);
  const [isBookingsLoading, setIsBookingsLoading] = useState(true);
  const [weddingData, setWeddingData] = useState(null);
  const [isWeddingLoading, setIsWeddingLoading] = useState(true);

  // Get current user information from localStorage
  const userStr = localStorage.getItem("currentUser");
  const user = userStr ? JSON.parse(userStr) : {};
  const weddingId = user.weddingId;

  // Fetch wedding data
  useEffect(() => {
    const fetchWeddingData = async () => {
      if (!weddingId) {
        console.log("No wedding ID found, skipping wedding data fetch");
        setWeddingData(null);
        setIsWeddingLoading(false);
        return;
      }

      try {
        const response = await weddingService.getWeddingById(weddingId);
        if (response.data) {
          setWeddingData(response.data);
        }
      } catch (error) {
        console.error("Error fetching wedding data:", error);
      } finally {
        setIsWeddingLoading(false);
      }
    };

    fetchWeddingData();
  }, [weddingId]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (!weddingId) {
          console.log("No wedding ID found, skipping task fetch");
          setTasks([]);
          setIsLoading(false);
          return;
        }

        console.log("Fetching tasks for wedding ID:", weddingId);
        const response = await taskService.getTasksByWeddingId(weddingId);
        if (response.data && Array.isArray(response.data)) {
          console.log("Received tasks:", response.data);
          // Sort tasks by due date and get upcoming ones
          const sortedTasks = response.data
            .filter((task) => {
              const isUpcoming =
                !task.isCompleted &&
                isAfter(new Date(task.dueDate), new Date());
              console.log(
                `Task ${task.name} is ${
                  isUpcoming ? "upcoming" : "not upcoming"
                }`
              );
              return isUpcoming;
            })
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .slice(0, 5); // Get only the next 5 upcoming tasks
          console.log("Filtered and sorted tasks:", sortedTasks);
          setTasks(sortedTasks);
        } else {
          console.warn(
            "No tasks data received or invalid format:",
            response.data
          );
          setTasks([]);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [weddingId]);

  useEffect(() => {
    const fetchVendorBookings = async () => {
      if (!user || !user.id) {
        setVendorBookings([]);
        setIsBookingsLoading(false);
        return;
      }
      try {
        const response = await bookingService.getAllBookings();
        if (response.data && Array.isArray(response.data)) {
          // Filter bookings for this couple/wedding
          const coupleBookings = response.data.filter(
            (booking) => booking.coupleId === user.id
          );
          // Fetch vendor details for each booking
          const bookingsWithVendor = await Promise.all(
            coupleBookings.map(async (booking) => {
              try {
                const vendorRes = await vendorService.getVendorById(
                  booking.vendorId
                );
                return {
                  ...booking,
                  vendorName: vendorRes.data?.name || "Unknown Vendor",
                  vendorType: vendorRes.data?.vendorType || "Vendor",
                  status: booking.status || "Unknown",
                };
              } catch {
                return {
                  ...booking,
                  vendorName: "Unknown Vendor",
                  vendorType: "Vendor",
                  status: booking.status || "Unknown",
                };
              }
            })
          );
          setVendorBookings(bookingsWithVendor.slice(0, 6)); // Show up to 6
        } else {
          setVendorBookings([]);
        }
      } catch (error) {
        setVendorBookings([]);
      } finally {
        setIsBookingsLoading(false);
      }
    };

    fetchVendorBookings();
  }, [user]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Wedding Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Track your wedding planning progress and upcoming tasks
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-violet-100 bg-gradient-to-br from-violet-50 to-violet-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-violet-900">
              Total Budget
            </CardTitle>
            <div className="flex items-center text-xs text-violet-600">
              <ArrowUp className="h-3 w-3 mr-1" />
              +12.5%
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-violet-900">
              {weddingData?.budget?.toLocaleString() || "0.00"} LKR
            </div>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-4 w-4 text-violet-500 mr-1" />
              <span className="text-xs text-violet-600">
                On track with planning
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-emerald-100 bg-gradient-to-br from-emerald-50 to-emerald-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-900">
              Tasks Completed
            </CardTitle>
            <div className="flex items-center text-xs text-emerald-600">
              <ArrowUp className="h-3 w-3 mr-1" />
              +12.5%
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900">
              {tasks.filter((task) => task.isCompleted).length}/{tasks.length}
            </div>
            <div className="flex items-center mt-1">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-1" />
              <span className="text-xs text-emerald-600">
                Good progress
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">
              Days Until Wedding
            </CardTitle>
            <div className="flex items-center text-xs text-blue-600">
              <ArrowUp className="h-3 w-3 mr-1" />
              +4.5%
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {weddingData?.date
                ? differenceInDays(new Date(weddingData.date), new Date())
                : "0"}
            </div>
            <div className="flex items-center mt-1">
              <Clock className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-xs text-blue-600">On schedule</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-slate-200 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-violet-500"></div>
                </div>
              ) : tasks.length > 0 ? (
                tasks.map((task) => (
                  <div
                    key={task.taskId}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">{task.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Due: {format(new Date(task.dueDate), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <div
                      className={`text-xs px-2.5 py-1 rounded-full ${
                        isToday(new Date(task.dueDate))
                          ? "bg-rose-100 text-rose-700"
                          : isBefore(new Date(task.dueDate), new Date())
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {isToday(new Date(task.dueDate))
                        ? "Today"
                        : isBefore(new Date(task.dueDate), new Date())
                        ? "Overdue"
                        : "Upcoming"}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No upcoming tasks
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Vendor Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isBookingsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-violet-500"></div>
                </div>
              ) : vendorBookings.length > 0 ? (
                vendorBookings.map((booking, idx) => (
                  <div
                    key={booking.bookingId || idx}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">{booking.vendorType}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {booking.vendorName}
                      </p>
                    </div>
                    <div
                      className={`text-xs px-2.5 py-1 rounded-full ${
                        booking.status === "CONFIRMED"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {booking.status.charAt(0) +
                        booking.status.slice(1).toLowerCase()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No vendor bookings yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CoupleOverview;
