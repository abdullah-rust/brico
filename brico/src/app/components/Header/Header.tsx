import React from "react";
import styles from "./Header.module.css";
import { FaUserCircle, FaChevronDown, FaBell } from "react-icons/fa";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      {/* Brand Section */}
      <div className={styles.brandSection}>
        <div className={styles.logo}>BRICO</div>
      </div>

      {/* Center Section: Welcome Message (Mobile par hide kar sakte hain) */}
      <div className={styles.welcomeSection}>
        <p>
          Welcome back, <span>Abdullah</span>
        </p>
      </div>

      {/* Right Section: Actions & Profile */}
      <div className={styles.actionsProfile}>
        <div className={styles.iconWrapper}>
          <FaBell className={styles.bellIcon} />
          <span className={styles.notificationDot}></span>
        </div>

        <div className={styles.profileBox}>
          <FaUserCircle className={styles.profileIcon} />
          <FaChevronDown className={styles.dropdownIcon} />
        </div>

        <button className={styles.postGigBtn}>Post Gig</button>
      </div>
    </header>
  );
};

export default Header;
