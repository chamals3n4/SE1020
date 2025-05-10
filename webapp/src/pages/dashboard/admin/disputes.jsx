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
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertCircle,
  Search,
  MoreHorizontal,
  CheckCircle,
  MessageSquare,
  UserCog,
  Store,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { adminService } from "@/services/api";

export default function AdminDisputes() {
  const [disputes, setDisputes] = useState([]);
  const [filteredDisputes, setFilteredDisputes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [resolutionText, setResolutionText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const response = await adminService.getAllDisputes();
        setDisputes(response.data);
        setFilteredDisputes(response.data);
      } catch (error) {
        console.error("Error fetching disputes:", error);
        toast.error("Failed to load disputes. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDisputes();
  }, []);

  useEffect(() => {
    // Filter disputes based on search query and status filter
    let result = disputes;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (dispute) =>
          dispute.title.toLowerCase().includes(query) ||
          dispute.description.toLowerCase().includes(query) ||
          dispute.couple.name.toLowerCase().includes(query) ||
          dispute.vendor.name.toLowerCase().includes(query)
      );
    }

    if (statusFilter === "open") {
      result = result.filter((dispute) => dispute.status === "OPEN");
    } else if (statusFilter === "resolved") {
      result = result.filter((dispute) => dispute.status === "RESOLVED");
    }

    setFilteredDisputes(result);
  }, [disputes, searchQuery, statusFilter]);

  const handleResolveDispute = async () => {
    if (!resolutionText.trim()) {
      toast.error("Please provide a resolution");
      return;
    }

    try {
      await adminService.resolveDispute(selectedDispute.id, resolutionText);
      
      // Refresh the disputes list to get the updated data
      const response = await adminService.getAllDisputes();
      const updatedDisputes = response.data;
      setDisputes(updatedDisputes);
      setFilteredDisputes(updatedDisputes.filter(d => {
        if (statusFilter === "open") return d.status === "OPEN";
        if (statusFilter === "resolved") return d.status === "RESOLVED";
        return true;
      }));
      
      setViewDetailsOpen(false);
      setResolutionText("");
      toast.success("Dispute resolved successfully");
    } catch (error) {
      console.error("Error resolving dispute:", error);
      toast.error("Failed to resolve dispute. Please try again.");
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

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "HIGH":
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case "MEDIUM":
        return <Badge className="bg-amber-100 text-amber-800">Medium</Badge>;
      case "LOW":
        return <Badge className="bg-blue-100 text-blue-800">Low</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "OPEN":
        return <Badge className="bg-amber-100 text-amber-800">Open</Badge>;
      case "RESOLVED":
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  if (isLoading) {
    return <div className="py-10 text-center">Loading disputes...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dispute Resolution</h1>
        <p className="text-muted-foreground">
          Manage and resolve disputes between vendors and couples
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Active Disputes <Badge>{filteredDisputes.length}</Badge>
            </CardTitle>
          </div>
          <CardDescription>
            Review and resolve disputes submitted by users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative w-full sm:w-2/3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search disputes..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex w-full sm:w-1/3 gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => setStatusFilter("all")}
                className="flex-1"
              >
                All
              </Button>
              <Button
                variant={statusFilter === "open" ? "default" : "outline"}
                onClick={() => setStatusFilter("open")}
                className="flex-1"
              >
                Open
              </Button>
              <Button
                variant={statusFilter === "resolved" ? "default" : "outline"}
                onClick={() => setStatusFilter("resolved")}
                className="flex-1"
              >
                Resolved
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dispute</TableHead>
                  <TableHead>Parties</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDisputes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No disputes found. Try adjusting your search or filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDisputes.map((dispute) => (
                    <TableRow key={dispute.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium truncate max-w-xs">
                            {dispute.title}
                          </div>
                          <div className="text-xs text-muted-foreground truncate max-w-xs">
                            {dispute.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <div className="flex items-center">
                            <UserCog className="h-3 w-3 mr-1" />
                            <span className="font-medium">{dispute.couple.name}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <Store className="h-3 w-3 mr-1" />
                            <span>{dispute.vendor.name}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatDate(dispute.createdAt)}
                      </TableCell>
                      <TableCell>
                        {getPriorityBadge(dispute.priority)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(dispute.status)}
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
                                setSelectedDispute(dispute);
                                setViewDetailsOpen(true);
                              }}
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {dispute.status === "OPEN" && (
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedDispute(dispute);
                                  setViewDetailsOpen(true);
                                }}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Resolve Dispute
                              </DropdownMenuItem>
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

      {/* Dispute Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedDispute && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedDispute.title}</DialogTitle>
                <DialogDescription className="flex items-center gap-2">
                  {getStatusBadge(selectedDispute.status)}
                  {getPriorityBadge(selectedDispute.priority)}
                  <span className="text-muted-foreground">
                    Submitted on {formatDate(selectedDispute.createdAt)}
                  </span>
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm">{selectedDispute.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <UserCog className="h-4 w-4 mr-2" />
                    Couple
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Name:</span> {selectedDispute.couple.name}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {selectedDispute.couple.email}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span> {selectedDispute.couple.phone}
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Store className="h-4 w-4 mr-2" />
                    Vendor
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Name:</span> {selectedDispute.vendor.name}
                    </div>
                    <div>
                      <span className="font-medium">Category:</span> {selectedDispute.vendor.category}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {selectedDispute.vendor.email}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span> {selectedDispute.vendor.phone}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Conversation History</h3>
                <div className="border rounded-md p-4 max-h-60 overflow-y-auto space-y-3">
                  {selectedDispute.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex flex-col p-3 rounded-md ${
                        message.sender === "couple"
                          ? "bg-blue-50 ml-8"
                          : message.sender === "vendor"
                          ? "bg-gray-50 mr-8"
                          : "bg-green-50"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium">
                          {message.sender === "couple"
                            ? selectedDispute.couple.name
                            : message.sender === "vendor"
                            ? selectedDispute.vendor.name
                            : "Admin"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedDispute.status === "RESOLVED" && (
                <div className="mt-6 border-t pt-4">
                  <h3 className="font-semibold mb-2">Resolution</h3>
                  <div className="bg-green-50 p-4 rounded-md">
                    <div className="text-xs text-muted-foreground mb-1">
                      Resolved on {formatDate(selectedDispute.resolvedAt)}
                    </div>
                    <p className="text-sm">{selectedDispute.resolution}</p>
                  </div>
                </div>
              )}

              {selectedDispute.status === "OPEN" && (
                <div className="mt-6 border-t pt-4">
                  <h3 className="font-semibold mb-2">Resolve This Dispute</h3>
                  <Textarea
                    placeholder="Provide your resolution decision here. This will be visible to both parties."
                    className="min-h-[100px]"
                    value={resolutionText}
                    onChange={(e) => setResolutionText(e.target.value)}
                  />
                </div>
              )}

              <DialogFooter className="flex justify-end gap-2 mt-6">
                {selectedDispute.status === "OPEN" ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setViewDetailsOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleResolveDispute}
                      disabled={!resolutionText.trim()}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Resolve Dispute
                    </Button>
                  </>
                ) : (
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
