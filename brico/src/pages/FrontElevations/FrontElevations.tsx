import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  MdArrowBack,
  MdFavoriteBorder,
  MdSearch,
  MdClose,
  MdFileDownload,
} from "react-icons/md";
import Swal from "sweetalert2";
import api from "../../utils/api";
import styles from "./FrontElevations.module.css";
import { Filesystem, Directory } from "@capacitor/filesystem";

const FrontElevations: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const url = import.meta.env.VITE_API_URL;

  const filters = [
    "All",
    "3 Marla",
    "5 Marla",
    "10 Marla",
    "1 Kanal",
    "Modern",
    "Spanish",
  ];

  // --- Fetch Data from Backend ---
  const {
    data: designs,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["elevations", activeFilter, searchResults],
    queryFn: async () => {
      if (searchResults && activeFilter === "Search Result")
        return searchResults;

      // Category filter 'Elevations' fix hai
      let endpoint = `/design/get-designs?category=Elevations&limit=50`;

      if (activeFilter !== "All") {
        if (activeFilter.includes("Marla") || activeFilter.includes("Kanal")) {
          endpoint += `&size=${activeFilter}`;
        } else {
          endpoint += `&style=${activeFilter}`;
        }
      }

      const res = await api.get(endpoint);
      return res.data.data;
    },
  });

  // --- Search Logic ---
  const handleSearch = () => {
    Swal.fire({
      title: "Search Elevations",
      input: "text",
      inputPlaceholder: "Enter style or size (e.g. Modern, 10 Marla)...",
      showCancelButton: true,
      confirmButtonColor: "#11d4b4",
      confirmButtonText: "Search",
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          const res = await api.get(
            `/design/get-designs?category=Elevations&search=${result.value}`
          );
          if (res.data.data.length > 0) {
            setSearchResults(res.data.data);
            setActiveFilter("Search Result");
          } else {
            Swal.fire("Not Found", "No matching designs found.", "info");
          }
        } catch (err) {
          Swal.fire("Error", "Search failed. Please try again.", "error");
        }
      }
    });
  };

  // --- Download Logic ---
  const downloadImage = async (e: React.MouseEvent, imgPath: string) => {
    e.preventDefault();
    e.stopPropagation();
    const fullUrl = `${url}/files/${imgPath}`;

    try {
      const response = await fetch(fullUrl);
      const blob = await response.blob();
      const fileName = `Brico-Elevation-${Date.now()}.jpg`;
      const isNative = (window as any).Capacitor?.isNativePlatform();

      if (!isNative) {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          const base64Data = reader.result as string;
          await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Documents,
          });
        };
      }

      Swal.fire({
        icon: "success",
        title: "Saved to Gallery",
        timer: 1500,
        showConfirmButton: false,
      });
      setPreviewImage(null);
    } catch (err) {
      Swal.fire("Error", "Could not save the image.", "error");
    }
  };

  return (
    <>
      <div className={styles.pageWrapper}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <button className={styles.backBtn} onClick={() => navigate(-1)}>
              <MdArrowBack size={24} />
            </button>
            <h1 className={styles.title}>Front Elevations</h1>
            <button className={styles.iconBtn} onClick={handleSearch}>
              <MdSearch size={24} />
            </button>
          </div>
          <div className={styles.filterScroll}>
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => {
                  setActiveFilter(f);
                  setSearchResults(null);
                }}
                className={
                  activeFilter === f ? styles.filterActive : styles.filterPill
                }
              >
                {f}
              </button>
            ))}
          </div>
        </header>

        <main className={styles.scrollContent}>
          {isLoading ? (
            <div className={styles.gridContainer}>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className={styles.skeletonCard}></div>
              ))}
            </div>
          ) : isError ? (
            <div className={styles.errorBox}>
              Something went wrong. Please try again.
            </div>
          ) : designs?.length === 0 ? (
            <div className={styles.noData}>
              No elevations found in this category.
            </div>
          ) : (
            <div className={styles.gridContainer}>
              {designs?.map((design: any) => (
                <div
                  key={design.id}
                  className={styles.designCard}
                  onClick={() => setPreviewImage(design.imageUrl)}
                >
                  <div className={styles.imageWrapper}>
                    <img
                      src={`${url}/files/${design.imageUrl}`}
                      alt={design.title}
                      loading="lazy"
                    />
                    <button
                      className={styles.favBtn}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MdFavoriteBorder size={18} />
                    </button>
                  </div>
                  <div className={styles.cardInfo}>
                    <div className={styles.styleBadge}>
                      <span>{design.styleTag || "Modern"}</span>
                    </div>
                    <span className={styles.sizeTag}>{design.sizeTag}</span>
                    <h3 className={styles.designTitle}>{design.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {previewImage && (
        <div
          className={styles.previewOverlay}
          onClick={() => setPreviewImage(null)}
        >
          <div
            className={styles.previewContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.previewClose}
              onClick={() => setPreviewImage(null)}
            >
              <MdClose size={28} />
            </button>
            <button
              className={styles.previewDownload}
              onClick={(e) => downloadImage(e, previewImage)}
            >
              <MdFileDownload size={28} />
            </button>
            <img
              src={`${url}/files/${previewImage}`}
              alt="Design Preview"
              className={styles.previewImage}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default FrontElevations;
