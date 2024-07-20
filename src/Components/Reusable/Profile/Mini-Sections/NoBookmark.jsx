import { Box, Button } from "@mui/material";
import { t } from "i18next";
import React from "react";
import { Link } from "react-router-dom";

const NoBookmark = () => {
  return (
    <div>
      <div className="textaling-center">
        <h2>{t("no_bookmark")}</h2>
        <Box display={"flex"} justifyContent={"center"}>
          <img
            src={"/images/no-booking.png"}
            height={"300px"}
            width={"300px"}
            alt="no bookings"
          />
        </Box>
        <Link to={"/providers"}>
          <Button variant="outlined">{t("add_bookmark")}</Button>
        </Link>
      </div>
    </div>
  );
};

export default NoBookmark;
