import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import Swal from "sweetalert2";
import styles from "./Auth.module.css";

const OTPVerification = () => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);

  // Is array mein hum saare 6 inputs ke references save karenge
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state?.username) {
      navigate("/signup");
    }
  }, [state, navigate]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Auto-focus next input agar value enter hui ho
    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    // Backspace par pichle box par jana
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalOtp = otp.join("");

    if (finalOtp.length < 6) {
      return Swal.fire("Error", "Please enter all 6 digits", "warning");
    }

    setLoading(true);
    try {
      await api.post("/admin/verify-signup", {
        username: state.username,
        otp: finalOtp,
      });

      Swal.fire({
        title: "Verified!",
        text: "Admin account created successfully.",
        icon: "success",
        confirmButtonColor: "#17cfb0",
      });
      navigate("/login");
    } catch (err: any) {
      Swal.fire(
        "Failed",
        err.response?.data?.message || "Invalid OTP",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authWrapper}>
      <form className={styles.authCard} onSubmit={handleVerify}>
        <div className={styles.logo}>B</div>
        <h1>Verify OTP</h1>
        <p>
          Sent to Owner. Enter the 6-digit code to finalize{" "}
          <b>{state?.username}</b>'s account.
        </p>

        <div className={styles.otpContainer}>
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              // FIX: Curly braces use kiye hain taake kuch return na ho (void)
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={styles.otpInput}
            />
          ))}
        </div>

        <button type="submit" className={styles.authBtn} disabled={loading}>
          {loading ? "Creating Account..." : "Finalize Registration"}
        </button>

        <p
          className={styles.toggleLink}
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/signup")}
        >
          Wrong details? Go back
        </p>
      </form>
    </div>
  );
};

export default OTPVerification;
