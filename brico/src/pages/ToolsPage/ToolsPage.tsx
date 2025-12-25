import React from "react";
import {
  MdSearch,
  MdCalculate,
  MdSquareFoot,
  MdStraighten,
  MdWaterDrop,
  MdConstruction,
  MdArrowForward,
  MdArchitecture,
  MdPayments,
  MdViewInAr,
  MdHomeRepairService,
  MdFormatPaint,
  MdSolarPower,
  MdChevronRight,
  MdWater,
} from "react-icons/md";
import styles from "./ToolsPage.module.css";

const ToolsPage: React.FC = () => {
  // Swiper conflict fix function
  const handleTouch = (e: React.TouchEvent) => e.stopPropagation();

  const favorites = [
    {
      id: 1,
      label: "Cost Est.",
      icon: <MdCalculate />,
      colorClass: styles.bgPrimary,
    },
    {
      id: 2,
      label: "Area",
      icon: <MdSquareFoot />,
      colorClass: styles.bgOrange,
    },
    {
      id: 3,
      label: "Unit Conv.",
      icon: <MdStraighten />,
      colorClass: styles.bgBlue,
    },
    {
      id: 4,
      label: "Paint",
      icon: <MdWaterDrop />,
      colorClass: styles.bgPurple,
    },
    {
      id: 5,
      label: "Bricks",
      icon: <MdConstruction />,
      colorClass: styles.bgPrimary,
    },
  ];

  const calculators = [
    {
      id: 1,
      title: "Area Calc",
      desc: "Floors & walls",
      icon: <MdArchitecture />,
      color: styles.green,
    },
    {
      id: 2,
      title: "Cost Calc",
      desc: "Estimate budget",
      icon: <MdPayments />,
      color: styles.yellow,
    },
    {
      id: 3,
      title: "Volume",
      desc: "Concrete & tank",
      icon: <MdViewInAr />,
      color: styles.blue,
    },
    {
      id: 4,
      title: "Flooring",
      desc: "Tiles & marble",
      icon: <MdHomeRepairService />,
      color: styles.red,
    },
    {
      id: 5,
      title: "Paint Calc",
      desc: "Wall coverage",
      icon: <MdFormatPaint />,
      color: styles.purple,
    },
    {
      id: 6,
      title: "Solar",
      desc: "Panel req.",
      icon: <MdSolarPower />,
      color: styles.gray,
      pulse: true,
    },
  ];

  return (
    <div className={styles.pageWrapper}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h2 className={styles.headerTitle}>Construction Tools</h2>
            <p className={styles.headerSubtitle}>
              Smart calculators for your projects
            </p>
          </div>
          <button className={styles.searchBtn}>
            <MdSearch size={24} />
          </button>
        </div>
      </header>

      <div className={styles.scrollArea}>
        {/* Favorites Section - Horizontal Swipe Fixed */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Favorites</h3>
            <button className={styles.textBtn}>Edit</button>
          </div>
          <div
            className={styles.horizontalScroll}
            onTouchStart={handleTouch}
            onTouchMove={handleTouch}
          >
            {favorites.map((fav) => (
              <div key={fav.id} className={styles.favItem}>
                <div className={`${styles.favIconBox} ${fav.colorClass}`}>
                  {fav.icon}
                </div>
                <span className={styles.favLabel}>{fav.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Card */}
        <section className={styles.section}>
          <div className={styles.featuredCard}>
            <span className={styles.popularBadge}>Popular</span>
            <div className={styles.featuredContent}>
              <div className={styles.featuredIconBox}>
                <MdConstruction size={24} />
              </div>
              <div className={styles.featuredText}>
                <h4>Material Estimator</h4>
                <p>Calculate exact quantities for bricks, cement, and sand.</p>
              </div>
            </div>
            <div className={styles.featuredFooter}>
              <span>Start Calculation</span>
              <MdArrowForward />
            </div>
          </div>
        </section>

        {/* All Calculators Grid */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>All Calculators</h3>
          <div className={styles.toolsGrid}>
            {calculators.map((tool) => (
              <div key={tool.id} className={styles.toolCard}>
                <div className={`${styles.toolIconBox} ${tool.color}`}>
                  {tool.icon}
                </div>
                <h4>{tool.title}</h4>
                <p>{tool.desc}</p>
                {tool.pulse && <div className={styles.pulseDot} />}
              </div>
            ))}
          </div>
        </section>

        {/* On-Site Utils List */}
        <section className={`${styles.section} ${styles.mbExtra}`}>
          <h3 className={styles.sectionTitle}>On-Site Utils</h3>
          <div className={styles.utilsList}>
            <div className={styles.utilRow}>
              <div className={styles.utilIcon}>
                <MdStraighten />
              </div>
              <div className={styles.utilText}>
                <h4>Digital Ruler</h4>
                <p>Use camera to measure</p>
              </div>
              <MdChevronRight className={styles.utilArrow} />
            </div>
            <div className={styles.utilRow}>
              <div className={styles.utilIcon}>
                <MdWater />
              </div>
              <div className={styles.utilText}>
                <h4>Bubble Level</h4>
                <p>Check surface alignment</p>
              </div>
              <MdChevronRight className={styles.utilArrow} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ToolsPage;
