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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CalendarIcon,
  Heart,
  Mail,
  Phone,
  User,
  Gem,
  MapPin,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import axios from "axios";
import WeddingHeader from "../../components/wedding-header";

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

      // Create partner object in the format expected by the backend
      const partner = {
        id: `user-${timestamp}`,
        email: formData.partnerEmail,
        password: formData.partnerPassword,
        name: `${formData.partnerFirstName} ${formData.partnerLastName}`,
        phone: formData.partnerPhone,
        role: "COUPLE" // Changed from PARTNER to COUPLE to match backend
      };

      // First, attempt to save to the backend (if backend is working)
      const coupleData = {
        id: coupleId,
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        role: "COUPLE",
        budget: parseFloat(formData.budget) || 0,
        weddingDate: weddingDate ? format(weddingDate, "yyyy-MM-dd") : null,
        style: formData.style || "",
        partnerId: partner.id, // Single partnerId string
        partner: partner, // Single partner object
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("Creating couple with data:", coupleData);

      let apiResponse;
      try {
        // Create couple in backend
        const coupleResponse = await axios.post(
          "http://localhost:8080/api/couple",
          coupleData
        );
        console.log("Couple created successfully:", coupleResponse.data);
        apiResponse = coupleResponse.data;

        // Then create the wedding with the couple's ID
        const weddingData = {
          weddingId: weddingId,
          name: `${formData.firstName} & ${formData.partnerFirstName}'s Wedding`,
          date: weddingDate ? format(weddingDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'") : null,
          coupleId: coupleId,
          budget: parseFloat(formData.budget) || 0,
          style: formData.style ? formData.style.toUpperCase() : "TRADITIONAL",
          location: "",
          tasks: []
        };

        console.log("Creating wedding with data:", weddingData);

        // Create wedding in backend
        const weddingResponse = await axios.post(
          "http://localhost:8080/api/wedding/profile",
          weddingData
        );
        console.log("Wedding created successfully:", weddingResponse.data);

        // Register with our auth context (stores in localStorage)
        // Use the IDs from API response if available, otherwise use our generated IDs
        const userData = {
          id: apiResponse?.id || coupleId,
          email: formData.email,
          name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          role: "COUPLE",
          // Store partner information in the format expected by the frontend
          partner: apiResponse?.partner || partner,
          partnerId: apiResponse?.partnerId || partner.id,
          // Wedding details
          budget: parseFloat(formData.budget) || 0,
          weddingDate: weddingDate ? format(weddingDate, "yyyy-MM-dd") : null,
          weddingId: weddingResponse.data.weddingId || weddingId,
          style: formData.style || "",
          // Timestamps
          createdAt: new Date().toISOString(),
        };

        console.log('Storing user data in localStorage:', userData);
        await register(userData, "couple");

        // Registration and auto-login successful, navigate to dashboard
        navigate("/dashboard/couple");
      } catch (error) {
        console.error("Registration failed:", error);
        alert("Registration failed. Please try again.");
        throw error;
      } finally {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      // You could show an error toast/message here
    }
  };

  const FormDivider = () => (
    <div className="flex items-center my-8">
      <div className="flex-grow h-px bg-gray-200"></div>
      <div className="mx-4 flex items-center">
        <Heart className="w-4 h-4 text-violet-400 mr-2" />
        <span className="text-sm font-medium text-gray-500">
          Partner Details
        </span>
      </div>
      <div className="flex-grow h-px bg-gray-200"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-100 to-white bg-fixed">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-wedding-blush rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-wedding-blush rounded-full opacity-20 translate-x-1/2 translate-y-1/2 blur-3xl" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <WeddingHeader />

        <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm animate-fade-in border-none shadow-none">
          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First column */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-violet-400" />
                    Your Information
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-gray-700">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="border-gray-300 focus:border-violet-400 focus:ring focus:ring-violet-400/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-gray-700">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="border-gray-300 focus:border-violet-400 focus:ring focus:ring-violet-400/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-gray-700 flex items-center"
                    >
                      <Mail className="w-4 h-4 mr-2 text-violet-400" /> Email
                      Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="border-gray-300 focus:border-violet-400 focus:ring focus:ring-violet-400/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-gray-700 flex items-center"
                    >
                      <Phone className="w-4 h-4 mr-2 text-violet-400" /> Phone
                      Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="border-gray-300 focus:border-violet-400 focus:ring focus:ring-violet-400/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-700">
                        Password
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="border-gray-300 focus:border-violet-400 focus:ring focus:ring-violet-400/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-gray-700"
                      >
                        Confirm Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="border-gray-300 focus:border-violet-400 focus:ring focus:ring-violet-400/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Second column */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-violet-400" />
                    Wedding Details
                  </h3>

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
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="Enter budget amount"
                      required
                      className="border-gray-300 focus:border-violet-400 focus:ring focus:ring-violet-400/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="weddingDate"
                      className="text-gray-700 flex items-center"
                    >
                      <CalendarIcon className="w-4 h-4 mr-2 text-violet-400" />{" "}
                      Wedding Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal border-gray-300 hover:bg-wedding-blush/10 hover:text-violet-400"
                        >
                          {weddingDate ? (
                            format(weddingDate, "PPP")
                          ) : (
                            <span className="text-gray-500">Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 border-violet-400/20"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={weddingDate}
                          onSelect={setWeddingDate}
                          disabled={(date) =>
                            date < new Date() || date > new Date("2030-01-01")
                          }
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="style"
                      className="text-gray-700 flex items-center"
                    >
                      <MapPin className="w-4 h-4 mr-2 text-violet-400" />{" "}
                      Wedding Style
                    </Label>
                    <Select
                      name="style"
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, style: value }))
                      }
                      value={formData.style}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-violet-400 focus:ring focus:ring-violet-400/20">
                        <SelectValue placeholder="Select a wedding style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TRADITIONAL">Traditional</SelectItem>
                        <SelectItem value="RUSTIC">Rustic</SelectItem>
                        <SelectItem value="BEACH">Beach</SelectItem>
                        <SelectItem value="ELEGANT">Elegant</SelectItem>
                        <SelectItem value="MODERN">Modern</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <FormDivider />

              {/* Partner Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="partnerFirstName"
                        className="text-gray-700"
                      >
                        First Name
                      </Label>
                      <Input
                        id="partnerFirstName"
                        name="partnerFirstName"
                        value={formData.partnerFirstName}
                        onChange={handleChange}
                        required
                        className="border-gray-300 focus:border-violet-400 focus:ring focus:ring-violet-400/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="partnerLastName"
                        className="text-gray-700"
                      >
                        Last Name
                      </Label>
                      <Input
                        id="partnerLastName"
                        name="partnerLastName"
                        value={formData.partnerLastName}
                        onChange={handleChange}
                        required
                        className="border-gray-300 focus:border-violet-400 focus:ring focus:ring-violet-400/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="partnerEmail"
                      className="text-gray-700 flex items-center"
                    >
                      <Mail className="w-4 h-4 mr-2 text-violet-400" /> Email
                      Address
                    </Label>
                    <Input
                      id="partnerEmail"
                      name="partnerEmail"
                      type="email"
                      value={formData.partnerEmail}
                      onChange={handleChange}
                      required
                      className="border-gray-300 focus:border-violet-400 focus:ring focus:ring-violet-400/20"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="partnerPassword" className="text-gray-700">
                      Password
                    </Label>
                    <Input
                      id="partnerPassword"
                      name="partnerPassword"
                      type="password"
                      value={formData.partnerPassword}
                      onChange={handleChange}
                      required
                      className="border-gray-300 focus:border-violet-400 focus:ring focus:ring-violet-400/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="partnerPhone"
                      className="text-gray-700 flex items-center"
                    >
                      <Phone className="w-4 h-4 mr-2 text-violet-400" /> Phone
                      Number
                    </Label>
                    <Input
                      id="partnerPhone"
                      name="partnerPhone"
                      value={formData.partnerPhone}
                      onChange={handleChange}
                      required
                      className="border-gray-300 focus:border-violet-400 focus:ring focus:ring-violet-400/20"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full bg-violet-500"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Creating Account..."
                    : "Begin Your Wedding Journey"}
                </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 border-t pt-6 bg-gray-50/50">
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
              Are you a vendor?{" "}
              <Link
                to="/register/vendor"
                className="text-wedding-burgundy font-medium hover:underline"
              >
                Register as a vendor
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default CoupleRegistration;
