import React from "react";
import {
  MdLocationOn,
  MdExpandMore,
  MdNotifications,
  MdSearch,
} from "react-icons/md";
import styles from "./ExploreHeader.module.css";

interface Props {
  location: string;
}

const ExploreHeader: React.FC<Props> = ({ location }) => {
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
              {location} <MdExpandMore />
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
      </div>
    </header>
  );
};

export default ExploreHeader;
