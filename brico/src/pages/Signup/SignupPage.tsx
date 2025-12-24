import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdPerson,
  MdEmail,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import styles from "./SignupPage.module.css";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.container}>
      {/* Fixed Navigation */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
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
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.inputGroup}>
            <label>Full Name</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                placeholder="e.g., Abdullah Engr"
                className={styles.inputField}
              />
              <MdPerson className={styles.inputIcon} size={20} />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <div className={styles.inputWrapper}>
              <input
                type="email"
                placeholder="name@example.com"
                className={styles.inputField}
              />
              <MdEmail className={styles.inputIcon} size={20} />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <div className={styles.inputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                className={styles.inputField}
              />
              <button
                type="button"
                className={styles.toggleBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <MdVisibilityOff size={20} />
                ) : (
                  <MdVisibility size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className={styles.termsWrapper}>
            <input type="checkbox" id="terms" className={styles.checkbox} />
            <label htmlFor="terms">
              I agree to the <span className={styles.linkText}>Terms</span> &{" "}
              <span className={styles.linkText}>Privacy</span>
            </label>
          </div>

          {/* CTA Button */}
          <button type="submit" className={styles.signupBtn}>
            Sign Up
          </button>
        </form>

        {/* Social & Footer */}
        <div className={styles.footerArea}>
          <div className={styles.divider}>
            <span>Or sign up with</span>
          </div>

          <button className={styles.googleBtn}>
            <FcGoogle size={20} />
            <span>Google</span>
          </button>

          <p className={styles.loginText}>
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className={styles.loginLink}
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
