import React from "react";
import {
  MdPersonSearch,
  MdCalculate,
  MdConstruction,
  MdFolderOpen,
} from "react-icons/md";
import styles from "./ActionGrid.module.css";

const ActionGrid: React.FC = () => {
  return (
    <div className={styles.grid}>
      <button className={styles.largeCardTeal}>
        <div className={styles.iconCircle}>
          <MdPersonSearch size={22} />
        </div>
        <div className={styles.textBottom}>
          <p className={styles.title}>Find Workers</p>
          <p className={styles.desc}>Nearby Masons</p>
        </div>
      </button>

      <button className={styles.largeCardOrange}>
        <div className={styles.iconCircle}>
          <MdCalculate size={22} />
        </div>
        <div className={styles.textBottom}>
          <p className={styles.title}>Price Estimator</p>
          <p className={styles.desc}>Material costs</p>
        </div>
      </button>

      <button className={styles.smallCard}>
        <div className={styles.smallIcon}>
          <MdConstruction size={22} />
        </div>
        <p className={styles.smallTitle}>Tools</p>
      </button>

      <button className={styles.smallCard}>
        <div className={styles.smallIcon}>
          <MdFolderOpen size={22} />
        </div>
        <p className={styles.smallTitle}>My Projects</p>
      </button>
    </div>
  );
};

export default ActionGrid;
