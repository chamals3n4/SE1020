"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminService } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 to-purple-50 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md">
        <Card className="w-full overflow-hidden border-none bg-white shadow-xl">
          <CardContent className="p-0">
            <div className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Welcome Back
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Enter your credentials to access your account
                </p>
              </div>

              <div className="mb-6">
                <div className="flex rounded-md overflow-hidden border border-gray-200">
                  <button
                    onClick={() => setUserType("couple")}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${
                      userType === "couple"
                        ? "bg-white text-gray-900"
                        : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    Couple
                  </button>
                  <button
                    onClick={() => setUserType("vendor")}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${
                      userType === "vendor"
                        ? "bg-white text-gray-900"
                        : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    Vendor
                  </button>
                  <button
                    onClick={() => setUserType("admin")}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${
                      userType === "admin"
                        ? "bg-white text-gray-900"
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
                      className="text-sm font-medium text-gray-700"
                    >
                      Email
                    </Label>
                    <div className="mt-1 relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11 w-full rounded-md border border-gray-200 bg-white text-sm text-gray-900 shadow-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="password"
                        className="text-sm font-medium text-gray-700"
                      >
                        Password
                      </Label>
                    </div>
                    <div className="mt-1 relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 h-11 w-full rounded-md border border-gray-200 bg-white text-sm text-gray-900 shadow-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-rose-600 hover:bg-rose-700 text-white transition-all duration-200 rounded-md flex items-center justify-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Logging in...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Login
                      </span>
                    )}
                  </Button>

                  <div className="text-center text-sm mt-4">
                    Don't have an account?{" "}
                    <Link
                      to={`/register/${
                        userType === "admin" ? "couple" : userType
                      }`}
                      className="font-medium text-rose-600 hover:text-rose-700 transition-colors"
                    >
                      Register as a {userType === "admin" ? "couple" : userType}
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Wedding Planner. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default Login;
