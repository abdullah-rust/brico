import React from "react";
import {
  MdEdit,
  MdSettingsApplications,
  MdStar,
  MdApartment,
  MdFavorite,
  MdCreditCard,
  MdTranslate,
  MdSettings,
  MdLogout,
  MdChevronRight,
} from "react-icons/md";
import styles from "./ProfilePage.module.css";

const ProfilePage: React.FC = () => {
  return (
    <div className={styles.pageWrapper}>
      {/* Sticky Header */}
      <div className={styles.stickyHeader}>
        <h2 className={styles.headerTitle}>My Profile</h2>
      </div>

      <div className={styles.scrollArea}>
        <div className={styles.container}>
          {/* Profile Header Section */}
          <section className={styles.profileCard}>
            <div className={styles.avatarWrapper}>
              <div
                className={styles.avatar}
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBCa1dtXiYI-722LqepSbaiWDu4vqq-2Abr3EZvP4sUK_gaT85tpo6EFA0XtrLctVFBcqStF8KbpacvGh7U2jC6psjq0kd2gU1QK_55jI4dXw1vVlkbNGUWtG8TrYpHiJzQVU17Fwa-riMskZoVPmWQHdxoXYEHtRIqSgsm0hWD91e6Qe6Tu5lyHMfU0C5sD9VU7sVJdlTfXU7y7gLtIT4WUTESqkSRI0u7ziy5_wYT2QCRLAFnHo5gtFgpsi4FTsnGAEguQVa8wSAo')",
                }}
              />
              <button className={styles.editAvatarBtn}>
                <MdEdit />
              </button>
            </div>

            <div className={styles.userInfo}>
              <h1 className={styles.userName}>Ravi Sharma</h1>
              <span className={styles.badge}>Contractor</span>
              <p className={styles.userContact}>
                ravi.sharma@brico.com | +91 98765 43210
              </p>
            </div>

            <button className={styles.editProfileBtn}>
              <MdSettingsApplications size={20} />
              <span>Edit Profile</span>
            </button>
          </section>

          {/* Stats Grid */}
          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <span className={styles.statValue}>12</span>
              <span className={styles.statLabel}>Active Jobs</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statValue}>4.8</span>
              <div className={styles.ratingRow}>
                <MdStar className={styles.starIcon} />
                <span className={styles.statLabel}>Rating</span>
              </div>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statValue}>4y</span>
              <span className={styles.statLabel}>Exp.</span>
            </div>
          </div>

          {/* Menu Groups */}
          <div className={styles.menuGroup}>
            <p className={styles.groupLabel}>Workspace</p>
            <MenuButton
              icon={<MdApartment />}
              title="My Projects"
              desc="Manage your active sites"
            />
            <div className={styles.divider} />
            <MenuButton
              icon={<MdFavorite />}
              title="Saved Designs"
              desc="House plans & elevations"
            />
          </div>

          <div className={styles.menuGroup}>
            <p className={styles.groupLabel}>Account</p>
            <MenuButton icon={<MdCreditCard />} title="Payment Methods" />
            <div className={styles.divider} />
            <MenuButton icon={<MdTranslate />} title="Language" sub="English" />
            <div className={styles.divider} />
            <MenuButton icon={<MdSettings />} title="App Settings" />
          </div>

          {/* Logout Button */}
          <button className={styles.logoutBtn}>
            <MdLogout size={20} />
            <span>Log Out</span>
          </button>

          <p className={styles.versionText}>Version 2.4.0 (Build 302)</p>
        </div>
      </div>
    </div>
  );
};

// Internal Sub-Component for cleaner logic
const MenuButton = ({ icon, title, desc, sub }: any) => (
  <button className={styles.menuItem}>
    <div className={styles.menuIconWrapper}>{icon}</div>
    <div className={styles.menuTextWrapper}>
      <p className={styles.menuTitle}>{title}</p>
      {desc && <p className={styles.menuDesc}>{desc}</p>}
    </div>
    {sub && <span className={styles.menuSubText}>{sub}</span>}
    <MdChevronRight className={styles.arrowIcon} />
  </button>
);

export default ProfilePage;
