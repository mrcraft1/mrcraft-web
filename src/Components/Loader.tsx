import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "@mui/material";
import React from "react";

const Loader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backdropFilter: "blur(100px)", // Add background blur
      }}
    >
      {/* You can customize the FontAwesomeIcon as needed */}
      <FontAwesomeIcon icon={faSpinner} spin size="lg" />
    </Box>
  );
};

export default Loader;
