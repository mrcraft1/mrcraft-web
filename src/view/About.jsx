import React, { useEffect, useState } from "react";
import { Box, Container, Typography, Breadcrumbs, Link } from "@mui/material";
import { t } from "i18next";
import api from "../API/apiCollection";
import { useSelector, useDispatch } from "react-redux";
import { setAboutUs } from "../redux/Pages";
import { SectionBackground } from "../CSS/ThemeStyle";
import { useNavigate } from "react-router-dom";
const AboutPage = () => {
  const dispatch = useDispatch();
  const pages = useSelector((state) => state.Pages);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAboutUs = async () => {
      try {
        if (pages.aboutUs === undefined && !error) {
          const response = await api.get_settings();
          dispatch(setAboutUs(response.data.about_us.about_us));
          setError(false);
        }
      } catch (error) {
        console.error("Error fetching about us:", error);
        setError(true);
      }
    };

    fetchAboutUs();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, pages.aboutUs, dispatch]);

  return (
    <>
      <div>
        <Box
          paddingTop={"35px"}
          paddingBottom={"35px"}
          mt={2}
          // sx={{ background: theme.palette.background.heading }}
        >
          <Container maxWidth="lg" className="mainContainer">
            <Breadcrumbs
              separator="|"
              aria-label="breadcrumb"
              className="mb-1 mt-1 breadcrumb"
            >
              <Link
                className="breadcrumb"
                color="inherit"
                onClick={() => navigate("/")}
              >
                <strong> {t("home")}</strong>
              </Link>
              <Typography color="text.primary">
                <strong>{t("about")}</strong>
              </Typography>
            </Breadcrumbs>
            <Typography variant="h4" gutterBottom>
              <>{t("about_us")}</>
            </Typography>
          </Container>
        </Box>
        <Container maxWidth={"lg"} className="mb-2 mt-2 mainContainer">
          <SectionBackground sx={{ padding: "30px", borderRadius: "8px" }}>
            <div dangerouslySetInnerHTML={{ __html: pages.aboutUs }} />
          </SectionBackground>
        </Container>
      </div>
    </>
  );
};

export default AboutPage;
