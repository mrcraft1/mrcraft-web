import React, { useEffect, Suspense } from "react";
import { setSettings } from "./redux/Settings";
import api from "./API/apiCollection";
import { useDispatch, useSelector } from "react-redux";
import ScrollToTop from "./ScrollToTop";
import Router from "./router/Router";
import Loader from "./Components/Loader";
import { RootState } from "./redux/store";


const Routes: React.FC = () => {
  const dispatch = useDispatch();
  const settings = useSelector((state: RootState) => state.Settings?.settings);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        if (settings && settings.length === 0) {
          const setting = await api.get_settings();
          dispatch(setSettings(setting.data));
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!localStorage.getItem("language")) {
    // Set the variable to an empty value if it doesn't exist
    localStorage.setItem("language", "");
  }
  if (!localStorage.getItem("selectedPromo")) {
    // Set the variable to an empty value if it doesn't exist
    localStorage.setItem("selectedPromo", "");
  }

  return (
    <Suspense fallback={<Loader />}>
      <ScrollToTop />
      <Router />
    </Suspense>
  );
};

export default Routes;