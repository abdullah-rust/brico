import React from "react";
import { MdNotifications } from "react-icons/md";
import styles from "./HomeHeader.module.css";

const HomeHeader: React.FC = () => (
  <header className={styles.header}>
    <div className={styles.textGroup}>
      <span className={styles.greeting}>Good Morning,</span>
      <h2 className={styles.userName}>Rahul 👋</h2>
    </div>
    <button className={styles.notifBtn}>
      <MdNotifications size={24} />
      <span className={styles.dot}></span>
    </button>
  </header>
);

export default HomeHeader;
