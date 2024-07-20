import {
  Box,
  Container,
  Divider,
  Skeleton,
  Typography,
  useTheme,
  LinearProgress,
  useMediaQuery,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/swiper.min.css";
import "swiper/css/navigation";
import SubCategory from "./SubCategory";
import { SkeletonSubCategory } from "./Skeletons";

const SubCategories = ({ subCategory, loading }) => {
  // eslint-disable-next-line no-unused-vars
  const [swiper, setSwiper] = useState(null);
  const theme = useTheme();

  const [progress, setProgress] = useState(0.05); // Initially filled 5%
  const isMdScreen = useMediaQuery("(min-width:1025px)"); // Check if screen size is medium (md) or larger

  useEffect(() => {
    const updateProgress = () => {
      if (swiper) {
        const { progress } = swiper;
        setProgress(progress);
      }
    };

    if (swiper) {
      swiper.on("progress", updateProgress);
    }

    return () => {
      if (swiper) {
        swiper.off("progress", updateProgress);
      }
    };
  }, [swiper]);

  return (
    <>
      <Box sx={{ background: theme.palette.background.box }}>
        <Container sx={{ paddingBottom: "8px", marginBottom: "16px" }} className="mainContainer subCategoriesSection">
          <Box key={subCategory.id} sx={{ padding: '30px 0px', paddingBottom: '0px', margin: '30px 0px' }}>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"end"}
            >
              {loading ? (
                <Skeleton height={50} width={200} />
              ) : (
                <Box>
                  <Typography
                    sx={{
                      typography: { md: "h5", xs: "body1" },
                      fontWeight: "600 !important", // Set font weight to 400
                    }}
                    fontWeight={"bold"} // This line is redundant, you can remove it
                    marginTop={1}
                  >
                    {subCategory.title}
                  </Typography>
                </Box>
              )}

              {loading ? (
                ""
              ) : (
                null
              )}
            </Box>
            {isMdScreen ? (
              <Divider sx={{ my: 1 }} />
            ) : (
              <LinearProgress variant="determinate" value={progress * 100} />
            )}
            <Box mb={2}>
              <Swiper
                className="swiper-wrapper-padding h-auto"
                slidesPerView={5}
                onSwiper={(s) => {
                  setSwiper(s);
                }}
                modules={[Navigation]}
                navigation
                breakpoints={{
                  0: {
                    slidesPerView: 1,
                    spaceBetween: 10,
                  },
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  898: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                  },
                  1204: {
                    slidesPerView: 5,
                    spaceBetween: 15,
                  },
                }}
              >
                <Box>
                  <Swiper
                    navigation={true}
                    modules={[Navigation]}
                    className="mySwiper max-h-500"
                  >
                    {subCategory.sub_categories.map((response) => (
                      <SwiperSlide
                        key={response.id}
                        className=""
                     

                      >
                        {loading ? (
                          <SkeletonSubCategory />
                        ) : (
                          <SubCategory subCategory={response} />
                        )}
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Box>
              </Swiper>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default SubCategories;
