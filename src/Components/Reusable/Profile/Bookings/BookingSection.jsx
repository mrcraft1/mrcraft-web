import { Box, useTheme } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import Book from "./Book";

const BookingSection = ({ status, booking }) => {
  const theme = useTheme();

  return (
    <>
      {booking &&
        booking.map((bookData) => {
          return (
            <Box
              component={Link}
              to={"/profile/booking/services/" + bookData.id}
              className="breadcrumb"
              sx={{
                color: theme.palette.color.navLink,
              }}
              key={bookData.id}
            >
              <Box
                sx={{
                  width: "100%",
                  border: "2px solid #dedddd",
                  borderRadius: "10px",
                  mb: 2,
                  transition: "ease-in",
                  "&:hover": {
                    border: `2px solid ${theme.palette?.primary?.main}`, // Change the color on hover
                  },
                }}
              >
                <Book bookData={bookData} key={bookData.id} />
              </Box>
            </Box>
          );
        })}
    </>
  );
};

export default BookingSection;
