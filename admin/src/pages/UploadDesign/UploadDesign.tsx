import React, { useState, useEffect, useRef } from "react";
import { MdCloudUpload, MdClose, MdAutoAwesome } from "react-icons/md";
import api from "../../utils/api";
import Swal from "sweetalert2";
import styles from "./UploadDesign.module.css";

const CATEGORIES = ["Elevations", "House Maps", "Ceiling Designs", "Interior"];
const SIZES = [
  "3 Marla",
  "5 Marla",
  "7 Marla",
  "10 Marla",
  "1 Kanal",
  "2 Kanal",
];
const STYLES = ["Modern", "Spanish", "Classical", "Contemporary", "Minimalist"];

const UploadDesign = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    sizeTag: "",
    styleTag: "",
  });

  // Auto-Title Generation Logic
  useEffect(() => {
    const { sizeTag, styleTag, category } = formData;
    if (sizeTag && styleTag && category) {
      setFormData((prev) => ({
        ...prev,
        title: `${sizeTag} ${styleTag} ${category}`,
      }));
    }
  }, [formData.sizeTag, formData.styleTag, formData.category]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return Swal.fire("Error", "Please select an image", "error");

    setLoading(true);
    const data = new FormData();
    data.append("image", file);
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("sizeTag", formData.sizeTag);
    data.append("styleTag", formData.styleTag);

    try {
      // Backend URL check kar lena (Port 5000 or whatever you use)
      await api.post("/design/add-design", data);

      Swal.fire({
        title: "Success!",
        text: "Design has been uploaded to S3 and Database.",
        icon: "success",
        confirmButtonColor: "#17cfb0",
      });

      // Clear Form
      setFile(null);
      setPreview(null);
      setFormData({
        title: "",
        description: "",
        category: "",
        sizeTag: "",
        styleTag: "",
      });
    } catch (err: any) {
      console.error(err);
      Swal.fire(
        "Upload Failed",
        err.response.data?.message || "Check backend logs or S3 connection",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>Publish Design</h1>
        <p className={styles.subtitle}>
          Create a new entry for Brico architecture database.
        </p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.uploadBox}>
          {!preview ? (
            <div
              className={styles.dropzone}
              onClick={() => fileInputRef.current?.click()}
            >
              <MdCloudUpload size={40} color="#17cfb0" />
              <p>Upload Design Image</p>
              <span>Resolution: 1080p+ recommended</span>
            </div>
          ) : (
            <div className={styles.previewContainer}>
              <img src={preview} alt="Preview" className={styles.previewImg} />
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  setFile(null);
                }}
                className={styles.closeBtn}
              >
                <MdClose size={20} />
              </button>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            hidden
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>

        <div className={styles.inputGrid}>
          <div className={styles.fullWidth}>
            <label>Auto-Generated Title</label>
            <div className={styles.titleWrapper}>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Select tags below..."
                className={styles.titleInput}
              />
              <MdAutoAwesome className={styles.magicIcon} />
            </div>
          </div>

          <div className={styles.halfWidth}>
            <label>Category</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
            >
              <option value="">Select Category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.halfWidth}>
            <label>Property Size</label>
            <select
              value={formData.sizeTag}
              onChange={(e) =>
                setFormData({ ...formData, sizeTag: e.target.value })
              }
              required
            >
              <option value="">Select Size</option>
              {SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.halfWidth}>
            <label>Style Tag</label>
            <select
              value={formData.styleTag}
              onChange={(e) =>
                setFormData({ ...formData, styleTag: e.target.value })
              }
              required
            >
              <option value="">Select Style</option>
              {STYLES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.fullWidth}>
            <label>Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Add more details about materials, number of rooms etc."
            />
          </div>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? "Uploading to S3..." : "Publish to Platform"}
        </button>
      </form>
    </div>
  );
};

export default UploadDesign;
