"use client";

import React, { useEffect, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import api from "../utils/api";
import Swal from "sweetalert2";

const LoginPage = () => {
  const backgroundImage = "/montreal-dusk.jpg";
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    Swal.fire({
      title: "Logging in...",
      text: "Please wait while we verify your account.",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await api.post("/login", {
        email,
        password,
      });

      Swal.fire({
        icon: "success",
        title: "Account Verify!",
        text: "Check your email for OTP verification.",
        timer: 2000,
        showConfirmButton: false,
      });

      router.push(`/verify-otp?email=${email}&type=login`);
    } catch (e: any) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: e.response?.data?.message || "Something went wrong!",
        confirmButtonColor: "#ff8c00",
      });
      console.log(e);
    }
  };

  const handleGoogleLogin = () => {
    router.push("/api/auth/google");
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className={styles.inputGroup}>
            <input
              type="password"
              className={styles.input}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
