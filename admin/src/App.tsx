import { useState } from "react";
import "./App.css";
import Sidebar from "./componenets/Sidebar/Sidebar";
import Dashboard from "./pages/Dashboard/Dashboard";
import UploadDesign from "./pages/UploadDesign/UploadDesign";
import Login from "./pages/Login/Login";

export type ScreenType = "stats" | "upload" | "settings";

function App() {
  // 1. Auth State (Refresh hone par default false ho jayegi)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeScreen, setActiveScreen] = useState<ScreenType>("stats");

  // 2. Logout Logic (Sidebar ko pass karenge)
  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveScreen("stats"); // Reset to default tab
  };

  // 3. Conditional Rendering
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

  // Agar login nahi hai toh sirf Login Page dikhao
  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // Agar authenticated hai toh poora Admin Layout dikhao
  return (
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
  );
}

export default App;
