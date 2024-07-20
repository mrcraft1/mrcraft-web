import { Box, Breadcrumbs, Container, Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import Heading from "./Heading";
import { AddAddress } from "./Address";
import { useTheme } from "@mui/material";
import Pnavigation from "./Pnavigation";
import { t } from "i18next";
import Layout from "../../layout/Layout";
import ViewAddress from "../Sections/ViewAddress";
import { BreadcrumbLink } from "../../../CSS/ThemeStyle";

const ProfileAddress = () => {
  useEffect(() => {
    const company_name = process.env.REACT_APP_NAME;
    document.title = `Profile - Address | ${company_name}`;
  }, []);

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
            <BreadcrumbLink to={"/"} className="breadcrumb" sx={{ mb: 0 }}>
              <strong>{t("home")}</strong>
            </BreadcrumbLink>
            <Typography color="text.primary">
              <strong>{t("profile")}</strong>
            </Typography>
          </Breadcrumbs>
          <Typography variant="h4" gutterBottom={true} sx={{ mt: "12px" }}>
            <strong>{t("manage_addresses")}</strong>
          </Typography>
        </Container>
      </Box>
      <Container className="mainContainer" sx={{ mt: "-40px" }}>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={4}>
            <Pnavigation />
          </Grid>
          <Grid item xs={12} md={8} maxHeight={"100%"}>
            <Box
              sx={{ backgroundColor: theme.palette.background.box, mb: 2 }}
              borderRadius={4}
              mb={2}
              height={"100%"}
            >
              <Box
                sx={{
                  mt: 3,
                  bgcolor: theme.palette.background.box,
                  borderRadius: "10px",
                  pb: 3,
                }}
              >
                <Heading heading={t("manage_address")} />
                <Grid
                  container
                  sx={{
                    borderRadius: "10px",
                    mt: 2,
                  }}
                >
                  <Grid item xs={12}>
                    <AddAddress />
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ my: 2 }}>
                <ViewAddress />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default ProfileAddress;
