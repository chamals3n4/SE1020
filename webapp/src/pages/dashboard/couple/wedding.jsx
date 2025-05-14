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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Edit, Save } from "lucide-react";
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
    weddingWebsite: "",
    theme: "",
    style: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({ ...weddingDetails });
  const [isLoading, setIsLoading] = useState(true);
  const [coupleId, setCoupleId] = useState("");
  const [partnerNames, setPartnerNames] = useState({
    partner1: "",
    partner2: "",
  });

  // Fetch wedding details
  useEffect(() => {
    const fetchWeddingDetails = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching wedding details...");

        // First check localStorage for couple data (required for ID)
        // FIXED: Use 'currentUser' instead of 'user' key
        const localUserData = localStorage.getItem("currentUser");
        const localUser = localUserData ? JSON.parse(localUserData) : null;
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
          };

          // See if there's a wedding ID in the couple data or localStorage
          if (coupleData.weddingId || localUser.weddingId) {
            const weddingId = coupleData.weddingId || localUser.weddingId;
            console.log(
              `Found wedding ID: ${weddingId}, fetching wedding data...`
            );
            try {
              // Get wedding details from the API
              const weddingResponse = await weddingService.getWeddingById(
                weddingId
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
                  location: weddingData.location || "",
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
  }, []); // Empty dependency array to run only once on mount

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
      console.log("Saving wedding details...");
      // Get the current user from localStorage
      // FIXED: Use 'currentUser' instead of 'user' key
      const localUserJson = localStorage.getItem("currentUser");
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
      localStorage.setItem("currentUser", JSON.stringify(updatedLocalUser));

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{weddingDetails.weddingName || "Our Wedding"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleEditToggle}>
            {isEditing ? "Cancel" : "Edit Details"}
          </Button>
        </CardContent>
      </Card>

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit Wedding Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Wedding Name</Label>
                <Input
                  name="weddingName"
                  value={editFormData.weddingName}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label>Wedding Style</Label>
                <Select
                  name="style"
                  onValueChange={(value) =>
                    setEditFormData((prev) => ({ ...prev, style: value }))
                  }
                  value={editFormData.style || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Not specified</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="rustic">Rustic</SelectItem>
                    <SelectItem value="beach">Beach</SelectItem>
                    <SelectItem value="garden">Garden</SelectItem>
                    <SelectItem value="elegant">Elegant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input
                    name="date"
                    type="date"
                    value={editFormData.date}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label>Time</Label>
                  <Input
                    name="time"
                    type="time"
                    value={editFormData.time}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <Label>Venue</Label>
                <Input
                  name="location"
                  value={editFormData.location}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label>Address</Label>
                <Input
                  name="address"
                  value={editFormData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label>Guest Count</Label>
                <Input
                  name="guestCount"
                  type="number"
                  value={editFormData.guestCount}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label>Budget</Label>
                <Input
                  name="budget"
                  type="number"
                  value={editFormData.budget}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea
                  name="notes"
                  value={editFormData.notes}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveChanges}>Save</Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Couple</CardTitle>
            </CardHeader>
            <CardContent>
              {partnerNames.partner1 || "partner 01 not fetched"} &{" "}
              {partnerNames.partner2 || "partner 02 not fetched"}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <strong>Date:</strong> {getFormattedDate()}
                </div>
                <div>
                  <strong>Venue:</strong>{" "}
                  {weddingDetails.location ? (
                    <span className="text-green-600">
                      {weddingDetails.location}
                    </span>
                  ) : (
                    <span className="text-gray-500">Not set</span>
                  )}
                </div>
                <div>
                  <strong>Style:</strong>{" "}
                  {weddingDetails.style
                    ? getStyleName(weddingDetails.style)
                    : "Not set"}
                </div>
                <div>
                  <strong>Budget:</strong> ${weddingDetails.budget}
                </div>
                {weddingDetails.address && (
                  <div>
                    <strong>Venue Address:</strong> {weddingDetails.address}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default WeddingPlanning;
