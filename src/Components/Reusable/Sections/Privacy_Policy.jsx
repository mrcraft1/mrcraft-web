import { Box, Breadcrumbs, Container, Link, Typography } from "@mui/material";
import React from "react";
import Layout from "../../layout/Layout";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import { useSelector } from "react-redux";
import { SectionBackground } from "../../../CSS/ThemeStyle";
const Privacy_Policy = () => {
  let settings = useSelector((state) => state.Settings)?.settings;
  let privacy_policy = settings?.customer_privacy_policy?.customer_privacy_policy;

  const navigate = useNavigate();

  return (
    <Layout>
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
              <Typography color="text.primary"><strong>{t("privacy")}</strong></Typography>
            </Breadcrumbs>
            <Typography variant="h4" gutterBottom>
              <>{t("privacy")}</>
            </Typography>
          </Container>
        </Box>
        <Container maxWidth={"lg"} className="mb-2 mt-2 mainContainer">
          <SectionBackground sx={{padding: '30px',borderRadius: '8px'}}>
            <div dangerouslySetInnerHTML={{ __html: privacy_policy }} />
          </SectionBackground>
        </Container>
      </div>
    </Layout>
  );
};

export default Privacy_Policy;
