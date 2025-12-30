// utils/getLocation.ts
import { Geolocation } from "@capacitor/geolocation";
import Swal from "sweetalert2";
import axios from "axios";

// 👇 Cache key (private to this module)
const LOCATION_CACHE_KEY = "__brico_user_location";

// 👇 Helper: sessionStorage se location nikalna
const getCachedLocation = (): {
  lat: number;
  lng: number;
  accuracy: number;
} | null => {
  try {
    const item = sessionStorage.getItem(LOCATION_CACHE_KEY);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    console.warn("Failed to parse cached location", e);
    return null;
  }
};

// 👇 Helper: sessionStorage mein location save karna
const setCachedLocation = (location: {
  lat: number;
  lng: number;
  accuracy: number;
}) => {
  try {
    sessionStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(location));
  } catch (e) {
    console.warn("Failed to cache location", e);
  }
};

// ✅ MAIN FUNCTION: Components will ONLY call this
export const getNativeLocation = async () => {
  // 🔹 Step 1: Pehle cache check karo
  const cached = getCachedLocation();
  if (cached) {
    console.log("✅ Location loaded from cache");
    return cached;
  }

  // 🔹 Step 2: Agar cache nahi hai, toh fresh fetch karo
  try {
    // Permission check
    const status = await Geolocation.checkPermissions();
    if (status.location === "denied" || status.location === "prompt") {
      const requestStatus = await Geolocation.requestPermissions();
      if (requestStatus.location !== "granted") {
        throw new Error("Jani, user ne location permission nahi di!");
      }
    }

    // Actual location fetch
    const coordinates = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
    });

    const location = {
      lat: coordinates.coords.latitude,
      lng: coordinates.coords.longitude,
      accuracy: coordinates.coords.accuracy,
    };

    // 🔹 Step 3: Cache karo future ke liye
    setCachedLocation(location);

    console.log("📍 Fresh location fetched and cached");
    return location;
  } catch (error: any) {
    Swal.fire({
      icon: "error",
      title: "Location Error",
      text: error.message || "Native location fetch fail ho gayi.",
      confirmButtonColor: "#11d4b4",
    });
    return null;
  }
};

// ✅ Reverse Geocoding (unchanged — no caching needed here unless you want)
export const getAddressFromCoords = async (lat: number, lng: number) => {
  try {
    // ⚠️ Extra spaces remove kardiye URL se (bug fix!)
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );

    const data = response.data;
    const addr = data.address;

    const area =
      addr.residential ||
      addr.suburb ||
      addr.neighborhood ||
      addr.municipality ||
      "";
    const city = addr.city || addr.town || addr.village || addr.state || "";

    const shortAddress =
      area && city && area !== city
        ? `${area}, ${city}`
        : area || city || "Unknown Location";

    return {
      fullData: data,
      addressDetails: addr,
      shortName: shortAddress,
      city,
      coords: { lat, lng },
    };
  } catch (error) {
    console.error("Reverse Geocoding Error:", error);
    return null;
  }
};
