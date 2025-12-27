import React, { useState, useEffect } from "react";
import ExploreHeader from "../../components/workers/ExploreHeader/ExploreHeader";
import WorkerCard from "../../components/workers/WorkerCard/WorkerCard";
import styles from "./FindWorkersPage.module.css";
import { getNativeLocation } from "../../utils/getLocation";
import { getAddressFromCoords } from "../../utils/getLocation";

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
  const [userLocation, setUserLocation] = useState("");

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
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDSoP8DWQ69ZqMaRfe7xHd86kSU867Iq-WzKP8dbMAvpcaHyu9iOOGLPw_DAHB29xPG2A2oHZkFwNoxQ4Ln1tVppPWficU4GtDzCqBEWw6SnTJqUnLnZ05xMINrAWwOTyi6pkOn9pIOAqny2hizKSrRJolWvyu_PeQDnuuwpI5mhECm7IQz71Fs4sxKD9B7y-wK4fktLnFOFHpZWV5_ZwI1UTbRUXYbWppv6TDkpfuJcRYyftWcwob0KnBtTbZveepnb30b9KG1y9Zq",
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
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDSoP8DWQ69ZqMaRfe7xHd86kSU867Iq-WzKP8dbMAvpcaHyu9iOOGLPw_DAHB29xPG2A2oHZkFwNoxQ4Ln1tVppPWficU4GtDzCqBEWw6SnTJqUnLnZ05xMINrAWwOTyi6pkOn9pIOAqny2hizKSrRJolWvyu_PeQDnuuwpI5mhECm7IQz71Fs4sxKD9B7y-wK4fktLnFOFHpZWV5_ZwI1UTbRUXYbWppv6TDkpfuJcRYyftWcwob0KnBtTbZveepnb30b9KG1y9Zq",
            },
          ];
          setWorkers(dummyWorkers);
          setLoading(false);
        }, 600);
      } catch (err) {
        setLoading(false);
      }
    };

    const fetchLocation = async () => {
      const coords = await getNativeLocation();
      if (coords) {
        const address = await getAddressFromCoords(coords.lat, coords.lng);
        setUserLocation(address?.shortName || "Unknown Location");
      }
    };
    fetchLocation();
    fetchWorkers();
  }, []);

  const filteredWorkers =
    selectedCat === "All"
      ? workers
      : workers.filter((w) => w.category === selectedCat);

  return (
    <div className={styles.page}>
      {/* Top Sticky Section */}
      <div className={styles.stickyHeader}>
        <ExploreHeader location={userLocation} />
        <div className={styles.categoryScroll}>
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

      {/* Main Scrollable Content */}
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
