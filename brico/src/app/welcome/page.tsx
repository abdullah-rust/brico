"use client";

import { FaGoogle } from "react-icons/fa";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const WelcomePage = () => {
  // Aap yahan apni image ka path denge
  const backgroundImage = "/gemini-background.png";
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleSignup = () => {
    router.push("/signup");
  };

  const handleGoogle = () => {
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
      {/* Dark Overlay */}
      <div className={styles.overlay}></div>

      {/* Main Content */}
      <div className={styles.content}>
        {/* BRICO Title */}
        <h1 className={styles.title}>BRICO</h1>

        {/* Tagline */}
        <p className={styles.tagline}>Build. Design. Discover.</p>

        {/* Buttons Container */}
        <div className={styles.buttonsContainer}>
          {/* Login & Signup Buttons */}
          <div className={styles.mainButtons}>
            <button
              className={`${styles.button} ${styles.loginBtn}`}
              onClick={handleLogin}
            >
              LOG IN
            </button>

            <button
              className={`${styles.button} ${styles.signupBtn}`}
              onClick={handleSignup}
            >
              SIGN UP
            </button>
          </div>

          {/* Divider with OR */}
          <div className={styles.divider}>
            <div className={styles.dividerLine}></div>
            <span className={styles.orText}>OR</span>
            <div className={styles.dividerLine}></div>
          </div>

          {/* Google Button */}
          <button
            className={`${styles.button} ${styles.googleBtn}`}
            onClick={handleGoogle}
          >
            <FaGoogle className={styles.googleIcon} />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
