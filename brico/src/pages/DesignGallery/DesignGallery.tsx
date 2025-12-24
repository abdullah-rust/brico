import React, { useState } from "react";
import { MdSearch, MdFavorite } from "react-icons/md";
import styles from "./DesignGallery.module.css";

const DesignGallery: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = [
    "All",
    "Elevations",
    "5 Marla",
    "10 Marla",
    "Floor Plans",
    "Spanish",
  ];

  const designs = [
    {
      id: 1,
      title: "10 Marla Modern Front",
      category: "Elevation",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1DzK2kkvwspLOeYxDZ6e2zuN3Pk-jnH9qLsTNuYMCaDIml0ZFdQvDzLjX--tvCNnevncYDMPm6kPdE35GugCDY-Wj47ZKbDNi89-YyfYA5YU79iuz6u4lBs8yo711NREGYSvl3sNq92R3nO_7i_C70dcGH02-mdXIzxVb_o9wByQQXblyFsimNTB7iYWu2WEJS718k5P8mNsQYbGEJuq_kU0wtJwB9j2w0BCb5JNQaFKpLqwNXY_2Ps8bgDYZMjoYcrBRWBM5KXLW",
      ratio: styles.aspect34,
    },
    {
      id: 2,
      title: "5 Marla Open Concept Map",
      category: "Floor Plan",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDrEOL-OcoBjJnnYz4jDKhOwDOvXTMiADoF4AlogG-4yekhedGv53YS5FX7UaFNG4I7hijxUIYqSwklXSLyZUkxNrcM79PJ_UCdT2dSxCqLb3k-BlEaHPji5VboBbafk_8qO8OuzKqrTTiavzGHRVTLW0IB3mEIgIbcc_xinC5XYqM7c_ngTg_uwxT9_X_5crQdAb1w-Yi8xoR3yMwZfXN11JHIeJRcmBMk9i3_jBojSRwMAobT2iHS-S7uQUfWf9y221knL_BjXn-9",
      ratio: styles.aspect43,
    },
    {
      id: 3,
      title: "1 Kanal Spanish Villa",
      category: "Spanish",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDC2TUqwAJhOXQe7V7GIhdiCxrkoYQVuX9GlzWoWzW22k378FP-pbFkq9xSPZgkrGR5Dt9iROVXCriko2v1O2V96Im_bO54D9-AO0NqhaqYkWeA6O7ukk_NcvNt2niT24-jeC36HN8xd9XRnLIVOG3dyjdTRV2kbv9V46YAdeiX23yJfnPojklxklMsaPblt0esgg3qYVoRpX1ElkzgLpn_4XUQ8VidwLuiO6KJ7HXSnXM7PmnJ6V_YbEnLjygs5gcooY2-fGgwJxqx",
      ratio: styles.aspect35,
    },
    {
      id: 4,
      title: "3 Marla Low Cost",
      category: "3D Model",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJz1UxRf5xYFD-0kkM6ZkU0IDi4OVPnOatUZzLsOswjA5TcT6QXu2sDTFgLJCKHtal_ohvhY5cWHs3AAdBlQkiPYpvOEAudqUp8He-_nCAVqTf8PYBzKsldLNf4aI313C-YmmVZWMrIa338cPygHAlaHfRL0mBEtY_UI_6UFfSU9i28S4mzyIwD6sjBaztONgGKeS26huQ3uGv8FAhLGxZWawOpmorBR8_V0jm1Dsm7jc1ksiXZyeCQtS8UvZ-vH4A-bRDBiiy5FPB",
      ratio: styles.aspectSquare,
    },
    {
      id: 5,
      title: "7 Marla Grey Structure",
      category: "Contemporary",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvm24JjepB4dCjU0qmn0-q26svvtPRIzBT9v-1nL8euvkvpq8MEc1EUIL_4jQeZlq6ba9i9tdatQAsLugIdr07lSgFVUVGXzW5MrzY-2A5TDHwff0sf6DsBbT8_zMyr3yG_4YNDL9NwDdJnbRKVfY76qdV9G2C8bIWaA6uVmOyh26ajY-eqgEZi-6mCzh7EO52bjWpBULubTxkxsHhuGn58-SI3FuqwCBDvEdfHudxJ0OgTmrMzXdN4VLFqhTPEwQqrc-erFNCHXW9",
      ratio: styles.aspect34,
    },
    {
      id: 6,
      title: "1 Kanal Farmhouse",
      category: "Minimal",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCnUl6AZd5frJGaMukmqpYvlt84gtfgYK4RHekIu1vgldK_JJnHrda6WXqwF_S-NvhjxuM36rsyG2ZxF528R_PTzeF4VNSGReDx5RQ-9kG4sgh5ihhNyi7DzVPhJ1GZnw80T4xlWi-FMmlGJJUNaHYBWuzF98NwH6eUDkGIrW3GmkIgY-_z3KbPEBWsymT9IGJU6YCwm33rW0heDHKePBVZTSGi_g4Aa6KkhkNihcD1PYXQTQMO5bKQbW8KX11S9F7wPCha30c5nrFb",
      ratio: styles.aspect45,
    },
  ];

  return (
    <div className={styles.pageWrapper}>
      {/* Top Header */}
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Design Gallery</h1>
        <button className={styles.iconBtn}>
          <MdSearch size={24} />
        </button>
      </header>

      {/* Filters (Horizontal Scroll) */}
      <div className={styles.filterContainer}>
        <div className={styles.filterScroll}>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={
                activeFilter === f ? styles.filterBtnActive : styles.filterBtn
              }
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry Grid */}
      <main className={styles.scrollArea}>
        <div className={styles.masonryGrid}>
          {designs.map((design) => (
            <div key={design.id} className={styles.designCard}>
              <div className={`${styles.imageWrapper} ${design.ratio}`}>
                <img
                  src={design.img}
                  alt={design.title}
                  className={styles.image}
                />
                <div className={styles.overlay} />
                <button className={styles.favBtn}>
                  <MdFavorite size={18} />
                </button>
                <div className={styles.cardContent}>
                  <span className={styles.categoryBadge}>
                    {design.category}
                  </span>
                  <h3 className={styles.designTitle}>{design.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DesignGallery;
