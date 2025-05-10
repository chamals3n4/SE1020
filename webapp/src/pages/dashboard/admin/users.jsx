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
  DialogTrigger,
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
  Edit,
  Trash,
  Mail,
  UserCog,
  CheckCircle,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { adminService } from "@/services/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState({
    isOpen: false,
    user: null,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await adminService.getAllUsers();
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search query and role filter
    let result = users;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.id.toLowerCase().includes(query)
      );
    }

    if (roleFilter !== "ALL") {
      result = result.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(result);
  }, [users, searchQuery, roleFilter]);

  const handleDeleteUser = async (userId) => {
    try {
      // In a real app we would delete via API
      // await adminService.deleteUser(userId);

      // For now, just update the UI
      setUsers(users.filter((user) => user.id !== userId));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user. Please try again.");
    } finally {
      setConfirmDeleteDialog({ isOpen: false, user: null });
    }
  };

  const handleApproveVendor = async (vendorId) => {
    try {
      // In a real app we would approve via API
      // await adminService.approveVendor(vendorId);

      // For now, just update the UI
      setUsers(
        users.map((user) =>
          user.id === vendorId ? { ...user, isApproved: true } : user
        )
      );
      toast.success("Vendor approved successfully");
    } catch (error) {
      console.error("Error approving vendor:", error);
      toast.error("Failed to approve vendor. Please try again.");
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

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "VENDOR":
        return "bg-blue-100 text-blue-800";
      case "COUPLE":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return <div className="py-10 text-center">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage users, vendors, and couples on the platform
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              All Users <Badge>{filteredUsers.length}</Badge>
            </CardTitle>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          <CardDescription>
            View and manage all registered users on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative w-full sm:w-1/2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex w-full sm:w-1/2 gap-2">
              <Button
                variant={roleFilter === "ALL" ? "default" : "outline"}
                onClick={() => setRoleFilter("ALL")}
                className="flex-1"
              >
                All
              </Button>
              <Button
                variant={roleFilter === "ADMIN" ? "default" : "outline"}
                onClick={() => setRoleFilter("ADMIN")}
                className="flex-1"
              >
                Admins
              </Button>
              <Button
                variant={roleFilter === "VENDOR" ? "default" : "outline"}
                onClick={() => setRoleFilter("VENDOR")}
                className="flex-1"
              >
                Vendors
              </Button>
              <Button
                variant={roleFilter === "COUPLE" ? "default" : "outline"}
                onClick={() => setRoleFilter("COUPLE")}
                className="flex-1"
              >
                Couples
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No users found. Try adjusting your search or filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>
                        <Badge
                          className={`${getRoleBadgeColor(user.role)}`}
                          variant="outline"
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell>
                        {user.role === "VENDOR" && (
                          <>
                            {user.isApproved ? (
                              <Badge className="bg-green-100 text-green-800">
                                Approved
                              </Badge>
                            ) : (
                              <Badge className="bg-amber-100 text-amber-800">
                                Pending
                              </Badge>
                            )}
                          </>
                        )}
                        {user.role === "COUPLE" && (
                          <Badge className="bg-purple-100 text-purple-800">
                            Active
                          </Badge>
                        )}
                        {user.role === "ADMIN" && (
                          <Badge className="bg-red-100 text-red-800">
                            {user.accessLevel || "Admin"}
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
                                /* View user profile */
                              }}
                            >
                              <UserCog className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                /* Send email to user */
                              }}
                            >
                              <Mail className="h-4 w-4 mr-2" />
                              Contact User
                            </DropdownMenuItem>
                            {user.role === "VENDOR" && !user.isApproved && (
                              <DropdownMenuItem
                                onClick={() => handleApproveVendor(user.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve Vendor
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                /* Edit user */
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() =>
                                setConfirmDeleteDialog({
                                  isOpen: true,
                                  user,
                                })
                              }
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Delete User
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDeleteDialog.isOpen}
        onOpenChange={(open) =>
          setConfirmDeleteDialog({ ...confirmDeleteDialog, isOpen: open })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm User Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium">
                {confirmDeleteDialog.user?.name}
              </span>
              ? This action cannot be undone and will permanently remove the user
              and all associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() =>
                setConfirmDeleteDialog({ isOpen: false, user: null })
              }
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteUser(confirmDeleteDialog.user?.id)}
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
