import { useState } from "react";
import "./App.css";
import Sidebar from "./componenets/Sidebar/Sidebar";
import Dashboard from "./pages/Dashboard/Dashboard";
import UploadDesign from "./pages/UploadDesign/UploadDesign";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import OTPVerification from "./pages/OTPVerification/OTPVerification";
import { Routes, Route, Navigate } from "react-router-dom";

export type ScreenType = "stats" | "upload" | "settings";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeScreen, setActiveScreen] = useState<ScreenType>("stats");

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveScreen("stats");
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case "stats":
        return <Dashboard />;
      case "upload":
        return <UploadDesign />;
      case "settings":
        return (
          <div className="p-8">
            <h2>Settings Coming Soon...</h2>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          !isAuthenticated ? (
            <Login onLoginSuccess={() => setIsAuthenticated(true)} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route path="/signup" element={<Signup />} />
      <Route path="/otp" element={<OTPVerification />} />

      {/* Protected Layout: Sirf login ke baad */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <div className="admin-layout">
              <Sidebar
                activeTab={activeScreen}
                setActiveTab={setActiveScreen}
                onLogout={handleLogout}
              />
              <main className="main-content">
                <div className="content-container">{renderScreen()}</div>
              </main>
            </div>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/login"} />}
      />
    </Routes>
  );
}

export default App;
