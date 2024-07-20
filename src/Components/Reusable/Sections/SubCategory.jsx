import { Box, Card, Typography, useTheme } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import slugify from "slugify";

const SubCategory = ({ subCategory }) => {
  const theme = useTheme();

  return (
    <Box key={subCategory.id}>
      <Link
        to={`sub-categories/${subCategory.id}/${slugify(
          subCategory.name
        ).toLowerCase()}`}
        className="breadcrumb"
      >
        <Card
          className="service-card"
          sx={{ borderRadius: "15px", position: "relative" }}
        >
          {subCategory.discount !== undefined && subCategory.discount > 0 ? (
            <Box
              position={"absolute"}
              left={8}
              top={8}
              bgcolor={"#34C57D"}
              p={0.1}
              px={1}
              borderRadius={"5px"}
              zIndex={1} // Increase z-index
            >
              <Typography
                variant="caption"
                color={theme.palette.color.subCatName}
              >
                {`${subCategory.discount}% OFF`}
                {/* {subCategory.discount !== undefined && subCategory.discount > 0
                ? `${subCategory.discount}% OFF`
                : "75% OFF"} */}
              </Typography>
            </Box>
          ) : null}
          {/* <Box
            position={"absolute"}
            left={8}
            top={8}
            bgcolor={"#34C57D"}
            p={0.1}
            px={1}
            borderRadius={"5px"}
            zIndex={1} // Increase z-index
          >
            <Typography
              variant="caption"
              color={theme.palette.color.subCatName}
            >
              {subCategory.discount !== undefined && subCategory.discount > 0
                ? `${subCategory.discount}% OFF`
                : "75% OFF"}
            </Typography>
          </Box> */}

          <Box sx={{ position: "relative" }}>
            <Box
              component={"img"}
              src={subCategory.image}
              title={subCategory.name}
              alt="service_image"
              className="subcat-img"
              sx={{ height: "319px" }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: "100%",
                color: theme.palette.color.subCatName,
                padding: "10px", // Adjust the padding as needed
                textAlign: "center",
                overflow: "hidden", // Ensure text overflow is hidden
                whiteSpace: "wrap", // Allow text to wrap to new lines
                textOverflow: "ellipsis", // Display ellipsis (...) for overflowing text
              }}
            >
              <Typography variant="h6" sx={{ textAlign: "center" }}>
                {subCategory.name}
              </Typography>
            </Box>
          </Box>
        </Card>
      </Link>
    </Box>
  );
};

export default SubCategory;
