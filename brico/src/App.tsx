import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Controller } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";

import HomePage from "./pages/Home/HomePage";
import ProjectsPage from "./pages/ProjectsPage/ProjectsPage";
import DesignGallery from "./pages/DesignGallery/DesignGallery"; // Designs
import FindWorkersPage from "./pages/FindWorkers/FindWorkersPage"; // Explore
import ToolsPage from "./pages/ToolsPage/ToolsPage"; // Tools
import ProfilePage from "./pages/ProfilePage/ProfilePage";

import BottomNav from "./components/BottomNav/BottomNav";
import "./App.css";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("home");
  const swiperRef = useRef<SwiperType | null>(null);

  // ORDER: Inka order bilkul SwiperSlide ke order jaisa hona chahiye
  const tabs = ["home", "projects", "designs", "explore", "tools", "profile"];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const index = tabs.indexOf(tabId);
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  };

  return (
    <div className="app-layout">
      <main className="main-content">
        <Swiper
          modules={[Controller]}
          className="mySwiper"
          onSlideChange={(swiper) => {
            setActiveTab(tabs[swiper.activeIndex]);
          }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          speed={400}
          resistanceRatio={0.5}
          touchStartPreventDefault={false}
        >
          {/* Index 0: Home */}
          <SwiperSlide className="custom-slide">
            <HomePage />
          </SwiperSlide>

          {/* Index 1: Projects */}
          <SwiperSlide className="custom-slide">
            <ProjectsPage />
          </SwiperSlide>

          {/* Index 2: Designs */}
          <SwiperSlide className="custom-slide">
            <DesignGallery />
          </SwiperSlide>

          {/* Index 3: Explore (Workers) */}
          <SwiperSlide className="custom-slide">
            <FindWorkersPage />
          </SwiperSlide>

          {/* Index 4: Tools */}
          <SwiperSlide className="custom-slide">
            <ToolsPage />
          </SwiperSlide>

          {/* Index 5: Profile */}
          <SwiperSlide className="custom-slide">
            <ProfilePage />
          </SwiperSlide>
        </Swiper>
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={handleTabChange} />
    </div>
  );
};

export default App;
