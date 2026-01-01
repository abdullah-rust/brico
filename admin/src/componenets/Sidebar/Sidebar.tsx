import React from "react";
import {
  MdDashboard,
  MdCloudUpload,
  MdSettings,
  MdLogout,
} from "react-icons/md";
import styles from "./Sidebar.module.css";

// Yahan type ko match karna lazmi hai
type ScreenType = "stats" | "upload" | "settings";

interface SidebarProps {
  activeTab: ScreenType;
  setActiveTab: (tab: ScreenType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems: { id: ScreenType; title: string; icon: any }[] = [
    { id: "stats", title: "Dashboard", icon: <MdDashboard size={22} /> },
    { id: "upload", title: "Upload Design", icon: <MdCloudUpload size={22} /> },
    { id: "settings", title: "Settings", icon: <MdSettings size={22} /> },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoSection}>
        <div className={styles.logoIcon}>B</div>
        <h2 className={styles.logoText}>
          Brico <span>Admin</span>
        </h2>
      </div>

      <nav className={styles.navLinks}>
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`${styles.navItem} ${
              activeTab === item.id ? styles.active : ""
            }`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.title}</span>
            {activeTab === item.id && <div className={styles.indicator} />}
          </div>
        ))}
      </nav>

      <div className={styles.footerSection}>
        <button className={styles.logoutBtn}>
          <MdLogout size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
