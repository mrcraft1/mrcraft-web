import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import slugify from "slugify";

const ViewCategories = ({ category }) => {
  let darkTheme = localStorage.getItem("darkMode");

  const slug = slugify(category.name, { lower: true });
  const theme = useTheme();
  return (
    <Box
      component={Link}
      to={"/categories/" + category.id + "/" + slug}
      sx={{
        textDecoration: "none",
        "&:hover": {
          // Change the color of Typography when hovering
          "& .MuiTypography-root": {
            color: theme?.palette?.primary?.main,
          },
        },
      }}
    >
      <Box
        className="category-box"
        // p={2}
        borderColor={theme.palette.text.secondary}
        width={"100%"}
      >
        <Box
          className="category-img-box"
          bgcolor={
            darkTheme === true || darkTheme === "true"
              ? category.dark_color
              : category.light_color
          }
        >
          <Box
            component={"img"}
            maxWidth={"50% !important"}
            src={category.category_image}
          />
        </Box>
        <Typography color={theme.palette.text.secondary} sx={{ py: "12px" }}>
          {category.name}
        </Typography>
      </Box>
    </Box>
  );
};

export default ViewCategories;
