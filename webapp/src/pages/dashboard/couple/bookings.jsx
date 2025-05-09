import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Phone,
  PenLine,
  XCircle,
  Store,
  CheckCircle,
  Trash2,
} from "lucide-react";
import { bookingService, vendorService } from "@/services/api";

function CoupleBookings() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [errorMessage, setErrorMessage] = useState("");

  // Get current user from localStorage (from auth context)
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
  const coupleId = currentUser.id || "couple-123";

  // Fetch bookings (with vendor details for each booking) from backend only
  useEffect(() => {
    fetchBookings();
  }, [coupleId]);

  const fetchBookings = async () => {
    setIsLoading(true);
    setErrorMessage("");
    let allBookings = [];

    try {
      // Get all bookings from the backend API only
      const response = await bookingService.getAllBookings();
      if (response.data && Array.isArray(response.data)) {
        // Filter bookings for this couple
        const coupleBookings = response.data.filter(
          (booking) => booking.coupleId === coupleId
        );
        allBookings = [...coupleBookings];

        // If we got bookings, try to fetch vendor details for each booking
        for (let i = 0; i < allBookings.length; i++) {
          try {
            // Fetch vendor details to get vendor name and type
            const vendorResponse = await vendorService.getVendorById(
              allBookings[i].vendorId
            );
            if (vendorResponse.data) {
              allBookings[i].vendorName = vendorResponse.data.name;
              allBookings[i].vendorType =
                vendorResponse.data.vendorType ||
                vendorResponse.data.type ||
                "VENDOR";
              allBookings[i].vendorPhone = vendorResponse.data.phone;
            }
          } catch (vendorError) {
            console.warn(
              `Could not fetch details for vendor ${allBookings[i].vendorId}:`,
              vendorError
            );
            // Keep the booking even if we can't get vendor details
          }
        }
      }

      // Sort bookings by date (newest first)
      allBookings.sort((a, b) => new Date(b.date) - new Date(a.date));

      // If we still have no bookings, show a message
      if (allBookings.length === 0) {
        setErrorMessage(
          "No bookings found in the system. Book a vendor to see your bookings here."
        );
      }

      setBookings(allBookings);
    } catch (error) {
      console.error("Error fetching bookings from backend:", error);
      setErrorMessage(
        "Could not load bookings from the server. Please make sure the backend is running."
      );
      setBookings([]);
    }

    setIsLoading(false);
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      if (!confirm("Are you sure you want to cancel this booking?")) return;

      try {
        // Try to cancel via API
        console.log(`Cancelling booking with ID: ${bookingId}`);
        await bookingService.cancelBooking(bookingId);
        
        // Refresh bookings after successful cancellation
        fetchBookings();
        
        alert("Booking cancelled successfully");
      } catch (apiError) {
        console.error("API cancel booking failed:", apiError);
        alert("Failed to cancel booking. Please try again.");
      }
    } catch (error) {
      console.error("Error in cancel booking handler:", error);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      if (!confirm("Are you sure you want to delete this booking? This action cannot be undone.")) return;

      try {
        // Try to delete via API
        console.log(`Deleting booking with ID: ${bookingId}`);
        await bookingService.deleteBooking(bookingId);
        
        // Refresh bookings after successful deletion
        fetchBookings();
        
        alert("Booking deleted successfully.");
      } catch (error) {
        console.error("Error deleting booking:", error);
        alert("There was an error deleting the booking. Please try again.");
      }
    } catch (error) {
      console.error("Error in delete booking handler:", error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            Pending
          </Badge>
        );
      case "CONFIRMED":
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <CheckCircle className="h-3.5 w-3.5 mr-1" />
            Confirmed
          </Badge>
        );
      case "CANCELLED":
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700">
            <XCircle className="h-3.5 w-3.5 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            {status}
          </Badge>
        );
    }
  };

  // Filter bookings by status if a filter is applied
  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter((booking) => booking.status.toLowerCase() === filter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bookings</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vendor Bookings</CardTitle>
          <CardDescription>
            Manage your bookings with wedding vendors
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading bookings...</div>
          ) : errorMessage ? (
            <div className="text-center py-8 text-muted-foreground">
              {errorMessage}
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No bookings found matching your filter.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.bookingId}>
                    <TableCell>
                      <div className="font-medium">
                        {booking.vendorName || "Unknown Vendor"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {booking.vendorType}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {booking.date instanceof Date 
                            ? booking.date.toLocaleDateString() 
                            : new Date(booking.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {booking.time}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{booking.packageName || "Standard Package"}</div>
                      <div className="text-sm text-muted-foreground">
                        $
                        {(booking.price || booking.totalCost || booking.packagePrice || 0).toFixed(
                          2
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {booking.status.toLowerCase() !== "cancelled" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-2"
                              onClick={() =>
                                (window.location.href = `tel:${
                                  booking.vendorPhone || "555-123-4567"
                                }`)
                              }
                            >
                              <Phone className="h-3.5 w-3.5 mr-1" />
                              Call
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-2"
                            >
                              <PenLine className="h-3.5 w-3.5 mr-1" />
                              Edit
                            </Button>
                            {booking.status.toLowerCase() !== "confirmed" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2"
                                onClick={() => handleCancelBooking(booking.bookingId)}
                              >
                                <XCircle className="h-3.5 w-3.5 mr-1" />
                                Cancel
                              </Button>
                            ) : (
                              <Button
                                variant="destructive"
                                size="sm"
                                className="h-8 px-2"
                                onClick={() => handleCancelBooking(booking.bookingId)}
                              >
                                <XCircle className="h-3.5 w-3.5 mr-1" />
                                Cancel
                              </Button>
                            )}
                          </>
                        )}
                        {booking.status.toLowerCase() === "cancelled" && (
                          <div className="flex space-x-2">
                            <Button
                              variant="destructive"
                              size="sm"
                              className="h-8 px-2"
                              onClick={() => handleDeleteBooking(booking.bookingId)}
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-1" />
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <a href="/dashboard/couple/vendors">
              <Store className="h-4 w-4 mr-2" />
              Find More Vendors
            </a>
          </Button>
          <div className="text-sm text-muted-foreground">
            {bookings.filter((b) => b.status.toLowerCase() === "confirmed").length} confirmed
            bookings
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default CoupleBookings;
