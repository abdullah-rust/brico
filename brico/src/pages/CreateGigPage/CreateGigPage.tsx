import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  MdArrowBack,
  MdAddAPhoto,
  MdClose,
  MdCalendarMonth,
  MdArrowForward,
  MdAttachMoney,
} from "react-icons/md";
import Swal from "sweetalert2";
import styles from "./CreateGigPage.module.css";
import {
  getNativeLocation,
  getAddressFromCoords,
} from "../../utils/getLocation";
import api from "../../utils/api";

interface GigFormInputs {
  title: string;
  category: string;
  description: string;
  price: number;
  rateType: string;
  workingHours: string;
  phone: string;
}

const CreateGigPage: React.FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Mason");

  const categories = [
    "Mason",
    "Electrician",
    "Plumber",
    "Carpenter",
    "Painter",
    "Welder",
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GigFormInputs>();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages((prev) => [...prev, ...filesArray]);

      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: GigFormInputs) => {
    // 1. Initial Validation
    if (images.length === 0) {
      return Swal.fire(
        "Required",
        "Please upload at least one portfolio image.",
        "warning"
      );
    }

    try {
      // 2. Loading State Start
      Swal.fire({
        title: "Fetching Location...",
        text: "Please wait while we detect your area.",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      // 3. Location Fetching
      const coords = await getNativeLocation(); // Native plugin use kar rahe hain
      if (!coords) return; // Error handling already inside getNativeLocation

      const addressObj = await getAddressFromCoords(coords.lat, coords.lng);

      if (!addressObj) {
        return Swal.fire(
          "Location Error",
          "Unable to fetch your area name. Try again.",
          "error"
        );
      }

      // 4. Prepare Form Data
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("category", selectedCategory);
      formData.append("description", data.description);
      formData.append("priceBase", data.price.toString()); // Prisma field: priceBase
      formData.append("lat", coords.lat.toString());
      formData.append("lng", coords.lng.toString());
      formData.append("locationName", addressObj.shortName); // "Block B, Islamabad"

      // Additional info
      formData.append("rateType", data.rateType);
      formData.append("phone", data.phone);

      // 5. Append Images
      images.forEach((imgFile) => {
        formData.append("portfolio", imgFile); // Aap "portfolio" naam use kar rahe hain
      });

      // 6. Update Swal to Uploading
      Swal.fire({
        title: "Publishing Gig...",
        text: "Uploading details and portfolio images.",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      // 7. Actual API Call
      // Note: Axios automatically sets 'multipart/form-data' header when it sees FormData
      await api.post("/gigs/publish", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // 8. Success Response
      Swal.fire({
        icon: "success",
        title: "Gig Published!",
        text: `Your gig is live in ${addressObj.shortName}.`,
        confirmButtonColor: "#11d4b4",
      }).then(() => {
        // Redirect ya back jao
        window.history.back();
      });
    } catch (err: any) {
      console.error("Submission Error:", err);
      Swal.fire(
        "Submission Failed",
        err.response?.data?.message || "Something went wrong while publishing.",
        "error"
      );
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button
          onClick={() => window.history.back()}
          className={styles.backButton}
          aria-label="Go back"
        >
          <MdArrowBack />
        </button>
        <h1>Create New Gig</h1>
        <div style={{ width: "24px" }}></div> {/* For spacing */}
      </header>

      <main className={styles.main}>
        {/* Portfolio Section */}
        <section className={styles.section}>
          <h2>Portfolio</h2>
          <p>Upload your work photos to attract clients.</p>
          <div className={styles.imageGrid}>
            <label className={styles.addBtn}>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
              <MdAddAPhoto />
              <span>Add</span>
            </label>
            {previews.map((src, i) => (
              <div key={i} className={styles.previewCard}>
                <img src={src} alt={`preview-${i}`} />
                <button
                  onClick={() => removeImage(i)}
                  aria-label="Remove image"
                >
                  <MdClose />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Form Details */}
        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="title">Gig Title *</label>
            <input
              id="title"
              {...register("title", { required: "Title is required" })}
              placeholder="e.g. Expert Home Wiring"
            />
            {errors.title && (
              <span className={styles.error}>{errors.title.message}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>Category</label>
            <div className={styles.chipContainer}>
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  className={
                    selectedCategory === cat ? styles.activeChip : styles.chip
                  }
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              {...register("description", {
                required: "Please describe your service",
              })}
              placeholder="Detail your experience and tools..."
            />
            {errors.description && (
              <span className={styles.error}>{errors.description.message}</span>
            )}
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="price">Price (₹) *</label>
              <div className={styles.iconInput}>
                <MdAttachMoney />
                <input
                  id="price"
                  type="number"
                  {...register("price", {
                    required: "Price is required",
                    min: { value: 1, message: "Price must be greater than 0" },
                  })}
                  placeholder="0"
                />
              </div>
              {errors.price && (
                <span className={styles.error}>{errors.price.message}</span>
              )}
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="rateType">Rate Type</label>
              <select id="rateType" {...register("rateType")}>
                <option value="Per Day">Per Day</option>
                <option value="Per Hour">Per Hour</option>
                <option value="Fixed">Fixed</option>
              </select>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="workingHours">Working Hours *</label>
            <div className={styles.iconInput}>
              <MdCalendarMonth />
              <input
                id="workingHours"
                {...register("workingHours", {
                  required: "Working hours are required",
                })}
                placeholder="Mon-Sat, 9am-6pm"
              />
            </div>
            {errors.workingHours && (
              <span className={styles.error}>
                {errors.workingHours.message}
              </span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="phone">Contact Number *</label>
            <input
              id="phone"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Enter a valid 10-digit phone number",
                },
              })}
              type="tel"
              placeholder="Your mobile number"
            />
            {errors.phone && (
              <span className={styles.error}>{errors.phone.message}</span>
            )}
          </div>
        </form>
      </main>

      <footer className={styles.cta}>
        <button
          onClick={handleSubmit(onSubmit)}
          className={styles.publishBtn}
          type="button"
        >
          Publish Gig <MdArrowForward />
        </button>
      </footer>
    </div>
  );
};

export default CreateGigPage;
