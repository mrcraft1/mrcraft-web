import React from "react";
import Provider from "../Components/Reusable/Sections/Provider";
import { Container, Grid } from "@mui/material";
import { t } from "i18next";
import { SectionBackground } from "../CSS/ThemeStyle";
import Breadcrumb from "../Components/Reusable/Breadcrumb/Breadcrumb.jsx";

const Providers = () => {
  return (
    <div>
      <Breadcrumb home={t("home")} pageOne={t("all_service_provider")} />

      <SectionBackground sx={{ pt: "22px", my: "40px" }}>
        <Container className="mainContainer">
          <Grid item xs={12}>
            <Provider />
          </Grid>
        </Container>
      </SectionBackground>
    </div>
  );
};

export default Providers;
