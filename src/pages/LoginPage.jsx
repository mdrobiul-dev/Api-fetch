import React, { useState } from "react";
import { authservices } from "../services/api";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle form submit - FIXED THIS FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // FIX: Remove the URL parameter, just pass the data object
      const response = await authservices.login({
        username: formData.username,
        password: formData.password,
      });

      console.log("Login success:", response);
      setSuccessMsg("Login successful!");
      
      // Store token if available in response
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }
      
      // You can redirect user after successful login
      // navigate('/dashboard'); // if using React Router
      
    } catch (error) {
      console.error("Login error:", error);
      
      // Enhanced error handling
      if (error.response) {
        const errorData = error.response.data;
        
        // Check if there are specific field errors
        if (errorData.errors && errorData.errors.length > 0) {
          const errorMessages = errorData.errors.map(err => {
            const field = Object.keys(err)[0];
            const message = err[field];
            return `${field}: ${message}`;
          });
          setErrorMsg(errorMessages.join(', '));
        } else {
          // Use the general message
          setErrorMsg(errorData?.message || "Invalid username or password");
        }
      } else if (error.request) {
        setErrorMsg("Network error. Please check your connection.");
      } else {
        setErrorMsg("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              required
              minLength={3}
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              required
              minLength={6}
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm text-center">{errorMsg}</p>
            </div>
          )}
          
          {successMsg && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm text-center">{successMsg}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
