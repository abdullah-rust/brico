import React from "react";
import { MdChevronRight } from "react-icons/md"; // Proper Icon Import
import styles from "./ActiveProjectCard.module.css";

interface ProjectProps {
  title: string;
  image: string;
  tag: string;
}

const ActiveProjectCard: React.FC<ProjectProps> = ({ title, image, tag }) => {
  return (
    <div className={styles.bannerSection}>
      <div className={styles.projectBanner}>
        <div className={styles.pInfo}>
          <img src={image} alt={title} className={styles.projectImage} />
          <div className={styles.textData}>
            <span className={styles.activeTag}>{tag}</span>
            <h4 className={styles.projectName}>{title}</h4>
          </div>
        </div>

        {/* Right Icon Fix */}
        <button className={styles.arrowBtn} aria-label="View Project">
          <MdChevronRight size={28} />
        </button>
      </div>
    </div>
  );
};

export default ActiveProjectCard;
