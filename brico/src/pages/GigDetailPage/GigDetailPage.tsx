import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  MdArrowBack,
  MdShare,
  MdVerified,
  MdStar,
  MdArrowForward,
  MdAccessTime,
  MdCalendarToday,
  MdWork,
  MdHistory, // Naya icon experience ke liye
} from "react-icons/md";
import api from "../../utils/api";
import styles from "./GigDetailPage.module.css";

const GigDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [gig, setGig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const url = import.meta.env.VITE_API_URL;

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });

  useEffect(() => {
    const fetchGigDetails = async () => {
      try {
        const res = await api.get(`/gigs/details/${id}`);
        setGig(res.data.data);
      } catch (err) {
        console.error("Error fetching gig:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchGigDetails();
  }, [id]);

  const handleShare = async () => {
    if (navigator.share && gig) {
      try {
        await navigator.share({
          title: gig.title,
          text: `Check out ${gig.worker?.user?.fullName}'s service: ${gig.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Sharing failed", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading)
    return <div className={styles.loading}>Connecting with Expert...</div>;
  if (!gig)
    return (
      <div className={styles.error}>
        Gig not found!{" "}
        <button onClick={() => window.history.back()}>Back</button>
      </div>
    );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button
          onClick={() => window.history.back()}
          className={styles.headerButton}
        >
          <MdArrowBack />
        </button>
        <h2 className={styles.headerTitle}>Service Details</h2>
        <button onClick={handleShare} className={styles.headerButton}>
          <MdShare />
        </button>
      </header>

      <main className={styles.main}>
        {/* Profile Section - Updated with Role from API */}
        <section className={styles.profileSection}>
          <div className={styles.profileImageContainer}>
            <img
              src={
                gig.worker?.user?.profilePicture
                  ? `${url}/files/${gig.worker.user.profilePicture}`
                  : "https://via.placeholder.com/150"
              }
              className={styles.profileImage}
              alt={gig.worker?.user?.fullName}
            />
            <div className={styles.verifiedBadge}>
              <MdVerified />
            </div>
          </div>
          <div>
            <h1 className={styles.profileName}>{gig.worker?.user?.fullName}</h1>
            <p className={styles.profileTitle}>
              {gig.worker?.user?.role || gig.category} {/* Role priority */}
            </p>
          </div>
        </section>

        {/* Stats Grid - Synced with ExperienceYears */}
        <section className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              <span>{gig.worker?.rating || "0.0"}</span>
              <MdStar className={styles.starIcon} />
            </div>
            <span className={styles.statLabel}>Rating</span>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statValue}>
              <MdHistory style={{ color: "#11d4b4", fontSize: "20px" }} />
              <span>{gig.worker?.experience || "0"}</span>
            </div>
            <span className={styles.statLabel}>Years Exp.</span>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statValue}>
              <span className={styles.locationText}>
                {gig.locationName?.split(",")[0]}
              </span>
            </div>
            <span className={styles.statLabel}>Location</span>
          </div>
        </section>

        {/* Portfolio Gallery */}
        {gig.imageUrls && gig.imageUrls.length > 0 && (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <MdWork style={{ marginRight: "8px" }} /> Portfolio
            </h3>
            <div className={styles.gallery}>
              {gig.imageUrls.map((img: string, index: number) => (
                <img
                  key={index}
                  src={`${url}/files/${img}`}
                  className={styles.galleryImg}
                  alt="Work sample"
                  onClick={() => setActiveImage(`${url}/files/${img}`)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Pricing Card */}
        <section className={styles.gigCard}>
          <span className={styles.serviceTag}>{gig.category}</span>
          <h2 className={styles.gigTitle}>{gig.title}</h2>
          <div className={styles.priceContainer}>
            <span className={styles.price}>Rs. {gig.priceBase}</span>
            <span className={styles.rateType}>/ {gig.rateType}</span>
          </div>
        </section>

        {/* Availability Section */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <MdAccessTime style={{ marginRight: "8px" }} /> Availability
          </h3>
          <div className={styles.weeklyCard}>
            {daysOfWeek.map((day) => {
              const schedule = gig.availability?.[day];
              const isToday = day === todayName;
              return (
                <div
                  key={day}
                  className={`${styles.dayRow} ${
                    isToday ? styles.todayRow : ""
                  }`}
                >
                  <span className={styles.dayName}>
                    {day.substring(0, 3)} {isToday && "•"}
                  </span>
                  <span
                    className={
                      schedule?.closed ? styles.closedStatus : styles.openTime
                    }
                  >
                    {schedule?.closed
                      ? "Closed"
                      : `${schedule?.from} - ${schedule?.to}`}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Description */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <MdCalendarToday style={{ marginRight: "8px" }} /> Description
          </h3>
          <p className={styles.description}>{gig.description}</p>
        </section>
      </main>

      <div className={styles.bottomBar}>
        <a
          href={`tel:${gig.phone || gig.worker?.user?.phone}`}
          className={styles.contactButton}
        >
          <span>Contact Professional</span>
          <MdArrowForward />
        </a>
      </div>

      {/* Image Modal Logic remains same */}
      {activeImage && (
        <div className={styles.modal} onClick={() => setActiveImage(null)}>
          <img src={activeImage} alt="Full view" className={styles.modalImg} />
          <button className={styles.modalClose}>✕</button>
        </div>
      )}
    </div>
  );
};

export default GigDetailPage;
