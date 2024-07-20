import "@stripe/stripe-js";
import { Paper, ThemeProvider, CircularProgress, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { darkTheme, lightTheme } from "./Theme";
import Routes from "./Routes";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import api from "./API/apiCollection";
import { setSettings } from "./redux/Settings";
import { useDispatch, useSelector } from "react-redux";
import { themesData } from "./redux/Theme";
import { RootState } from "./typescriptTypes/globalTypes";

// main app component
function App() : JSX.Element {
  const [darkMode, setDarkMode] = useState(false);
  const storeDark = localStorage.getItem("darkMode");
  const dispatch = useDispatch();
  const locationData = useSelector((state: RootState) => state.Location);
  const [isLoading, setIsLoading] = useState(true); // Initial state is loading
  const themeSelector = useSelector(themesData);

  useEffect(() => {
    if (storeDark === "true") {
      setDarkMode(true);
      document.body.classList.add("dark-mode");
    } else {
      setDarkMode(false);
      document.body.classList.remove("dark-mode");
    }
  }, [storeDark, themeSelector]);

  useEffect(() => {
    if (!locationData.lat && !locationData.lng) {
      setIsLoading(false);
    }
  }, [locationData]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const response = await api.get_settings();
        dispatch(setSettings(response.data));
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Paper>
        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
          >
            <CircularProgress />
          </Box>
        ) : (
          <Routes />
        )}
      </Paper>
    </ThemeProvider>
  );
}

export default App;
