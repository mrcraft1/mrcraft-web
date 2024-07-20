import React, { useState, useEffect } from "react";
import { Grid, Typography, Card, CardMedia, Box } from "@mui/material";
import { t } from "i18next";
import { FaLocationDot } from "react-icons/fa6";
import { useTheme } from "@emotion/react";
import { useParams } from "react-router";
import NoImage from "../../../Images/No_Image Found_99.svg";
import GoogleMapBox from "../../GoogleMap/GoogleMapBox";
import { MAP_API } from "../../../config/config";
import AboutUsLightbox from "../../LightBox/AboutUsLightbox";

const AboutUs = ({ data }) => {
  // console.log(data1);
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const LATITUDE = data && data.latitude;
  const LONGITUDE = data && data.longitude;
  const params = useParams();
  const { company_name } = params;

  useEffect(() => {
    const company = process.env.REACT_APP_NAME;
    document.title = `${company_name}-About Us|${company}`;
  }, []);

  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const suffix = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes < 10 ? "0" : ""}${minutes} ${suffix}`;
  };

  // Function to convert HTML to plain text
  const htmlToText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const theme = useTheme();

  const isDayOpen = (day) => {
    return data && data[`${day.toLowerCase()}_is_open`] === "1";
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid
          item
          md={12}
          mb={2}
          p={2}
          bgcolor={theme.palette.background.box}
          borderRadius={"10px"}
        >
          <div>
            <Typography
              variant="body1"
              sx={{
                font: "normal normal bold 24px/32px 'Plus Jakarta Sans'",
                color: theme.palette.color.textColor,
                textAlign: "left",
                letterSpacing: "0px",
                opacity: 1,
                marginBottom: "19px",
              }}
            >
              {t("about_this_provider")}
            </Typography>
            <Box>
              <Typography
                sx={{
                  font: "var(--unnamed-font-style-normal) normal var(--unnamed-font-weight-normal) 20px/var(--unnamed-line-spacing-32) var(--unnamed-font-family-plus-jakarta-sans)",
                  textAlign: { xs: "center", md: "left" },
                  marginBottom: "30px",
                }}
                color={theme.palette.color.textColor}
              >
                {data?.about}
              </Typography>
            </Box>
          </div>
        </Grid>

        <Grid container gap={2} mb={2} mt={-2} py={2}>
          <Grid
            item
            md={5.9}
            bgcolor={theme.palette.background.box}
            borderRadius={"10px"}
          >
            <Typography
              variant="body1"
              sx={{
                font: "normal normal bold 24px/32px 'Plus Jakarta Sans'",
                color: theme.palette.color.textColor,
                textAlign: { xs: "center", md: "left" },
                letterSpacing: "0px",
                opacity: 1,
                marginBottom: "4px",
                borderRadius: "10px",
                padding: 2,
              }}
            >
              {t("bussiness_hours")}
            </Typography>
            <Grid container gap={1} ml={{ xs: 0, md: 2 }} mb={2}>
              {days.map((day, index) => (
                <Grid container key={index}>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        font: "normal normal medium 22px/32px Plus Jakarta Sans",
                        color: theme.palette.color.textColor,
                        textAlign: { xs: "center", md: "left" },
                        letterSpacing: "1.1px",
                        opacity: 1,
                        marginBottom: "3px",
                      }}
                    >
                      {day}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="body1"
                      color={theme.palette.color.textColor}
                      textAlign={{ xs: "center", md: "left" }}
                    >
                      {isDayOpen(day)
                        ? `${formatTime(
                            data[`${day.toLowerCase()}_opening_time`]
                          )} - ${formatTime(
                            data[`${day.toLowerCase()}_closing_time`]
                          )}`
                        : "Closed"}
                    </Typography>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid
            item
            md={5.9}
            width={"100%"}
            bgcolor={theme.palette.background.box}
            borderRadius={"10px"}
            p={2}
          >
            <Grid item md={12}>
              <Typography
                variant="body1"
                sx={{
                  font: "normal normal bold 24px/32px 'Plus Jakarta Sans'",
                  color: theme.palette.color.textColor,
                  textAlign: "left",
                  letterSpacing: "0px",
                  opacity: 1,
                }}
              >
                {t("photos")}
              </Typography>
            </Grid>
            <Box
              mx={1}
              my={2}
              px={2}
              maxWidth={"100%"}
              display={"flex"}
              flexDirection={"column"}
              gap={2}
            >
              {data?.other_images?.length > 0 ? (
                <Box>
                  {/* Lightbox */}
                  <AboutUsLightbox urls={data.other_images} />
                </Box>
              ) : (
                <Box
                  mt={3}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Card
                    sx={{
                      width: "60%",
                      marginTop: "0px",
                      height: "80%",
                      marginBottom: "8px",
                      position: "relative",
                      borderRadius: "10px",
                      boxShadow: "none",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={NoImage}
                      alt="No Image"
                      sx={{
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </Card>
                  <Typography variant="h6" textAlign="center" color="#4a4a4a">
                    No Photos Available
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Grid>

      {/* Service Description */}

      {htmlToText(data.long_description)?.length > 0 && (
        <Grid container spacing={2} mt={-2}>
          <Grid
            item
            md={12}
            bgcolor={theme.palette.background.box}
            borderRadius={"10px"}
          >
            <Typography
              variant="body1"
              sx={{
                font: "normal normal bold 24px/32px 'Plus Jakarta Sans'",
                color: theme.palette.color.textColor,
                textAlign: "left",
                letterSpacing: "0px",
                opacity: 1,
                marginBottom: "30px",
                wordBreak: "break-word",
              }}
            >
              {t("company_information")}
            </Typography>
            <Grid container>
              <Grid item md={12}>
                <Typography
                  sx={{
                    font: "var(--unnamed-font-style-normal) normal var(--unnamed-font-weight-normal) 20px/var(--unnamed-line-spacing-32) var(--unnamed-font-family-plus-jakarta-sans)",
                    textAlign: { xs: "center", md: "left" },
                    letterSpacing: "0px",
                    marginBottom: "30px",
                    pr: 2,
                    wordBreak: "break-word",
                  }}
                  color={theme.palette.color.textColor}
                >
                  {htmlToText(data.long_description)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}

      {/* GOOGLE MAP */}
      <Grid container spacing={2} mt={2}>
        <Grid
          item
          md={12}
          sm={12}
          xs={12}
          bgcolor={theme.palette.background.box}
          borderRadius={"10px"}
          width={"100%"}
        >
          <Typography
            variant="body1"
            sx={{
              font: "normal normal bold 24px/32px 'Plus Jakarta Sans'",
              color: theme.palette.color.textColor,
              textAlign: "left",
              letterSpacing: "0px",
              opacity: 1,
              marginBottom: "30px",
              wordBreak: "break-word",
            }}
          >
            {t("contact")}
          </Typography>
          <Grid item md={12} sm={12} xm={12} mb={3}>
            <div
              style={{
                margin: "1em",
                marginLeft: "0em",
              }}
            >
              <GoogleMapBox
                onSelectLocation={(e) => e}
                apiKey={MAP_API}
                isLocationPass={true}
                locationlat={parseFloat(LATITUDE)}
                locationlng={parseFloat(LONGITUDE)}
              />
            </div>
          </Grid>

          <Grid item md={12} mb={2}>
            <Typography
              style={{
                font: "var(--unnamed-font-style-normal) normal var(--unnamed-font-weight-normal) 20px/var(--unnamed-line-spacing-32) var(--unnamed-font-family-plus-jakarta-sans)",
                color: "var(--secondary-color-343f53)",
                textAlign: "left",
                letterSpacing: "0px",
                opacity: 1,
                fontSize: "24px",
                marginBottom: 2,
                wordBreak: "break-word",
              }}
            >
              {data.company_name}
            </Typography>
            <Typography
              style={{
                font: "var(--unnamed-font-style-normal) normal var(--unnamed-font-weight-normal) 20px/var(--unnamed-line-spacing-32) var(--unnamed-font-family-plus-jakarta-sans)",
                color: "var(--secondary-color-343f53)",
                textAlign: "left",
                letterSpacing: "0px",
                opacity: 1,
                marginTop: 10,
                fontSize: "20px",
                wordBreak: "break-word",
              }}
            >
              <FaLocationDot color="#2560FC " /> {"   "}
              {"  "} {data.address}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AboutUs;
