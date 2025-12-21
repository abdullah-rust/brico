// components/MinimalLoader/MinimalLoader.tsx

import React from "react";
import styles from "./Loading.module.css";

const MinimalLoader: React.FC = () => {
  return (
    // Poore viewport ko cover karega, z-index 9999 for overlay
    <div className={styles.minimalLoaderOverlay}>
      <div className={styles.loaderContent}>
        {/* The Branded Spinner */}
        <div className={styles.bricoSpinner}></div>

        {/* The BRICO Logo */}
        <h1 className={styles.logoText}>BRICO</h1>
      </div>
    </div>
  );
};

export default MinimalLoader;
