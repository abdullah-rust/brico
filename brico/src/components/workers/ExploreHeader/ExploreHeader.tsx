import React from "react";
import {
  MdLocationOn,
  MdExpandMore,
  MdNotifications,
  MdSearch,
  MdTune,
} from "react-icons/md";
import styles from "./ExploreHeader.module.css";

const ExploreHeader: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.locationRow}>
        <div className={styles.locLeft}>
          <div className={styles.locIcon}>
            <MdLocationOn />
          </div>
          <div>
            <p className={styles.locLabel}>Current Location</p>
            <div className={styles.locName}>
              Bandra West, Mumbai <MdExpandMore />
            </div>
          </div>
        </div>
        <button className={styles.notifBtn}>
          <MdNotifications />
          <span className={styles.badge}></span>
        </button>
      </div>

      <div className={styles.searchWrapper}>
        <MdSearch className={styles.searchIcon} />
        <input type="text" placeholder="Find electricians, masons..." />
        <button className={styles.filterBtn}>
          <MdTune />
        </button>
      </div>
    </header>
  );
};

export default ExploreHeader;
