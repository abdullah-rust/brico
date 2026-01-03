import React from "react";
import HomeHeader from "../../components/Homes/Home/HomeHeader";
import SearchBar from "../../components/Homes/SearchBar/SearchBar";
import ActionGrid from "../../components/Homes/ActionGrid/ActionGrid";
import ActiveProjectCard from "../../components/Homes/ActiveProjectCard/ActiveProjectCard";
import DesignCarousel from "../../components/Homes/DesignCarousel/DesignCarousel";
import PromoBanner from "../../components/Homes/PromoBanner/PromoBanner";
import styles from "./HomePage.module.css";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.topSticky}>
        <HomeHeader />
        <SearchBar />
      </div>

      <main className={styles.scrollArea}>
        <div className={styles.sectionHeader}>
          <h3>Quick Actions</h3>
        </div>
        <ActionGrid />

        {/* Ab sirf component call ho rha hai, koi ganda code nhi */}
        <ActiveProjectCard
          title="Villa Renovation"
          tag="Active Project"
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuD4R3DV7AZMqKRoESdl6p1QGcd2F4Mr3jftpgVNQINNFpau95b3-OVq1Ct0F76Q4Ugm1z23XUDeYIZQ1Z0YZip_--2yPN0fmgBCNv2cEkAES3GDhctYCtSDDkcC7PrmGDg-mweP-l1_OY9ZHoKtCtfYCnPTCiEdaQb5Yl71VjdzMC5RrDUEwG-5v74My2PrGjeO4hy6EN7cmvsLM2ZosqYvFh50CAkiTw5T2AgYJLZIpM67r_SJHhj_PYhfJlfMcPH8WipWqfSDzDRC"
        />

        <DesignCarousel />
        <PromoBanner />
      </main>
    </div>
  );
};

export default HomePage;
