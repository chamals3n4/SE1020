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
import WeddingHeader from "../../components/wedding-header";
import { Building, Mail, Phone, Map, FileText, Store, CreditCard } from "lucide-react";

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
    basePrice: "",
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
        basePrice: Number(formData.basePrice) || 0,
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
        console.warn(
          "API registration failed, using local auth only:",
          apiError
        );
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
    <div className="min-h-screen bg-gradient-to-b from-violet-100 to-white bg-fixed">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-wedding-blush rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-wedding-blush rounded-full opacity-20 translate-x-1/2 translate-y-1/2 blur-3xl" />

      <div className="container max-w-6xl mx-auto px-4 py-6">
        <WeddingHeader />

        <div className="mt-2 flex items-center justify-center">
          <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-sm animate-fade-in border-none shadow-none">
            <div className="absolute top-0 right-0 w-32 h-32 bg-wedding-gold/5 rounded-bl-full"></div>

            <CardContent className="py-4">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1">
                  <Label
                    htmlFor="name"
                    className="text-gray-700 flex items-center gap-2"
                  >
                    <Building className="h-4 w-4 text-wedding-rose" />
                    Business Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your Business Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="email"
                    className="text-gray-700 flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4 text-wedding-rose" />
                    Email
                  </Label>
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
                  <div className="space-y-1">
                    <Label htmlFor="password" className="text-gray-700">
                      Password
                    </Label>
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

                  <div className="space-y-1">
                    <Label htmlFor="confirmPassword" className="text-gray-700">
                      Confirm Password
                    </Label>
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

                <div className="space-y-1">
                  <Label
                    htmlFor="phone"
                    className="text-gray-700 flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4 text-wedding-rose" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="(123) 456-7890"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="vendorType"
                    className="text-gray-700 flex items-center gap-2"
                  >
                    <Store className="h-4 w-4 text-wedding-rose" />
                    Business Type
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleSelectChange("vendorType", value)
                    }
                    value={formData.vendorType}
                  >
                    <SelectTrigger className="border-wedding-rose/20 focus:ring-wedding-rose/30">
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

                <div className="space-y-1">
                  <Label
                    htmlFor="description"
                    className="text-gray-700 flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4 text-wedding-rose" />
                    Business Description
                  </Label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="Brief description of your services"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="address"
                    className="text-gray-700 flex items-center gap-2"
                  >
                    <Map className="h-4 w-4 text-wedding-rose" />
                    Business Address
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="123 Main Street"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="basePrice"
                    className="text-gray-700 flex items-center gap-2"
                  >
                    <CreditCard className="h-4 w-4 text-wedding-rose" />
                    Base Price (LKR)
                  </Label>
                  <Input
                    id="basePrice"
                    name="basePrice"
                    type="number"
                    placeholder="Enter your base price"
                    value={formData.basePrice}
                    onChange={handleChange}
                    required
                    min="0"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full bg-violet-500"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? "Creating Account..."
                      : "Create Vendor Account"}
                  </Button>
                  <p className="text-sm text-center mt-2 text-gray-600 italic">
                    You can add your business details and services in your
                    profile after registration
                  </p>
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col space-y-2 py-2 border-t border-wedding-rose/10">
              <div className="text-sm text-center text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-wedding-burgundy font-medium hover:underline"
                >
                  Sign in
                </Link>
              </div>
              <div className="text-sm text-center text-gray-600">
                Are you a couple?{" "}
                <Link
                  to="/register/couple"
                  className="text-wedding-burgundy font-medium hover:underline"
                >
                  Register as a couple
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default VendorRegistration;
