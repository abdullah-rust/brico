import React from "react";
import styles from "./PromoBanner.module.css";

const PromoBanner: React.FC = () => (
  <div className={styles.wrapper}>
    <div className={styles.banner}>
      <div className={styles.content}>
        <h3>Need help calculating materials?</h3>
        <p>Use our smart estimator to plan your budget efficiently.</p>
        <button className={styles.cta}>Try Estimator</button>
      </div>
      {/* Decorative Blur Shapes */}
      <div className={styles.blob1} />
      <div className={styles.blob2} />
    </div>
  </div>
);

export default PromoBanner;
