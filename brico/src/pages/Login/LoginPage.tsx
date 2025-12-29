import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdConstruction,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import styles from "./LoginPage.module.css";
import api from "../../utils/api";
import Swal from "sweetalert2";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
      general: "",
    };
    let isValid = true;

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Show loading animation with SweetAlert
      Swal.fire({
        title: "Logging in...",
        html: "Please wait while we authenticate your account",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Make API call using your axios instance
      await api.post("/auth/login", formData);

      // Close loading alert
      Swal.close();

      setTimeout(() => {
        navigate("/otp", {
          state: {
            email: formData.email,
            type: "Login",
          },
        });
      }, 1500);
    } catch (error: any) {
      // Close loading alert
      Swal.close();

      // Handle API errors
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Login failed. Please try again.";

      // Show error with SweetAlert
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: errorMessage,
        confirmButtonText: "Try Again",
        confirmButtonColor: "#3085d6",
      });

      console.error("Login error:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleForgotPassword = () => {
    Swal.fire({
      title: "Reset Password",
      input: "email",
      inputLabel: "Enter your email address",
      inputPlaceholder: "Enter your email",
      showCancelButton: true,
      confirmButtonText: "Send Reset Link",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      showLoaderOnConfirm: true,
      preConfirm: async (email) => {
        try {
          const response = await api.post("/auth/forgot-password", { email });
          return response.data;
        } catch (error: any) {
          Swal.showValidationMessage(
            `Request failed: ${error.response?.data?.message || "Server error"}`
          );
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Email Sent!",
          text: "Check your email for password reset instructions",
          confirmButtonColor: "#3085d6",
        });
      }
    });
  };

  return (
    <div className={styles.container}>
      {/* Fixed Header */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <MdArrowBack size={24} />
        </button>
      </header>

      <main className={styles.mainContent}>
        {/* Logo & Headline Area */}
        <div className={styles.topSection}>
          <div className={styles.logoBox}>
            <MdConstruction size={28} color="white" />
          </div>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Manage your projects easily.</p>
        </div>

        {/* Form Area */}
        <form className={styles.form} onSubmit={handleLogin}>
          {/* Email Field */}
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="user@example.com"
              className={`${styles.inputField} ${
                errors.email ? styles.inputError : ""
              }`}
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            {errors.email && (
              <span className={styles.errorText}>{errors.email}</span>
            )}
          </div>

          {/* Password Field */}
          <div className={styles.inputGroup}>
            <label>Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                className={`${styles.passwordInput} ${
                  errors.password ? styles.inputError : ""
                }`}
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <button
                type="button"
                className={styles.toggleBtn}
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <MdVisibilityOff size={20} />
                ) : (
                  <MdVisibility size={20} />
                )}
              </button>
            </div>
            {errors.password && (
              <span className={styles.errorText}>{errors.password}</span>
            )}
          </div>

          {/* Forgot Password */}
          <div className={styles.forgotPass}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleForgotPassword();
              }}
            >
              Forgot Password?
            </a>
          </div>

          {/* General Error */}
          {errors.general && (
            <div className={styles.generalError}>
              <span>{errors.general}</span>
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className={`${styles.loginBtn} ${isLoading ? styles.loading : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner}></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Bottom Link */}
        <footer className={styles.footer}>
          <p>
            Don't have an account?{" "}
            <span
              onClick={() => !isLoading && navigate("/signup")}
              className={`${styles.signUpLink} ${
                isLoading ? styles.disabled : ""
              }`}
            >
              Sign Up
            </span>
          </p>
        </footer>
      </main>
    </div>
  );
};

export default LoginPage;
