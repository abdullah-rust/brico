import React from "react";
import {
  MdVerified,
  MdStar,
  MdLocationOn,
  MdHistory,
  MdBolt,
} from "react-icons/md";
import styles from "./WorkerCard.module.css";

interface WorkerProps {
  name: string;
  role: string;
  rating: number;
  distance: string;
  jobs?: number;
  price: string;
  available: boolean;
  image: string;
  isVerified?: boolean;
}

const WorkerCard: React.FC<WorkerProps> = (props) => {
  return (
    <div className={styles.card}>
      <div className={styles.topSection}>
        <div className={styles.imageWrapper}>
          <img
            src={props.image}
            alt={props.name}
            className={styles.workerImg}
          />
          {props.isVerified && <MdVerified className={styles.verifiedIcon} />}
        </div>
        <div className={styles.info}>
          <div className={styles.headerRow}>
            <h3 className={styles.name}>{props.name}</h3>
            <div className={styles.ratingBadge}>
              <MdStar className={styles.starIcon} />
              {props.rating}
            </div>
          </div>
          <p className={styles.role}>{props.role}</p>
          <div className={styles.meta}>
            <span>
              <MdLocationOn size={14} /> {props.distance}
            </span>
            <span className={styles.dot}></span>
            {props.available ? (
              <span className={styles.available}>
                <MdBolt size={14} /> Available Now
              </span>
            ) : (
              <span className={styles.jobs}>
                <MdHistory size={14} /> {props.jobs} jobs
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.priceInfo}>
          <p className={styles.rateLabel}>RATE</p>
          <p className={styles.price}>
            ₹{props.price}
            <span>/visit</span>
          </p>
        </div>
        <button
          className={props.available ? styles.bookBtn : styles.contactBtn}
        >
          {props.available ? "Book Now" : "Contact"}
        </button>
      </div>
    </div>
  );
};

export default WorkerCard;
