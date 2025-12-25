import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdPerson,
  MdEmail,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import styles from "./SignupPage.module.css";
import api from "../../utils/api";
import Swal from "sweetalert2";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    terms: "",
    general: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
      fullName: "",
      email: "",
      password: "",
      terms: "",
      general: "",
    };
    let isValid = true;

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      isValid = false;
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
      isValid = false;
    }

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
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(formData.password)) {
      newErrors.password = "Include 1 uppercase & 1 special character";
      isValid = false;
    }

    // Terms validation
    if (!formData.agreeTerms) {
      newErrors.terms = "You must agree to the terms and privacy policy";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Show loading animation with SweetAlert
      Swal.fire({
        title: "Creating Account...",
        html: "Please wait while we set up your account",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Prepare data for API
      const signupData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      };

      // Make API call using your axios instance
      await api.post("/signup", signupData);

      // Close loading alert
      Swal.close();

      // Navigate to OTP verification page
      navigate("/otp", {
        state: {
          email: formData.email,
          type: "Signup",
        },
      });
    } catch (error: any) {
      // Close loading alert
      Swal.close();

      // Handle API errors
      let errorMessage = "Signup failed. Please try again.";

      if (error.response) {
        if (error.response.status === 409) {
          errorMessage =
            "This email is already registered. Please use a different email or login.";
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error;
        }
      }

      // Show error with SweetAlert
      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        html: `
          <div style="text-align: center;">
            <div style="font-size: 48px; margin-bottom: 20px;">😕</div>
            <p>${errorMessage}</p>
          </div>
        `,
        confirmButtonText: "Try Again",
        confirmButtonColor: "#3085d6",
        showClass: {
          popup: "animate__animated animate__shakeX",
        },
      });

      console.error("Signup error:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleTermsClick = () => {
    Swal.fire({
      title: "Terms & Conditions",
      html: `
        <div style="text-align: left; max-height: 300px; overflow-y: auto;">
          <h4>Welcome to Brico Construction Network</h4>
          <p>By creating an account, you agree to:</p>
          <ul>
            <li>Provide accurate information</li>
            <li>Maintain account security</li>
            <li>Use the platform for legitimate construction purposes</li>
            <li>Respect other users' privacy and rights</li>
          </ul>
          <p><strong>Privacy Policy:</strong> We protect your data according to industry standards.</p>
        </div>
      `,
      showCancelButton: false,
      confirmButtonText: "I Understand",
      confirmButtonColor: "#3085d6",
      width: "500px",
    });
  };

  const handlePrivacyClick = () => {
    Swal.fire({
      title: "Privacy Policy",
      html: `
        <div style="text-align: left; max-height: 300px; overflow-y: auto;">
          <h4>Your Privacy Matters</h4>
          <p>We collect and use your information to:</p>
          <ul>
            <li>Provide and improve our services</li>
            <li>Verify your identity for security</li>
            <li>Send important updates about your account</li>
            <li>Personalize your experience</li>
          </ul>
          <p>We never sell your personal data to third parties.</p>
        </div>
      `,
      showCancelButton: false,
      confirmButtonText: "Got It",
      confirmButtonColor: "#3085d6",
      width: "500px",
    });
  };

  return (
    <div className={styles.container}>
      {/* Fixed Navigation */}
      <header className={styles.header}>
        <button
          className={styles.backBtn}
          onClick={() => navigate(-1)}
          disabled={isLoading}
        >
          <MdArrowBack size={24} />
        </button>
      </header>

      <main className={styles.mainContent}>
        {/* Header Section */}
        <div className={styles.topSection}>
          <h1 className={styles.title}>
            Create Your <br />
            <span className={styles.highlight}>Brico</span> Account
          </h1>
          <p className={styles.subtitle}>Join the best construction network.</p>
        </div>

        {/* Form Area - Carefully Spaced */}
        <form className={styles.form} onSubmit={handleSignup}>
          {/* Full Name Field */}
          <div className={styles.inputGroup}>
            <label>Full Name</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                name="fullName"
                placeholder="e.g., Abdullah Engr"
                className={`${styles.inputField} ${
                  errors.fullName ? styles.inputError : ""
                }`}
                value={formData.fullName}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <MdPerson className={styles.inputIcon} size={20} />
            </div>
            {errors.fullName && (
              <span className={styles.errorText}>{errors.fullName}</span>
            )}
          </div>

          {/* Email Field */}
          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <div className={styles.inputWrapper}>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                className={`${styles.inputField} ${
                  errors.email ? styles.inputError : ""
                }`}
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <MdEmail className={styles.inputIcon} size={20} />
            </div>
            {errors.email && (
              <span className={styles.errorText}>{errors.email}</span>
            )}
          </div>

          {/* Password Field */}
          <div className={styles.inputGroup}>
            <label>Password</label>
            <div className={styles.inputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Min. 8 characters"
                className={`${styles.inputField} ${
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

            {/* Password strength indicator */}
            {formData.password.length > 0 && !errors.password && (
              <div className={styles.passwordStrength}>
                <div className={styles.strengthBar}>
                  <div
                    className={`${styles.strengthFill} ${
                      formData.password.length >= 8 &&
                      /(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(formData.password)
                        ? styles.strong
                        : formData.password.length >= 6
                        ? styles.medium
                        : styles.weak
                    }`}
                    style={{
                      width: `${Math.min(
                        (formData.password.length / 12) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
                <span className={styles.strengthText}>
                  {formData.password.length >= 8 &&
                  /(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(formData.password)
                    ? "Strong password"
                    : formData.password.length >= 6
                    ? "Medium strength"
                    : "Weak password"}
                </span>
              </div>
            )}
          </div>

          {/* Terms */}
          <div className={styles.termsWrapper}>
            <input
              type="checkbox"
              id="terms"
              name="agreeTerms"
              className={`${styles.checkbox} ${
                errors.terms ? styles.checkboxError : ""
              }`}
              checked={formData.agreeTerms}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <label htmlFor="terms" className={isLoading ? styles.disabled : ""}>
              I agree to the{" "}
              <span className={styles.linkText} onClick={handleTermsClick}>
                Terms
              </span>{" "}
              &{" "}
              <span className={styles.linkText} onClick={handlePrivacyClick}>
                Privacy
              </span>
            </label>
            {errors.terms && (
              <span className={styles.errorText}>{errors.terms}</span>
            )}
          </div>

          {/* General Error */}
          {errors.general && (
            <div className={styles.generalError}>
              <span>{errors.general}</span>
            </div>
          )}

          {/* CTA Button */}
          <button
            type="submit"
            className={`${styles.signupBtn} ${isLoading ? styles.loading : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner}></span>
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* Social & Footer */}
        <div className={styles.footerArea}>
          <p className={styles.loginText}>
            Already have an account?{" "}
            <span
              onClick={() => !isLoading && navigate("/login")}
              className={`${styles.loginLink} ${
                isLoading ? styles.disabled : ""
              }`}
            >
              Log In
            </span>
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;
