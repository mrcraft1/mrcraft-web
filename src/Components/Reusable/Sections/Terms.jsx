import { Box, Breadcrumbs, Container, Link, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import { useSelector } from "react-redux";
import Layout from "../../layout/Layout";
import { SectionBackground } from "../../../CSS/ThemeStyle";

const Terms = () => {
  const navigate = useNavigate();

  let settings = useSelector((state) => state.Settings)?.settings;
  let customer_terms_conditions =
    settings?.customer_terms_conditions?.customer_terms_conditions;

  return (
    <>
      <Layout>
        <Box
          paddingTop="35px"
          paddingBottom="35px"
          mb="20px"
          mt={2}
          // sx={{ background: theme.palette.background.heading }}
        >
          <Container maxWidth="lg" className="mainContainer">
            <Breadcrumbs separator="|" aria-label="breadcrumb">
              <Link
                className="breadcrumb"
                color="inherit"
                onClick={() => navigate("/")}
              >
                <strong> {t("home")}</strong>
              </Link>
              <Typography color="text.primary">
                {t("terms_and_conditions")}
              </Typography>
            </Breadcrumbs>
            <Typography variant="h4">
              <strong>{t("terms_and_conditions")}</strong>
            </Typography>
          </Container>
        </Box>
        <Container maxWidth="lg" className="mt-2 mb-2 mainContainer">
          <SectionBackground sx={{ padding: "30px", borderRadius: "8px" }}>
            <div
              dangerouslySetInnerHTML={{ __html: customer_terms_conditions }}
            />
          </SectionBackground>
        </Container>
      </Layout>
    </>
  );
};

export default Terms;
