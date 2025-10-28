import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { authservices, setCookie, getCookie } from '../services/api';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setApiError('');
    setSuccessMessage('');

    try {
      const response = await authservices.login({
        username: data.username,
        password: data.password,
      });

      console.log("Login success:", response);

      const { accessToken, refreshToken, user } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      setCookie("accessToken", accessToken, 1);
      setCookie("refreshToken", refreshToken, 7);

      console.log('accessToken from cookie:', getCookie('accessToken'));
      console.log('refreshToken from cookie:', getCookie('refreshToken'));

      setSuccessMessage("Login successful! Redirecting...");
      
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
      
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.response) {
        const errorData = error.response.data;
        
        if (errorData.errors && errorData.errors.length > 0) {
          const errorMessages = errorData.errors.map(err => {
            const field = Object.keys(err)[0];
            const message = err[field];
            return `${field}: ${message}`;
          });
          setApiError(errorMessages.join(', '));
        } else {
          const errorMessage = errorData?.message || 'Login failed. Please try again.';
          setApiError(errorMessage);
        }
      } else if (error.request) {
        setApiError('Network error. Please check your connection and try again.');
      } else {
        setApiError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-dvh bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

       
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">{successMessage}</p>
          </div>
        )}

       
        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register('username', { 
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters long'
                }
              })}
              type="text"
              className="w-full px-4 py-3 border-b border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors duration-200 bg-transparent"
              placeholder="Username"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-rose-500">{errors.username.message}</p>
            )}
          </div>

          <div className="relative">
            <input
              {...register('password', { 
                required: 'Password is required',
                minLength: { 
                  value: 6, 
                  message: 'Password must be at least 6 characters' 
                }
              })}
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-3 border-b border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors duration-200 bg-transparent pr-10"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible className="w-5 h-5" />
              ) : (
                <AiOutlineEye className="w-5 h-5" />
              )}
            </button>
            {errors.password && (
              <p className="mt-1 text-sm text-rose-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gray-900 text-white py-3 px-4 font-medium hover:bg-black transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6 flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-gray-900 font-medium underline hover:text-gray-700">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

//gisytez
//Pa$$w0rd!
