"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { vendorService } from "@/services/api";
import { Loader2, ImageIcon, Upload, X, Plus } from "lucide-react";
import { toast } from "sonner";
import supabase from "@/config/supabase";

function VendorProfile() {
  // Get vendor data from localStorage
  const userStr = localStorage.getItem("currentUser");
  const user = userStr ? JSON.parse(userStr) : {};
  const vendorId = user.id;

  // Loading state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Image gallery state
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  // Initialize profile data
  const [profileData, setProfileData] = useState({
    id: vendorId || "",
    name: user.name || "Your Business Name",
    email: user.email || "you@example.com",
    phone: user.phone || "",
    vendorType: user.vendorType || "PHOTOGRAPHY",
    description: user.description || "",
    address: user.address || "",
    city: user.city || "",
    state: user.state || "",
    zip: user.zip || "",
    isAvailable: user.isAvailable !== false, // Default to true
  });

  // State for packages with proper IDs
  const [packages, setPackages] = useState([]);

  // Fetch vendor data from backend when component mounts
  useEffect(() => {
    const fetchVendorData = async () => {
      if (!vendorId) {
        setLoading(false);
        setError("No vendor ID found. Please log in again.");
        return;
      }

      try {
        const response = await vendorService.getVendorById(vendorId);
        const vendorData = response.data;

        if (vendorData) {
          console.log("Fetched vendor data:", vendorData);

          // Update profile data with fetched data
          setProfileData((prev) => ({
            ...prev,
            id: vendorData.id || vendorId,
            name: vendorData.name || prev.name,
            email: vendorData.email || prev.email,
            phone: vendorData.phone || prev.phone,
            vendorType: vendorData.vendorType || prev.vendorType,
            description: vendorData.description || prev.description,
            address: vendorData.address || prev.address,
            city: vendorData.city || prev.city,
            state: vendorData.state || prev.state,
            zip: vendorData.zip || prev.zip,
            isAvailable:
              vendorData.isAvailable !== undefined
                ? vendorData.isAvailable
                : prev.isAvailable,
          }));

          // Update packages with fetched data
          if (
            vendorData.servicePackages &&
            vendorData.servicePackages.length > 0
          ) {
            setPackages(vendorData.servicePackages);
          }

          // Update portfolio images if available in vendor data
          if (vendorData.imageUrls && vendorData.imageUrls.length > 0) {
            setPortfolioImages(vendorData.imageUrls);
          } else if (
            vendorData.portfolioImages &&
            vendorData.portfolioImages.length > 0
          ) {
            setPortfolioImages(vendorData.portfolioImages);
          } else {
            // If no images found in vendor data, try to fetch from Supabase
            fetchImagesFromSupabase(vendorId);
          }

          // Update localStorage with the most current data
          localStorage.setItem(
            "currentUser",
            JSON.stringify({
              ...user,
              ...vendorData,
            })
          );
        }
      } catch (err) {
        console.error("Error fetching vendor data:", err);
        setError("Failed to load vendor data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    // Function to fetch images from Supabase storage
    const fetchImagesFromSupabase = async (vendorId) => {
      try {
        // List all files in the vendor's folder
        const { data, error } = await supabase.storage
          .from("images")
          .list(`vendors/${vendorId}`);

        if (error) {
          console.error("Error fetching images from Supabase:", error);
          return;
        }

        if (data && data.length > 0) {
          // Get public URLs for all files
          const imageUrls = data.map((file) => {
            const { data: urlData } = supabase.storage
              .from("images")
              .getPublicUrl(`vendors/${vendorId}/${file.name}`);
            return urlData.publicUrl;
          });

          setPortfolioImages(imageUrls);

          // Update the vendor data with these image URLs
          await vendorService.updateVendor(vendorId, {
            imageUrls: imageUrls,
          });
        }
      } catch (err) {
        console.error("Error in Supabase image fetching:", err);
      }
    };

    fetchVendorData();
  }, [vendorId]);

  // Fallback to default packages if none loaded
  useEffect(() => {
    if (!loading && packages.length === 0) {
      setPackages([
        {
          id: `pkg-${vendorId}-1`,
          name: "Basic Package",
          price: 1000,
          description:
            "Basic package description. Includes essential services.",
          vendorId: vendorId,
          isActive: true,
        },
        {
          id: `pkg-${vendorId}-2`,
          name: "Standard Package",
          price: 2000,
          description:
            "Standard package with additional features and longer coverage.",
          vendorId: vendorId,
          isActive: true,
        },
        {
          id: `pkg-${vendorId}-3`,
          name: "Premium Package",
          price: 3000,
          description:
            "Premium all-inclusive package with full day coverage and extras.",
          vendorId: vendorId,
          isActive: true,
        },
      ]);
    }
  }, [loading, packages.length, vendorId]);

  // Handle profile field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle toggle changes (like availability)
  const handleToggleChange = (name, checked) => {
    setProfileData((prev) => ({ ...prev, [name]: checked }));
  };

  // Handle package changes
  const handlePackageChange = (packageId, field, value) => {
    setPackages((prevPackages) =>
      prevPackages.map((pkg) =>
        pkg.id === packageId ? { ...pkg, [field]: value } : pkg
      )
    );
  };

  // Add a new package with proper ID
  const handleAddPackage = () => {
    const newPackageId = `pkg-${vendorId}-${packages.length + 1}-${Date.now()}`;

    const newPackage = {
      id: newPackageId,
      name: "New Package",
      price: 0,
      description: "Describe what's included in this package",
      vendorId: vendorId,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    setPackages([...packages, newPackage]);
  };

  // Handle file input change for image upload
  const handleImageFileChange = (e) => {
    const files = Array.from(e.target.files);

    // Limit to 3 images total
    if (portfolioImages.length + selectedImages.length + files.length > 3) {
      toast.error("Maximum 3 images allowed", {
        description: "Please remove some images before adding more.",
      });
      return;
    }

    // Preview the images
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / 1024).toFixed(2) + "KB",
    }));

    setSelectedImages([...selectedImages, ...newImages]);
  };

  // Remove a selected image before upload
  const removeSelectedImage = (index) => {
    const updatedImages = [...selectedImages];

    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(updatedImages[index].preview);

    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
  };

  // Upload images to Supabase and update the vendor profile
  const uploadPortfolioImages = async () => {
    if (selectedImages.length === 0) return;

    setIsUploadingImage(true);
    const urls = [];

    try {
      for (const image of selectedImages) {
        // Create a safe filename
        const safeFileName = image.file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const timestamp = new Date().getTime();
        const filePath = `vendors/${vendorId}/${timestamp}_${safeFileName}`;

        // Upload to Supabase
        const { data, error } = await supabase.storage
          .from("images")
          .upload(filePath, image.file, {
            contentType: image.file.type || "image/jpeg",
            cacheControl: "3600",
            upsert: true,
          });

        if (error) throw error;

        // Get the public URL
        const { data: publicUrlData } = supabase.storage
          .from("images")
          .getPublicUrl(filePath);

        urls.push(publicUrlData.publicUrl);
      }

      // Update state with new images
      const newPortfolioImages = [...portfolioImages, ...urls];
      setPortfolioImages(newPortfolioImages);

      // Get current vendor data
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}"
      );

      // Update the vendor profile with new images
      const updatedVendorData = {
        ...currentUser,
        id: vendorId,
        imageUrls: newPortfolioImages, // Update only the image URLs
      };

      console.log("Updating vendor with image URLs:", newPortfolioImages);

      // Update vendor data in the backend
      const response = await vendorService.updateVendor(
        vendorId,
        updatedVendorData
      );
      console.log("Vendor update response:", response);

      // Update localStorage with the new data
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          ...currentUser,
          imageUrls: newPortfolioImages,
        })
      );

      // Clear selected images
      setSelectedImages([]);

      toast.success("Images uploaded successfully");
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload images", {
        description: error.message || "Please try again later.",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Remove an image from portfolio
  const removePortfolioImage = async (index) => {
    try {
      const updatedImages = [...portfolioImages];
      const removedUrl = updatedImages[index];

      // Extract the file path from the URL
      const filePathMatch = removedUrl.match(/vendors\/[\w-]+\/[\w.-]+/g);

      if (filePathMatch && filePathMatch[0]) {
        // Try to remove from Supabase storage (this might fail if RLS policies don't allow it)
        try {
          await supabase.storage.from("images").remove([filePathMatch[0]]);
        } catch (storageError) {
          console.warn("Could not remove file from storage:", storageError);
          // Continue anyway, we'll still update the vendor data
        }
      }

      // Remove from the state array
      updatedImages.splice(index, 1);
      setPortfolioImages(updatedImages);

      // Update vendor profile with remaining images while preserving other data
      const updatedVendorData = {
        ...profileData,
        id: vendorId,
        role: "VENDOR",
        updatedAt: new Date().toISOString(),
        email: profileData.email,
        name: profileData.name,
        phone: profileData.phone,
        vendorType: profileData.vendorType,
        businessName: profileData.name,
        rating: profileData.rating || 0.0,
        availability: profileData.isAvailable,
        address: profileData.address,
        imageUrls: updatedImages,
        servicePackages: packages,
        socialMediaLinks: profileData.socialMediaLinks || {},
        approved: profileData.approved || false,
        rejected: profileData.rejected || false,
      };

      await vendorService.updateVendor(vendorId, updatedVendorData);

      toast.success("Image removed successfully");
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Failed to remove image");
    }
  };

  // Save all profile and package data
  const handleSave = async () => {
    // Exit if no vendor ID
    if (!vendorId) {
      toast.error("You need to be logged in as a vendor to save your profile.");
      return;
    }

    // Prepare profile data for API update
    const profileApiData = {
      ...profileData,
      id: vendorId,
      role: "VENDOR",
      updatedAt: new Date().toISOString(),
      // Include all necessary vendor fields
      email: profileData.email,
      name: profileData.name,
      phone: profileData.phone,
      vendorType: profileData.vendorType,
      businessName: profileData.name, // Using name as business name
      rating: profileData.rating || 0.0,
      availability: profileData.isAvailable,
      address: profileData.address,
      city: profileData.city,
      state: profileData.state,
      zipCode: profileData.zip,
      serviceRadius: profileData.serviceRadius || 0.0,
      portfolioItems: portfolioImages.map((url) => ({ imageUrl: url })),
      servicePackages: packages,
      socialMediaLinks: profileData.socialMediaLinks || {},
      approved: profileData.approved || false,
      rejected: profileData.rejected || false,
    };

    // Prepare packages data with consistent IDs and relationships
    const packagesApiData = packages.map((pkg) => ({
      ...pkg,
      vendorId: vendorId, // Ensure relationship is maintained
      updatedAt: new Date().toISOString(),
    }));

    console.log("Profile update data:", profileApiData);
    console.log("Packages update data:", packagesApiData);

    try {
      // Show loading toast
      toast.loading("Saving profile changes...");

      // First update the vendor profile via API
      await vendorService.updateVendor(vendorId, profileApiData);

      // Then update each package
      for (const pkg of packagesApiData) {
        if (pkg.id.includes("new-") || pkg.id.includes(`pkg-${vendorId}-`)) {
          await vendorService.addServicePackage(vendorId, pkg);
        } else {
          // Use the endpoint for updating packages if it exists
          // or fall back to the add endpoint
          try {
            await vendorService.updateVendor(vendorId, {
              ...profileApiData,
              servicePackages: packagesApiData,
            });
          } catch (pkgError) {
            console.warn(
              "Could not update package directly, adding instead",
              pkgError
            );
            await vendorService.addServicePackage(vendorId, pkg);
          }
        }
      }

      // Update the profile in localStorage for immediate feedback
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          ...user,
          ...profileApiData,
          servicePackages: packagesApiData,
        })
      );

      toast.success("Profile and packages updated successfully!");
      console.log("Profile and packages updated successfully via API");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("There was an error saving your profile. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading vendor profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4 max-w-md text-center">
          <p className="text-destructive font-medium text-lg">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      {/* Header with action buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Account Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your business profile and services
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch
              id="isAvailable"
              checked={profileData.isAvailable}
              onCheckedChange={(checked) =>
                handleToggleChange("isAvailable", checked)
              }
            />
            <Label htmlFor="isAvailable" className="font-medium text-sm">
              {profileData.isAvailable
                ? "Available for bookings"
                : "Unavailable"}
            </Label>
          </div>
          <Button onClick={handleSave} className="whitespace-nowrap">
            Save Changes
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar with profile summary */}
        <Card className="lg:col-span-1 h-fit">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mb-4">
                <span className="text-2xl text-white font-semibold">
                  {profileData.name
                    ? profileData.name.charAt(0).toUpperCase()
                    : "V"}
                </span>
              </div>
              <h2 className="text-xl font-semibold">{profileData.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {profileData.vendorType || "Vendor"}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 mt-0.5 flex-shrink-0 text-muted-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {profileData.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 mt-0.5 flex-shrink-0 text-muted-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">
                    {profileData.phone || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 mt-0.5 flex-shrink-0 text-muted-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">
                    {[profileData.city, profileData.state]
                      .filter(Boolean)
                      .join(", ") || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 mt-0.5 flex-shrink-0 text-muted-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M3 9h18" />
                    <path d="M9 21V9" />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Packages</p>
                  <p className="text-sm text-muted-foreground">
                    {packages.length} active packages
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 mt-0.5 flex-shrink-0 text-muted-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                    <circle cx="12" cy="13" r="3" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Gallery</p>
                  <p className="text-sm text-muted-foreground">
                    {portfolioImages.length} of 3 images
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main content area */}
        <div className="lg:col-span-3 space-y-6">
          <Tabs defaultValue="business" className="w-full">
            <TabsList className="w-full grid grid-cols-2 mb-2">
              <TabsTrigger value="business">Business Info</TabsTrigger>
              {/* <TabsTrigger value="services">Services</TabsTrigger> */}
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
            </TabsList>

            <TabsContent value="business" className="mt-0">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">
                    Business Information
                  </CardTitle>
                  <CardDescription>
                    Update your business details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="font-medium">
                        Business Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleChange}
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="font-medium">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleChange}
                        className="h-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleChange}
                      disabled
                      className="h-10 bg-muted/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email address cannot be changed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="font-medium">
                      Business Address
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={profileData.address}
                      onChange={handleChange}
                      className="h-10"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="font-medium">
                        City
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        value={profileData.city}
                        onChange={handleChange}
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state" className="font-medium">
                        State
                      </Label>
                      <Input
                        id="state"
                        name="state"
                        value={profileData.state}
                        onChange={handleChange}
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zip" className="font-medium">
                        ZIP Code
                      </Label>
                      <Input
                        id="zip"
                        name="zip"
                        value={profileData.zip}
                        onChange={handleChange}
                        className="h-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="font-medium">
                      Business Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      rows={5}
                      value={profileData.description}
                      onChange={handleChange}
                      placeholder="Describe your business and services..."
                      className="resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gallery" className="mt-0">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">Photo Gallery</CardTitle>
                  <CardDescription>
                    Showcase your best work to attract potential clients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Portfolio Images */}
                  {portfolioImages.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                      {portfolioImages.map((imageUrl, index) => (
                        <div
                          key={index}
                          className="relative aspect-square bg-muted rounded-md overflow-hidden border group"
                        >
                          <img
                            src={imageUrl || "/placeholder.svg"}
                            alt={`Portfolio image ${index + 1}`}
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://via.placeholder.com/300x300?text=Image+Error";
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              variant="destructive"
                              size="sm"
                              className="h-8"
                              onClick={() => removePortfolioImage(index)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-lg border border-dashed">
                      <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">
                        No portfolio images yet
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-md">
                        Add images to showcase your work to potential clients.
                        High-quality images help attract more business.
                      </p>
                    </div>
                  )}

                  {/* Upload Section - only show if less than 3 images */}
                  {portfolioImages.length < 3 && (
                    <div className="mt-6">
                      {/* Selected images preview */}
                      {selectedImages.length > 0 && (
                        <div className="mb-6 border rounded-md p-4">
                          <h3 className="text-sm font-medium mb-3">
                            Selected Images ({selectedImages.length})
                          </h3>
                          <div className="space-y-3">
                            {selectedImages.map((image, index) => (
                              <div
                                key={index}
                                className="flex items-center bg-muted/50 rounded-md p-2"
                              >
                                <div className="h-10 w-10 mr-3 flex-shrink-0 bg-background rounded overflow-hidden">
                                  <img
                                    src={image.preview || "/placeholder.svg"}
                                    alt={`Upload preview ${index}`}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium truncate">
                                    {image.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {image.size}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => removeSelectedImage(index)}
                                  disabled={isUploadingImage}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedImages([])}
                              disabled={isUploadingImage}
                            >
                              Clear All
                            </Button>
                            <Button
                              size="sm"
                              onClick={uploadPortfolioImages}
                              disabled={isUploadingImage}
                              className="ml-auto"
                            >
                              {isUploadingImage ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  Uploading...
                                </>
                              ) : (
                                <>Upload</>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* File selector */}
                      <div className="border border-dashed rounded-md p-6 text-center bg-muted/20">
                        <Input
                          type="file"
                          id="gallery-image-upload"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleImageFileChange}
                          disabled={
                            isUploadingImage ||
                            portfolioImages.length + selectedImages.length >= 3
                          }
                        />
                        <label htmlFor="gallery-image-upload">
                          <div className="flex flex-col items-center cursor-pointer">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                              <Upload className="h-5 w-5 text-primary" />
                            </div>
                            <p className="text-sm font-medium">
                              Click to add portfolio images
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {3 -
                                portfolioImages.length -
                                selectedImages.length}{" "}
                              {3 -
                                portfolioImages.length -
                                selectedImages.length ===
                              1
                                ? "spot"
                                : "spots"}{" "}
                              remaining (max 3 images)
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default VendorProfile;
