import React, { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import ExploreHeader from "../../components/workers/ExploreHeader/ExploreHeader";
import WorkerCard from "../../components/workers/WorkerCard/WorkerCard";
import styles from "./FindWorkersPage.module.css";
import {
  getNativeLocation,
  getAddressFromCoords,
} from "../../utils/getLocation";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

// 👇 Location ko module-level cache karo (sirf ek baar fetch ho)
let locationPromise: Promise<{ lat: number; lng: number } | null> | null = null;

const getLocationOnce = () => {
  if (!locationPromise) {
    locationPromise = getNativeLocation();
  }
  return locationPromise;
};

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

interface GigsResponse {
  data: Worker[];
  hasNextPage: boolean;
}

const FindWorkersPage: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState("All");
  const [userLocationName, setUserLocationName] = useState("Detecting...");
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

  // 👇 Location & address detect karo sirf pehli baar
  useEffect(() => {
    const fetchLocation = async () => {
      const coords = await getLocationOnce();
      if (coords) {
        const address = await getAddressFromCoords(coords.lat, coords.lng);
        setUserLocationName(address?.shortName || "Unknown Location");
      } else {
        setUserLocationName("Location Unavailable");
      }
    };
    fetchLocation();
  }, []);

  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteQuery<GigsResponse>({
      queryKey: ["gigs", selectedCat],
      initialPageParam: 1, // ✅ Yeh naya requirement hai (v5+)
      queryFn: async ({ pageParam }) => {
        const coords = await getLocationOnce();
        if (!coords) {
          throw new Error("Location not available");
        }

        const res = await api.post(
          `/gigs/get-gigs?page=${pageParam}&category=${selectedCat}`,
          {
            lat: coords.lat,
            lng: coords.lng,
          }
        );
        return res.data; // expect: { data: Worker[], hasNextPage: boolean }
      },
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.hasNextPage ? allPages.length + 1 : undefined;
      },
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    });
  const workers = data?.pages.flatMap((page) => page.data) || [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
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
              key={worker.id}
              onClick={() =>
                navigate(`/gig-detail/${worker.id}`, {
                  state: { role: worker.role, img: worker.image },
                })
              }
            >
              <WorkerCard {...worker} />
            </div>
          ))}

          {isLoading && (
            <p className={styles.loader}>Finding professionals...</p>
          )}

          {isFetching && !isLoading && (
            <p className={styles.loader}>Loading more...</p>
          )}

          {!isLoading && hasNextPage && (
            <button className={styles.loadMoreBtn} onClick={handleLoadMore}>
              Load More
            </button>
          )}

          {!isLoading && workers.length === 0 && (
            <div className={styles.noData}>No {selectedCat}s found nearby.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindWorkersPage;
