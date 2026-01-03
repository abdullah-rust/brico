import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import Swal from "sweetalert2";
import styles from "./Auth.module.css";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSignupRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/admin/admin-signup", formData);

      Swal.fire({
        title: "Request Sent!",
        text: "OTP has been sent to the Owner. Please enter it on the next screen.",
        icon: "info",
        confirmButtonColor: "#17cfb0",
      });

      navigate("/otp", { state: { ...formData } });
    } catch (err: any) {
      Swal.fire(
        "Request Failed",
        err.response?.data?.message || "Username might be taken",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authWrapper}>
      <form className={styles.authCard} onSubmit={handleSignupRequest}>
        <div className={styles.logo}>B</div>
        <h1>Admin Request</h1>
        <p>Enter details to request admin access</p>

        <div className={styles.inputGroup}>
          <label>Desired Username</label>
          <input
            type="text"
            placeholder="e.g. abdullah_admin"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Set Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
        </div>

        <button type="submit" className={styles.authBtn} disabled={loading}>
          {loading ? "Sending Request..." : "Request OTP"}
        </button>

        <p className={styles.toggleLink}>
          Have an account?{" "}
          <span onClick={() => navigate("/login")}>Sign In</span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
