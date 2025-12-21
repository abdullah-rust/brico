"use client";
// pages/DashboardLayout.tsx (Ya components/Dashboard/DashboardLayout.tsx)

import React, { useEffect } from "react";
import styles from "./page.module.css"; // Iska CSS alag se
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import FeatureTile from "./components/FeatureTile/FeatureTile";
// React Icons
import {
  FaSearch,
  FaMapMarkerAlt,
  FaHome,
  FaBook,
  FaCalculator,
  FaFolderOpen,
  FaSave,
} from "react-icons/fa";
import { useRouter } from "next/navigation";

const DashboardLayout: React.FC = () => {
  const router = useRouter();
  const imageTiles = [
    { id: 1, title: "Modern Villa", imageUrl: "/images/1.jpg" },
    { id: 2, title: "City Center Project", imageUrl: "/images/2.jpg" },
    { id: 3, title: "Luxury House Design", imageUrl: "/images/3.jpg" },
  ];

  // Feature buttons ka data (Image ke mutabiq colors aur icons)
  const featureButtons = [
    { title: "Find Workers", icon: <FaSearch />, iconBg: "#9b59b6" },
    { title: "Maps House", icon: <FaMapMarkerAlt />, iconBg: "#3498db" },
    { title: "House Designs", icon: <FaHome />, iconBg: "#e67e22" },
    { title: "Saved Notes", icon: <FaBook />, iconBg: "#2ecc71" },
    { title: "Calculations Tools", icon: <FaCalculator />, iconBg: "#2ecc71" },
    { title: "Prices Estimation", icon: <FaCalculator />, iconBg: "#f39c12" },
    { title: "Start Project", icon: <FaFolderOpen />, iconBg: "#34495e" },
    { title: "Saved Collections", icon: <FaSave />, iconBg: "#e74c3c" },
  ];

  return (
    <div className={styles.dashboardContainer}>
      {/* Background Image / Overlay yahan laga sakte hain agar poore page par chahiye */}
      <Header />

      <main className={styles.mainContent}>
        {/* Image Tiles Row */}
        <div className={styles.imageTilesGrid}>
          {imageTiles.map((tile) => (
            <FeatureTile
              key={tile.id}
              type="image"
              imageUrl={tile.imageUrl}
              title={tile.title}
            />
          ))}
        </div>

        {/* Feature Buttons Row */}
        <div className={styles.featureButtonsGrid}>
          {featureButtons.map((button, index) => (
            <FeatureTile
              key={index}
              type="button"
              title={button.title}
              icon={button.icon}
              iconBg={button.iconBg}
            />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
