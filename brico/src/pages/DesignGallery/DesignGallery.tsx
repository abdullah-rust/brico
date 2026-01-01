import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdChevronRight, MdHome, MdMap, MdArchitecture } from "react-icons/md";
import styles from "./DesignHub.module.css";
import nasha from "/naqsha.jpg";

// Optimized Image Component for smooth loading
const OptimizedImage: React.FC<{ src: string; alt: string }> = ({
  src,
  alt,
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`${styles.imageWrapper} ${!loaded ? styles.shimmer : ""}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`${styles.actualImage} ${
          loaded ? styles.visible : styles.hidden
        }`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};

const DesignHub: React.FC = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: "elevations",
      title: "Front Elevations",
      desc: "Modern, Spanish & Luxury Exterior Designs",
      icon: <MdHome size={32} />,
      // Adding Unsplash optimization parameters: w=600, format=webp
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600&fm=webp",
      count: "120+ Designs",
      link: "/elevations",
    },
    {
      id: "maps",
      title: "House Maps (Naqshe)",
      desc: "5 Marla, 10 Marla & 1 Kanal Floor Plans",
      icon: <MdMap size={32} />,
      img: nasha,
      count: "80+ Layouts",
      link: "/maps",
    },
    {
      id: "ceiling",
      title: "Ceiling Designs",
      desc: "Latest Gypsum & False Ceiling Ideas",
      icon: <MdArchitecture size={32} />,
      img: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=600&fm=webp",
      count: "200+ Ideas",
      link: "/ceiling",
    },
  ];

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Design Hub</h1>
        <p className={styles.subTitle}>
          Explore inspiration for your dream home
        </p>
      </header>

      <main className={styles.gridContainer}>
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={styles.categoryCard}
            onClick={() => navigate(cat.link)}
          >
            {/* Optimized Image Logic */}
            <OptimizedImage src={cat.img} alt={cat.title} />

            <div className={styles.cardContent}>
              <div className={styles.iconCircle}>{cat.icon}</div>
              <div className={styles.textData}>
                <h2 className={styles.catTitle}>{cat.title}</h2>
                <p className={styles.catDesc}>{cat.desc}</p>
                <span className={styles.catCount}>{cat.count}</span>
              </div>
              <MdChevronRight size={28} className={styles.arrowIcon} />
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default DesignHub;
