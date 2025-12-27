import { Geolocation } from "@capacitor/geolocation";
import Swal from "sweetalert2";
import axios from "axios";

export const getNativeLocation = async () => {
  try {
    // 1. Check current permission status
    const status = await Geolocation.checkPermissions();

    // 2. Agar permission "prompt" (nahi mili) ya "denied" hai, to request karo
    if (status.location === "denied" || status.location === "prompt") {
      const requestStatus = await Geolocation.requestPermissions();
      if (requestStatus.location !== "granted") {
        throw new Error("Jani, user ne location permission nahi di!");
      }
    }

    // 3. Ab accurate location nikalwao
    const coordinates = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true, // GPS use karega
      timeout: 10000,
    });

    return {
      lat: coordinates.coords.latitude,
      lng: coordinates.coords.longitude,
      accuracy: coordinates.coords.accuracy,
    };
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

export const getAddressFromCoords = async (lat: any, lng: any) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );

    const data = response.data;
    const addr = data.address;

    // 1. Short Address Logic (UI ke liye)
    // Priority: Block/Street -> Area -> City
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

    // 2. Return everything (taake tum jahan chaho jo marzi use karo)
    return {
      fullData: data, // Pura raw object (osm_id, importance etc)
      addressDetails: addr, // Sirf address wala hissa
      shortName: shortAddress, // "Block B, Islamabad"
      city: city, // Filtering ke liye specific city
      coords: { lat, lng }, // Original coordinates
    };
  } catch (error) {
    console.error("Reverse Geocoding Error:", error);
    return null;
  }
};
