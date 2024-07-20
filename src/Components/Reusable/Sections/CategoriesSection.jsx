import {
  Box,
  Button,
  Container,
  Divider,
  Link,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import "swiper/swiper.min.css";
import "swiper/css/navigation";
import { useTheme } from "@emotion/react";
import { t } from "i18next";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Category from "./Category";
import { SkeletonSwiperSlide } from "./Skeletons";
import { useNavigate } from "react-router-dom";

const CategoriesSection = ({ categories, loading }) => {
  const navigate = useNavigate();
  const [swiper, setSwiper] = useState(null);
  const theme = useTheme();
  // Function to handle sliding to the next slide
  const handleNextSlide = () => {
    if (swiper) {
      swiper.slideNext();
    }
  };

  // Function to handle sliding to the previous slide
  const handlePrevSlide = () => {
    if (swiper) {
      swiper.slidePrev();
    }
  };

  return (
    <Box sx={{ background: theme.palette.background.box, py: 2 }}>
      <Container className="mainContainer">
        <Box>
          <Box
            display={"flex"}
            sx={{ my: 1 }}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography
              fontWeight={"bold"}
              sx={{
                fontSize: theme.palette.fonts.h2,
                typography: { md: "h5", xs: "body1" },
              }}
            >
              {t("categories")}
            </Typography>
            <Typography sx={{ typography: { md: "body", xs: "body1" } }}>
              <Link
                href="/categories"
                underline="none"
                sx={{ color: theme.palette.color.secondary,fontWeight: 700, }}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/categories");
                }}
              >
                {t("view_all")}
              </Link>
            </Typography>
          </Box>

          <Divider />

          <Swiper
            className="myslider h-auto"
            pagination={{
              type: "progressbar",
            }}
            slidesPerView={5}
            freeMode={true}
            modules={[Pagination, Navigation]}
            onSwiper={(s) => {
              setSwiper(s);
            }}
            breakpoints={{
              0: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 6,
                spaceBetween: 10,
              },
              1200: {
                slidesPerView: 6,
                spaceBetween: 20,
              },
            }}
          >
            {loading
              ? // Render Skeletons when loading is true
                Array.from(Array(5).keys()).map((index) => (
                  <SwiperSlide key={index}>
                    <SkeletonSwiperSlide />
                  </SwiperSlide>
                ))
              : categories.map((category) => {
                  return (
                    <SwiperSlide
                      key={category.id}
                      className="display-flex just-space-around"
                    >
                      <Box mt={4}>
                        <Category category={category} />
                      </Box>
                    </SwiperSlide>
                  );
                })}
          </Swiper>
          <Box
            display={"flex"}
            sx={{ my: 3 }}
            gap={2}
            width={"100%"}
            justifyContent={"center"}
            alignContent={"center"}
            className='categoryNavigationBtns'
          >
            <Button
              aria-label="Previous"
              variant="contained"
              size="small"
              color="inherit"
              className="categorySwiperBtn"
              sx={{
                borderRadius: "10px",
                minWidth: "40px",
                backgroundColor: "#F2F1F6",
                "&:hover": {
                  backgroundColor: "#F2F1F6",
                  textDecoration: "none",
                },
              }}
              onClick={() => handlePrevSlide()}
            >
              <ArrowBackIosIcon sx={{ color: "black" }} size="small" />
            </Button>
            <Button
              aria-label="Next"
              variant="contained"
              size="small"
              color="inherit"
              className="categorySwiperBtn"
              sx={{
                borderRadius: "10px",
                minWidth: "40px",
                py: 1,
                backgroundColor: "#F2F1F6",
                "&:hover": {
                  backgroundColor: "#F2F1F6",
                  textDecoration: "none",
                },
              }}
              onClick={() => handleNextSlide()}
            >
              <ArrowForwardIosIcon sx={{ color: "black" }} size="small" />
            </Button>
            {/* <span className="previous-next-btn">
                        </span> */}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CategoriesSection;
