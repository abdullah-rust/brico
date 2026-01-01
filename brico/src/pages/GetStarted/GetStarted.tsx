import React from "react"; // 1. useEffect add kiya
import { useNavigate } from "react-router-dom";
import { MdConstruction, MdEmail, MdPersonAdd } from "react-icons/md";
import styles from "./GetStarted.module.css";
import image from "/getStarted.webp";

const GetStarted: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div
          className={styles.bgImage}
          style={{
            backgroundImage: `url(${image})`,
          }}
        >
          <div className={styles.overlay}></div>
        </div>

        {/* Logo Badge */}
        <div className={styles.logoBadgeContainer}>
          <div className={styles.logoBadge}>
            <MdConstruction className={styles.logoIcon} />
            <span className={styles.brandText}>Brico</span>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className={styles.contentBody}>
        <div className={styles.textContent}>
          <h1 className={styles.title}>
            Your Construction
            <br />
            Partner
          </h1>
          <p className={styles.description}>
            Find workers, view designs, and manage your dream projects in one
            place.
          </p>
        </div>

        {/* Action Buttons */}
        <div className={styles.buttonGroup}>
          {/* Signup Button */}
          <button
            className={styles.signupBtn}
            onClick={() => navigate("/signup")}
          >
            <MdPersonAdd className={styles.btnIcon} />
            <span>Create Account</span>
          </button>

          {/* Login Button */}
          <button
            className={styles.loginBtn}
            onClick={() => navigate("/login")}
          >
            <MdEmail className={styles.btnIcon} />
            <span>Login with Email</span>
          </button>
        </div>

        {/* Footer Legal */}
        <footer className={styles.footer}>
          <p>
            By continuing, you agree to our
            <span className={styles.legalLink}> Terms of Service</span> and
            <span className={styles.legalLink}> Privacy Policy</span>.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default GetStarted;
