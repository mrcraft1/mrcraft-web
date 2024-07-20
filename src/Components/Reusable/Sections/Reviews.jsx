import {
  Box,
  Breadcrumbs,
  Container,
  Divider,
  Link,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import CustomerReview from "./CustomerReview";
import { useNavigate } from "react-router";
import Layout from "../../layout/Layout";
import { t } from "i18next";
import { capilaizeString } from "../../../util/Helper";

const Review = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const currentURL = window.location.href;
  const urlArray = currentURL.split("/");
  const id = urlArray[6];

  useEffect(() => {
    var partner_name = urlArray[7];
    partner_name = capilaizeString(partner_name);
    const company_name = process.env.REACT_APP_NAME
    document.title = `${t(
      "reviews_and_rating"
    )} | ${partner_name} | ${company_name}`;
  }, [urlArray]);

  return (
    <Layout>
      <Container className="mainContainer">
        <Box sx={{ mt: '25px', pb: '20px' }}>

          <Breadcrumbs
            separator="|"
            aria-label="breadcrumb"
            className="mb-1 mt-1"
            my={1}
            mt={3}
          >
            <Link
              underline="hover"
              color="inherit"
              onClick={() => navigate("/")}
              className="breadcrumb"
            >
              <strong>{t("home")}</strong>
            </Link>
            <Link
              underline="hover"
              color="inherit"
              className="breadcrumb"
              onClick={() => navigate("/providers")}
            >
              <strong>{t("providers")}</strong>
            </Link>
            <Typography color="text.primary"><strong>{t("all_reviews")}</strong></Typography>
            <Typography color="text.primary"><strong>{urlArray[7]}</strong></Typography>
          </Breadcrumbs>
          <Typography variant="h4" gutterBottom mt={2}>
            <strong>{t("all_reviews")}</strong>
          </Typography>
        </Box>


        <Box
          p={2}
          borderRadius={"10px"}
          my={2}
          minHeight={520}
          sx={{
            background: theme.palette.background.box,
            mb: '40px'
          }}
        >
          <Typography variant="h5" mb={2}>
            {t("review_and_rating")}
          </Typography>
          <Divider />
          <CustomerReview partnerID={id} limit={5} />
        </Box>
      </Container>
    </Layout>
  );
};

export default Review;
