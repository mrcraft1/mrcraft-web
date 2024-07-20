import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import api from "../API/apiCollection";
import Layout from "../Components/layout/Layout";
import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Grid,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
  Link,
} from "@mui/material";
import { t } from "i18next";
import { Search } from "@mui/icons-material";
import { PartnerSkeleton } from "../Components/Reusable/Sections/Skeletons";
import Partner from "../Components/Reusable/Sections/Partner";
import Services from "../Components/Reusable/Sections/Services";
import { normalizeSlugTerm } from "../util/Helper";

const SearchAndProvider = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const location = useSelector((state) => state.Location);
  const [service, setService] = useState([]);
  const [provider, setProvider] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const [value, setValue] = useState(0);

  const [searchTerm, setSearchTerm] = useState(slug || ""); // Initialize with slug or empty string
  const theme = useTheme();
  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      const type = value === 0 ? "service" : "provider";
      await fetchData(type, searchTerm);
    }
  };

  const fetchData = async (type, search = slug) => {
    setIsLoading(true);
    setError(false);
    try {
      const normalizedSearchTerm = normalizeSlugTerm(search);
      // console.log("normal",normalizedSearchTerm);
      const response = await api.search_services_providers({
        search: normalizedSearchTerm,
        latitude: location.lat,
        longitude: location.lng,
        type,
      });

      if (type === "service") {
        setService(response.data.Services || []);
      } else if (type === "provider") {
        setProvider(response.data.providers || []);
      }
      setIsLoading(false);
    } catch (error) {
      setError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData("service");
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const normalizedSearchTerm = normalizeSlugTerm(searchTerm);
    setSearchTerm(normalizedSearchTerm);
  }, [searchTerm]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 0) {
      fetchData("service", searchTerm);
    } else if (newValue === 1) {
      fetchData("provider", searchTerm);
    }
  };

  const handleSearch = () => {
    fetchData(value === 0 ? "service" : "provider", searchTerm);
  };

  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ py: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <>
      <Layout>
        <>
          <Box paddingTop={"35px"} paddingBottom={"35px"} mt={2}>
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
                  <strong>{t("search")}</strong>
                </Typography>
              </Breadcrumbs>
              <Typography variant="h4" gutterBottom>
                <>
                  {t("search")} {t("result")} '{searchTerm}'
                </>
              </Typography>
            </Container>
          </Box>

          <Box className="main-content-search">
            <Container maxWidth="lg" className="mainContainer">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
                className="search-input"
              >
                <TextField
                  className="text-field-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t("search-placeholder")}
                  sx={{ justifyContent: "center", backgroundColor: "#fff" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: theme?.palette?.primary?.main,
                          }}
                          onClick={handleSearch}
                        >
                          {t("search")}
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box sx={{ width: "100%" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                  >
                    <Tab
                      label={t("service")}
                      {...a11yProps(0)}
                      sx={{ alignItems: "flex-start", paddingLeft: "0" }}
                    />
                    <Tab
                      label={t("provider")}
                      {...a11yProps(1)}
                      sx={{ alignItems: "flex-start", paddingLeft: "0" }}
                    />
                  </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                  {isLoading ? (
                    <Grid container spacing={2} mb={13}>
                      <Grid
                        item
                        lg={12}
                        display={"flex"}
                        flexWrap={"wrap"}
                        justifyContent={"space-evenly"}
                        gap={2}
                      >
                        <>
                          <PartnerSkeleton />
                          <PartnerSkeleton />
                          <PartnerSkeleton />
                          <PartnerSkeleton />
                          <PartnerSkeleton />
                          <PartnerSkeleton />
                          <PartnerSkeleton />
                          <PartnerSkeleton />
                          <PartnerSkeleton />
                        </>
                      </Grid>
                    </Grid>
                  ) : (
                    <div className="services-tab">
                      {service && service?.length > 0 ? (
                        <Services servicesData={service} />
                      ) : (
                        <Grid width={"100%"} item xs={12}>
                          <Box
                            display={"flex"}
                            flexDirection={"column"}
                            alignItems={"center"}
                            justifyContent={"center"}
                          >
                            <img
                              className="no-service-and-provider"
                              src={"/images/no-provider.png"}
                              alt="There is no providers"
                            />
                            <Typography variant="body1">
                              {t("no_service")}
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                    </div>
                  )}
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                  {isLoading ? (
                    <Grid container spacing={2} mb={13}>
                      <Grid
                        item
                        lg={12}
                        display={"flex"}
                        flexWrap={"wrap"}
                        justifyContent={"space-evenly"}
                        gap={2}
                      >
                        <>
                          <PartnerSkeleton />
                          <PartnerSkeleton />
                          <PartnerSkeleton />
                          <PartnerSkeleton />
                          <PartnerSkeleton />
                          <PartnerSkeleton />
                          <PartnerSkeleton />
                          <PartnerSkeleton />
                          <PartnerSkeleton />
                        </>
                      </Grid>
                    </Grid>
                  ) : (
                    <Box>
                      <div className="row">
                        {provider && provider?.length > 0 ? (
                          provider.map((response) => (
                            <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 col-xxl-3 mb-4">
                              <Partner
                                partner={response}
                                sx={{
                                  height: "100%",
                                  display: "block",
                                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                                  borderRadius: "10px",
                                }}
                              />
                            </div>
                          ))
                        ) : (
                          <Grid width={"100%"} item xs={12}>
                            <Box
                              display={"flex"}
                              flexDirection={"column"}
                              alignItems={"center"}
                              justifyContent={"center"}
                            >
                              <img
                                className="no-service-and-provider"
                                src={"/images/no-provider.png"}
                                alt="There is no providers"
                              />
                              <Typography variant="body1">
                                {t("no_provider")}
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                      </div>
                    </Box>
                  )}
                </CustomTabPanel>
              </Box>
            </Container>
          </Box>
        </>
      </Layout>
    </>
  );
};

export default SearchAndProvider;
