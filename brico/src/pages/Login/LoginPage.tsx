import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdConstruction,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import styles from "./LoginPage.module.css";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.container}>
      {/* Fixed Header */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <MdArrowBack size={24} />
        </button>
      </header>

      <main className={styles.mainContent}>
        {/* Logo & Headline Area */}
        <div className={styles.topSection}>
          <div className={styles.logoBox}>
            <MdConstruction size={28} color="white" />
          </div>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Manage your projects easily.</p>
        </div>

        {/* Form Area */}
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              placeholder="user@example.com"
              className={styles.inputField}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={styles.passwordInput}
              />
              <button
                type="button"
                className={styles.toggleBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <MdVisibilityOff size={20} />
                ) : (
                  <MdVisibility size={20} />
                )}
              </button>
            </div>
          </div>

          <div className={styles.forgotPass}>
            <a href="#">Forgot Password?</a>
          </div>

          <button type="submit" className={styles.loginBtn}>
            Login
          </button>
        </form>

        {/* Bottom Link */}
        <footer className={styles.footer}>
          <p>
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className={styles.signUpLink}
            >
              Sign Up
            </span>
          </p>
        </footer>
      </main>
    </div>
  );
};

export default LoginPage;
