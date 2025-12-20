"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";

const VerifyOtpPage = () => {
  const backgroundImage = "/montreal-dusk.jpg";

  // OTP digits state
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  // Timer state
  const [timer, setTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);

  // Refs for input boxes
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Timer effect
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

  // Handle OTP input change
  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only last character
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle key down for backspace
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste OTP
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

      // Focus last filled input
      const lastFilledIndex = Math.min(digits.length - 1, 5);
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  // Handle verify
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length === 6) {
      console.log("Verifying OTP:", otpCode);
      // Add your OTP verification logic here
    } else {
      alert("Please enter all 6 digits");
    }
  };

  // Handle resend code
  const handleResend = () => {
    if (canResend) {
      console.log("Resending OTP code...");
      setTimer(60);
      setCanResend(false);
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    }
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

      {/* OTP Form Card */}
      <div className={styles.formCard}>
        {/* BRICO Heading */}
        <h1 className={styles.logo}>BRICO</h1>

        {/* Form Title */}
        <h2 className={styles.title}>Enter Verification Code</h2>

        {/* Description */}
        <p className={styles.description}>
          We have sent a 6-digit verification code to your email
        </p>

        {/* OTP Form */}
        <form className={styles.form} onSubmit={handleVerify}>
          {/* OTP Inputs Container */}
          <div className={styles.otpContainer}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={styles.otpInput}
                autoFocus={index === 0}
              />
            ))}
          </div>

          {/* Timer/Resend */}
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

          {/* VERIFY Button */}
          <button type="submit" className={styles.verifyButton}>
            VERIFY
          </button>
        </form>

        {/* Back to Login Link */}
        <p className={styles.backLink}>
          <Link href="/login" className={styles.backText}>
            ← Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
