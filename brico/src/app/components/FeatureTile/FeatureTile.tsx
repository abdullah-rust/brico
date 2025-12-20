// components/FeatureTile/FeatureTile.tsx

import React from "react";
import styles from "./FeatureTile.module.css";

interface FeatureTileProps {
  type: "image" | "button";
  title: string;
  imageUrl?: string;
  icon?: React.ReactNode;
  iconBg?: string;
}

const FeatureTile: React.FC<FeatureTileProps> = ({
  type,
  title,
  imageUrl,
  icon,
  iconBg,
}) => {
  if (type === "image") {
    return (
      <div
        className={styles.imageTile}
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        {/* Image Tiles mein koi text nahi hai image ke mutabiq */}
      </div>
    );
  }

  // Type === 'button'
  return (
    <div className={styles.featureButton}>
      <div className={styles.iconWrapper} style={{ backgroundColor: iconBg }}>
        {icon}
      </div>
      <p className={styles.buttonTitle}>{title}</p>
    </div>
  );
};

export default FeatureTile;
