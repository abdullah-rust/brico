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
import styles from "./CeilingDesigns.module.css";
import { Filesystem, Directory } from "@capacitor/filesystem";

const CeilingDesigns: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const url = import.meta.env.VITE_API_URL;

  // Professional filters for Ceiling
  // Note: Room types ko hum title ya sizeTag mein handle karenge
  const filters = [
    "All",
    "3 Marla",
    "5 Marla",
    "10 Marla",
    "1 Kanal",
    "Modern",
    "Classical",
  ];

  // --- API Fetch Logic ---
  const {
    data: designs,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ceiling-designs", activeFilter, searchResults],
    queryFn: async () => {
      if (searchResults && activeFilter === "Search Result")
        return searchResults;

      // FIX: Category must match exactly what is in your DB ("Ceiling Designs")
      let endpoint = `/design/get-designs?category=Ceiling Designs&limit=50`;

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
      title: "Search Ceiling Designs",
      input: "text",
      inputPlaceholder: "Search e.g. Modern, 5 Marla...",
      showCancelButton: true,
      confirmButtonColor: "#11d4b4",
      confirmButtonText: "Search",
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          // FIX: Exact category "Ceiling Designs" here too
          const res = await api.get(
            `/design/get-designs?category=Ceiling Designs&search=${result.value}`
          );
          if (res.data.data.length > 0) {
            setSearchResults(res.data.data);
            setActiveFilter("Search Result");
          } else {
            Swal.fire(
              "Not Found",
              "No ceiling designs matched your search.",
              "info"
            );
          }
        } catch (err) {
          Swal.fire(
            "Error",
            "Search service is currently unavailable.",
            "error"
          );
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
      const fileName = `Brico-Ceiling-${Date.now()}.jpg`;
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
        title: "Saved!",
        timer: 1500,
        showConfirmButton: false,
      });
      setPreviewImage(null);
    } catch (err) {
      Swal.fire("Error", "Failed to save image.", "error");
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
            <h1 className={styles.title}>Ceiling Designs</h1>
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
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className={styles.skeletonCard}></div>
              ))}
            </div>
          ) : isError ? (
            <div className={styles.errorBox}>Failed to load designs.</div>
          ) : designs?.length === 0 ? (
            <div className={styles.noData}>
              No designs found for this category.
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
                    <div className={styles.categoryBadge}>
                      <span>{design.sizeTag || "General"}</span>
                    </div>
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
              alt="Ceiling Preview"
              className={styles.previewImage}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CeilingDesigns;
