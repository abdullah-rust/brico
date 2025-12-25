import React from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowForward } from "react-icons/md";
import styles from "./WelcomePage.module.css";

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
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCodjgW84vEIgsP4VhGreTfLRPFYD5n_KbaHyWldBXJMA2cWWVab47XI4qc6lkSkXfsBiudS-ZuWVdlbZlN99Lr9s-gxGvTNTIBYOjVrQaev0gpwRKMH2qMkObkuZTyTQHMpYS-6ThUpEu0OtDpHV4pfAwZqJB58xmwMyfI83t_RyZ3bVCJqFMw_7FCK-SyX5_HYAwO9MwC6PRAp-m_fKAMOSJXCqV00fDS6nCIIoAiqWZkQUMsoRv9XA1WJvwI-9MCbLXMQUXIml8y"
            alt="Hero"
            className={styles.heroImg}
          />
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
