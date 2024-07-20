import { useTheme } from "@emotion/react";
import { Box, Tab, Tabs } from "@mui/material";
import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

const BookingIndex = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const location = useLocation();
  const theme = useTheme();
  var primaryColor = theme.palette?.primary?.main;
  const activeTabStyle = {
    background: primaryColor,
    borderRadius: "6px",
    color: "white",
  };
  useEffect(() => {
    const path = location.pathname;
    switch (path) {
      case "/profile/booking":
        setCurrentTab(0);
        break;
      case "/profile/booking/awaiting":
        setCurrentTab(1);
        break;
      case "/profile/booking/confirmed":
        setCurrentTab(2);
        break;
      case "/profile/booking/cancelled":
        setCurrentTab(3);
        break;
      case "/profile/booking/rescheduled":
        setCurrentTab(4);
        break;
      case "/profile/booking/completed":
        setCurrentTab(5);
        break;
      case "/profile/booking/started":
        setCurrentTab(6);
        break;
      default:
        setCurrentTab(0); // Set a default value if the path doesn't match any of the cases.
    }

    // Access the element by its ID or reference
    const elements = document.getElementsByClassName("MuiTabs-flexContainer");

    // Check if the element exists before manipulating it
    // Loop through the elements and add the class to each one
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.add("css-heg063-MuiTabs-flexContainer");
    }
  }, [location]);

  return (
    <div>
      <Box
        display={"flex"}
        color={"black"}
        bgcolor={"#F2F1F6"}
        borderRadius={2}
        overflow={"auto"}
      >
        <Tabs
          className="tabs"
          sx={{ opacity: 1, overflow: "auto", color: "black", width: '100%' }}
          textColor="secondary"
          indicatorColor="secondary"
          variant="fullWidth"
        >
          <Link to={"/profile/booking"}>
            <Tab
              value={0}
              label={t("all")}
              sx={{
                opacity: 1,
                color: "gray",
                textTransform: "none",
                minWidth:"145px"
              }}
              style={currentTab === 0 ? activeTabStyle : {}}
            />
          </Link>
          <Link to={"/profile/booking/awaiting"}>
            <Tab
              value={1}
              label={t("awaiting")}
              sx={{
                opacity: 1,
                color: "gray",
                textTransform: "none",
                minWidth:"145px"
              }}
              style={currentTab === 1 ? activeTabStyle : {}}
            />
          </Link>
          <Link to={"/profile/booking/confirmed"}>
            <Tab
              value={2}
              label={t("confirmed")}
              sx={{
                color: "gray",
                opacity: 1,
                textTransform: "none",
                minWidth:"145px"
              }}
              style={currentTab === 2 ? activeTabStyle : {}}
            />
          </Link>
          <Link to={"/profile/booking/started"}>
            <Tab
              value={6}
              label={t("started")}
              sx={{
                color: "gray",
                opacity: 1,
                textTransform: "none",
                minWidth:"145px"
              }}
              style={currentTab === 6 ? activeTabStyle : {}}
            />
          </Link>
          <Link to={"/profile/booking/cancelled"}>
            <Tab
              value={3}
              label={t("cancelled")}
              sx={{
                color: "gray",
                opacity: 1,
                textTransform: "none",
                minWidth:"145px"
              }}
              style={currentTab === 3 ? activeTabStyle : {}}
            />
          </Link>
          <Link to={"/profile/booking/rescheduled"}>
            <Tab
              value={4}
              label={t("rescheduled")}
              sx={{
                color: "gray",
                opacity: 1,
                textTransform: "none",
                minWidth:"145px"
              }}
              style={currentTab === 4 ? activeTabStyle : {}}
            />
          </Link>
          <Link to={"/profile/booking/completed"}>
            <Tab
              value={5}
              label={t("completed")}
              sx={{
                color: "gray",
                opacity: 1,
                textTransform: "none",
                minWidth:"145px"
              }}
              style={currentTab === 5 ? activeTabStyle : {}}
            />
          </Link>
          
        </Tabs>
      </Box>
    </div>
  );
};

export default BookingIndex;
