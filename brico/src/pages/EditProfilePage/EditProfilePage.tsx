import React, { useState, useEffect } from "react";
import {
  MdArrowBack,
  MdSave,
  MdPerson,
  MdCall,
  MdLocationOn,
  MdPhotoCamera,
  MdDescription,
} from "react-icons/md";
import styles from "./EditProfilePage.module.css";
import api from "../../utils/api";

interface EditProfileData {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  bio: string;
  skills: string[];
  experienceYears: number;
  rating: number;
  profileImage?: string; // ✅ added
}

interface Skill {
  id: string;
  name: string;
}

const EditProfilePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tempSkill, setTempSkill] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null); // ✅ added
  const [imageFile, setImageFile] = useState<File | null>(null);
  const url = import.meta.env.VITE_API_URL;
  const [profileData, setProfileData] = useState<EditProfileData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    bio: "",
    skills: [],
    experienceYears: 0,
    rating: 0,
    profileImage: "",
  });

  const availableSkills: Skill[] = [
    { id: "1", name: "Carpentry" },
    { id: "2", name: "Plumbing" },
    { id: "3", name: "Electrical" },
    { id: "4", name: "Painting" },
    { id: "5", name: "Masonry" },
    { id: "6", name: "Tiling" },
    { id: "7", name: "Welding" },
    { id: "8", name: "Roofing" },
    { id: "9", name: "Flooring" },
    { id: "10", name: "HVAC" },
    { id: "11", name: "Landscaping" },
    { id: "12", name: "Drywall" },
  ];

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/user/profile");
      const data = res.data;

      console.log(res.data);

      setProfileData({
        fullName: data.fullName || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        address: data.address || "",
        bio: data.bio || "",
        skills: data.skills || [],
        experienceYears: data.experienceYears || 0,
        rating: data.rating || 0,
        profileImage: data.profilePicture || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof EditProfileData,
    value: string | number
  ) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddSkill = (skillName: string) => {
    if (skillName.trim() && !profileData.skills.includes(skillName.trim())) {
      setProfileData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillName.trim()],
      }));
      setTempSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("fullName", profileData.fullName);
      formData.append("phoneNumber", profileData.phoneNumber);
      formData.append("address", profileData.address);
      formData.append("bio", profileData.bio);
      formData.append(
        "experienceYears",
        profileData.experienceYears.toString()
      );

      profileData.skills.forEach((skill) => {
        formData.append("skills[]", skill);
      });

      // Image file key ko backend se match karo
      if (imageFile) {
        formData.append("profilePicture", imageFile); // ✅ FIXED: "profileImage" ki jagah "profilePicture"
      }

      await api.post("/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      window.history.back();
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setImageFile(file); // ✅ backend ke liye
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    };

    input.click();
  };

  const getFirstLetter = () => {
    if (!profileData.fullName) return "?";
    return profileData.fullName.trim().charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
        <p>Loading Profile...</p>
      </div>
    );
  }

  const avatarImage =
    imagePreview || `${url}/files/${profileData.profileImage}`;

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.appBar}>
        <button className={styles.backButton} onClick={handleBack}>
          <MdArrowBack />
        </button>
        <h2 className={styles.headerTitle}>Edit Profile</h2>
      </header>

      <main className={styles.mainContent}>
        {/* Profile Picture Section */}
        <div className={styles.profilePictureSection}>
          <div className={styles.avatarWrapper}>
            {avatarImage ? (
              <div>
                <div
                  className={styles.avatar}
                  style={{ backgroundImage: `url(${avatarImage})` }}
                />
              </div>
            ) : (
              <div className={styles.avatarLetter}>{getFirstLetter()}</div>
            )}

            <button className={styles.cameraButton} onClick={handleImageUpload}>
              <MdPhotoCamera />
            </button>
          </div>

          <div className={styles.profileInfo}>
            <h1 className={styles.userName}>{profileData.fullName}</h1>
            <button
              className={styles.changePictureBtn}
              onClick={handleImageUpload}
            >
              Change Profile Picture
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className={styles.formContainer}>
          {/* Name Field */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Full Name</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                className={styles.formInput}
                placeholder="Enter your full name"
                value={profileData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
              />
              <MdPerson className={styles.inputIcon} />
            </div>
          </div>

          {/* Phone Field */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Phone Number</label>
            <div className={styles.inputWrapper}>
              <input
                type="tel"
                className={styles.formInput}
                placeholder="+91 00000 00000"
                value={profileData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
              />
              <MdCall className={styles.inputIcon} />
            </div>
          </div>

          {/* Address Field */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Address</label>
            <div className={styles.textareaWrapper}>
              <textarea
                className={styles.formTextarea}
                placeholder="Enter your address"
                value={profileData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                rows={4}
              />
              <MdLocationOn className={styles.textareaIcon} />
            </div>
          </div>

          {/* Bio Field */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>About Me (Bio)</label>
            <div className={styles.textareaWrapper}>
              <textarea
                className={styles.formTextarea}
                placeholder="Tell us about yourself and your experience..."
                value={profileData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                rows={4}
              />
              <MdDescription className={styles.textareaIcon} />
            </div>
          </div>

          {/* Skills Field */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Skills</label>
            <div className={styles.skillsContainer}>
              <div className={styles.selectedSkills}>
                {profileData.skills.map((skill, index) => (
                  <div key={index} className={styles.skillTag}>
                    {skill}
                    <button
                      className={styles.removeSkillBtn}
                      onClick={() => handleRemoveSkill(skill)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className={styles.skillInputContainer}>
                <input
                  type="text"
                  className={styles.skillInput}
                  placeholder="Add a skill (e.g., Plumbing)"
                  value={tempSkill}
                  onChange={(e) => setTempSkill(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAddSkill(tempSkill);
                    }
                  }}
                />
                <button
                  className={styles.addSkillBtn}
                  onClick={() => handleAddSkill(tempSkill)}
                >
                  Add
                </button>
              </div>
              <div className={styles.skillsSuggestions}>
                <p className={styles.suggestionsLabel}>Popular Skills:</p>
                <div className={styles.suggestionsGrid}>
                  {availableSkills.map((skill) => (
                    <button
                      key={skill.id}
                      className={`${styles.suggestionTag} ${
                        profileData.skills.includes(skill.name)
                          ? styles.suggestionTagSelected
                          : ""
                      }`}
                      onClick={() => {
                        if (!profileData.skills.includes(skill.name)) {
                          handleAddSkill(skill.name);
                        }
                      }}
                    >
                      {skill.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Experience Years */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Years of Experience: {profileData.experienceYears} years
            </label>
            <div className={styles.rangeContainer}>
              <input
                type="range"
                min="0"
                max="50"
                value={profileData.experienceYears}
                onChange={(e) =>
                  handleInputChange("experienceYears", parseInt(e.target.value))
                }
                className={styles.rangeInput}
              />
              <div className={styles.rangeLabels}>
                <span>0</span>
                <span>10</span>
                <span>20</span>
                <span>30</span>
                <span>40</span>
                <span>50+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className={styles.saveButtonContainer}>
          <button
            className={styles.saveButton}
            onClick={handleSaveProfile}
            disabled={saving}
          >
            {saving ? (
              <div className={styles.saveSpinner}></div>
            ) : (
              <>
                <MdSave />
                Save Changes
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default EditProfilePage;
