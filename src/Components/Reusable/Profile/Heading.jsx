import { Divider, Typography } from "@mui/material";
import React from "react";

const Heading = (props) => {
  return (
    <div>
      <Typography variant="h5" fontWeight={"bold"} ml={3} mb={2} pt={2}>
        {props.heading}
      </Typography>
      <Divider />
    </div>
  );
};

export default Heading;
