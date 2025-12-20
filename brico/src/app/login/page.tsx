"use client";

import React from "react";
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";
import styles from "./page.module.css";

const LoginPage = () => {
  const backgroundImage = "/montreal-dusk.jpg";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login form submitted");
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
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

      {/* Compact Login Form Card */}
      <div className={styles.formCard}>
        {/* BRICO Heading */}
        <h1 className={styles.logo}>BRICO</h1>

        {/* Form Title */}
        <h2 className={styles.title}>Log In to Your Account</h2>

        {/* Login Form */}
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className={styles.inputGroup}>
            <input
              type="email"
              className={styles.input}
              placeholder="Email Address"
              required
            />
          </div>

          {/* Password Input */}
          <div className={styles.inputGroup}>
            <input
              type="password"
              className={styles.input}
              placeholder="Password"
              required
            />
          </div>

          {/* Forgot Password Link */}
          <div className={styles.forgotPassword}>
            <Link href="/forgot-password" className={styles.forgotLink}>
              Forgot Password?
            </Link>
          </div>

          {/* LOG IN Button */}
          <button type="submit" className={styles.loginButton}>
            LOG IN
          </button>
        </form>

        {/* Divider */}
        <div className={styles.divider}>
          <div className={styles.dividerLine}></div>
          <span className={styles.orText}>OR</span>
          <div className={styles.dividerLine}></div>
        </div>

        {/* Google Button */}
        <button
          className={styles.googleButton}
          onClick={handleGoogleLogin}
          type="button"
        >
          <FaGoogle className={styles.googleIcon} />
          Continue with Google
        </button>

        {/* Sign Up Link */}
        <p className={styles.signupLink}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className={styles.signupText}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
