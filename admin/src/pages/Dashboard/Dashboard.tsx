import {
  MdPeople,
  MdEngineering,
  MdDesignServices,
  MdFormatListBulleted,
} from "react-icons/md";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Users",
      value: "1,240",
      icon: <MdPeople />,
      color: "#4f46e5",
    },
    {
      title: "Active Workers",
      value: "85",
      icon: <MdEngineering />,
      color: "#17cfb0",
    },
    {
      title: "Live Gigs",
      value: "312",
      icon: <MdFormatListBulleted />,
      color: "#f59e0b",
    },
    {
      title: "Total Designs",
      value: "450",
      icon: <MdDesignServices />,
      color: "#10b981",
    },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>System Overview</h1>
        <p className={styles.subtitle}>
          Welcome back, Abdullah. Here's what's happening at Brico.
        </p>
      </header>

      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statInfo}>
              <span className={styles.statTitle}>{stat.title}</span>
              <h2 className={styles.statValue}>{stat.value}</h2>
            </div>
            <div
              className={styles.iconWrapper}
              style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
            >
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.recentActivity}>
        <h3 className={styles.sectionTitle}>Quick Links</h3>
        <div className={styles.grid2}>
          <div className={styles.actionCard}>Manage All Workers</div>
          <div className={styles.actionCard}>Approve Pending Gigs</div>
        </div>
      </div>
    </div>
  );
}
