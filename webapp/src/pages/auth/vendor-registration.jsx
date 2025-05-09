"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function VendorRegistration() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    vendorType: "",
    description: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // First, attempt to save to the backend if it's available
      const apiData = {
        id: `vendor-${Date.now()}`,
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        role: "VENDOR",
        vendorType: formData.vendorType,
        description: formData.description || "N/A",
        address: formData.address || "N/A",
        rating: 0.0,
        isAvailable: true,
      };

      try {
        const response = await fetch("http://localhost:8080/api/vendor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
        });

        if (!response.ok) throw new Error("Failed to register vendor");
        console.log("API registration successful");
      } catch (apiError) {
        console.warn("API registration failed, using local auth only:", apiError);
        // Continue with local auth even if API fails
      }

      // Register with our auth context (stores in localStorage)
      const userData = {
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        vendorType: formData.vendorType,
        description: formData.description || "N/A",
        address: formData.address || "N/A",
      };
      
      await register(userData, "vendor");
      
      // Registration and auto-login successful, navigate to dashboard
      navigate("/dashboard/vendor");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Vendor registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-0.5 py-4">
          <CardTitle className="text-2xl font-bold text-center">
            Vendor Registration
          </CardTitle>
          <CardDescription className="text-center">
            Create an account to showcase your services to couples
          </CardDescription>
        </CardHeader>
        <CardContent className="py-3">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="name">Business Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Your Business Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="(123) 456-7890"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendorType">Business Type</Label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("vendorType", value)
                }
                value={formData.vendorType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PHOTOGRAPHY">Photography</SelectItem>
                  <SelectItem value="VENUE">Venue</SelectItem>
                  <SelectItem value="CATERING">Catering</SelectItem>
                  <SelectItem value="FLORIST">Florist</SelectItem>
                  <SelectItem value="ENTERTAINMENT">
                    DJ/Entertainment
                  </SelectItem>
                  <SelectItem value="PLANNING">Wedding Planner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Business Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Brief description of your services"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Business Address</Label>
              <Input
                id="address"
                name="address"
                placeholder="123 Main Street"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Vendor Account"}
              </Button>
              <p className="text-sm text-center mt-2 text-muted-foreground">
                You can add your business details and services in your profile
                after registration
              </p>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-1 py-3">
          <div className="text-sm text-center text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-primary underline">
              Sign in
            </Link>
          </div>
          <div className="text-sm text-center text-gray-500">
            Are you a couple?{" "}
            <Link to="/register/couple" className="text-primary underline">
              Register as a couple
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default VendorRegistration;
