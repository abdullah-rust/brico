import React, { useState } from "react";
import api from "../../utils/api";
import Swal from "sweetalert2";
import styles from "./Login.module.css";

interface LoginProps {
  onLoginSuccess: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Backend par login API hit karein ge
      const response = await api.post("/admin/admin-login", {
        username,
        password,
      });

      const { accessToken, admin } = response.data;

      localStorage.setItem("brico_admin_token", accessToken);
      onLoginSuccess(accessToken);

      Swal.fire({
        title: "Welcome " + admin.username,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err: any) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Invalid Credentials",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <form className={styles.loginCard} onSubmit={handleLogin}>
        <div className={styles.logo}>B</div>
        <h1>Brico Admin</h1>
        <p>Please enter your credentials to continue</p>

        <div className={styles.inputGroup}>
          <label>Enter Username</label>
          <input
            type="text"
            placeholder="admin@brico.com"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={styles.loginBtn} disabled={loading}>
          {loading ? "Verifying..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default Login;
