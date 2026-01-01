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
import styles from "./FrontElevations.module.css";

// Capacitor plugins
import { Filesystem, Directory } from "@capacitor/filesystem";

const ELEVATION_DATA = [
  {
    id: "e1",
    title: "Modern Glass Villa",
    sizeTag: "10 Marla",
    style: "Modern",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600",
  },
  {
    id: "e2",
    title: "Spanish Arched Front",
    sizeTag: "1 Kanal",
    style: "Spanish",
    imageUrl:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600",
  },
  {
    id: "e3",
    title: "Minimalist Grey Cubic",
    sizeTag: "5 Marla",
    style: "Modern",
    imageUrl:
      "https://images.unsplash.com/photo-1513584684374-8bdb7489feef?q=80&w=600",
  },
  {
    id: "e4",
    title: "Classical Brick Look",
    sizeTag: "10 Marla",
    style: "Classical",
    imageUrl:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=600",
  },
  {
    id: "e5",
    title: "Twin Unit Modern",
    sizeTag: "5 Marla",
    style: "Modern",
    imageUrl:
      "https://images.unsplash.com/photo-1598228723793-52759bba239c?q=80&w=600",
  },
  {
    id: "e6",
    title: "Luxury Farmhouse",
    sizeTag: "2 Kanal",
    style: "Modern",
    imageUrl:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=600",
  },
];

const FrontElevations: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);

  const filters = [
    "All",
    "5 Marla",
    "10 Marla",
    "1 Kanal",
    "Modern",
    "Spanish",
  ];

  // Search Logic with Swal
  const handleSearch = () => {
    Swal.fire({
      title: "Search Design",
      input: "text",
      inputPlaceholder: "Enter style, size (e.g. Modern, 5 Marla)...",
      showCancelButton: true,
      confirmButtonColor: "#11d4b4",
      confirmButtonText: "Search",
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const query = result.value.toLowerCase().trim();
        const filtered = ELEVATION_DATA.filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            item.sizeTag.toLowerCase().includes(query) ||
            item.style.toLowerCase().includes(query)
        );

        if (filtered.length > 0) {
          setSearchResults(filtered);
          setActiveFilter("Search Result"); // Visual cue for the user
        } else {
          Swal.fire("Not Found", "No design matches your search.", "info");
        }
      }
    });
  };

  const { data: designs, isLoading } = useQuery({
    queryKey: ["elevations", activeFilter, searchResults],
    queryFn: async () => {
      if (searchResults && activeFilter === "Search Result")
        return searchResults;
      if (activeFilter === "All") return ELEVATION_DATA;
      return ELEVATION_DATA.filter(
        (item) => item.sizeTag === activeFilter || item.style === activeFilter
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
      const fileName = `brico-${Date.now()}.jpg`;
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
        text: "Design downloaded successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire("Error", "Failed to save image", "error");
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
                  setSearchResults(null); // Reset search when clicking filters
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
            <div className={styles.loader}>Loading...</div>
          ) : (
            <div className={styles.gridContainer}>
              {designs?.map((design) => (
                <div
                  key={design.id}
                  className={styles.designCard}
                  onClick={() => setPreviewImage(design.imageUrl)}
                >
                  <div className={styles.imageWrapper}>
                    <img
                      src={design.imageUrl}
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

export default FrontElevations;
