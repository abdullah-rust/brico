import React, { useState, useEffect } from "react";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import { MdNotifications, MdSearch, MdTune, MdAdd } from "react-icons/md";
import styles from "./ProjectsPage.module.css";

interface Project {
  id: string;
  title: string;
  location?: string;
  date?: string;
  status: "In Progress" | "Planning" | "Completed";
  image: string;
}

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        setTimeout(() => {
          const dummyData: Project[] = [
            {
              id: "1",
              title: "Gulshan Villa Renovation",
              location: "Dhaka, Bangladesh",
              status: "In Progress",
              image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDFzvVblOwpfxURJUafewji7aVRbq2zWlAkxDyE-Ciu1E09tGMAaZe1hDRnje7o0liWUXDvcjelpFgDgTaZeiNqSvNtjbnPy-_pSUUw1DVgV3AaCD-yqQ2sYP4kgRSw6mwZPCubfU2ULbdYQXvRSH3i2b0xZpoUuWV5yu-KieolBbEKyrXovGGKQrQ3z5gndAiBsvtccQC4VlTNsCqbYU5EIA16GFGAIxV5yp6JOZfTXIIISGGXrTDZeMn_Tf092BvEu0e--b2SXg7I",
            },
            {
              id: "2",
              title: "Uttara Apartment Interior",
              location: "Uttara Sector 4",
              status: "Planning",
              image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCMLn9Jq6etIfhN-7WZQfxhif2cf2qHeiy0UXEkxuAWsBluGYUd1GLalYClml4tAXVBX0Pcm9YjCFNFHzcgO79JHecRcD8uFESEcqlHc0aUsHD7q0NI2YZRn6nK1fykJlz6KWYD3oJlcHLcqdoL7yMXXD1NUZACww3Sb29DQ3Iij8fONspQ_82olCKTz8j1EVpJTbIYpFMLgFoI0wmEARmvZ-MIWZT69Bkjo6pSI2DJlTdFPdxHDhmiOoYqssMER0GLXm1wvgTHTCU6",
            },
            {
              id: "3",
              title: "Dhanmondi Roof Repair",
              date: "October 2023",
              status: "Completed",
              image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuA-9meAS2gqtpzZ3NzffGhDZtjGPZiP2vE3qT4LjDYa5qIqQSCMCHocAoa73MQVsAjBmJ2A-5ztZfhgnMCThl7bknQD7vDs4tj7ieJxAaOWqqvae52idVDfh225aFu1npJqPKfOeKrQgmgftHqarC4YS3E_9UVwaxa-IsmaKiLv6frqzuVQBN2d8Gq44RA4w8fg2l5qCeQ88dIWuyGWUxwGxiw0aWbBYP4C57lENailk2eg4YQ7JZuK6oC7nIkkq64vzOZE9BYOpxQ_",
            },
            {
              id: "4",
              title: "Hafizabad Commercial Hub",
              date: "Nov 2025",
              status: "Completed",
              image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuA-9meAS2gqtpzZ3NzffGhDZtjGPZiP2vE3qT4LjDYa5qIqQSCMCHocAoa73MQVsAjBmJ2A-5ztZfhgnMCThl7bknQD7vDs4tj7ieJxAaOWqqvae52idVDfh225aFu1npJqPKfOeKrQgmgftHqarC4YS3E_9UVwaxa-IsmaKiLv6frqzuVQBN2d8Gq44RA4w8fg2l5qCeQ88dIWuyGWUxwGxiw0aWbBYP4C57lENailk2eg4YQ7JZuK6oC7nIkkq64vzOZE9BYOpxQ_",
            },
            {
              id: "4",
              title: "Hafizabad Commercial Hub",
              date: "Nov 2025",
              status: "Completed",
              image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuA-9meAS2gqtpzZ3NzffGhDZtjGPZiP2vE3qT4LjDYa5qIqQSCMCHocAoa73MQVsAjBmJ2A-5ztZfhgnMCThl7bknQD7vDs4tj7ieJxAaOWqqvae52idVDfh225aFu1npJqPKfOeKrQgmgftHqarC4YS3E_9UVwaxa-IsmaKiLv6frqzuVQBN2d8Gq44RA4w8fg2l5qCeQ88dIWuyGWUxwGxiw0aWbBYP4C57lENailk2eg4YQ7JZuK6oC7nIkkq64vzOZE9BYOpxQ_",
            },
            {
              id: "4",
              title: "Hafizabad Commercial Hub",
              date: "Nov 2025",
              status: "Completed",
              image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuA-9meAS2gqtpzZ3NzffGhDZtjGPZiP2vE3qT4LjDYa5qIqQSCMCHocAoa73MQVsAjBmJ2A-5ztZfhgnMCThl7bknQD7vDs4tj7ieJxAaOWqqvae52idVDfh225aFu1npJqPKfOeKrQgmgftHqarC4YS3E_9UVwaxa-IsmaKiLv6frqzuVQBN2d8Gq44RA4w8fg2l5qCeQ88dIWuyGWUxwGxiw0aWbBYP4C57lENailk2eg4YQ7JZuK6oC7nIkkq64vzOZE9BYOpxQ_",
            },
          ];
          setProjects(dummyData);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Fetch error", error);
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const activeProjects = projects.filter((p) => p.status !== "Completed");
  const pastProjects = projects.filter((p) => p.status === "Completed");

  if (loading) {
    return <div className={styles.loading}>Loading Projects...</div>;
  }

  return (
    <>
      {/* MAIN CONTENT - Yeh scroll hoga */}
      <div className={styles.pageWrapper}>
        {/* 1. Header & Search (Fixed at top) */}
        <div className={styles.stickyHeader}>
          <header className={styles.header}>
            <h1>My Projects</h1>
            <button className={styles.iconBtn}>
              <MdNotifications />
            </button>
          </header>

          <div className={styles.searchSection}>
            <div className={styles.searchBar}>
              <MdSearch className={styles.searchIcon} />
              <input type="text" placeholder="Search your projects..." />
              <MdTune className={styles.filterIcon} />
            </div>
          </div>
        </div>

        {/* 2. Scrollable Area */}
        <div className={styles.scrollArea}>
          <main className={styles.content}>
            {activeProjects.length > 0 && (
              <section>
                <div className={styles.sectionHeader}>
                  <h2>Active Projects</h2>
                  <button className={styles.seeAllBtn}>See All</button>
                </div>
                {activeProjects.map((project) => (
                  <ProjectCard key={project.id} {...project} />
                ))}
              </section>
            )}

            {pastProjects.length > 0 && (
              <section className={styles.pastSection}>
                <div className={styles.sectionHeader}>
                  <h2>Past Projects</h2>
                </div>
                {pastProjects.map((project) => (
                  <ProjectCard key={project.id} {...project} />
                ))}
              </section>
            )}
          </main>
        </div>
      </div>

      {/* 3. FAB - YEH AB FIXED HAI AUR PAGE KE TOP LEVEL PAR HAI */}
      <button
        className={styles.fab}
        onClick={() => alert("FAB ab fixed hai jani!")}
      >
        <MdAdd />
      </button>
    </>
  );
};

export default ProjectsPage;
