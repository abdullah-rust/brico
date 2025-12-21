"use client";

import Link from "next/link";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";
import styles from "./Footer.module.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Top Section: Branding & Links */}
        <div className={styles.topSection}>
          <div className={styles.brandInfo}>
            <h2 className={styles.logo}>BRICO</h2>
            <p className={styles.tagline}>
              Building unique software architectures for the next generation of
              tech.
            </p>
          </div>

          <div className={styles.linksGrid}>
            <div className={styles.linkGroup}>
              <h4>Platform</h4>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/projects">Projects</Link>
              <Link href="/workers">Find Workers</Link>
            </div>
            <div className={styles.linkGroup}>
              <h4>Company</h4>
              <Link href="/about">About Us</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/privacy">Privacy Policy</Link>
            </div>
          </div>

          <div className={styles.socialSection}>
            <h4>Connect</h4>
            <div className={styles.socialIcons}>
              <a href="#" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="#" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" aria-label="Github">
                <FaGithub />
              </a>
            </div>
          </div>
        </div>

        <hr className={styles.divider} />

        {/* Bottom Section: Copyright */}
        <div className={styles.bottomSection}>
          <p>© {currentYear} BRICO. Made with 🔥 in Pakistan.</p>
          <div className={styles.status}>
            <span className={styles.statusDot}></span>
            Systems Operational
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
