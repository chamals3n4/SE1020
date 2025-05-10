import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { vendorService } from "@/services/api";

function VendorServices() {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // In a real app, this would come from auth context
  // For demonstration, we'll use a hardcoded value
  const vendorId = "vendor-123";

  // Fetch vendor packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await vendorService.getVendorPackages(vendorId);
        setPackages(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching packages:", error);
        setPackages([]);
        // Show error notification
        toast("Error", {
          description:
            "Unable to fetch service packages. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, [vendorId]);

  const handleAddPackage = async () => {
    // In a real app, implement modal with form for package details
    const newPackage = {
      name: "New Package",
      description: "Description of the new package",
      price: 1499.99,
      features: ["Feature 1", "Feature 2", "Feature 3"],
    };

    try {
      const response = await vendorService.addServicePackage(
        vendorId,
        newPackage
      );
      setPackages([...packages, response.data]);
    } catch (error) {
      console.error("Error adding package:", error);
    }
  };

  const handleEditPackage = async (packageId) => {
    // In a real app, implement editing form
    const packageToEdit = packages.find((pkg) => pkg.id === packageId);
    if (!packageToEdit) return;

    // This would normally open a modal with the package data for editing
    // For now, we'll just simulate an update
    const updatedPackage = {
      ...packageToEdit,
      name: packageToEdit.name + " (Updated)",
    };

    try {
      // In this API, editing a package is done by updating the vendor
      // First get the current vendor
      const vendorResponse = await vendorService.getVendorById(vendorId);
      const vendor = vendorResponse.data;

      // Update the package in the vendor's package list
      const updatedVendor = {
        ...vendor,
        servicePackages: vendor.servicePackages.map((pkg) =>
          pkg.id === packageId ? updatedPackage : pkg
        ),
      };

      // Update the vendor
      await vendorService.updateVendor(vendorId, updatedVendor);

      // Update local state
      setPackages(
        packages.map((pkg) => (pkg.id === packageId ? updatedPackage : pkg))
      );
    } catch (error) {
      console.error("Error updating package:", error);
    }
  };

  const handleDeletePackage = async (packageId) => {
    // In a real app, implement confirmation dialog
    if (!confirm("Are you sure you want to delete this package?")) return;

    try {
      await vendorService.removeServicePackage(vendorId, packageId);
      setPackages(packages.filter((pkg) => pkg.id !== packageId));
    } catch (error) {
      console.error("Error deleting package:", error);
    }
  };

  if (isLoading) {
    return <div className="py-10 text-center">Loading packages...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Services & Packages
        </h1>
        <Button onClick={handleAddPackage}>
          <Plus className="h-4 w-4 mr-2" />
          Add Package
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {packages.map((pkg) => (
          <Card key={pkg.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{pkg.name}</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditPackage(pkg.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeletePackage(pkg.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>${pkg.price.toFixed(2)}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{pkg.description}</p>
              <div className="space-y-2">
                <h4 className="font-medium">Features:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {pkg.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default VendorServices;
