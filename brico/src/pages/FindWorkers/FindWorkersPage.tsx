import React, { useState, useEffect, useCallback } from "react";
import ExploreHeader from "../../components/workers/ExploreHeader/ExploreHeader";
import WorkerCard from "../../components/workers/WorkerCard/WorkerCard";
import styles from "./FindWorkersPage.module.css";
import {
  getNativeLocation,
  getAddressFromCoords,
} from "../../utils/getLocation";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

interface Worker {
  id: string;
  name: string;
  role: string;
  category: string;
  rating: number;
  distance: string;
  price: string;
  available: boolean;
  image: string;
}

const FindWorkersPage: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState("All");
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocationName, setUserLocationName] = useState("Detecting...");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const categories = [
    "All",
    "Mason",
    "Electrician",
    "Plumber",
    "Carpenter",
    "Painter",
    "Welder",
  ];

  // 1. Function to Fetch Gigs from Backend
  const loadGigs = useCallback(
    async (pageNum: number, category: string, reset: boolean = false) => {
      try {
        setLoading(true);
        const coords = await getNativeLocation();

        if (!coords) {
          setLoading(false);
          return;
        }

        // API Call
        const response = await api.post(
          `/gigs/get-gigs?page=${pageNum}&category=${category}`,
          {
            lat: coords.lat,
            lng: coords.lng,
          }
        );

        const newWorkers = response.data.data;

        console.log(newWorkers);

        if (reset) {
          setWorkers(newWorkers);
        } else {
          setWorkers((prev) => [...prev, ...newWorkers]);
        }

        // Agar data limit se kam hai toh mazeed load nahi karega
        setHasMore(newWorkers.length === 20);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching gigs:", err);
        setLoading(false);
      }
    },
    []
  );

  // 2. Initial Load: Location and First Page
  useEffect(() => {
    const init = async () => {
      const coords = await getNativeLocation();
      if (coords) {
        const address = await getAddressFromCoords(coords.lat, coords.lng);
        setUserLocationName(address?.shortName || "Unknown Location");
        loadGigs(1, selectedCat, true);
      }
    };
    init();
  }, []);

  // 3. Category Change Handler
  useEffect(() => {
    setPage(1);
    loadGigs(1, selectedCat, true);
  }, [selectedCat, loadGigs]);

  // 4. Load More (Infinite Scroll Logic trigger)
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadGigs(nextPage, selectedCat);
  };

  return (
    <div className={styles.page}>
      <div className={styles.stickyHeader}>
        <ExploreHeader location={userLocationName} />
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

      <div className={styles.content}>
        <div className={styles.sectionTitle}>
          <h2>
            {selectedCat === "All"
              ? "Nearby Professionals"
              : `${selectedCat}s Near You`}
          </h2>
        </div>

        <div className={styles.list}>
          {workers.map((worker) => (
            <div
              onClick={() =>
                navigate(`/gig-detail/${worker.id}`, {
                  state: { role: worker.role, img: worker.image },
                })
              }
            >
              <WorkerCard key={worker.id} {...worker} />
            </div>
          ))}

          {loading && <p className={styles.loader}>Finding professionals...</p>}

          {!loading && hasMore && workers.length > 0 && (
            <button className={styles.loadMoreBtn} onClick={handleLoadMore}>
              Load More
            </button>
          )}

          {!loading && workers.length === 0 && (
            <div className={styles.noData}>No {selectedCat}s found nearby.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindWorkersPage;
