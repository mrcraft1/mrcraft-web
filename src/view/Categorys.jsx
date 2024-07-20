import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  CardMedia,
} from "@mui/material";
import { SectionBackground } from "../CSS/ThemeStyle";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../API/apiCollection";
import { t } from "i18next";
import ViewCategories from "../Components/Reusable/Sections/ViewCategories";
import { setCategory } from "../redux/Pages";
import { CategorySkeleton } from "../Components/Reusable/Sections/Skeletons";
import noDataImage from "../Images/No__data-pana.png";
import Breadcrumb from "../Components/Reusable/Breadcrumb/Breadcrumb";

const Categorys = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const category = useSelector((state) => state.Pages).category;
  const dispatch = useDispatch();
  const location = useSelector((state) => state.Location);

  const fetchData = async () => {
    try {
      const response = await api.get_category({
        latitude: location.lat,
        longitude: location.lng,
      });
      if (response) {
        setLoading(false);
        setError(false);
        dispatch(setCategory(response.data));
      } else {
        setLoading(false);
        setError(true);
      }
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const retryFetchData = () => {
    setLoading(true);
    setError(false);
    fetchData();
  };

  return (
    <div>
      <Breadcrumb home={t("home")} pageOne={t("all_categories")} />
      {/* <Box
        bgcolor={theme.palette.background.heading}
        paddingTop={"15px"}
        paddingBottom={"4px"}
        mb={"20px"}
        mt={2}
      >
        <Container maxWidth="lg">
          <Breadcrumbs
            separator="|"
            aria-label="breadcrumb"
            className="mb-1 mt-1"
          >
            <BreadcrumbLink to={"/"} className="breadcrumb">
              {t("home")}
            </BreadcrumbLink>
            <Typography color="text.primary">{t("category")}</Typography>
          </Breadcrumbs>
          <Typography variant="h4" gutterBottom={true}>
            <strong>{t("all_categories")}</strong>
          </Typography>
        </Container>
      </Box> */}

      {!error ? (
        <SectionBackground sx={{ paddingBottom: "12px", mb: "40px" }}>
          <Container className="mainContainer">
            <Grid container spacing={4} sx={{ mb: "44px", mt: 2 }}>
              {loading === false ? (
                category?.map((category) => {
                  return (
                    <Grid key={category.id} item xs={12} sm={6} md={3}>
                      <ViewCategories category={category} loading={loading} />
                    </Grid>
                  );
                })
              ) : (
                <Box mb={17}>
                  <CategorySkeleton />
                  <CategorySkeleton />
                  <CategorySkeleton />
                  <CategorySkeleton />
                  <CategorySkeleton />
                </Box>
              )}
            </Grid>
          </Container>
        </SectionBackground>
      ) : (
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
              md: -12.2, // 100px margin on medium screens and larger
            },
          }}
        >
          <Grid item>
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
                  marginTop: 0.1,
                }}
              >
                {t("try_again_later")}
              </Typography>
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={retryFetchData}
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
      )}
    </div>
  );
};

export default Categorys;
