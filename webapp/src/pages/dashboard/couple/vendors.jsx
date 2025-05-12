import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "@/config/supabase";
import { AlertCircle } from "lucide-react";
import axios from "axios";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import {
  Search,
  Star,
  MapPin,
  Phone,
  Heart,
  Calendar,
  Filter,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { vendorService, bookingService } from "@/services/api";

function FindVendors() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [imageLoadingStatus, setImageLoadingStatus] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [vendorType, setVendorType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Fetch vendors on component mount
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        // Check if we have any recently updated vendor data in localStorage (for development/testing)
        const lastUpdatedVendorData = localStorage.getItem(
          "lastUpdatedVendorData"
        );

        const response = await vendorService.getAllVendors();
        let vendorsData = response.data;

        // Process the vendors first before fetching images
        const processedVendors = vendorsData.map((vendor) => {
          return {
            ...vendor,
            // Calculate min/max price from service packages if available
            minPrice:
              vendor.servicePackages && vendor.servicePackages.length > 0
                ? Math.min(...vendor.servicePackages.map((pkg) => pkg.price))
                : 0,
            maxPrice:
              vendor.servicePackages && vendor.servicePackages.length > 0
                ? Math.max(...vendor.servicePackages.map((pkg) => pkg.price))
                : 0,
            // Use default values for any missing fields
            avgRating: vendor.avgRating || 0,
            reviewCount: vendor.reviewCount || 0,
            // Initialize empty portfolio images array that will be populated
            portfolioImages: [],
          };
        });

        // Set vendors with basic info first so UI can render
        setVendors(processedVendors);
        setFilteredVendors(processedVendors);

        // Then fetch images for each vendor from Supabase
        const fetchVendorImages = async () => {
          try {
            // For each vendor, list their images
            const updatedVendors = await Promise.all(
              processedVendors.map(async (vendor) => {
                try {
                  const { data, error } = await supabase.storage
                    .from("images")
                    .list(`vendors/${vendor.id}`);
                  console.log(`Files in vendors/${vendor.id}:`, data);

                  let portfolioImages = [];
                  if (data && data.length > 0) {
                    portfolioImages = data
                      .filter(file => file.name) // Only files, not folders
                      .map(file => {
                        const { data: publicUrlData } = supabase.storage
                          .from("images")
                          .getPublicUrl(`vendors/${vendor.id}/${file.name}`);
                        return publicUrlData.publicUrl;
                      });
                  }
                  return { ...vendor, portfolioImages };
                } catch (err) {
                  console.error(`Error processing images for vendor ${vendor.id}:`, err);
                  return { ...vendor, portfolioImages: [] };
                }
              })
            );

            setVendors(updatedVendors);
            setFilteredVendors(updatedVendors);
          } catch (err) {
            console.error("Error fetching vendor images:", err);
            setFetchError(`Error fetching vendor images: ${err.message}`);
          }
        };

        fetchVendorImages();

        // Keep the old fallback method for existing portfolio items
        // This ensures backward compatibility with existing data
        for (const vendor of processedVendors) {
          if (vendor.portfolioItems && vendor.portfolioItems.length > 0) {
            vendor.portfolioItems.forEach((item) => {
              if (item.imageUrls && item.imageUrls.length > 0) {
                vendor.portfolioImages.push(...item.imageUrls);
              }
            });
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching vendors:", error);
        setVendors([]);
        setFilteredVendors([]);
        toast("Error", {
          description: "Unable to fetch vendors. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setIsLoading(false);
      }
    };

    fetchVendors();
  }, []);

  // Apply filters whenever search params change
  useEffect(() => {
    let results = [...vendors];

    // Apply text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (vendor) =>
          vendor.name.toLowerCase().includes(query) ||
          vendor.description.toLowerCase().includes(query)
      );
    }

    // Apply vendor type filter
    if (vendorType) {
      results = results.filter((vendor) => vendor.type === vendorType);
    }

    // Apply price range filter
    if (priceRange) {
      switch (priceRange) {
        case "budget":
          results = results.filter((vendor) => vendor.minPrice < 1000);
          break;
        case "moderate":
          results = results.filter(
            (vendor) => vendor.minPrice >= 1000 && vendor.minPrice < 3000
          );
          break;
        case "premium":
          results = results.filter((vendor) => vendor.minPrice >= 3000);
          break;
      }
    }

    // Apply sorting
    if (sortBy === "rating") {
      results.sort((a, b) => b.avgRating - a.avgRating);
    } else if (sortBy === "price_low") {
      results.sort((a, b) => a.minPrice - b.minPrice);
    } else if (sortBy === "price_high") {
      results.sort((a, b) => b.minPrice - a.minPrice);
    }

    setFilteredVendors(results);
  }, [vendors, searchQuery, vendorType, priceRange, sortBy]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setVendorType("all_types");
    setPriceRange("any_price");
    setSortBy("rating");
  };

  const bookVendor = async (vendorId) => {
    // First, get vendor details to include in booking
    let vendorDetails = {};
    try {
      const vendorResponse = await vendorService.getVendorById(vendorId);
      vendorDetails = vendorResponse.data || {};
    } catch (error) {
      console.error("Error fetching vendor details for booking:", error);
      // Continue with limited vendor info
      const vendor = filteredVendors.find((v) => v.id === vendorId) || {};
      vendorDetails = vendor;
    }

    // Try to get user data from multiple possible localStorage keys
    // The app might be using different keys for historical reasons
    let userStr = localStorage.getItem("user");

    // If not found with "user" key, try "currentUser" as fallback
    if (!userStr) {
      const currentUserStr = localStorage.getItem("currentUser");
      if (currentUserStr) {
        userStr = currentUserStr;
        console.log(
          "User found in 'currentUser' localStorage key instead of 'user'"
        );
      }
    }

    // Check if we found the user in any storage location
    if (!userStr) {
      alert("You must be logged in to book a vendor");
      return;
    }

    // Parse the user data
    const user = JSON.parse(userStr);

    // Log the user data for debugging
    console.log("User data found:", {
      id: user.id,
      name: user.name,
      role: user.role,
      storage:
        userStr === localStorage.getItem("currentUser")
          ? "currentUser"
          : "user",
    });

    // Ensure we have the couple ID
    if (!user.id) {
      alert("User information is incomplete. Please log in again.");
      return;
    }

    // Get vendor pricing information
    let packagePrice = 0;
    let packageId = "";
    let packageName = "";

    if (
      vendorDetails.servicePackages &&
      vendorDetails.servicePackages.length > 0
    ) {
      // Use the first package for quick booking
      const selectedPackage = vendorDetails.servicePackages[0];
      packagePrice = selectedPackage.price || 1000;
      packageId = selectedPackage.id || `package-${vendorId}-1`;
      packageName = selectedPackage.name || "Standard Package";
    } else {
      // Use minPrice as fallback
      packagePrice = vendorDetails.minPrice || 1000;
      packageId = `package-${vendorId}-default`;
      packageName = "Standard Package";
    }

    // Create consistent IDs
    const timestamp = Date.now();
    const bookingId = `booking-${timestamp}`;

    // Create a booking object that matches backend expected format
    const newBooking = {
      // Use consistent ID format
      id: bookingId, // Primary identifier
      bookingId: bookingId, // For backward compatibility if needed

      // Relationship fields
      vendorId: vendorId,
      coupleId: user.id,
      weddingId: user.weddingId || null, // Link to wedding if it exists

      // Package details
      serviceId: packageId,
      packageName: packageName,
      packagePrice: packagePrice,

      // Booking details
      date: new Date().toISOString().split("T")[0], // Today's date as YYYY-MM-DD
      time: "10:00",
      status: "REQUESTED", // Use uppercase enum value expected by backend
      totalCost: packagePrice,

      // Additional info for display
      coupleNames: user.name || "Couple",
      vendorName: vendorDetails.name || "Vendor",
      notes: `Booking request for ${packageName} package`,
      createdAt: new Date().toISOString(),
    };

    try {
      // Validate crucial fields before sending
      if (
        !newBooking.vendorId ||
        !newBooking.coupleId ||
        !newBooking.bookingId
      ) {
        console.error("Booking validation failed - missing required fields:", {
          vendorId: newBooking.vendorId,
          coupleId: newBooking.coupleId,
          bookingId: newBooking.bookingId,
        });
        alert("Cannot create booking: Missing required information");
        return;
      }

      // Double-check that the ID is not undefined
      if (
        newBooking.bookingId === "undefined" ||
        newBooking.id === "undefined"
      ) {
        console.error("Invalid booking ID detected. Fixing...");
        const fixedId = `booking-${Date.now()}-${Math.floor(
          Math.random() * 1000
        )}`;
        newBooking.id = fixedId;
        newBooking.bookingId = fixedId;
      }

      // Save to backend API with validated data
      console.log("Sending VALIDATED booking to API:", newBooking);

      // Make a direct call to the bookingService
      const backendResponse = await bookingService.createBooking(newBooking);

      console.log(
        "Booking created successfully:",
        backendResponse.data || newBooking
      );

      // Show success message
      alert(
        "Booking request sent successfully! Check your bookings page for status."
      );

      // Navigate to bookings page
      navigate("/dashboard/couple/bookings");
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("There was an error creating your booking. Please try again.");
    }
  };

  const viewVendorDetails = (vendor) => {
    setSelectedVendor(vendor);
    setOpenDialog(true);
  };

  const renderRatingStars = (rating) => {
    return (
      <div className="flex items-center">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
        <span className="ml-1 text-xs text-muted-foreground">
          ({rating.toFixed(1)}/5)
        </span>
      </div>
    );
  };

  if (isLoading) {
    return <div className="py-10 text-center">Loading vendors...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Find Vendors</h1>
        <p className="text-muted-foreground">
          Discover the perfect vendors for your special day
        </p>

        {/* Error Message */}
        {fetchError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 my-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Error Loading Images
                </h3>
                <p className="text-sm text-red-700">{fetchError}</p>
                <p className="text-sm text-red-700 mt-2">
                  <strong>Possible fixes:</strong> Ensure your Supabase RLS
                  policies are correctly set up. Your bucket should have a
                  policy allowing public read access.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search vendors..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={vendorType} onValueChange={setVendorType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Vendor type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_types">All Types</SelectItem>
              <SelectItem value="PHOTOGRAPHY">Photography</SelectItem>
              <SelectItem value="VIDEOGRAPHY">Videography</SelectItem>
              <SelectItem value="CATERING">Catering</SelectItem>
              <SelectItem value="FLORIST">Florist</SelectItem>
              <SelectItem value="VENUE">Venue</SelectItem>
              <SelectItem value="PLANNER">Planner</SelectItem>
              <SelectItem value="MUSIC">Music</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Price range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any_price">Any Price</SelectItem>
              <SelectItem value="budget">Budget (Under $1000)</SelectItem>
              <SelectItem value="moderate">Moderate ($1000-$3000)</SelectItem>
              <SelectItem value="premium">Premium ($3000+)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="price_low">Price (Low to High)</SelectItem>
              <SelectItem value="price_high">Price (High to Low)</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={resetFilters} className="gap-1">
            <Filter className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      {filteredVendors.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">No vendors found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your filters or search terms
          </p>
          <Button variant="outline" onClick={resetFilters} className="mt-4">
            Reset Filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredVendors.map((vendor, index) => {
              return (
                <div
                  key={vendor.id || `vendor-${index}`}
                  className="group rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  {/* Display carousel of vendor images */}
                  <div className="relative aspect-video bg-muted">
                    {console.log(
                      `Rendering vendor card for ${vendor.id}:`,
                      vendor
                    )}
                    {console.log(
                      `Portfolio images for ${vendor.id}:`,
                      vendor.portfolioImages
                    )}

                    {vendor.portfolioImages &&
                    vendor.portfolioImages.length > 0 ? (
                      <Carousel className="w-full">
                        <CarouselContent>
                          {vendor.portfolioImages.map((imageUrl, index) => {
                            console.log(`Rendering image ${index} for vendor ${vendor.id}:`, imageUrl);
                            return (
                              <CarouselItem key={`${vendor.id}-image-${index}`}>
                                <div className="relative h-48 w-full">
                                  <img
                                    src={imageUrl}
                                    alt={`${vendor.name} portfolio ${index + 1}`}
                                    className="object-cover w-full h-full rounded-t-lg"
                                    onError={(e) => {
                                      console.error(
                                        `Failed to load image ${index} for ${vendor.name}:`,
                                        imageUrl
                                      );
                                      e.target.src = "https://placehold.co/600x400?text=Image+Not+Found";
                                    }}
                                  />
                                </div>
                              </CarouselItem>
                            );
                          })}
                        </CarouselContent>
                        <CarouselPrevious className="left-2" />
                        <CarouselNext className="right-2" />
                      </Carousel>
                    ) : (
                      <div className="flex items-center justify-center w-full h-48 bg-muted rounded-t-lg">
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-lg">{vendor.name}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm ml-1 font-medium">
                          {vendor.avgRating.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 inline mr-1" />
                      {vendor.city}, {vendor.state}
                    </p>

                    <p className="text-sm line-clamp-2">{vendor.description}</p>

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-base font-medium">
                        ${vendor.minPrice.toLocaleString()} - $
                        {vendor.maxPrice.toLocaleString()}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => viewVendorDetails(vendor)}
                          variant="outline"
                          className="px-3 py-2"
                        >
                          Details
                        </Button>
                        <Button
                          onClick={() => bookVendor(vendor.id)}
                          className="px-3 py-2"
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Book
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Vendor Details Dialog */}
          {openDialog && selectedVendor && (
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    {selectedVendor.name}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedVendor.type && (
                      <Badge variant="secondary" className="mr-2 text-sm">
                        {selectedVendor.type.replace("_", " ")}
                      </Badge>
                    )}
                    <span className="flex items-center mt-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {selectedVendor.city}, {selectedVendor.state}
                    </span>
                  </DialogDescription>
                </DialogHeader>

                {/* Vendor Images */}
                <div className="mt-4">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {selectedVendor.portfolioImages &&
                      selectedVendor.portfolioImages.length > 0 ? (
                        selectedVendor.portfolioImages.map(
                          (imageUrl, imgIndex) => (
                            <CarouselItem key={`detail-img-${imgIndex}`}>
                              <div className="h-80 w-full relative rounded-lg overflow-hidden">
                                <img
                                  src={imageUrl}
                                  alt={`${selectedVendor.name} - image ${
                                    imgIndex + 1
                                  }`}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            </CarouselItem>
                          )
                        )
                      ) : (
                        <CarouselItem>
                          <div className="h-80 w-full flex items-center justify-center bg-muted rounded-lg">
                            <ImageIcon className="h-16 w-16 text-muted-foreground" />
                          </div>
                        </CarouselItem>
                      )}
                    </CarouselContent>
                    <CarouselPrevious className="-left-5" />
                    <CarouselNext className="-right-5" />
                  </Carousel>
                </div>

                {/* Portfolio Gallery */}
                {selectedVendor?.portfolioImages &&
                  selectedVendor.portfolioImages.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-3">
                        Portfolio Gallery
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedVendor.portfolioImages.map((url, index) => (
                          <div
                            key={index}
                            className="rounded-md overflow-hidden"
                          >
                            <img
                              src={url}
                              alt={`${selectedVendor.name} portfolio ${
                                index + 1
                              }`}
                              className="w-full h-40 object-cover hover:scale-105 transition-transform cursor-pointer"
                              onError={(e) => {
                                console.error(
                                  `Failed to load detail image ${index}:`,
                                  url
                                );
                                e.target.src =
                                  "https://placehold.co/600x400?text=Image+Not+Found";
                              }}
                              onClick={() => {
                                setSelectedImageIndex(index);
                                setGalleryOpen(true);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      About this vendor
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedVendor.description ||
                        "No description available."}
                    </p>

                    <div className="mt-4">
                      <h4 className="font-medium mb-1">Rating & Reviews</h4>
                      <div className="flex items-center">
                        {renderRatingStars(selectedVendor.avgRating)}
                        <span className="ml-2 text-sm">
                          {selectedVendor.avgRating.toFixed(1)} (
                          {selectedVendor.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Pricing</h3>
                    <p className="text-lg font-bold text-primary">
                      ${selectedVendor.minPrice.toLocaleString()} - $
                      {selectedVendor.maxPrice.toLocaleString()}
                    </p>

                    <h4 className="font-medium mt-4 mb-1">Contact</h4>
                    <div className="flex items-center mb-1">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>
                        {selectedVendor.phone ||
                          "Contact information unavailable"}
                      </span>
                    </div>

                    <Button
                      onClick={() => {
                        setOpenDialog(false);
                        bookVendor(selectedVendor.id);
                      }}
                      className="mt-6 w-full"
                      size="lg"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Book This Vendor
                    </Button>
                  </div>
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </>
      )}
    </div>
  );
}

export default FindVendors;
