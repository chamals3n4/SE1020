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

function CoupleOverview() {
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
              {[
                {
                  task: "Send save-the-date cards",
                  deadline: "May 23, 2025",
                  priority: "High",
                },
                {
                  task: "Book florist consultation",
                  deadline: "May 30, 2025",
                  priority: "Medium",
                },
                {
                  task: "Finalize guest list",
                  deadline: "June 15, 2025",
                  priority: "High",
                },
                {
                  task: "Schedule cake tasting",
                  deadline: "June 20, 2025",
                  priority: "Medium",
                },
                {
                  task: "Book honeymoon flights",
                  deadline: "July 1, 2025",
                  priority: "Low",
                },
              ].map((task, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{task.task}</p>
                    <p className="text-sm text-muted-foreground">
                      Due: {task.deadline}
                    </p>
                  </div>
                  <div
                    className={`text-sm px-2 py-1 rounded-full ${
                      task.priority === "High"
                        ? "bg-red-100 text-red-800"
                        : task.priority === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {task.priority}
                  </div>
                </div>
              ))}
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
