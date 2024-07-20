import React from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import Layout from "../../layout/Layout";
import Pnavigation from "./Pnavigation";
import { t } from "i18next";

const ProfileNavigation = () => {
  const company_name = process.env.REACT_APP_NAME;
  document.title = `Profile | ${company_name}`;
  const url = "/profile";

  return (
    <Layout>
      <Container maxWidth={"lg"}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Pnavigation />
          </Grid>

          <Grid item xs={12} md={8} mt={8} mb={3}>
            {url === "/profile" ? (
              <>
                <Box
                  display={"flex"}
                  justifyContent={{ xs: "start", md: "center" }}
                  textAlign={"center"}
                  height={400}
                >
                  <img
                    src={"/images/no-booking.png"}
                    className="border-radius-10"
                    width={"auto"}
                    height="380px"
                    alt="Empty state"
                  />
                </Box>
                <Box>
                  <Typography
                    color={"#5e6870"}
                    fontSize={"30px"}
                    textAlign={{ md: "center" }}
                    ml={{ xs: "80px", sm: "" }}
                  >
                    {t("nothing_here")}
                  </Typography>
                </Box>
              </>
            ) : (
              <></>
            )}
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default ProfileNavigation;
