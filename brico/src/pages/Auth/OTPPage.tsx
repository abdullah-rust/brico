import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import styles from "./OTPPage.module.css";

const OTPPage: React.FC = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus pehle box par jab page load ho
  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0].focus();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return; // Sirf numbers allow hain

    const newOtp = [...otp];
    // Sirf aakhri character lo (agar user fast type kare)
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Agle box par move karo
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
        // Agar current box khali hai, toh pichle par jao aur usse khali karo
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const data = e.clipboardData.getData("text").slice(0, 6); // Pehle 6 digits lo
    if (!/^\d+$/.test(data)) return;

    const newOtp = data.split("");
    setOtp([...newOtp, ...new Array(6 - newOtp.length).fill("")]);

    // Sab se aakhri filled box par focus le jao
    const lastIdx = Math.min(newOtp.length, 5);
    inputRefs.current[lastIdx]?.focus();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <MdArrowBack size={24} />
        </button>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.topSection}>
          <h1 className={styles.title}>Verify Your Account</h1>
          <p className={styles.subtitle}>
            Enter the 6-digit code sent to{" "}
            <span className={styles.phone}>+92 312***786</span>
          </p>
        </div>

        <div className={styles.otpWrapper}>
          {otp.map((data, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric" // Mobile par sirf number pad khulega
              autoComplete="one-time-code" // iOS/Android auto-fill support
              value={data}
              onPaste={handlePaste}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={styles.otpInput}
            />
          ))}
        </div>

        <div className={styles.timerSection}>
          <p>
            Resend code in <span className={styles.timer}>00:30</span>
          </p>
          <button className={styles.resendBtn} disabled>
            Resend OTP
          </button>
        </div>

        <button
          className={styles.verifyBtn}
          disabled={otp.join("").length < 6}
          onClick={() => console.log("OTP Submitted:", otp.join(""))}
        >
          Verify
        </button>
      </main>
    </div>
  );
};

export default OTPPage;
