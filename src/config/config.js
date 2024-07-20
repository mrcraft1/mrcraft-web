import { store } from "../redux/store";
//default lang, map api key, firebase config, theme settings default color dark or light,
// base URL of your admin panel

export const MAP_API = process.env.REACT_APP_MAP_API;

export const GOOGLE_MAP = "https://maps.googleapis.com/maps/api/js";

let config = {
  supportedLanguages: ["en", "de", "es"],
  defaultLanguage: "en",
};
export default config;

export const DECIMAL_POINT = () => {
  const state = store.getState();
  return state.Settings?.settings?.general_settings?.decimal_point;
};

/** Only modify above given config
 * Do not touch below code
 * */
// all possible order statuses
export const order_statues = [
  "awaiting",
  "confirmed",
  "cancelled",
  "rescheduled",
  "completed",
  "started",
];

//function for load google map
export function loadAsyncScript(src) {
  return new Promise((resolve) => {
    // Check if the script with the given source already exists
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      // If the script already exists, resolve the promise immediately
      resolve(existingScript);
    } else {
      // Otherwise, create a new script element and load the script
      const script = document.createElement("script");
      Object.assign(script, {
        type: "text/javascript",
        async: true,
        src,
      });
      script.addEventListener("load", () => resolve(script));
      document.head.appendChild(script);
    }
  });
}

// Function to handle open drawer
export const handleOpen = (setDrawerOpen) => {
  setDrawerOpen(true);
}

// Function to handle close drawer
export function handleClose(setDrawerOpen) {
  setDrawerOpen(false);
}
