import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import slugify from "slugify";

const Category = ({ category }) => {
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
      <Box className="category-box" borderColor={theme.palette.text.secondary}>
        <Box className="category-img-box">
          <Box
            component={"img"}
            maxWidth={"50% !important"}
            src={category.category_image}
          />
        </Box>
        <Typography
          color={theme.palette.text.secondary}
          // Set fontWeight to 800
          sx={{ py: "12px", fontSize: "14px", fontWeight: "800 !important" }} // Apply !important via sx prop
        >
          {category.name}
        </Typography>
      </Box>
    </Box>
  );
};

export default Category;
