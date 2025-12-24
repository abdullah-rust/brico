import React from "react";
import {
  MdHome,
  MdAssignment,
  MdHandyman,
  MdPerson,
  MdBuild,
} from "react-icons/md";
import { HiOutlineLightBulb } from "react-icons/hi"; // Designs ke liye behtar icon
import styles from "./BottomNav.module.css";

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "home", label: "Home", icon: <MdHome size={24} /> },
    { id: "projects", label: "Projects", icon: <MdAssignment size={22} /> },
    { id: "designs", label: "Designs", icon: <HiOutlineLightBulb size={22} /> }, // Naya Tab
    { id: "explore", label: "Explore", icon: <MdHandyman size={22} /> },
    { id: "tools", label: "Tools", icon: <MdBuild size={22} /> }, // Naya Tab
    { id: "profile", label: "Profile", icon: <MdPerson size={24} /> },
  ];

  return (
    <nav className={styles.nav}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={
            activeTab === tab.id ? styles.navItemActive : styles.navItem
          }
          onClick={() => setActiveTab(tab.id)}
        >
          <div className={styles.iconWrapper}>{tab.icon}</div>
          <span className={styles.labelText}>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
