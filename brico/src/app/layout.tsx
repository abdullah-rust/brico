"use client"; // Layout ko client banana parega agar yahan logic likhni hai

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import "./globals.css";
import MinimalLoader from "./components/MinimalLoader/MinimalLoader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const isLogin = localStorage.getItem("isLogin");

    // Auth Pages ka array (Jin par login banda nahi ja sakta)
    const authPages = ["/welcome", "/login", "/signup", "/verify-otp"];

    if (isLogin) {
      // Agar login hai aur inme se kisi page par hai toh redirect to Home/Dashboard
      if (authPages.includes(pathname)) {
        router.replace("/"); // Ya "/dashboard" jo aapka main page ho
      }
    } else {
      // Agar login NAHI hai aur dashboard/home par hai toh redirect to Welcome
      const protectedPages = ["/", "/dashboard", "/profile"]; // Add your protected routes here
      if (protectedPages.includes(pathname)) {
        router.replace("/welcome");
      }
    }

    // Thori der baad loader hatayein taake state update ho jaye
    const timeout = setTimeout(() => setIsChecking(false), 500);
    return () => clearTimeout(timeout);
  }, [pathname, router]);

  if (isChecking) {
    return (
      <html lang="en">
        <body>
          <MinimalLoader />
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
