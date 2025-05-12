"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminService } from "@/services/api";
import { Github } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import PNG from "../../assets/images/login.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("couple");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (userType === "admin") {
        // Special handling for admin login
        try {
          const response = await adminService.login(email, password);
          if (response && response.data) {
            // Store admin info in localStorage
            localStorage.setItem("adminUser", JSON.stringify(response.data));
            navigate("/dashboard/admin/overview");
          } else {
            throw new Error("Invalid admin credentials");
          }
        } catch (error) {
          throw new Error("Invalid admin credentials");
        }
      } else {
        // Regular user login for couples and vendors
        const user = await login(email, password, userType);
        // Redirect based on user type
        if (user.userType === "vendor") {
          navigate("/dashboard/vendor");
        } else {
          navigate("/dashboard/couple");
        }
      }
    } catch (error) {
      setError(error.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-violet-100 to-white bg-fixed">
      {/* Left side - Login form */}
      <div className="w-1/2 flex flex-col justify-center px-8 py-12">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-6">
            <div className="flex items-center space-x-2">
              <div className="rounded-md bg-gray-900 p-1.5">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <rect width="24" height="24" fill="white" fillOpacity="0" />
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="text-sm font-semibold">Acme Inc.</span>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Login to your account
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Enter your email below to login to your account
            </p>
          </div>

          <div className="mb-6">
            <div className="flex rounded-md overflow-hidden border border-gray-200">
              <button
                onClick={() => setUserType("couple")}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  userType === "couple"
                    ? "bg-white text-gray-900 border-b-2 border-gray-900"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
              >
                Couple
              </button>
              <button
                onClick={() => setUserType("vendor")}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  userType === "vendor"
                    ? "bg-white text-gray-900 border-b-2 border-gray-900"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
              >
                Vendor
              </button>
              <button
                onClick={() => setUserType("admin")}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  userType === "admin"
                    ? "bg-white text-gray-900 border-b-2 border-gray-900"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <Alert variant="destructive" className="mb-4 animate-fadeIn">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </Label>
                <div className="mt-1">
                  <Input
                    id="email"
                    type="email"
                    placeholder="sam@openai.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </Label>
                </div>
                <div className="mt-1">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full justify-center rounded-md border border-transparent bg-violet-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to={`/register/${userType === "admin" ? "couple" : userType}`}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Image/placeholder area */}
      <div className="w-1/2 bg-orange-950 relative">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <img
          src={PNG}
          alt="Elderly couple sitting on a bench looking at cherry blossoms"
          className="w-full h-168 object-cover"
        />
      </div>
    </div>
  );
}

export default Login;
