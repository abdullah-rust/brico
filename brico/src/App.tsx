import React, { useState, useRef, Suspense, lazy, useEffect } from "react";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Controller } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { App as CapacitorApp } from "@capacitor/app";

import { AuthService } from "./utils/AuthService";
import BottomNav from "./components/BottomNav/BottomNav";
import PageLoader from "./components/Loader/PageLoader";
import AnimatedPage from "./components/AnimatedPage/AnimatedPage";

import "swiper/css";
import "./App.css";

// Lazy Imports
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

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const tabs = ["home", "projects", "designs", "explore", "tools", "profile"];

  useEffect(() => {
    const checkAuth = async () => {
      // Check for access_token specifically
      const token = await AuthService.getToken("access_token");
      setIsAuthenticated(!!token);
    };
    checkAuth();
  }, [location.pathname]);

  // Handle Swiper initialization and control
  useEffect(() => {
    if (swiperRef.current && activeTab) {
      const tabIndex = tabs.indexOf(activeTab);
      if (tabIndex !== -1) {
        // Smooth transition without animation if user clicked bottom nav
        swiperRef.current.slideTo(tabIndex, 0); // 0 speed for instant jump
      }
    }
  }, [activeTab]);

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

  // Handle Swiper slide change
  const handleSlideChange = (swiper: SwiperType) => {
    const newTab = tabs[swiper.activeIndex];
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  };

  // Handle tab click from bottom nav
  const handleTabClick = (tabId: string) => {
    const tabIndex = tabs.indexOf(tabId);
    if (tabIndex !== -1 && swiperRef.current) {
      setActiveTab(tabId);
      // Smooth sliding animation with 300ms
      swiperRef.current.slideTo(tabIndex, 300);
    }
  };

  if (isAuthenticated === null) return <PageLoader />;

  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <AnimatedPage>
                  <div className="app-layout">
                    <main className="main-content">
                      <Swiper
                        modules={[Controller]}
                        onSlideChange={handleSlideChange}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                        speed={300}
                        touchRatio={0.6} // Yeh 1 se 0.6 kar do (easier to drag)
                        shortSwipes={true} // Yeh true kar do (allows short swipes)
                        resistanceRatio={0.85} // Yeh 0 se 0.85 kar do (elastic effect)
                        followFinger={true}
                        threshold={2} // Yeh 5 se 2 kar do (less distance needed)
                        simulateTouch={true}
                        allowTouchMove={true}
                        autoHeight={false}
                        slidesPerView={1}
                        spaceBetween={0}
                        touchAngle={30} // Yeh 45 se 30 kar do (wider touch area)
                        longSwipesRatio={0.2} // Yeh add karo
                        longSwipesMs={150} // Yeh add karo
                        grabCursor={true} // Yeh add karo
                        className="main-swiper"
                        style={{
                          height: "100%",
                          width: "100%",
                          overflow: "hidden",
                        }}
                      >
                        <SwiperSlide className="custom-slide">
                          <HomePage />
                        </SwiperSlide>
                        <SwiperSlide className="custom-slide">
                          <ProjectsPage />
                        </SwiperSlide>
                        <SwiperSlide className="custom-slide">
                          <DesignGallery />
                        </SwiperSlide>
                        <SwiperSlide className="custom-slide">
                          <FindWorkersPage />
                        </SwiperSlide>
                        <SwiperSlide className="custom-slide">
                          <ToolsPage />
                        </SwiperSlide>
                        <SwiperSlide className="custom-slide">
                          <ProfilePage />
                        </SwiperSlide>
                      </Swiper>
                    </main>
                    <BottomNav
                      activeTab={activeTab}
                      setActiveTab={handleTabClick}
                    />
                  </div>
                </AnimatedPage>
              ) : (
                <Navigate to="/welcome" replace />
              )
            }
          />

          {/* Auth Routes with Protection */}
          <Route
            path="/welcome"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <AnimatedPage>
                  <WelcomePage />
                </AnimatedPage>
              )
            }
          />
          <Route
            path="/get-started"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <AnimatedPage>
                  <GetStarted />
                </AnimatedPage>
              )
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <AnimatedPage>
                  <LoginPage />
                </AnimatedPage>
              )
            }
          />
          <Route
            path="/signup"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <AnimatedPage>
                  <SignupPage />
                </AnimatedPage>
              )
            }
          />
          <Route
            path="/otp"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <AnimatedPage>
                  <OTPPage />
                </AnimatedPage>
              )
            }
          />

          <Route
            path="/edit-profile"
            element={
              isAuthenticated ? (
                <AnimatedPage>
                  <EditProfilePage />
                </AnimatedPage>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};

export default App;

EditProfilePage;
