import React from "react";
import { MdLocationOn, MdChevronRight, MdCalendarMonth } from "react-icons/md";
import styles from "./ProjectCard.module.css";

interface ProjectProps {
  title: string;
  location?: string;
  date?: string;
  status: "In Progress" | "Planning" | "Completed";
  image: string;
}

const ProjectCard: React.FC<ProjectProps> = ({
  title,
  location,
  date,
  status,
  image,
}) => {
  // Status wise badge colors
  const statusStyles: Record<string, string> = {
    "In Progress": styles.statusProgress,
    Planning: styles.statusPlanning,
    Completed: styles.statusCompleted,
  };

  return (
    <article className={styles.card}>
      <div className={styles.container}>
        {/* Thumbnail */}
        <div
          className={styles.thumbnail}
          style={{ backgroundImage: `url(${image})` }}
        />

        {/* Info */}
        <div className={styles.content}>
          <div className={styles.header}>
            <h3 className={styles.title}>{title}</h3>
            <span className={`${styles.statusBadge} ${statusStyles[status]}`}>
              {status}
            </span>
          </div>

          <div className={styles.meta}>
            {location && (
              <div className={styles.metaItem}>
                <MdLocationOn className={styles.icon} />
                <span>{location}</span>
              </div>
            )}
            {date && (
              <div className={styles.metaItem}>
                <MdCalendarMonth className={styles.icon} />
                <span>{date}</span>
              </div>
            )}
          </div>

          <button className={styles.detailsBtn}>
            View Details <MdChevronRight />
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
