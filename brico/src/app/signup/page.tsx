"use client";
import React from "react";
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";
import styles from "./page.module.css";

const SignupPage = () => {
  const backgroundImage = "/montreal-dusk.jpg";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup form submitted");
  };

  const handleGoogleSignup = () => {
    console.log("Google signup clicked");
  };

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className={styles.overlay}></div>

      {/* Compact Form Card */}
      <div className={styles.formCard}>
        {/* BRICO Heading - Compact */}
        <h1 className={styles.logo}>BRICO</h1>

        {/* Form Title - Compact */}
        <h2 className={styles.title}>Create Your Account</h2>

        {/* Compact Form */}
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Compact Input Fields */}
          <div className={styles.inputGroup}>
            <input
              type="text"
              className={styles.input}
              placeholder="Full Name"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="email"
              className={styles.input}
              placeholder="Email Address"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              className={styles.input}
              placeholder="Password"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              className={styles.input}
              placeholder="Confirm Password"
              required
            />
          </div>

          {/* SIGN UP Button */}
          <button type="submit" className={styles.signupButton}>
            SIGN UP
          </button>
        </form>

        {/* Compact Divider */}
        <div className={styles.divider}>
          <div className={styles.dividerLine}></div>
          <span className={styles.orText}>OR</span>
          <div className={styles.dividerLine}></div>
        </div>

        {/* Google Button */}
        <button
          className={styles.googleButton}
          onClick={handleGoogleSignup}
          type="button"
        >
          <FaGoogle className={styles.googleIcon} />
          Continue with Google
        </button>

        {/* Login Link */}
        <p className={styles.loginLink}>
          Already have an account?{" "}
          <Link href="/" className={styles.loginText}>
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
