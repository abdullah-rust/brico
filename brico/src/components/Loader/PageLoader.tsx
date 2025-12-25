import React from "react";
import styles from "./PageLoader.module.css";

const PageLoader: React.FC = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.logoWrapper}>
        <div className={styles.spinner}></div>
        <img src="/logo.svg" alt="Brico" className={styles.logo} />
      </div>
      <p className={styles.text}>Loading Brico...</p>
    </div>
  );
};

export default PageLoader;
