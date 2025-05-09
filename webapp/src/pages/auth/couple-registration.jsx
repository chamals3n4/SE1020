import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import axios from "axios";

function CoupleRegistration() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [weddingDate, setWeddingDate] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    budget: "",
    partnerFirstName: "",
    partnerLastName: "",
    partnerEmail: "",
    partnerPassword: "",
    partnerPhone: "",
    style: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate password match
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        setIsLoading(false);
        return;
      }

      // Create consistent IDs upfront using a single timestamp
      // This ensures related entities have coordinated IDs
      const timestamp = Date.now();
      const coupleId = `couple-${timestamp}`;
      const weddingId = `wedding-${timestamp}`;
      
      // Generate a separate ID for each partner to support multiple partners
      // For now we have one partner, but this approach allows for more partners in the future
      const partners = [
        {
          id: `partner-${timestamp}-1`, // Using numbered IDs for partners
          email: formData.partnerEmail,
          password: formData.partnerPassword,
          firstName: formData.partnerFirstName,
          lastName: formData.partnerLastName,
          name: `${formData.partnerFirstName} ${formData.partnerLastName}`,
          phone: formData.partnerPhone,
          role: "PARTNER",
          coupleId: coupleId, // Reference back to the couple
          weddingId: weddingId, // Reference to the wedding
          createdAt: new Date().toISOString()
        }
      ];
      
      // First, attempt to save to the backend (if backend is working)
      const apiData = {
        id: coupleId,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        role: "COUPLE",
        budget: parseFloat(formData.budget) || 0,
        weddingDate: weddingDate ? format(weddingDate, "yyyy-MM-dd") : null,
        style: formData.style || "",
        weddingId: weddingId,
        // Store array of partner IDs instead of a single partnerId
        partnerIds: partners.map(p => p.id),
        // Include full partner objects
        partners: partners,
        // Created and updated timestamps
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      let apiResponse = null;
      
      try {
        // Send to backend API
        const response = await axios.post("http://localhost:8080/api/couple", apiData);
        apiResponse = response.data;
        console.log("API registration successful:", apiResponse);
      } catch (apiError) {
        console.warn("API registration failed, using local auth only:", apiError);
        // Continue with local auth even if API fails
      }
      
      // Register with our auth context (stores in localStorage)
      // Use the IDs from API response if available, otherwise use our generated IDs
      const userData = {
        id: apiResponse?.id || coupleId,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        role: "COUPLE",
        // Support multiple partners in a consistent way
        partners: apiResponse?.partners || partners,
        // For backward compatibility with existing code
        partnerName: `${formData.partnerFirstName} ${formData.partnerLastName}`,
        partnerId: partners[0].id,
        // Wedding details
        budget: parseFloat(formData.budget) || 0,
        weddingDate: weddingDate ? format(weddingDate, "yyyy-MM-dd") : null,
        weddingId: apiResponse?.weddingId || weddingId,
        style: formData.style || "",
        // Timestamps
        createdAt: new Date().toISOString()
      };
      
      await register(userData, "couple");
      
      // Registration and auto-login successful, navigate to dashboard
      navigate("/dashboard/couple");
    } catch (error) {
      console.error("Registration failed:", error);
      // You could show an error toast/message here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Couple Registration
          </CardTitle>
          <CardDescription>
            Create an account to plan your perfect wedding
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Your First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Your Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Your Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Your Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Wedding Budget</Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                value={formData.budget}
                onChange={handleChange}
                placeholder="Enter budget amount"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weddingDate">Wedding Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {weddingDate ? (
                        format(weddingDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={weddingDate}
                      onSelect={setWeddingDate}
                      disabled={(date) =>
                        date < new Date() || date > new Date("2030-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="style">Wedding Style</Label>
              <Select 
                name="style" 
                onValueChange={(value) => setFormData(prev => ({ ...prev, style: value }))} 
                value={formData.style}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a wedding style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic">Classic & Traditional</SelectItem>
                  <SelectItem value="rustic">Rustic & Country</SelectItem>
                  <SelectItem value="beach">Beach & Coastal</SelectItem>
                  <SelectItem value="garden">Garden & Outdoor</SelectItem>
                  <SelectItem value="modern">Modern & Minimalist</SelectItem>
                  <SelectItem value="vintage">Vintage & Retro</SelectItem>
                  <SelectItem value="bohemian">Bohemian & Whimsical</SelectItem>
                  <SelectItem value="glamorous">Glamorous & Luxury</SelectItem>
                  <SelectItem value="destination">Destination Wedding</SelectItem>
                  <SelectItem value="themed">Themed Wedding</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
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
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <hr className="my-4" />
            <h3 className="text-lg font-semibold">Partner Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="partnerFirstName">Partner First Name</Label>
                <Input
                  id="partnerFirstName"
                  name="partnerFirstName"
                  value={formData.partnerFirstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="partnerLastName">Partner Last Name</Label>
                <Input
                  id="partnerLastName"
                  name="partnerLastName"
                  value={formData.partnerLastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="partnerEmail">Partner Email</Label>
              <Input
                id="partnerEmail"
                name="partnerEmail"
                type="email"
                value={formData.partnerEmail}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="partnerPassword">Partner Password</Label>
              <Input
                id="partnerPassword"
                name="partnerPassword"
                type="password"
                value={formData.partnerPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="partnerPhone">Partner Phone</Label>
              <Input
                id="partnerPhone"
                name="partnerPhone"
                value={formData.partnerPhone}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-1 border-t pt-6">
          <div className="text-sm text-center text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </div>
          <div className="text-sm text-center text-gray-500">
            Are you a vendor?{" "}
            <Link
              to="/register/vendor"
              className="text-primary font-medium hover:underline"
            >
              Register as a vendor
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default CoupleRegistration;
