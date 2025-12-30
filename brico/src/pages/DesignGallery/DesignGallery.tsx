import React from "react";
import { useNavigate } from "react-router-dom";
import { MdChevronRight, MdHome, MdMap, MdArchitecture } from "react-icons/md";
import styles from "./DesignHub.module.css";
import nasha from "/naqsha.jpg";

const DesignHub: React.FC = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: "elevations",
      title: "Front Elevations",
      desc: "Modern, Spanish & Luxury Exterior Designs",
      icon: <MdHome size={32} />,
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800", // Example House Front
      count: "120+ Designs",
      link: "/elevations",
    },
    {
      id: "maps",
      title: "House Maps (Naqshe)",
      desc: "5 Marla, 10 Marla & 1 Kanal Floor Plans",
      icon: <MdMap size={32} />,
      img: nasha, // Example Floor plan
      count: "80+ Layouts",
      link: "/maps",
    },
    {
      id: "ceiling",
      title: "Ceiling Designs",
      desc: "Latest Gypsum & False Ceiling Ideas",
      icon: <MdArchitecture size={32} />,
      img: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=800", // Example Interior/Ceiling
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
            <div
              className={styles.imageOverlay}
              style={{ backgroundImage: `url(${cat.img})` }}
            />
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
