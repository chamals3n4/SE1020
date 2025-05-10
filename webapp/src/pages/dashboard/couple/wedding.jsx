import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  MapPin,
  Timer,
  User,
  Users,
  PlusCircle,
  Save,
  Edit,
  Heart,
  Clock,
  DollarSign,
  Gift,
  Home,
  Globe,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { weddingService, coupleService } from "@/services/api";

function WeddingPlanning() {
  const [weddingDetails, setWeddingDetails] = useState({
    id: "",
    weddingName: "",
    date: "",
    time: "12:00",
    location: "",
    address: "",
    notes: "",
    budget: 0,
    guestCount: 0,
    weddingWebsite: "",
    theme: "",
    style: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({ ...weddingDetails });
  const [isLoading, setIsLoading] = useState(true);

  // Get the logged-in user's ID
  const [coupleId, setCoupleId] = useState("");

  // Get partner names for the romantic display
  const [partnerNames, setPartnerNames] = useState({
    partner1: "",
    partner2: "",
  });

  // Random guest count between 50-200 for display
  const randomGuestCount = Math.floor(Math.random() * (200 - 50 + 1)) + 50;

  // Fetch wedding details
  useEffect(() => {
    const fetchWeddingDetails = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching wedding details...");

        // First check localStorage for couple data (required for ID)
        const localUser = JSON.parse(localStorage.getItem("user"));
        console.log("LocalUser data from localStorage:", localUser);

        if (!localUser || !localUser.id) {
          console.error("No valid user found in localStorage");
          setIsLoading(false);
          return;
        }

        // Get couple ID from localStorage
        const userCoupleId = localUser.id;
        setCoupleId(userCoupleId);
        console.log(`Using couple ID: ${userCoupleId}`);

        try {
          // First, get couple data from the API using the controller's GET method
          console.log(`Fetching couple data for ID: ${userCoupleId}`);
          const coupleResponse = await coupleService.getCoupleById(
            userCoupleId
          );
          console.log("Couple API response:", coupleResponse);

          if (!coupleResponse || !coupleResponse.data) {
            throw new Error("Failed to fetch couple data from API");
          }

          const coupleData = coupleResponse.data;
          console.log("Couple data from API:", coupleData);

          // Extract partner information
          let partnerData = {};

          // If partner information is nested in the couple object
          if (coupleData.partner && coupleData.partner.name) {
            partnerData = coupleData.partner;
            console.log("Found nested partner data:", partnerData);
          }
          // If only a partnerId is provided, fetch the partner separately
          else if (coupleData.partnerId) {
            try {
              console.log(
                `Fetching partner data for ID: ${coupleData.partnerId}`
              );
              const partnerResponse = await coupleService.getCoupleById(
                coupleData.partnerId
              );
              if (partnerResponse && partnerResponse.data) {
                partnerData = partnerResponse.data;
                console.log("Partner data fetched from API:", partnerData);
              }
            } catch (partnerError) {
              console.error("Failed to fetch partner details:", partnerError);
            }
          }

          // Set partner names based on fetched data
          setPartnerNames({
            partner1: coupleData.name || "Partner One",
            partner2: partnerData.name || "Partner Two",
          });

          // Create wedding name from couple & partner names
          const weddingNameFromAPI =
            coupleData.name && partnerData.name
              ? `${coupleData.name.split(" ")[0]} & ${
                  partnerData.name.split(" ")[0]
                }'s Wedding`
              : "Our Wedding";

          // Initialize wedding details with couple data
          const initialWeddingDetails = {
            weddingName: weddingNameFromAPI,
            date: coupleData.weddingDate || "",
            budget: parseFloat(coupleData.budget) || 0,
            style: coupleData.style || "",
            id: `w-${userCoupleId}`,
            // Location will be updated when venue is booked and confirmed
            location: "",
            address: "",
            notes: "",
            theme: "",
            time: "12:00",
            guestCount: randomGuestCount,
          };

          // See if there's a wedding ID in the couple data
          if (coupleData.weddingId) {
            console.log(
              `Found wedding ID: ${coupleData.weddingId}, fetching wedding data...`
            );
            try {
              // Get wedding details from the API
              const weddingResponse = await weddingService.getWeddingById(
                coupleData.weddingId
              );
              console.log("Wedding API response:", weddingResponse);

              if (weddingResponse && weddingResponse.data) {
                const weddingData = weddingResponse.data;
                console.log("Wedding data from API:", weddingData);

                // Merge wedding data with our initial details
                const mergedWeddingDetails = {
                  ...initialWeddingDetails,
                  weddingName:
                    weddingData.name || initialWeddingDetails.weddingName,
                  date: weddingData.date || initialWeddingDetails.date,
                  budget:
                    parseFloat(weddingData.budget) ||
                    initialWeddingDetails.budget,
                  location: weddingData.venue || "",
                  address: weddingData.address || "",
                  style: weddingData.style || initialWeddingDetails.style,
                  notes: weddingData.notes || "",
                  theme: weddingData.theme || "",
                  id: weddingData.weddingId || initialWeddingDetails.id,
                };

                console.log(
                  "Setting merged wedding details:",
                  mergedWeddingDetails
                );
                setWeddingDetails(mergedWeddingDetails);
                setEditFormData({ ...mergedWeddingDetails });
              } else {
                // No wedding data found, use the initial details
                console.log("No wedding data found, using initial details");
                setWeddingDetails(initialWeddingDetails);
                setEditFormData({ ...initialWeddingDetails });
              }
            } catch (weddingError) {
              console.error("Failed to fetch wedding details:", weddingError);
              // Use initial data from couple
              setWeddingDetails(initialWeddingDetails);
              setEditFormData({ ...initialWeddingDetails });
            }
          } else {
            // No wedding ID found, use couple data only
            console.log("No wedding ID found, using couple data only");
            setWeddingDetails(initialWeddingDetails);
            setEditFormData({ ...initialWeddingDetails });
          }
        } catch (apiError) {
          console.error(
            "Error fetching wedding details or creating a new wedding:",
            apiError
          );
          // Show error toast
          toast("Error", {
            description:
              "Unable to fetch wedding details. Please try again later.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          // Set empty wedding details instead of using mock data
          setWeddingDetails(null);
          setEditFormData({});
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching wedding details:", error);
        setIsLoading(false);
      }
    };

    fetchWeddingDetails();
  }, [randomGuestCount]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setEditFormData({ ...weddingDetails });
    } else {
      // Start editing
      setEditFormData({ ...weddingDetails });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      // Get the current user from localStorage
      const localUserJson = localStorage.getItem("user");
      if (!localUserJson) {
        console.error("No user found in localStorage");
        return;
      }

      const localUser = JSON.parse(localUserJson);

      // Update user data in localStorage with any changes to budget and style
      const updatedLocalUser = {
        ...localUser,
        budget: editFormData.budget || localUser.budget || 0,
        style: editFormData.style || "",
      };

      // Save updated user data back to localStorage
      localStorage.setItem("user", JSON.stringify(updatedLocalUser));

      // If wedding doesn't exist yet, create it in the API
      if (!weddingDetails.id) {
        // Create a wedding profile request
        const weddingRequest = {
          wedding: {
            name: editFormData.weddingName,
            date: editFormData.date,
            venue: editFormData.location,
            coupleId: coupleId,
            budget: editFormData.budget,
            guestCount: editFormData.guestCount,
            notes: editFormData.notes,
            style: editFormData.style || "",
          },
          tasks: [], // You could add initial tasks here
        };

        try {
          const response = await weddingService.createWeddingProfile(
            weddingRequest
          );
          setWeddingDetails({
            ...editFormData,
            id: response.data.weddingId,
          });
        } catch (apiError) {
          console.warn(
            "API create wedding failed, using local data only:",
            apiError
          );
          // Still update UI even if API fails
          setWeddingDetails({
            ...editFormData,
            id: `w-${coupleId}`,
          });
        }
      } else {
        // Update existing wedding in the API
        const weddingData = {
          weddingId: weddingDetails.id,
          name: editFormData.weddingName,
          date: editFormData.date,
          venue: editFormData.location,
          coupleId: coupleId,
          budget: editFormData.budget,
          guestCount: editFormData.guestCount,
          notes: editFormData.notes,
          style: editFormData.style || "",
        };

        try {
          await weddingService.updateWedding(weddingDetails.id, weddingData);
        } catch (apiError) {
          console.warn(
            "API update wedding failed, using local data only:",
            apiError
          );
        }

        // Update UI regardless of API success
        setWeddingDetails({ ...editFormData });
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Error saving wedding details:", error);
      // Still update the UI to give feedback to the user
      setWeddingDetails({ ...editFormData });
      setIsEditing(false);
    }
  };

  // Helper function to format style names for display
  const getStyleName = (style) => {
    if (!style) return "Not specified";
    return style.charAt(0).toUpperCase() + style.slice(1).replace(/-/g, " ");
  };

  // Extract partner names from wedding name if available
  const getPartnerNames = () => {
    // First try to use the explicitly set partner names
    if (partnerNames.partner1 && partnerNames.partner2) {
      return {
        partner1: partnerNames.partner1,
        partner2: partnerNames.partner2,
      };
    }

    // Fall back to extracting from wedding name
    if (!weddingDetails.weddingName)
      return { partner1: "Partner One", partner2: "Partner Two" };

    const parts = weddingDetails.weddingName.split("&");
    if (parts.length >= 2) {
      return {
        partner1: parts[0].trim(),
        partner2: parts[1].trim().replace("'s Wedding", "").trim(),
      };
    }

    return { partner1: "Partner One", partner2: "Partner Two" };
  };

  // Get formatted date and time for display
  const getFormattedDate = () => {
    if (!weddingDetails.date) return "Wedding Date TBD";
    return new Date(weddingDetails.date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const { partner1, partner2 } = getPartnerNames();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-rose-200 border-t-rose-500 animate-spin"></div>
            <Heart className="absolute inset-0 m-auto h-6 w-6 text-rose-500 animate-pulse" />
          </div>
          <p className="text-rose-700 font-medium">
            Loading your wedding details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Elegant Header with Wedding Banner */}
      <div className="relative pb-12 pt-8 px-4 text-center bg-gradient-to-r from-rose-50 via-white to-rose-50 rounded-lg shadow-sm border border-rose-100">
        {/* Decorative Hearts */}
        <div className="absolute top-0 left-0 w-20 h-20 opacity-50">
          <Heart className="h-full w-full text-rose-300" />
        </div>
        <div className="absolute top-0 right-0 w-20 h-20 opacity-50">
          <Heart className="h-full w-full text-rose-300" />
        </div>

        <div className="flex flex-col items-center gap-4">
          {/* Interlocking Rings */}
          <div className="flex justify-center mb-3">
            <div className="relative h-12 w-20">
              <div className="absolute left-0 top-0 h-12 w-12 rounded-full border-2 border-rose-400"></div>
              <div className="absolute right-0 top-0 h-12 w-12 rounded-full border-2 border-purple-400"></div>
            </div>
          </div>

          {/* Wedding Title */}
          <h1 className="font-serif  text-5xl font-bold tracking-tight text-rose-700 drop-shadow-sm">
            {weddingDetails.weddingName || "Our Beautiful Wedding"}
          </h1>

          {/* Decorative Divider */}
          <div className="flex items-center w-full max-w-sm mx-auto my-2">
            <div className="flex-grow h-px bg-rose-200"></div>
            <Heart className="mx-2 h-5 w-5 text-rose-300" />
            <div className="flex-grow h-px bg-rose-200"></div>
          </div>

          {/* Date Display */}
          <div className="font-light text-xl text-rose-600">
            {getFormattedDate()}
          </div>

          {/* Edit Button */}
          <Button
            variant="outline"
            onClick={handleEditToggle}
            className="mt-4 border-rose-200 text-rose-600 hover:bg-rose-50 transition-all duration-300"
          >
            {isEditing ? (
              <>Cancel</>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Edit Our Wedding
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2 p-1 bg-rose-50 border border-rose-100 rounded-lg">
          <TabsTrigger
            value="details"
            className="data-[state=active]:bg-white data-[state=active]:text-rose-700"
          >
            <Heart className="h-4 w-4 mr-2" />
            Wedding Details
          </TabsTrigger>
          <TabsTrigger
            value="budget"
            className="data-[state=active]:bg-white data-[state=active]:text-rose-700"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Budget & Planning
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          {isEditing ? (
            <Card>
              <CardHeader>
                <CardTitle>Edit Wedding Details</CardTitle>
                <CardDescription>
                  Update the information about your special day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weddingName">Wedding Name</Label>
                      <Input
                        id="weddingName"
                        name="weddingName"
                        value={editFormData.weddingName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="theme">Wedding Theme</Label>
                      <Input
                        id="theme"
                        name="theme"
                        value={editFormData.theme}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="style">Wedding Style</Label>
                    <Select
                      name="style"
                      onValueChange={(value) =>
                        setEditFormData((prev) => ({ ...prev, style: value }))
                      }
                      value={editFormData.style || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a wedding style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Not specified</SelectItem>
                        <SelectItem value="classic">
                          Classic & Traditional
                        </SelectItem>
                        <SelectItem value="rustic">Rustic & Country</SelectItem>
                        <SelectItem value="beach">Beach & Coastal</SelectItem>
                        <SelectItem value="garden">Garden & Outdoor</SelectItem>
                        <SelectItem value="modern">
                          Modern & Minimalist
                        </SelectItem>
                        <SelectItem value="vintage">Vintage & Retro</SelectItem>
                        <SelectItem value="bohemian">
                          Bohemian & Whimsical
                        </SelectItem>
                        <SelectItem value="glamorous">
                          Glamorous & Luxury
                        </SelectItem>
                        <SelectItem value="destination">
                          Destination Wedding
                        </SelectItem>
                        <SelectItem value="themed">Themed Wedding</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Wedding Date</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={editFormData.date}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Wedding Time</Label>
                      <Input
                        id="time"
                        name="time"
                        type="time"
                        value={editFormData.time}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Venue Name</Label>
                      <Input
                        id="location"
                        name="location"
                        value={editFormData.location}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guestCount">Expected Guest Count</Label>
                      <Input
                        id="guestCount"
                        name="guestCount"
                        type="number"
                        value={editFormData.guestCount}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Venue Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={editFormData.address}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weddingWebsite">Wedding Website</Label>
                    <Input
                      id="weddingWebsite"
                      name="weddingWebsite"
                      value={editFormData.weddingWebsite}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={editFormData.notes}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleEditToggle}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveChanges}
                  className="bg-rose-600 hover:bg-rose-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Couple showcase with decorative elements */}
              <div className="relative bg-gradient-to-r from-rose-50 via-white to-purple-50 p-6 rounded-lg border border-rose-100 overflow-hidden">
                <div className="text-center flex flex-col items-center justify-center gap-2">
                  <div className="relative">
                    <div className="flex relative">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center z-10">
                          <User className="h-6 w-6 text-rose-600" />
                        </div>
                        <div className="absolute right-0 top-0 h-12 w-12 rounded-full border-2 border-rose-400"></div>
                      </div>
                      <div className="relative -ml-3">
                        <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center z-10">
                          <User className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="absolute right-0 top-0 h-12 w-12 rounded-full border-2 border-purple-400"></div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-serif text-rose-600">
                          &
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-1 space-y-1">
                    <h2 className="text-xl font-medium text-rose-700">
                      {/*Use exact partners from our partner state*/}
                      {partnerNames.partner1 || "Partner"} &{" "}
                      {partnerNames.partner2 || "Partner"}
                    </h2>
                    <p className="text-sm text-rose-500">
                      {weddingDetails.weddingName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Wedding details in elegant cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Date & Time Card */}
                <div className="bg-white p-4 rounded-lg border border-rose-100 shadow-sm flex flex-col items-center text-center group hover:border-rose-300 transition-all duration-300">
                  <div className="bg-rose-50 p-3 rounded-full mb-3">
                    <Calendar className="h-6 w-6 text-rose-600" />
                  </div>
                  <h3 className="text-base font-medium text-rose-700 group-hover:text-rose-800">
                    When We Say "I Do"
                  </h3>
                  <p className="text-sm text-rose-600 mt-1">
                    {getFormattedDate()}
                  </p>
                  <p className="text-sm text-rose-600 mt-1">
                    {weddingDetails.time || "Time not set yet"}
                  </p>
                </div>

                {/* Venue Card */}
                <div className="bg-white p-5 rounded-lg border border-rose-100 shadow-sm flex flex-col items-center text-center group hover:border-rose-300 transition-all duration-300">
                  <div className="bg-rose-50 p-3 rounded-full mb-3">
                    <MapPin className="h-6 w-6 text-rose-600" />
                  </div>
                  <h3 className="text-base font-medium text-rose-700 group-hover:text-rose-800">
                    Where We Celebrate
                  </h3>
                  {weddingDetails.location ? (
                    <>
                      <p className="text-sm text-rose-600 mt-1 font-medium">
                        {weddingDetails.location}
                      </p>
                      <p className="text-sm text-rose-600 mt-1">
                        {weddingDetails.address || "Address not set yet"}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-rose-400 italic mt-1">
                      Please book and confirm a venue with a vendor
                    </p>
                  )}
                </div>

                {/* Theme & Style Card */}
                <div className="bg-white p-4 rounded-lg border border-rose-100 shadow-sm flex flex-col items-center text-center group hover:border-rose-300 transition-all duration-300">
                  <div className="bg-rose-50 p-3 rounded-full mb-3">
                    <Home className="h-6 w-6 text-rose-600" />
                  </div>
                  <h3 className="text-base font-medium text-rose-700 group-hover:text-rose-800">
                    Our Dream Theme
                  </h3>
                  <p className="text-sm text-rose-600 mt-1 font-medium">
                    {weddingDetails.style
                      ? getStyleName(weddingDetails.style)
                      : "Wedding style not selected yet"}
                  </p>
                </div>

                {/* Guest Count */}
                <div className="bg-white p-4 rounded-lg border border-rose-100 shadow-sm flex flex-col items-center text-center group hover:border-rose-300 transition-all duration-300">
                  <div className="bg-rose-50 p-3 rounded-full mb-3">
                    <Users className="h-6 w-6 text-rose-600" />
                  </div>
                  <h3 className="text-base font-medium text-rose-700 group-hover:text-rose-800">
                    Celebrating With
                  </h3>
                  <p className="text-sm text-rose-600 mt-1 font-medium">
                    {randomGuestCount} Cherished Guests
                  </p>
                </div>

                {/* Wedding Website */}
                <div className="bg-white p-4 rounded-lg border border-rose-100 shadow-sm flex flex-col items-center text-center group hover:border-rose-300 transition-all duration-300">
                  <div className="bg-rose-50 p-3 rounded-full mb-3">
                    <Globe className="h-6 w-6 text-rose-600" />
                  </div>
                  <h3 className="text-base font-medium text-rose-700 group-hover:text-rose-800">
                    Our Wedding Site
                  </h3>
                  <p className="text-sm text-rose-600 mt-1">
                    {weddingDetails.weddingWebsite ? (
                      <a
                        href={weddingDetails.weddingWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-rose-600 hover:text-rose-800 hover:underline"
                      >
                        Visit Our Website
                      </a>
                    ) : (
                      "Website not created yet"
                    )}
                  </p>
                </div>

                {/* Notes Card - Full Width */}
                <div className="col-span-1 sm:col-span-2 md:col-span-3 bg-white p-5 rounded-lg border border-rose-100 shadow-sm">
                  <h3 className="text-base font-medium mb-2 text-rose-700 flex items-center">
                    <Heart className="h-5 w-5 mr-2" />
                    Our Notes & Special Moments
                  </h3>
                  <div className="p-4 bg-rose-50/50 rounded-md text-rose-700 text-sm whitespace-pre-wrap">
                    {weddingDetails.notes ||
                      "We haven't added any notes yet about our special day."}
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="budget">
          <Card className="border-rose-100">
            <CardHeader className="bg-gradient-to-r from-rose-50 to-purple-50 border-b border-rose-100">
              <CardTitle className="flex items-center gap-2 text-rose-700">
                <DollarSign className="h-5 w-5" />
                Budget & Timeline
              </CardTitle>
              <CardDescription className="text-rose-600/70">
                Track your wedding budget and planning timeline
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Budget Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-rose-700 flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Wedding Budget
                  </h3>

                  <div className="bg-rose-50/50 rounded-lg p-5 border border-rose-100">
                    <div className="flex justify-between items-center">
                      <span className="text-rose-700 font-medium">
                        Total Budget:
                      </span>
                      <span className="text-xl font-semibold text-rose-700">
                        $
                        {parseFloat(weddingDetails.budget).toLocaleString() ||
                          "0"}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-rose-600">
                        Use the edit button above to update your budget amount.
                      </p>
                      <Button
                        variant="outline"
                        onClick={handleEditToggle}
                        className="w-full mt-2 border-rose-200 text-rose-600 hover:bg-rose-50"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Budget
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Simple Timeline */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-rose-700 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Wedding Timeline
                  </h3>

                  <div className="space-y-3">
                    {weddingDetails.date ? (
                      <div className="relative pl-8 pb-6 border-l-2 border-rose-200">
                        <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-rose-400"></div>
                        <div className="font-medium text-rose-700">
                          {getFormattedDate()}
                        </div>
                        <div className="text-sm text-rose-600">
                          Your Wedding Day
                        </div>
                        <div className="text-xs text-rose-500 mt-1">
                          {weddingDetails.time ? (
                            <>Ceremony at {weddingDetails.time}</>
                          ) : (
                            "Time not set"
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-6 bg-rose-50/50 rounded-lg border border-rose-100">
                        <p className="text-rose-600">
                          Please set a wedding date to see your timeline.
                        </p>
                        <Button
                          variant="outline"
                          onClick={handleEditToggle}
                          className="mt-4 border-rose-200 text-rose-600 hover:bg-rose-50"
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Set Wedding Date
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default WeddingPlanning;
