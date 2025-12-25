import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import styles from "./OTPPage.module.css";
import api from "../../utils/api";
import Swal from "sweetalert2";
import { AuthService } from "../../utils/AuthService"; // Tumhari banayi hui service

const OTPPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [timer, setTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [verificationType, setVerificationType] = useState<"Signup" | "Login">(
    "Signup"
  );
  const [email, setEmail] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (location.state) {
      setEmail(location.state.email || "");
      setVerificationType(location.state.type || "Signup");
    }
  }, [location.state]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const data = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(data)) return;

    const newOtpData = data.split("");
    const finalOtp = [
      ...newOtpData,
      ...new Array(6 - newOtpData.length).fill(""),
    ];
    setOtp(finalOtp);

    const focusIdx = Math.min(newOtpData.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join("");

    if (otpCode.length < 6 || !email) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete OTP",
        text: "Please enter the complete 6-digit code",
      });
      return;
    }

    setIsLoading(true);

    try {
      Swal.fire({
        title: "Verifying...",
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
      });

      const endpoint =
        verificationType === "Signup" ? "/signup-otp" : "/login-otp";
      const response = await api.post(endpoint, { email, code: otpCode });

      await AuthService.setToken("access_token", response.data.token1);
      await AuthService.setToken("refresh_token", response.data.token2);
      Swal.close();

      Swal.fire({
        icon: "success",
        title:
          verificationType === "Signup"
            ? "Account Verified!"
            : "Login Successful!",
        confirmButtonText: "Continue",
        confirmButtonColor: "#17cfb0",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/"); // Go to Dashboard
        }
      });
    } catch (error: any) {
      Swal.close();
      let errorMessage =
        error.response?.data?.message || "Verification failed.";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#17cfb0",
      });

      setOtp(new Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className={styles.container}>
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
        <div className={styles.topSection}>
          <h1 className={styles.title}>Verify Account</h1>
          <p className={styles.subtitle}>
            Code sent to <span className={styles.email}>{email}</span>
          </p>
          <div className={styles.verificationType}>
            <span
              className={`${styles.typeBadge} ${
                verificationType === "Signup"
                  ? styles.signupBadge
                  : styles.loginBadge
              }`}
            >
              {verificationType} Mode
            </span>
          </div>
        </div>

        <div className={styles.otpWrapper}>
          {otp.map((data, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              value={data}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className={styles.otpInput}
              disabled={isLoading}
            />
          ))}
        </div>

        <div className={styles.timerSection}>
          <p>
            {canResend ? (
              <span
                className={styles.readyText}
                onClick={() => navigate("/get-started")}
              >
                Retry
              </span>
            ) : (
              <>
                Expires in{" "}
                <span className={styles.timer}>{formatTime(timer)}</span>
              </>
            )}
          </p>
        </div>

        <button
          className={`${styles.verifyBtn} ${
            otp.join("").length < 6 || isLoading ? styles.disabled : ""
          }`}
          onClick={handleVerifyOTP}
          disabled={otp.join("").length < 6 || isLoading}
        >
          {isLoading ? (
            <span className={styles.spinner}></span>
          ) : (
            "Verify & Continue"
          )}
        </button>
      </main>
    </div>
  );
};

export default OTPPage;
