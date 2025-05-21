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
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, parse } from "date-fns";
import { coupleService } from "@/services/api";
import { Gem, User } from "lucide-react";

function CoupleProfile() {
  const [isLoading, setIsLoading] = useState(true);
  const [weddingDate, setWeddingDate] = useState(null);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    budget: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    // Partner information
    partnerId: "",
    partnerEmail: "",
    partnerName: "",
    partnerPhone: "",
  });
  
  // Get current couple's data from session and API
  useEffect(() => {
    const fetchCoupleData = async () => {
      try {
        setIsLoading(true);
        
        // Get current user from localStorage
        const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
        
        if (!currentUser.id) {
          console.warn("No authenticated user found in session");
          setIsLoading(false);
          return;
        }
        
        // Fetch complete couple profile from API
        const response = await coupleService.getCoupleById(currentUser.id);
        const coupleData = response.data;
        
        if (!coupleData) {
          console.warn("No couple data found");
          setIsLoading(false);
          return;
        }
        
        // Set wedding date if available
        if (coupleData.weddingDate) {
          try {
            // Convert the date string to a Date object
            const dateObj = new Date(coupleData.weddingDate);
            setWeddingDate(dateObj);
          } catch (error) {
            console.error("Error parsing wedding date:", error);
          }
        }
        
        // Update profile data with API data
        setProfileData({
          name: coupleData.name || "",
          email: coupleData.email || "",
          phone: coupleData.phone || "",
          budget: coupleData.budget ? coupleData.budget.toString() : "",
          address: coupleData.address || "",
          city: coupleData.city || "",
          state: coupleData.state || "",
          zip: coupleData.zip || "",
          // Partner information
          partnerId: coupleData.partnerId || "",
          partnerName: coupleData.partnerName || "",
          partnerEmail: coupleData.partnerEmail || "",
          partnerPhone: coupleData.partnerPhone || "",
        });
      } catch (error) {
        console.error("Error fetching couple data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCoupleData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Get current user from localStorage
      const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
      
      if (!currentUser.id) {
        alert("Error: Could not determine user ID. Please sign in again.");
        return;
      }

      // Prepare data for API update
      const apiData = {
        id: currentUser.id, // Required field for the backend
        name: profileData.name,
        email: profileData.email, // Include email since it might be required by the backend
        phone: profileData.phone,
        budget: Number.parseInt(profileData.budget) || 0,
        weddingDate: weddingDate ? format(weddingDate, "yyyy-MM-dd") : null,
        address: profileData.address,
        city: profileData.city,
        state: profileData.state,
        zip: profileData.zip,
        // Partner information (if available)
        partnerId: profileData.partnerId,
        partnerName: profileData.partnerName,
        partnerEmail: profileData.partnerEmail,
        partnerPhone: profileData.partnerPhone,
      };

      console.log("Sending profile update data:", apiData);
      
      // Call the API to update couple information
      const response = await coupleService.updateCouple(currentUser.id, apiData);
      
      if (response && response.data) {
        console.log("Profile updated successfully:", response.data);
        alert("Profile updated successfully.");
        
        // Update localStorage with new user information as needed
        const updatedUser = {
          ...currentUser,
          name: apiData.name,
          email: apiData.email,
          phone: apiData.phone,
          weddingId: response.data.weddingId || currentUser.weddingId
        };
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      } else {
        console.warn("No data returned from profile update");
        alert("Profile updated, but no data was returned.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Couple Profile</h1>
        <Button onClick={handleSave} disabled={isLoading}>Save Changes</Button>
      </div>
      
      {isLoading ? (
        <div className="py-12 text-center">
          <p className="text-lg text-muted-foreground">Loading profile information...</p>
        </div>
      ) : (

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="partner">Partner Details</TabsTrigger>
          <TabsTrigger value="wedding">Wedding Details</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleChange}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={profileData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={profileData.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={profileData.state}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input
                    id="zip"
                    name="zip"
                    value={profileData.zip}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partner">
          <Card>
            <CardHeader>
              <CardTitle>Partner Information</CardTitle>
              <CardDescription>Add your partner's details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="partnerName">Partner's Full Name</Label>
                <Input
                  id="partnerName"
                  name="partnerName"
                  value={profileData.partnerName}
                  onChange={handleChange}
                  placeholder="Your partner's name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="partnerEmail">Partner's Email</Label>
                  <Input
                    id="partnerEmail"
                    name="partnerEmail"
                    type="email"
                    value={profileData.partnerEmail}
                    onChange={handleChange}
                    placeholder="partner@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="partnerPhone">Partner's Phone</Label>
                  <Input
                    id="partnerPhone"
                    name="partnerPhone"
                    value={profileData.partnerPhone}
                    onChange={handleChange}
                    placeholder="(123) 456-7890"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wedding">
          <Card>
            <CardHeader>
              <CardTitle>Wedding Details</CardTitle>
              <CardDescription>
                Information about your special day
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Wedding Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {weddingDate ? (
                          format(weddingDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={weddingDate}
                        onSelect={setWeddingDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="budget"
                    className="text-gray-700 flex items-center"
                  >
                    <Gem className="w-4 h-4 mr-2 text-violet-400" /> Wedding
                    Budget
                  </Label>
                  <Input
                    id="budget"
                    name="budget"
                    type="number"
                    value={profileData.budget}
                    onChange={handleChange}
                    required
                    className="border-gray-300 focus:border-violet-400 focus:ring focus:ring-violet-400/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="venueAddress">Venue Address (if known)</Label>
                <Input
                  id="venueAddress"
                  name="venueAddress"
                  placeholder="Wedding venue address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weddingNotes">Wedding Notes</Label>
                <Textarea
                  id="weddingNotes"
                  name="weddingNotes"
                  rows={4}
                  placeholder="Any special notes about your wedding plans"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      )}
    </div>
  );
}

export default CoupleProfile;
