import {
  Box,
  Breadcrumbs,
  Container,
  Grid,
  Typography,
  Skeleton,
  Divider,
} from "@mui/material";
import api from "../../../API/apiCollection";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { t } from "i18next";
import Layout from "../../layout/Layout";
import { useTheme } from "@mui/material";
//import slugify from "slugify";
import ProviderService from "./ProviderService";
import { ServiceSkeleton } from "./Skeletons";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ProviderDetails from "./ProviderDetails";
import ProviderCard from "./ProviderCard";
import Promocodes from "./Promocodes";
import AboutUs from "./AboutUs";
import { useSelector } from "react-redux";

const CustomTabLabel = ({ children }) => (
  <Typography
    variant="body1"
    sx={{ textTransform: "capitalize", fontWeight: "600" }}
  >
    {children}
  </Typography>
);

const ProviderServices = () => {
  const theme = useTheme();

  const [data, setData] = useState([]);
  const [provider, setProvider] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProvierLoading, setProviderLoading] = useState(false);
  const location = useSelector((state) => state.Location);
  const params = useParams();
  const { partner_id } = params;
  const { company_name } = params;

  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.allServices({
          partner_id: partner_id,
          company_name: company_name,
          latitude: location.lat,
          longitude: location.lng,
        });
        setData(response.data);
        setIsLoading(true); // Assuming setIsLoading(false) is correct if data fetching is complete
      } catch (error) {
        setIsLoading(true);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const fetchProviders = async () => {
      try {
        const response = await api.get_providers({
          latitude: location.lat,
          longitude: location.lng,
        });
        setProvider(response.data);
        setProviderLoading(true); // Assuming setProviderLoading(false) is correct if provider fetching is complete
      } catch (error) {
        console.error("Error fetching providers:", error);
        setProviderLoading(true); // Ensure loading state is set to false in case of error
      }
    };

    // Call fetchProviders function
    fetchProviders();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partner_id, company_name, location.lat, location.lng]);

  useEffect(() => {
    const company = localStorage.getItem("Company");
    document.title = `${company_name} Services|${company}`;
  }, [company_name]);

  return (
    <Layout>
      <>
        <Box sx={{}} paddingTop={"0px"} paddingBottom={"44px"} my={1}>
          <Container maxWidth="lg" className="mainContainer">
            <Breadcrumbs
              sx={{ paddingTop: "30px" }}
              separator="|"
              aria-label="breadcrumb"
              className="mt-2 mb-1"
            >
              <Typography
                component={Link}
                to={"/"}
                className="breadcrumb"
                sx={{
                  color: theme.palette.color.breadcrum,
                }}
              >
                <strong>{t("home")}</strong>
              </Typography>
              <Typography
                component={Link}
                to={"/providers"}
                className="breadcrumb"
                sx={{
                  color: theme.palette.color.breadcrum,
                }}
              >
                <strong>{t("Provider")}</strong>
              </Typography>
              <Typography
                component={Link}
                to={"/providers"}
                className="breadcrumb"
                sx={{
                  color: theme.palette.color.breadcrum,
                }}
              >
                <strong> {t("provider_services")}</strong>
              </Typography>
            </Breadcrumbs>
            {isProvierLoading ? (
              <>
                {provider.map((response) => {
                  if (response.partner_id === partner_id) {
                    return (
                      <Typography
                        key={response.partner_id}
                        variant="h4"
                        gutterBottom
                      >
                        <strong>{response.company_name}</strong>
                      </Typography>
                    );
                  }
                  return null;
                })}
              </>
            ) : (
              <Skeleton width={200} height={50} />
            )}
          </Container>
        </Box>
        <Container maxWidth="lg" className="mainContainer">
          <Grid container spacing={2} className="mainContainer">
            <Grid item xs={12}>
              <Box>
                {isProvierLoading ? (
                  <>
                    {provider.map((response) => {
                      if (response.partner_id === partner_id) {
                        const partnerID = response.partner_id;
                        return (
                          <ProviderCard
                            key={partnerID}
                            partnerID={partnerID}
                            partner={response}
                            provider={provider}
                            isProvierLoading={isProvierLoading}
                          />
                        );
                      }
                      return null;
                    })}
                  </>
                ) : (
                  <Box display={"flex"} flexDirection={"column"} gap={3}>
                    <Skeleton variant="rectangular" height={"288px"} />
                    <Skeleton variant="rectangular" height={"50px"} />
                    <Skeleton variant="rectangular" height={"800px"} />
                    <Skeleton variant="rectangular" height={"500px"} />
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>

        <Container maxWidth="lg" className="mainContainer">
          <Grid container spacing={2} sx={{ borderRadius: "10px" }}>
            <Grid item xs={12}>
              <Box sx={{ mt: 2 }}>
                <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList
                      onChange={handleChange}
                      aria-label="lab API tabs example"
                      className="provider-tab"
                    >
                      <Tab
                        value="1"
                        label={
                          <CustomTabLabel sx={{ fontWeight: "bold" }}>
                            {t("services")}
                          </CustomTabLabel>
                        }
                      />
                      <Tab
                        value="2"
                        label={<CustomTabLabel>{t("reviews")}</CustomTabLabel>}
                      />
                      <Tab
                        value="3"
                        label={
                          <CustomTabLabel>{t("promocodes")}</CustomTabLabel>
                        }
                      />
                      <Tab
                        value="4"
                        label={<CustomTabLabel>{t("about_us")}</CustomTabLabel>}
                      />
                    </TabList>
                  </Box>

                  <TabPanel
                    value="1"
                    sx={{
                      px: 0,
                      py: 0,
                      // paddingBottom: "1.5em",
                      background: theme.palette.background.box,
                      marginTop: 2,
                      mb: 2,
                      borderRadius: "10px",
                    }}
                  >
                    <Typography variant="h5" fontWeight={"bold"} py={2} px={4}>
                      {t("our_services")}
                    </Typography>

                    <Divider />
                    <Box mt={1} px={3}>
                      {isLoading ? (
                        data && data?.length === 0 ? (
                          <>
                            <Box
                              maxWidth={"100%"}
                              maxHeight={"100%"}
                              alignItems={"center"}
                              textAlign={"center"}
                            >
                              <img
                                src={"/images/No-service.png"}
                                style={{ maxWidth: "100%" }}
                                width={"400"}
                                alt="no service"
                              />
                            </Box>
                            <Box alignItems={"center"} textAlign={"center"}>
                              <Typography>{t("no_service")}</Typography>
                            </Box>
                          </>
                        ) : (
                          <Box>
                            {data &&
                              data.map((response) => (
                                <ProviderService
                                  key={response.id}
                                  service={response}
                                  provider={provider}
                                  partner_id={partner_id}
                                />
                              ))}
                          </Box>
                        )
                      ) : (
                        <Box>
                          <ServiceSkeleton />
                          <ServiceSkeleton />
                          <ServiceSkeleton />
                          <ServiceSkeleton />
                          <ServiceSkeleton />
                          <ServiceSkeleton />
                        </Box>
                      )}
                    </Box>
                  </TabPanel>

                  <TabPanel
                    value="2"
                    sx={{
                      borderRadius: "10px",
                      mt: 2,
                    }}
                  >
                    <ProviderDetails
                      isProvierLoading={isProvierLoading}
                      provider={provider}
                      partner_id={partner_id}
                    />
                  </TabPanel>

                  <TabPanel
                    value="3"
                    sx={{
                      //backgroundColor: "#fff",
                      marginTop: "0em",
                      width: "100%",
                      p: { xs: 0, md: 3 },
                      borderRadius: "10px",
                    }}
                  >
                    <Promocodes partner_id={partner_id} />
                  </TabPanel>

                  <TabPanel
                    value="4"
                    sx={{
                      p: 2,
                      pr: 1,
                      borderRadius: "10px",
                      mt: 2,
                    }}
                  >
                    <Box>
                      {isProvierLoading &&
                        provider.map((response, index) => {
                          if (response.partner_id === partner_id) {
                            // Store the desired response object in a variable
                            const selectedProviderResponse = response;
                            return (
                              <AboutUs
                                key={index}
                                data={selectedProviderResponse}
                              />
                            );
                          }
                          return null;
                        })}
                    </Box>
                  </TabPanel>
                </TabContext>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </>
    </Layout>
  );
};

export default ProviderServices;
