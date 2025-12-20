// app/dashboard/loading.tsx ya app/loading.tsx

import React from "react";
import styles from "./Loading.module.css";

const LoadingPage: React.FC = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.bricoLoader}>
        <div className={styles.cube}></div>
        {/* BRICO Title ko animation ke saath */}
        <h1 className={styles.logoTitle}>BRICO</h1>
      </div>

      {/* Loading Bar ya Text */}
      <div className={styles.loadingText}>Loading Resources...</div>

      {/* Optional: Skeleton Placeholder for better UX on slower connections */}
      <div className={styles.skeletonContainer}>
        {/* Skeleton Header */}
        <div className={styles.skeletonHeader}></div>

        {/* Skeleton Tiles Grid */}
        <div className={styles.skeletonTilesGrid}>
          <div
            className={`${styles.skeletonTile} ${styles.skeletonPulse}`}
          ></div>
          <div
            className={`${styles.skeletonTile} ${styles.skeletonPulse}`}
          ></div>
          <div
            className={`${styles.skeletonTile} ${styles.skeletonPulse}`}
          ></div>
        </div>

        {/* Skeleton Buttons Grid */}
        <div className={styles.skeletonButtonsGrid}>
          <div className={styles.skeletonButton}></div>
          <div className={styles.skeletonButton}></div>
          <div className={styles.skeletonButton}></div>
          <div className={styles.skeletonButton}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
