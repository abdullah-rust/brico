import React from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowForward } from "react-icons/md";
import styles from "./WelcomePage.module.css";
import image from "/welcome.webp";

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      {/* 1. Header Area (Fixed Height: 80px) */}
      <header className={styles.header}>
        <h2 className={styles.brandName}>Brico</h2>
      </header>

      {/* 2. Hero Area (Fixed Height: 300px) */}
      <main className={styles.heroSection}>
        <div className={styles.imageContainer}>
          <img src={image} alt="Hero" className={styles.heroImg} />
        </div>
      </main>

      {/* 3. Content Area (Fixed Height: 287px) */}
      <section className={styles.bottomSheet}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>Build Your Vision</h1>
          <p className={styles.subtitle}>
            The smartest way to plan, build, and manage construction projects.
          </p>
        </div>

        <button
          className={styles.ctaButton}
          onClick={() => navigate("/get-started")}
        >
          <span>Get Started</span>
          <MdArrowForward />
        </button>

        <footer className={styles.footer}>
          By joining, you agree to our <span>Terms & Privacy</span>
        </footer>
      </section>
    </div>
  );
};

export default WelcomePage;
