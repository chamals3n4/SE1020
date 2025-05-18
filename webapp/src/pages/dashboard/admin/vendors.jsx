import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Filter,
  Search,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Eye,
  Store,
  Star,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { adminService } from "@/services/api";

export default function AdminVendors() {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await adminService.getAllVendors();
        setVendors(response.data);
        setFilteredVendors(response.data);
      } catch (error) {
        console.error("Error fetching vendors:", error);
        toast.error("Failed to load vendors. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendors();
  }, []);

  useEffect(() => {
    // Filter vendors based on search query and status filter
    let result = vendors;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (vendor) =>
          vendor.name.toLowerCase().includes(query) ||
          vendor.email.toLowerCase().includes(query) ||
          vendor.vendorType?.toLowerCase().includes(query) ||
          vendor.address?.toLowerCase().includes(query)
      );
    }

    if (statusFilter === "pending") {
      result = result.filter((vendor) => !vendor.status || vendor.status === "PENDING");
    } else if (statusFilter === "approved") {
      result = result.filter((vendor) => vendor.status === "APPROVED");
    }

    setFilteredVendors(result);
  }, [vendors, searchQuery, statusFilter]);

  const handleApproveVendor = async (vendorId) => {
    try {
      await adminService.approveVendor(vendorId);
      
      // Update the vendor status in the local state
      setVendors(prevVendors => 
        prevVendors.map(vendor => 
          vendor.id === vendorId 
            ? { ...vendor, status: "APPROVED" }
            : vendor
        )
      );

      // Update filtered vendors
      setFilteredVendors(prevVendors => 
        prevVendors.map(vendor => 
          vendor.id === vendorId 
            ? { ...vendor, status: "APPROVED" }
            : vendor
        )
      );
      
      toast.success("Vendor approved successfully");
    } catch (error) {
      console.error("Error approving vendor:", error);
      toast.error("Failed to approve vendor. Please try again.");
    }
  };

  const handleRejectVendor = async (vendorId, reason = "") => {
    try {
      await adminService.rejectVendor(vendorId, reason);
      
      // Update the vendor status in the local state
      setVendors(prevVendors => 
        prevVendors.map(vendor => 
          vendor.id === vendorId 
            ? { ...vendor, status: "REJECTED" }
            : vendor
        )
      );

      // Update filtered vendors
      setFilteredVendors(prevVendors => 
        prevVendors.map(vendor => 
          vendor.id === vendorId 
            ? { ...vendor, status: "REJECTED" }
            : vendor
        )
      );
      
      toast.success("Vendor rejected");
    } catch (error) {
      console.error("Error rejecting vendor:", error);
      toast.error("Failed to reject vendor. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryBadgeColor = (category) => {
    const categories = {
      "VENUE": "bg-purple-100 text-purple-800",
      "PHOTOGRAPHY": "bg-blue-100 text-blue-800",
      "CATERING": "bg-amber-100 text-amber-800",
      "MUSIC": "bg-indigo-100 text-indigo-800",
      "DECORATION": "bg-green-100 text-green-800"
    };
    
    return categories[category] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return <div className="py-10 text-center">Loading vendors...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vendor Management</h1>
        <p className="text-muted-foreground">
          Manage and approve vendors on the platform
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Platform Vendors <Badge>{filteredVendors.length}</Badge>
            </CardTitle>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          <CardDescription>
            View and manage vendor approvals and details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full mb-6">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger
                value="all"
                onClick={() => setStatusFilter("all")}
              >
                All Vendors
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                onClick={() => setStatusFilter("pending")}
              >
                Pending Approval
                <Badge className="ml-2 bg-amber-100 text-amber-800">
                  {vendors.filter(v => !v.status || v.status === "PENDING").length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="approved"
                onClick={() => setStatusFilter("approved")}
              >
                Approved
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search vendors by name, category, or location..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No vendors found. Try adjusting your search or filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell>
                        <div className="font-medium">{vendor.name}</div>
                        <div className="text-sm text-muted-foreground">{vendor.email}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryBadgeColor(vendor.vendorType)}>
                          {vendor.vendorType}
                        </Badge>
                      </TableCell>
                      <TableCell>{vendor.address}</TableCell>
                      <TableCell>{formatDate(vendor.createdAt)}</TableCell>
                      <TableCell>
                        {vendor.status === "APPROVED" ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approved
                          </Badge>
                        ) : vendor.status === "REJECTED" ? (
                          <Badge className="bg-red-100 text-red-800">
                            <XCircle className="h-3 w-3 mr-1" />
                            Rejected
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-800">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedVendor(vendor);
                                setViewDetailsOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {!vendor.status || vendor.status === "PENDING" && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => handleApproveVendor(vendor.id)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve Vendor
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleRejectVendor(vendor.id)}
                                  className="text-red-600"
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject Vendor
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Vendor Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedVendor && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedVendor.name}</DialogTitle>
                <DialogDescription className="flex items-center gap-2">
                  <Badge
                    className={getCategoryBadgeColor(selectedVendor.vendorType)}
                    variant="outline"
                  >
                    {selectedVendor.vendorType}
                  </Badge>
                  {selectedVendor.status === "APPROVED" ? (
                    <Badge className="bg-green-100 text-green-800">
                      Approved
                    </Badge>
                  ) : selectedVendor.status === "REJECTED" ? (
                    <Badge className="bg-red-100 text-red-800">
                      Rejected
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-100 text-amber-800">
                      Pending Approval
                    </Badge>
                  )}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <h3 className="font-semibold mb-2">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Email:</span> {selectedVendor.email}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span> {selectedVendor.phone}
                    </div>
                    <div>
                      <span className="font-medium">Location:</span> {selectedVendor.address}
                    </div>
                    <div>
                      <span className="font-medium">Joined:</span> {formatDate(selectedVendor.createdAt)}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Performance</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Rating:</span> 
                      <div className="flex items-center">
                        {selectedVendor.rating > 0 ? (
                          <>
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="ml-1">{selectedVendor.rating.toFixed(1)}</span>
                            <span className="text-muted-foreground ml-1">
                              ({selectedVendor.reviewCount} reviews)
                            </span>
                          </>
                        ) : (
                          <span className="text-muted-foreground">No ratings yet</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Portfolio Items:</span> {selectedVendor.portfolioItems}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm">{selectedVendor.description}</p>
              </div>

              <DialogFooter className="flex justify-end gap-2 mt-6">
                {!selectedVendor.status || selectedVendor.status === "PENDING" && (
                  <>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleRejectVendor(selectedVendor.id);
                        setViewDetailsOpen(false);
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => {
                        handleApproveVendor(selectedVendor.id);
                        setViewDetailsOpen(false);
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </>
                )}
                {(selectedVendor.status === "APPROVED" || selectedVendor.status === "REJECTED") && (
                  <Button onClick={() => setViewDetailsOpen(false)}>
                    Close
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
