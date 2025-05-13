import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowUp,
  ArrowDown,
  TrendingUp,
  Calendar,
  Users,
  Heart,
} from "lucide-react";
import { useEffect, useState } from "react";
import { taskService } from "@/services/api";
import { format, isAfter, isBefore, isToday } from "date-fns";

function CoupleOverview() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get current user information from localStorage
  const userStr = localStorage.getItem("currentUser");
  const user = userStr ? JSON.parse(userStr) : {};
  const weddingId = user.weddingId;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (!weddingId) {
          console.log('No wedding ID found, skipping task fetch');
          setTasks([]);
          setIsLoading(false);
          return;
        }

        console.log('Fetching tasks for wedding ID:', weddingId);
        const response = await taskService.getTasksByWeddingId(weddingId);
        if (response.data && Array.isArray(response.data)) {
          console.log('Received tasks:', response.data);
          // Sort tasks by due date and get upcoming ones
          const sortedTasks = response.data
            .filter(task => {
              const isUpcoming = !task.isCompleted && isAfter(new Date(task.dueDate), new Date());
              console.log(`Task ${task.name} is ${isUpcoming ? 'upcoming' : 'not upcoming'}`);
              return isUpcoming;
            })
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .slice(0, 5); // Get only the next 5 upcoming tasks
          console.log('Filtered and sorted tasks:', sortedTasks);
          setTasks(sortedTasks);
        } else {
          console.warn('No tasks data received or invalid format:', response.data);
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

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Budget
            </CardTitle>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUp className="h-3 w-3 mr-1" />
              +12.5%
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$25,000.00</div>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs text-muted-foreground">
                On track with planning
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Guest Count
            </CardTitle>
            <div className="flex items-center text-xs text-red-600">
              <ArrowDown className="h-3 w-3 mr-1" />
              -20%
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120</div>
            <div className="flex items-center mt-1">
              <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-xs text-muted-foreground">
                RSVPs need attention
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tasks Completed
            </CardTitle>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUp className="h-3 w-3 mr-1" />
              +12.5%
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24/36</div>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs text-muted-foreground">
                Good progress
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Days Until Wedding
            </CardTitle>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUp className="h-3 w-3 mr-1" />
              +4.5%
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs text-muted-foreground">On schedule</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Wedding Timeline</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Last 3 months
            </Button>
            <Button variant="outline" size="sm">
              Last 30 days
            </Button>
            <Button variant="outline" size="sm">
              Last 7 days
            </Button>
          </div>
        </div>

        <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md">
          <p className="text-muted-foreground">
            Timeline chart will be displayed here
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
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
                    className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{task.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Due: {format(new Date(task.dueDate), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <div
                      className={`text-sm px-2 py-1 rounded-full ${
                        isToday(new Date(task.dueDate))
                          ? "bg-red-100 text-red-800"
                          : isBefore(new Date(task.dueDate), new Date())
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
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
                <div className="text-center py-4 text-muted-foreground">
                  No upcoming tasks
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Vendor Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  type: "Venue",
                  name: "Grand Ballroom",
                  status: "Confirmed",
                  icon: Users,
                },
                {
                  type: "Photographer",
                  name: "Elegant Events Photography",
                  status: "Confirmed",
                  icon: Heart,
                },
                {
                  type: "Caterer",
                  name: "Gourmet Delights",
                  status: "Confirmed",
                  icon: Calendar,
                },
                {
                  type: "DJ",
                  name: "Rhythm Masters",
                  status: "Confirmed",
                  icon: Users,
                },
                {
                  type: "Florist",
                  name: "Blooming Creations",
                  status: "Confirmed",
                  icon: Heart,
                },
                {
                  type: "Cake",
                  name: "",
                  status: "Not Booked",
                  icon: Calendar,
                },
              ].map((vendor, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                >
                  <div className="flex items-center">
                    <vendor.icon className="h-4 w-4 mr-2 text-gray-500" />
                    <div>
                      <p className="font-medium">{vendor.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {vendor.name || "Not selected yet"}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`text-sm px-2 py-1 rounded-full ${
                      vendor.status === "Confirmed"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {vendor.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CoupleOverview;
