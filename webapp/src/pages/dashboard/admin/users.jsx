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
  User,
  Mail,
  Phone,
  Heart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { adminService } from "@/services/api";

export default function AdminUsers() {
  const [couples, setCouples] = useState([]);
  const [filteredCouples, setFilteredCouples] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCouple, setSelectedCouple] = useState(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchCouples = async () => {
      try {
        const response = await adminService.getAllCouples();
        setCouples(response.data);
        setFilteredCouples(response.data);
      } catch (error) {
        console.error("Error fetching couples:", error);
        toast.error("Failed to load couples. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCouples();
  }, []);

  useEffect(() => {
    // Filter couples based on search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = couples.filter(
        (couple) =>
          couple.name?.toLowerCase().includes(query) ||
          couple.email?.toLowerCase().includes(query) ||
          couple.partnerName?.toLowerCase().includes(query) ||
          couple.phone?.toLowerCase().includes(query)
      );
      setFilteredCouples(filtered);
    } else {
      setFilteredCouples(couples);
    }
  }, [searchQuery, couples]);

  const handleDeleteCouple = async (coupleId) => {
    try {
      await adminService.deleteCouple(coupleId);
      setCouples(couples.filter(couple => couple.id !== coupleId));
      setFilteredCouples(filteredCouples.filter(couple => couple.id !== coupleId));
      toast.success("Couple deleted successfully");
    } catch (error) {
      console.error("Error deleting couple:", error);
      toast.error("Failed to delete couple. Please try again.");
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

  if (isLoading) {
    return <div className="py-10 text-center">Loading couples...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Couple Management</h1>
        <p className="text-muted-foreground">
          Manage couples registered on the platform
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Registered Couples <Badge>{filteredCouples.length}</Badge>
            </CardTitle>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          <CardDescription>
            View and manage couple accounts and details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search couples by name, email, or phone..."
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
                  <TableHead>Couple</TableHead>
                  <TableHead>Partner</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCouples.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      No couples found. Try adjusting your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCouples.map((couple) => (
                    <TableRow key={couple.id}>
                      <TableCell>
                        <div className="font-medium">{couple.name}</div>
                        <div className="text-sm text-muted-foreground">{couple.email}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{couple.partnerName}</div>
                        <div className="text-sm text-muted-foreground">{couple.partnerEmail}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {couple.phone}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(couple.createdAt)}</TableCell>
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
                                setSelectedCouple(couple);
                                setViewDetailsOpen(true);
                              }}
                            >
                              <User className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteCouple(couple.id)}
                              className="text-red-600"
                            >
                              Delete Account
                            </DropdownMenuItem>
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

      {/* Couple Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="max-w-3xl">
          {selectedCouple && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedCouple.name}</DialogTitle>
                <DialogDescription>
                  Couple Account Details
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <h3 className="font-semibold mb-2">Primary Contact</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Name:</span> {selectedCouple.name}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {selectedCouple.email}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span> {selectedCouple.phone}
                    </div>
                    <div>
                      <span className="font-medium">Joined:</span> {formatDate(selectedCouple.createdAt)}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Partner Information</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Name:</span> {selectedCouple.partner?.name || 'Not specified'}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {selectedCouple.partner?.email || 'Not specified'}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span> {selectedCouple.partner?.phone || 'Not specified'}
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex justify-end gap-2 mt-6">
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDeleteCouple(selectedCouple.id);
                    setViewDetailsOpen(false);
                  }}
                >
                  Delete Account
                </Button>
                <Button onClick={() => setViewDetailsOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
