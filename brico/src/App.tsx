import React, { useState, useEffect, Suspense, lazy } from "react";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { App as CapacitorApp } from "@capacitor/app";

import { AuthService } from "./utils/AuthService";
import BottomNav from "./components/BottomNav/BottomNav";
import PageLoader from "./components/Loader/PageLoader";
import AnimatedPage from "./components/AnimatedPage/AnimatedPage";

import "./App.css";

// Lazy Imports (Performance ke liye behtareen hain)
const HomePage = lazy(() => import("./pages/Home/HomePage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage/ProjectsPage"));
const DesignGallery = lazy(() => import("./pages/DesignGallery/DesignGallery"));
const FindWorkersPage = lazy(
  () => import("./pages/FindWorkers/FindWorkersPage")
);
const ToolsPage = lazy(() => import("./pages/ToolsPage/ToolsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage/ProfilePage"));
const WelcomePage = lazy(() => import("./pages/welcomePage/WelcomePage"));
const GetStarted = lazy(() => import("./pages/GetStarted/GetStarted"));
const LoginPage = lazy(() => import("./pages/Login/LoginPage"));
const SignupPage = lazy(() => import("./pages/Signup/SignupPage"));
const OTPPage = lazy(() => import("./pages/Auth/OTPPage"));
const EditProfilePage = lazy(
  () => import("./pages/EditProfilePage/EditProfilePage")
);
const CreateGigPage = lazy(() => import("./pages/CreateGigPage/CreateGigPage"));
const GigDetailPage = lazy(() => import("./pages/GigDetailPage/GigDetailPage"));
const FrontElevationsPage = lazy(
  () => import("./pages/DesignCategoryPage/FrontElevations")
);
const HouseMapsPage = lazy(() => import("./pages/HouseMaps/HouseMaps"));
const CeilingDesignsPage = lazy(
  () => import("./pages/CeilingDesigns/CeilingDesigns")
);

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Auth logic - optimized
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AuthService.getToken("access_token");
      setIsAuthenticated(!!token);
    };
    checkAuth();
  }, [location.pathname]);

  // Capacitor Back Button Logic
  useEffect(() => {
    const backHandler = CapacitorApp.addListener("backButton", () => {
      if (location.pathname === "/" || location.pathname === "/welcome") {
        CapacitorApp.exitApp();
      } else {
        navigate(-1);
      }
    });
    return () => {
      backHandler.then((h) => h.remove());
    };
  }, [location.pathname, navigate]);

  if (isAuthenticated === null) return <PageLoader />;

  // Yeh function check karega ke BottomNav dikhana hai ya nahi
  const showBottomNav =
    isAuthenticated &&
    ["/", "/projects", "/designs", "/explore", "/tools", "/profile"].includes(
      location.pathname
    );

  return (
    <Suspense fallback={<PageLoader />}>
      <div className="app-container">
        <main className="main-content">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Main Tabs as Routes */}
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <AnimatedPage>
                      <HomePage />
                    </AnimatedPage>
                  ) : (
                    <Navigate to="/welcome" replace />
                  )
                }
              />
              <Route
                path="/projects"
                element={
                  <AnimatedPage>
                    <ProjectsPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/designs"
                element={
                  <AnimatedPage>
                    <DesignGallery />
                  </AnimatedPage>
                }
              />
              <Route
                path="/explore"
                element={
                  <AnimatedPage>
                    <FindWorkersPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/tools"
                element={
                  <AnimatedPage>
                    <ToolsPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/profile"
                element={
                  <AnimatedPage>
                    <ProfilePage />
                  </AnimatedPage>
                }
              />

              {/* Auth Routes */}
              <Route
                path="/welcome"
                element={
                  !isAuthenticated ? (
                    <AnimatedPage>
                      <WelcomePage />
                    </AnimatedPage>
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
              <Route
                path="/get-started"
                element={
                  !isAuthenticated ? (
                    <AnimatedPage>
                      <GetStarted />
                    </AnimatedPage>
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
              <Route
                path="/login"
                element={
                  !isAuthenticated ? (
                    <AnimatedPage>
                      <LoginPage />
                    </AnimatedPage>
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
              <Route
                path="/signup"
                element={
                  !isAuthenticated ? (
                    <AnimatedPage>
                      <SignupPage />
                    </AnimatedPage>
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
              <Route
                path="/otp"
                element={
                  !isAuthenticated ? (
                    <AnimatedPage>
                      <OTPPage />
                    </AnimatedPage>
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />

              {/* Other Pages */}
              <Route
                path="/edit-profile"
                element={
                  isAuthenticated ? (
                    <AnimatedPage>
                      <EditProfilePage />
                    </AnimatedPage>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/create-gig"
                element={
                  isAuthenticated ? (
                    <AnimatedPage>
                      <CreateGigPage />
                    </AnimatedPage>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/gig-detail/:id"
                element={
                  isAuthenticated ? (
                    <AnimatedPage>
                      <GigDetailPage />
                    </AnimatedPage>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/elevations"
                element={
                  isAuthenticated ? (
                    <AnimatedPage>
                      <FrontElevationsPage />
                    </AnimatedPage>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/maps"
                element={
                  isAuthenticated ? (
                    <AnimatedPage>
                      <HouseMapsPage />
                    </AnimatedPage>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/ceiling"
                element={
                  isAuthenticated ? (
                    <AnimatedPage>
                      <CeilingDesignsPage />
                    </AnimatedPage>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
            </Routes>
          </AnimatePresence>
        </main>

        {showBottomNav && (
          <BottomNav
            activeTab={
              location.pathname === "/"
                ? "home"
                : location.pathname.substring(1)
            }
            setActiveTab={(tabId) =>
              navigate(tabId === "home" ? "/" : `/${tabId}`)
            }
          />
        )}
      </div>
    </Suspense>
  );
};

export default App;
