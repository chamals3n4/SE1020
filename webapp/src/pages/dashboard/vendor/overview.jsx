import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, Calendar, DollarSign, Users } from "lucide-react";

function VendorOverview() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Vendor Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome back! Here's an overview of your business performance.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,345</div>
            <p className="text-xs text-muted-foreground">
              +18% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+5 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">+12 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">57%</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
            <CardDescription>Your next 5 scheduled events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  date: "May 15, 2025",
                  couple: "Johnson & Smith",
                  package: "Premium",
                },
                {
                  date: "May 22, 2025",
                  couple: "Garcia & Lee",
                  package: "Standard",
                },
                {
                  date: "June 5, 2025",
                  couple: "Wilson & Brown",
                  package: "Premium",
                },
                {
                  date: "June 12, 2025",
                  couple: "Taylor & Davis",
                  package: "Basic",
                },
                {
                  date: "June 19, 2025",
                  couple: "Miller & Anderson",
                  package: "Standard",
                },
              ].map((booking, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div>
                    <p className="font-medium">{booking.couple}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.date}
                    </p>
                  </div>
                  <div className="text-sm">{booking.package} Package</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Inquiries</CardTitle>
            <CardDescription>Your latest customer inquiries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  date: "May 9, 2025",
                  couple: "Martinez & White",
                  status: "New",
                },
                {
                  date: "May 8, 2025",
                  couple: "Clark & Lewis",
                  status: "Replied",
                },
                { date: "May 7, 2025", couple: "Walker & Hall", status: "New" },
                {
                  date: "May 6, 2025",
                  couple: "Young & Allen",
                  status: "Replied",
                },
                {
                  date: "May 5, 2025",
                  couple: "King & Wright",
                  status: "Converted",
                },
              ].map((inquiry, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div>
                    <p className="font-medium">{inquiry.couple}</p>
                    <p className="text-sm text-muted-foreground">
                      {inquiry.date}
                    </p>
                  </div>
                  <div
                    className={`text-sm px-2 py-1 rounded-full ${
                      inquiry.status === "New"
                        ? "bg-blue-100 text-blue-800"
                        : inquiry.status === "Replied"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {inquiry.status}
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

export default VendorOverview;
