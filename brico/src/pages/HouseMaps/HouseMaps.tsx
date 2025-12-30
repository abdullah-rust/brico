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
import styles from "./HouseMaps.module.css";

// Capacitor plugins
import { Filesystem, Directory } from "@capacitor/filesystem";

const MAPS_DATA = [
  {
    id: "m1",
    title: "Modern 3-Bed Family Plan",
    sizeTag: "5 Marla",
    type: "Double Story",
    imageUrl:
      "https://images.unsplash.com/photo-1503387762-592dea58ef23?q=80&w=600",
  },
  {
    id: "m2",
    title: "Luxury 5-Bed Open Concept",
    sizeTag: "1 Kanal",
    type: "Double Story",
    imageUrl:
      "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=600",
  },
  {
    id: "m3",
    title: "Compact 4-Bed Layout",
    sizeTag: "10 Marla",
    type: "Single Story",
    imageUrl:
      "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?q=80&w=600",
  },
  {
    id: "m4",
    title: "Elite Executive Villa Map",
    sizeTag: "2 Kanal",
    type: "Double Story",
    imageUrl:
      "https://images.unsplash.com/photo-1605146761889-44a581c327e4?q=80&w=600",
  },
  {
    id: "m5",
    title: "Smart 3-Bed Economic",
    sizeTag: "5 Marla",
    type: "Single Story",
    imageUrl:
      "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=600",
  },
  {
    id: "m6",
    title: "Modern Corner Plot Plan",
    sizeTag: "7 Marla",
    type: "Double Story",
    imageUrl:
      "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?q=80&w=600",
  },
];

const HouseMaps: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);

  const filters = [
    "All",
    "5 Marla",
    "10 Marla",
    "1 Kanal",
    "Single Story",
    "Double Story",
  ];

  // --- Search Logic Restored ---
  const handleSearch = () => {
    Swal.fire({
      title: "Search House Maps",
      input: "text",
      inputPlaceholder:
        "Search by size or type (e.g. 5 Marla, Single Story)...",
      showCancelButton: true,
      confirmButtonColor: "#11d4b4",
      confirmButtonText: "Search",
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const query = result.value.toLowerCase().trim();
        const filtered = MAPS_DATA.filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            item.sizeTag.toLowerCase().includes(query) ||
            item.type.toLowerCase().includes(query)
        );

        if (filtered.length > 0) {
          setSearchResults(filtered);
          setActiveFilter("Search Result");
        } else {
          Swal.fire(
            "No Results",
            "Aapki search ke mutabiq koi naqsha nahi mila.",
            "info"
          );
        }
      }
    });
  };

  const { data: maps, isLoading } = useQuery({
    queryKey: ["house-maps", activeFilter, searchResults],
    queryFn: async () => {
      if (searchResults && activeFilter === "Search Result")
        return searchResults;
      if (activeFilter === "All") return MAPS_DATA;
      return MAPS_DATA.filter(
        (item) => item.sizeTag === activeFilter || item.type === activeFilter
      );
    },
  });

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const downloadImage = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!previewImage) return;

    try {
      const response = await fetch(previewImage);
      const blob = await response.blob();
      const fileName = `brico-map-${Date.now()}.jpg`;
      const isNative = (window as any).Capacitor?.isNativePlatform();

      if (!isNative) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        const base64Data = await blobToBase64(blob);
        await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Documents,
        });
      }

      setPreviewImage(null);
      Swal.fire({
        title: "Saved!",
        text: "Map downloaded successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire("Error", "Failed to save map", "error");
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
            <h1 className={styles.title}>House Maps</h1>
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
            <div className={styles.loader}>Loading Blueprints...</div>
          ) : (
            <div className={styles.gridContainer}>
              {maps?.map((map) => (
                <div
                  key={map.id}
                  className={styles.designCard}
                  onClick={() => setPreviewImage(map.imageUrl)}
                >
                  <div className={styles.imageWrapper}>
                    <img src={map.imageUrl} alt={map.title} loading="lazy" />
                    <button
                      className={styles.favBtn}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MdFavoriteBorder size={18} />
                    </button>
                  </div>
                  <div className={styles.cardInfo}>
                    <div className={styles.typeBadge}>
                      <span>{map.type}</span>
                    </div>
                    <span className={styles.sizeTag}>{map.sizeTag}</span>
                    <h3 className={styles.designTitle}>{map.title}</h3>
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
              <MdClose size={24} />
            </button>
            <button className={styles.previewDownload} onClick={downloadImage}>
              <MdFileDownload size={24} />
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className={styles.previewImage}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default HouseMaps;
