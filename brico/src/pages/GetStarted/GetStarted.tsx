import React from "react";
import { useNavigate } from "react-router-dom";
import { MdConstruction, MdEmail, MdPersonAdd } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import styles from "./GetStarted.module.css";

const GetStarted: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {/* Hero Section - Image with Logo Badge */}
      <div className={styles.heroSection}>
        <div
          className={styles.bgImage}
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAENG-Y87V5txCcSW6787BcV_QDmuc6eK8-AhzjFj0A4qzJdHMoOPa_ePHnEnP2d7-vmgPHAWFTyIsmPJQPUo_zpuOi4Oq-q_ZtA2NcQD92P2txTI0wUA1JloGeOI2VdBBWqvz-bBYwvBrg5T-zB4wkftG7GdChX9j6eJcoeHPvbfl5lKrlLrxt-DDH5tRehO7zEN6AKA18hprnRMfLXsLR90zigFxeGFVhmXHMWLM0JwF6LfP6leRTl1pnoTQelqwVQZlfN_wmeuLD')",
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

        {/* Action Buttons - 3 Buttons as requested */}
        <div className={styles.buttonGroup}>
          {/* Google Button */}
          <button
            className={styles.googleBtn}
            onClick={() => console.log("Google Login")}
          >
            <FcGoogle className={styles.btnIconLarge} />
            <span>Continue with Google</span>
          </button>

          {/* Signup Button (Solid Primary) */}
          <button
            className={styles.signupBtn}
            onClick={() => navigate("/signup")}
          >
            <MdPersonAdd className={styles.btnIcon} />
            <span>Create Account</span>
          </button>

          {/* Login Button (Outline) */}
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
