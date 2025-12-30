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
import styles from "./CeilingDesigns.module.css"; // Consistency ke liye same styles

// Capacitor plugins
import { Filesystem, Directory } from "@capacitor/filesystem";

const CEILING_DATA = [
  {
    id: "c1",
    title: "Modern Gypsum Masterpiece",
    category: "Drawing Room",
    style: "Modern",
    imageUrl:
      "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?q=80&w=600",
  },
  {
    id: "c2",
    title: "Classic Wooden Tray",
    category: "Bedroom",
    style: "Wooden",
    imageUrl:
      "https://images.unsplash.com/photo-1620626011761-9963d7521576?q=80&w=600",
  },
  {
    id: "c3",
    title: "Minimalist Recessed Lighting",
    category: "Lounge",
    style: "Minimalist",
    imageUrl:
      "https://images.unsplash.com/photo-1594904351111-a072f80b1a71?q=80&w=600",
  },
  {
    id: "c4",
    title: "Royal Chandelier Base",
    category: "Drawing Room",
    style: "Classical",
    imageUrl:
      "https://images.unsplash.com/photo-1582582621959-48d245674831?q=80&w=600",
  },
  {
    id: "c5",
    title: "Smart LED Pattern",
    category: "Bedroom",
    style: "Modern",
    imageUrl:
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?q=80&w=600",
  },
  {
    id: "c6",
    title: "Industrial Concrete Finish",
    category: "Kitchen",
    style: "Modern",
    imageUrl:
      "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?q=80&w=600",
  },
];

const CeilingDesigns: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);

  // Ceiling specific categories
  const filters = [
    "All",
    "Drawing Room",
    "Bedroom",
    "Lounge",
    "Modern",
    "Wooden",
    "Minimalist",
  ];

  const handleSearch = () => {
    Swal.fire({
      title: "Search Ceiling Designs",
      input: "text",
      inputPlaceholder: "Search style or room (e.g. Wooden, Bedroom)...",
      showCancelButton: true,
      confirmButtonColor: "#11d4b4",
      confirmButtonText: "Search",
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const query = result.value.toLowerCase().trim();
        const filtered = CEILING_DATA.filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query) ||
            item.style.toLowerCase().includes(query)
        );

        if (filtered.length > 0) {
          setSearchResults(filtered);
          setActiveFilter("Search Result");
        } else {
          Swal.fire(
            "Not Found",
            "Aapki search ke mutabiq koi design nahi mila.",
            "info"
          );
        }
      }
    });
  };

  const { data: designs, isLoading } = useQuery({
    queryKey: ["ceiling-designs", activeFilter, searchResults],
    queryFn: async () => {
      if (searchResults && activeFilter === "Search Result")
        return searchResults;
      if (activeFilter === "All") return CEILING_DATA;
      return CEILING_DATA.filter(
        (item) => item.category === activeFilter || item.style === activeFilter
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
      const fileName = `brico-ceiling-${Date.now()}.jpg`;
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
        text: "Ceiling design downloaded.",
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
            <div className={styles.loader}>Loading Designs...</div>
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
                    <span className={styles.sizeTag}>{design.category}</span>
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

export default CeilingDesigns;
