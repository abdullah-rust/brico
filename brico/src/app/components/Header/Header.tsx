// components/Header/Header.tsx

import React from "react";
import styles from "./Header.module.css";
import { FaUserCircle, FaChevronDown, FaSearch } from "react-icons/fa";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      {/* Logo and Profile */}
      <div className={styles.logoProfile}>
        <div className={styles.logo}>BRICO</div>
        <FaUserCircle className={styles.profileIcon} />
        <FaChevronDown className={styles.dropdownIcon} />
      </div>

      {/* Search Bar */}
      <div className={styles.searchBar}>
        <FaSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search for workers, maps..."
          className={styles.searchInput}
        />
      </div>

      {/* Action Button */}
      <button className={styles.postGigBtn}>Post a Gig</button>
    </header>
  );
};

export default Header;
