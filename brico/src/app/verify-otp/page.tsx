"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import api from "../utils/api";
import Swal from "sweetalert2";

// Next.js mein useSearchParams use karne ke liye Suspense zaroori hai
const VerifyOtpContent = () => {
  const backgroundImage = "/montreal-dusk.jpg";
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const type = searchParams.get("type"); // 'signup' ya 'login'

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [timer, setTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Timer logic
  useEffect(() => {
    if (timer > 0 && !canResend) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, canResend]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.split("");
      const newOtp = [...otp];
      digits.forEach((digit, index) => {
        if (index < 6) newOtp[index] = digit;
      });
      setOtp(newOtp);
      inputRefs.current[Math.min(digits.length - 1, 5)]?.focus();
    }
  };

  // --- API Handling: Verify OTP ---
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      return Swal.fire({
        icon: "warning",
        title: "Wait!",
        text: "Please enter all 6 digits.",
      });
    }

    Swal.fire({
      title: "Verifying...",
      text: "Please wait while we check your code.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      // Jani yahan design change ho raha hai aapke mutabiq
      // Agar type 'signup' hai toh '/signup-otp' par bhejo, warna '/login-otp' par
      const endpoint = type === "signup" ? "/signup-otp" : "/login-otp";

      await api.post(endpoint, {
        email,
        code: otpCode.toString(),
      });

      Swal.fire({
        icon: "success",
        title: "Success!",
        text:
          type === "signup"
            ? "Account verified successfully!"
            : "Logged in successfully!",
        timer: 2000,
        showConfirmButton: false,
      });

      localStorage.setItem("isLogin", "yes");
      router.push("/"); // Login OTP ke baad direct dashboard
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text: err.response?.data?.message || "Invalid code. Please try again.",
        confirmButtonColor: "#ff8c00",
      });
      console.log(err);
    }
  };

  // --- API Handling: Resend OTP ---
  const handleResend = async () => {
    if (!canResend) return;

    Swal.fire({
      title: "Resending...",
      text: "Sending a new code to your email.",
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await api.post("/resend-otp", { email });

      Swal.fire({
        icon: "success",
        title: "Sent!",
        text: "New OTP has been sent.",
        timer: 1500,
        showConfirmButton: false,
      });

      setTimer(60);
      setCanResend(false);
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not resend OTP.",
      });
    }
  };

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className={styles.overlay}></div>
      <div className={styles.formCard}>
        <h1 className={styles.logo}>BRICO</h1>
        <h2 className={styles.title}>Verify Your Email</h2>
        <p className={styles.description}>
          We've sent a code to <br /> <strong>{email || "your email"}</strong>
        </p>

        <form className={styles.form} onSubmit={handleVerify}>
          <div className={styles.otpContainer}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={styles.otpInput}
              />
            ))}
          </div>

          <div className={styles.timerContainer}>
            {!canResend ? (
              <p className={styles.timer}>
                Resend code in: <span className={styles.time}>{timer}s</span>
              </p>
            ) : (
              <button
                type="button"
                className={styles.resendButton}
                onClick={handleResend}
              >
                Resend Verification Code
              </button>
            )}
          </div>

          <button type="submit" className={styles.verifyButton}>
            VERIFY
          </button>
        </form>

        <p className={styles.backLink}>
          <Link href="/login" className={styles.backText}>
            ← Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

// Main Page Component
const VerifyOtpPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
};

export default VerifyOtpPage;
