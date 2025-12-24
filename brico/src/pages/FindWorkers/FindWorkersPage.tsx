import React, { useState, useEffect } from "react";
import ExploreHeader from "../../components/workers/ExploreHeader/ExploreHeader";
import WorkerCard from "../../components/workers/WorkerCard/WorkerCard";
import styles from "./FindWorkersPage.module.css";

interface Worker {
  id: string;
  name: string;
  role: string;
  category: string;
  rating: number;
  distance: string;
  price: string;
  available: boolean;
  isVerified: boolean;
  image: string;
}

const FindWorkersPage: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState("All");
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    "All",
    "Mason",
    "Electrician",
    "Plumber",
    "Carpenter",
    "Painter",
    "Welder",
  ];

  useEffect(() => {
    const fetchWorkers = async () => {
      setLoading(true);
      try {
        setTimeout(() => {
          const dummyWorkers: Worker[] = [
            {
              id: "1",
              name: "Rajesh Kumar",
              role: "Senior Mason",
              category: "Mason",
              rating: 4.8,
              distance: "2.5 km",
              price: "400",
              available: false,
              isVerified: true,
              image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDSoP8DWQ69ZqMaRfe7xHd86kSU867Iq-WzKP8dbMAvpcaHyu9iOOGLPw_DAHB29xPG2A2oHZkFwNoxQ4Ln1tVppPWficU4GtDzCqBEWw6SnTJqUnLnZ05xMINrAWwOTyi6pkOn9pIOAqny2hizKSrRJolWvyu_PeQDnuuwpI5mhECm7IQz71Fs4sxKD9B7y-wK4fktLnFOFHpZWV5_ZwI1UTbRUXYbWppv6TDkpfuJcRYyftWcwob0KnBtTbZveepnb30b9KG1y9Zq",
            },
            {
              id: "2",
              name: "Amit Singh",
              role: "Electrician",
              category: "Electrician",
              rating: 4.9,
              distance: "1.2 km",
              price: "500",
              available: true,
              isVerified: false,
              image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAA2UbTa0CH2W9BFyQptwkgiflWBjX1M9OedXgF4QPH3V3QBBL0pbYxBIdwhaDcobN8WE_Nm5aAJ0ejpJLWv-4Kqa89w8Ahn33QkYEhJEJrwttZrFY_KxgnohAa2JMVLjPZja0_PZTK7kb_uaDOUrxvTFFfkG9kT7eNuIT2l58XCAPNXDyevHNMrM8EnRlKdaYXWNfOCkIB7cM9I9ZDEHLgbsx40f9vD7wyOl-arNjmGtI0lI4wpoMvKofZvIQ7UrcgPFVNoDh6rGcS",
            },
            {
              id: "3",
              name: "Sajid Khan",
              role: "Expert Plumber",
              category: "Plumber",
              rating: 4.5,
              distance: "3.1 km",
              price: "450",
              available: true,
              isVerified: true,
              image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuBU4skSAN_mMoXSilPhflNvWHHm7kDG6DSA-QQk1xAmDuH9HXIWF8f6cPz6oBC0QBGvoGDto6WHOb3yeyuZI_c3O035h04UlAs7O_F6fxxBtPCdWSA3XnaWZ9sZ23PfBXONTZqaaUkyQNxixBfDCFNoHh-yS0PB1Lg0x9adAfP77mfuEjg6965cXlY89JBeP7CF-VCyn9Zwae0vp2a9nrejSP8bv_MO7iIYYCz9Az1NWMqZ5NJkaUfI-dO02XT6nFo3FxqvwlVpae0B",
            },
          ];
          setWorkers(dummyWorkers);
          setLoading(false);
        }, 600);
      } catch (err) {
        console.error("Fetch error:", err);
        setLoading(false);
      }
    };
    fetchWorkers();
  }, []);

  const filteredWorkers =
    selectedCat === "All"
      ? workers
      : workers.filter((w) => w.category === selectedCat);

  const handleTouch = (e: React.TouchEvent) => e.stopPropagation();

  return (
    <div className={styles.page}>
      {/* Sticky Container: Iske andar Header aur Categories dono fixed rahengi */}
      <div className={styles.stickyHeader}>
        <ExploreHeader />
        <div
          className={`${styles.categoryScroll} swiper-no-swiping`}
          onTouchStart={handleTouch}
          onTouchMove={handleTouch}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={
                selectedCat === cat ? styles.catActive : styles.catInactive
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className={styles.content}>
        <div className={styles.sectionTitle}>
          <h2>
            {selectedCat === "All"
              ? "Nearby Professionals"
              : `${selectedCat}s Near You`}
          </h2>
          <button>See all</button>
        </div>

        <div className={styles.list}>
          {loading ? (
            <p className={styles.loader}>Finding professionals...</p>
          ) : filteredWorkers.length > 0 ? (
            filteredWorkers.map((worker) => (
              <WorkerCard key={worker.id} {...worker} />
            ))
          ) : (
            <div className={styles.noData}>No {selectedCat}s available.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindWorkersPage;
