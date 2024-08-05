import React, { useEffect, useState } from "react";
import api from "../API/apiCollection";
import SwiperHome from "../Components/Reusable/Sections/Slider";
import CategoriesSection from "../Components/Reusable/Sections/CategoriesSection";
import ProviderSection from "../Components/Reusable/Sections/ProviderSection";
import SubCategories from "../Components/Reusable/Sections/SubCategories";
import {
  Box,
  Container,
  useTheme,
  Grid,
  Typography,
  Button,
  Card,
  CardMedia,
} from "@mui/material";
import {
  PartnerSkeleton,
  SkeletonSubCategory,
} from "../Components/Reusable/Sections/Skeletons";
import { useSelector, useDispatch } from "react-redux";
import { setHomePage } from "../redux/Pages";
import { t } from "i18next";
import noDataImage from "../Images/No__data-pana.png";

const HomeFinal = () => {
  const [slider, setSlider] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false); // State to track fetch errors
  const dispatch = useDispatch();
  const locationData = useSelector((state) => state.Location);
  //const HomeData = useSelector((state) => state.Pages).home;
  const web_settings = useSelector((state) => state.Settings)?.settings
    ?.web_settings;
  const theme = useTheme();

  // console.log("locationhome",locationData)

  // Function to fetch home data
  const fetchHome = async () => {
    setLoading(true); // Set loading state to true when fetching data
    setFetchError(false); // Reset fetch error state

    try {
      const response = await api.get_home_screen({
        latitude: locationData.lat,
        longitude: locationData.lng,
      });
      setSlider(response?.data?.sliders);
      setCategories(response?.data?.categories);
      setSections(response?.data?.sections);
      dispatch(setHomePage(response?.data));
    } catch (error) {
      console.log(error);
      setFetchError(true); // Set fetch error state to true
    } finally {
      setLoading(false); // Set loading state to false regardless of the outcome
    }
  };

  useEffect(() => {
    fetchHome();
    // eslint-disable-next-line
  }, [web_settings, locationData]);

  return (
    <>
      {fetchError ? ( // Render retry button only if fetch error
        <Grid
          container
          spacing={2}
          direction="column" // Stack components vertically
          alignItems="center"
          justifyContent="center"
          height="100vh" // Adjust this according to your layout
          sx={{
            marginTop: {
              xs: 0, // No margin on extra small screens
              md: -20, // 100px margin on medium screens and larger
            },
          }}
        >
          <Grid item>
            <Card
              sx={{
                boxShadow: "none !important",
                // marginTop: {
                //   xs: 0, // No margin on extra small screens
                //   md: -30, // 100px margin on medium screens and larger
                // },
              }}
            >
              <CardMedia
                component="img"
                src={noDataImage} // Use the imported PNG image
                alt="No Data Image"
                sx={{
                  width: { xs: 300, sm: 600, md: 700 }, // Set width based on screen size
                  height: "auto", // Maintain aspect ratio
                  border: "none", // Remove border
                  boxShadow: "none", // Remove box shadow
                }}
              />
            </Card>
          </Grid>
          <Grid item>
            <Typography
              sx={{
                textAlign: "center", // Center the text
                marginTop: {
                  xs: 0, // No margin on extra small screens
                  md: -22, // 100px margin on medium screens and larger
                },
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  textAlign: "left",
                  fontFamily: "Plus Jakarta Sans",
                  fontWeight: "bold",
                  fontSize: "32px",
                  lineHeight: "32px",
                  letterSpacing: "0px",
                }}
              >
                {t("something_went_wrong")}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "var(--secondary-color-343f53)", // Using custom color variable
                  textAlign: "left",
                  fontFamily: "Plus Jakarta Sans",
                  fontWeight: "normal",
                  fontSize: "20px",
                  lineHeight: "32px",
                  letterSpacing: "0px",
                  opacity: 0.7,
                  marginLeft: 5,
                }}
              >
                {t("try_again_later")}
              </Typography>
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={fetchHome}
              sx={{
                textTransform: "none",
                marginTop: {
                  xs: 0, // No margin on extra small screens
                  md: -28, // 100px margin on medium screens and larger
                },
              }}
            >
              {t("retry")}
            </Button>
          </Grid>
        </Grid>
      ) : (
        <>
          <SwiperHome sliderData={slider} loading={loading} />
          <Box my={3}>
            <CategoriesSection categories={categories} loading={loading} />
          </Box>

          {loading ? (
            <Box
              className="display-flex gap-12"
              sx={{
                overflow: "auto",
                background: theme.palette.background.box,
              }}
            >
              <Container>
                <Box display={"flex"} gap={2} mt={1} mb={1}>
                  {Array.from(Array(4).keys()).map((index) => (
                    <SkeletonSubCategory key={index} />
                  ))}
                </Box>

                <Box display={"flex"} gap={2} mt={1} mb={1}>
                  {Array.from(Array(3).keys()).map((index) => (
                    <PartnerSkeleton key={index} />
                  ))}
                </Box>
              </Container>
            </Box>
          ) : (
            sections.map((section) => {
              if (
                section.section_type === "partners" ||
                section.section_type === "top_rated_partner"
              ) {
                return (
                  <ProviderSection
                    key={section.id}
                    Provider={section}
                    loading={loading}
                    isHome={true}
                  />
                );
              } else if (section.section_type === "sub_categories") {
                return (
                  <SubCategories
                    key={section.id}
                    subCategory={section}
                    loading={loading}
                  />
                );
              }
              return null;
            })
          )}
        </>
      )}
    </>
  );
};

export default HomeFinal;
