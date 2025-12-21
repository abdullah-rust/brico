"use client";
import React, { useEffect, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import api from "../utils/api";
import Swal from "sweetalert2";

const SignupPage = () => {
  const backgroundImage = "/montreal-dusk.jpg";
  const router = useRouter();

  // States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Password Match Validation
    if (password !== confirmPassword) {
      return Swal.fire({
        icon: "error",
        title: "Wait bro!",
        text: "Passwords do not match.",
        confirmButtonColor: "#ff8c00",
      });
    }

    // 2. Start Loading
    Swal.fire({
      title: "Creating Account...",
      text: "We are verifying your account, please wait a moment.",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      // 3. API Call
      const response = await api.post("/signup", {
        fullName,
        email,
        password,
      });

      // 4. Success Response
      Swal.fire({
        icon: "success",
        title: "Account Created!",
        text: "Check your email for OTP verification.",
        timer: 2000,
        showConfirmButton: false,
      });

      // Signup ke baad direct OTP page par bhejein (kyunke aapka architecture hai)
      // OTP page par email pass kar sakte hain state ke zariye
      router.push(`/verify-otp?email=${email}&type=signup`);
    } catch (e: any) {
      // 5. Error Handling
      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: e.response?.data?.message || "Internal Server Error. Try again!",
        confirmButtonColor: "#ff8c00",
      });
      console.error("Signup error:", e);
    }
  };

  const handleGoogleSignup = () => {
    // Backend Google Auth route
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
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

      <div className={styles.formCard}>
        <h1 className={styles.logo}>BRICO</h1>
        <h2 className={styles.title}>Create Your Account</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              className={styles.input}
              placeholder="Full Name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

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

          <div className={styles.inputGroup}>
            <input
              type="password"
              className={styles.input}
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" className={styles.signupButton}>
            SIGN UP
          </button>
        </form>

        <div className={styles.divider}>
          <div className={styles.dividerLine}></div>
          <span className={styles.orText}>OR</span>
          <div className={styles.dividerLine}></div>
        </div>

        <button
          className={styles.googleButton}
          onClick={handleGoogleSignup}
          type="button"
        >
          <FaGoogle className={styles.googleIcon} />
          Continue with Google
        </button>

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
