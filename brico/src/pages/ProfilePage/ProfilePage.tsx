import React, { useEffect, useState } from "react";
import {
  MdEdit,
  MdSettingsApplications,
  MdStar,
  MdApartment,
  MdFavorite,
  MdTranslate,
  MdSettings,
  MdLogout,
  MdChevronRight,
  MdBuild,
  MdWorkOutline,
  MdPhone,
  MdLocationOn,
  MdAdd,
} from "react-icons/md";
import styles from "./ProfilePage.module.css";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
  profilePicture?: string;
  phoneNumber?: string;
  address?: string;
  bio?: string;
  skills?: string[];
  rating?: number;
  experienceYears?: number;
  jobsCompleted?: number;
}

const ProfilePage: React.FC = () => {
  // --- States ---
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const url = import.meta.env.VITE_API_URL;

  // --- Fetch Data ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/user/profile");
        setUser(res.data);
        console.log(res.data);
      } catch (err: any) {
        console.error("Profile fetch error:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load profile. Please try again."
        );
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // --- Helper Functions ---
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getDefaultAvatarColor = (name: string) => {
    const colors = [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // --- Loading & Error States ---
  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
        <p>Loading Brico Profile...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className={styles.errorWrapper}>
        <div className={styles.errorIcon}>⚠️</div>
        <h3 className={styles.errorTitle}>Profile Not Loaded</h3>
        <p className={styles.errorMessage}>
          {error || "Failed to load profile. Please login again."}
        </p>
        <button
          className={styles.retryBtn}
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
        <button className={styles.loginBtn} onClick={() => navigate("/login")}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      {/* Header */}
      <div className={styles.stickyHeader}>
        <h2 className={styles.headerTitle}>My Profile</h2>
      </div>

      <div className={styles.scrollArea}>
        <div className={styles.container}>
          {/* 1. Profile Card Section */}
          <section className={styles.profileCard}>
            <div className={styles.avatarWrapper}>
              {user.profilePicture ? (
                <div
                  className={styles.avatar}
                  style={{
                    backgroundImage: `url(${url}/files/${user.profilePicture})`,
                  }}
                />
              ) : (
                <div
                  className={styles.avatarInitials}
                  style={{
                    background: getDefaultAvatarColor(user.fullName),
                  }}
                >
                  <span className={styles.initialsText}>
                    {getUserInitials(user.fullName)}
                  </span>
                </div>
              )}
              <button
                className={styles.editAvatarBtn}
                onClick={() => navigate("/edit-profile")}
              >
                <MdEdit />
              </button>
            </div>

            <div className={styles.userInfo}>
              <h1 className={styles.userName}>{user.fullName}</h1>
              <span className={styles.badge}>
                {user.role === "worker" ? "Professional" : "Client"}
              </span>
              <p className={styles.userContact}>{user.email}</p>
            </div>

            <button
              className={styles.editProfileBtn}
              onClick={() => navigate("/edit-profile")}
            >
              <MdSettingsApplications size={20} />
              <span>Edit Profile</span>
            </button>
          </section>

          {/* 2. Contact & Location Section */}
          <section className={styles.infoSection}>
            <div className={styles.contactRow}>
              <MdPhone className={styles.contactIcon} />
              <span>
                {user.phoneNumber || (
                  <button
                    className={styles.addInfoBtn}
                    onClick={() => navigate("/edit-profile")}
                  >
                    <MdAdd size={14} />
                    Add phone number
                  </button>
                )}
              </span>
            </div>
            <div className={styles.dividerSmall} />
            <div className={styles.contactRow}>
              <MdLocationOn className={styles.contactIcon} />
              <span>
                {user.address || (
                  <button
                    className={styles.addInfoBtn}
                    onClick={() => navigate("/edit-profile")}
                  >
                    <MdAdd size={14} />
                    Add address
                  </button>
                )}
              </span>
            </div>
          </section>

          {/* 3. About Section */}
          <section className={styles.infoSection}>
            <h3 className={styles.sectionHeading}>About Me</h3>
            <p className={styles.description}>
              {user.bio || (
                <button
                  className={styles.addInfoBtn}
                  onClick={() => navigate("/edit-profile")}
                >
                  <MdAdd size={14} />
                  Add bio description
                </button>
              )}
            </p>
          </section>

          {/* Skills Section */}
          <section className={styles.infoSection}>
            <div className={styles.sectionHeaderRow}>
              <h3 className={styles.sectionHeading}>Core Skills</h3>
              <MdBuild className={styles.sectionIcon} />
            </div>
            <div className={styles.skillsGrid}>
              {user.skills && user.skills.length > 0 ? (
                user.skills.map((skill: string, index: number) => (
                  <span key={index} className={styles.skillTag}>
                    {skill}
                  </span>
                ))
              ) : (
                <button
                  className={styles.addInfoBtn}
                  onClick={() => navigate("/edit-profile")}
                >
                  <MdAdd size={14} />
                  Add your skills
                </button>
              )}
            </div>
          </section>

          {/* Stats Grid */}
          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <span className={styles.statValue}>
                {user.jobsCompleted || 0}
              </span>
              <span className={styles.statLabel}>Jobs</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statValue}>
                {user.rating?.toFixed(1) || "0.0"}
              </span>
              <div className={styles.ratingRow}>
                <MdStar className={styles.starIcon} />
                <span className={styles.statLabel}>Rating</span>
              </div>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statValue}>
                {user.experienceYears || 0}y
              </span>
              <span className={styles.statLabel}>Exp.</span>
            </div>
          </div>

          {/* 4. Menu Groups */}
          <div className={styles.menuGroup}>
            <p className={styles.groupLabel}>Workspace</p>
            <MenuButton
              icon={<MdApartment />}
              title="My Projects"
              desc="Manage construction sites"
            />
            <div className={styles.divider} />
            <MenuButton
              icon={<MdFavorite />}
              title="Saved Designs"
              desc="Favorite house plans"
            />
          </div>

          <div className={styles.menuGroup}>
            <p className={styles.groupLabel}>Services</p>
            <MenuButton
              icon={<MdWorkOutline />}
              title="My Services"
              desc="Manage offered services"
            />
            <div className={styles.divider} />
            <MenuButton
              icon={<MdBuild />}
              title="Equipment"
              desc="Tools & machinery"
            />
          </div>

          <div className={styles.menuGroup}>
            <p className={styles.groupLabel}>Settings</p>
            <MenuButton icon={<MdTranslate />} title="Language" sub="English" />
            <div className={styles.divider} />
            <MenuButton icon={<MdSettings />} title="App Settings" />
          </div>

          {/* Logout */}
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <MdLogout size={20} />
            <span>Log Out</span>
          </button>

          <p className={styles.versionText}>Brico v2.4.0</p>
        </div>
      </div>
    </div>
  );
};

// Sub-Component
interface MenuButtonProps {
  icon: React.ReactNode;
  title: string;
  desc?: string;
  sub?: string;
  onClick?: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({
  icon,
  title,
  desc,
  sub,
  onClick,
}) => (
  <button className={styles.menuItem} onClick={onClick}>
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
