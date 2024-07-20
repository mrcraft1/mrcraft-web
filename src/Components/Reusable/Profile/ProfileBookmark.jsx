import React from "react";
import Heading from "./Heading";
import { Box, Container, Grid,Breadcrumbs,Typography} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Bookmark from "./Bookmark";
import Pnavigation from "./Pnavigation";
import { BreadcrumbLink } from "../../../CSS/ThemeStyle";
import { t } from "i18next";
import Layout from "../../layout/Layout";

const ProfileBookmark = () => {
  const company_name = process.env.REACT_APP_NAME
  document.title = `Profile - Bookmark | ${company_name}`;

  const theme = useTheme();
  return (
    <Layout>
      <Box
        // bgcolor={theme.palette.background.heading}
        paddingTop={"35px"}
        paddingBottom={"35px"}
        mt={2}
      >
        <Container maxWidth="lg" className="mainContainer">
          <Breadcrumbs
            separator="|"
            aria-label="breadcrumb"
            className="mb-1 mt-1"
          >
            <BreadcrumbLink to={"/"} className="breadcrumb" sx={{mb:0}}>
              <strong>{t("home")}</strong>
            </BreadcrumbLink>
            <Typography color="text.primary"><strong>{t("profile")}</strong></Typography>
          </Breadcrumbs>
          <Typography variant="h4" gutterBottom={true} sx={{mt: '12px'}}>
            <strong>{t("bookmarks")}</strong>
          </Typography>
        </Container>
      </Box>
      <Box>
        <Container className="mainContainer" sx={{mt: '-40px'}}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Pnavigation />
            </Grid>
            <Grid item xs={12} md={8}>
              <Box
                sx={{
                  background: theme.palette.background.box,
                }}
                mt={3}
                borderRadius={4}
                minHeight={570}
              >
                <Heading heading={t("bookmark")} />
                <Box m={2} pb={5}>
                  <Bookmark />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Layout>
  );
};

export default ProfileBookmark;
