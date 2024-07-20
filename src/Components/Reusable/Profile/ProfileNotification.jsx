import React, { useEffect, useState } from "react";
import Heading from "./Heading";
import {
  Box,
  Container,
  Grid,
  Pagination,
  Skeleton,
  Stack,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Breadcrumbs,
  Button,
} from "@mui/material";
import { BreadcrumbLink } from "../../../CSS/ThemeStyle";
import { useTheme } from "@mui/material/styles";
import Pnavigation from "./Pnavigation";
import { t } from "i18next";
import Layout from "../../layout/Layout";
import api from "../../../API/apiCollection";
import { ceil } from "lodash";
import noDataImage from "../../../Images/No__data-pana.png";
import dummyUser from "../../../Images/dummyUser.jpeg";

const ProfileNotification = () => {
  const company_name = process.env.REACT_APP_NAME;
  document.title = `Profile - Notifications | ${company_name}`;

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
            <strong>{t("notifications")}</strong>
          </Typography>
        </Container>
      </Box>
      <Container
        className="notification-container mainContainer"
        sx={{ mt: "-40px" }}
      >
        <Grid container spacing={1}>
          <Grid item xs={12} md={4}>
            <Pnavigation />
          </Grid>
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                mt: 3,
                background: theme.palette.background.box,
                borderRadius: "10px",
              }}
            >
              <Heading heading={t("notifications")} />
              <Box minHeight={500}>
                <NotificationList />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export const NotificationList = () => {
  const [notification, setNotification] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const limit = 5;
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState(false);
  const currentPage = 0;
  const itemsPerPage = 3;

  const changeItem = (e, v) => {
    const newOffset = (v - 1) * limit;
    setOffset(newOffset);
  };

  const fetchNotifications = async (page) => {
    try {
      const response = await api.userNotifications({
        limit: limit,
        offset: offset,
      });
      setNotification(response.data);
      setTotal(response.total);
      setLoading(true);
      setError(false); // Resetting error state to false when data is successfully fetched
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError(true);
      setLoading(false); // Setting error state to true when an error occurs
    }
  };

  useEffect(() => {
    fetchNotifications(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

  const theme = useTheme();

  const totalItems = total; // Use the total count from API response
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  return (
    <>
      {!error ? (
        <Box
          sx={{
            maxWidth: "100%",
            bgcolor: theme.palette.background.box,
            padding: 0,
          }}
        >
          {loading ? (
            <>
              {notification && notification?.length > 0 ? (
                <Box sx={{ backgroundColor: theme.palette.background.box }}>
                  {notification.map((response) => {
                    return (
                      <Box key={response.id} sx={{ boxShadow: "none" }}>
                        <Card
                          sx={{
                            display: "flex",
                            backgroundColor: theme.palette.background.box,
                            mt: 2,
                            mx: 3,
                            boxShadow: "none",
                            borderBottom: "rgba(128, 128, 128, 0.14) 2px solid",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: {
                                xs: "column",
                                sm: "row",
                                md: "row",
                              },
                              mx: 3,
                              alignItems: "center",
                              width: "100%",
                            }}
                          >
                            <CardMedia
                              component="img"
                              sx={{
                                width: { xs: "100%", sm: 151, md: "70px" },
                                height: { xs: "100%", sm: 151, md: "70px" },
                                borderRadius: { xs: "10px", md: "50%" },
                              }}
                              image={response.image || dummyUser}
                              onError={(e) => {
                                e.target.src = dummyUser;
                              }}
                              alt="Notification Image"
                            />
                            <Box
                              sx={{ display: "flex", flexDirection: "column" }}
                              width={"100%"}
                              ml={0.5}
                            >
                              <CardContent
                                sx={{
                                  flex: "1 0 auto",
                                  display: "flex",
                                  flexWrap: { xs: "wrap", lg: "nowrap" },
                                  gap: { xs: "12px", lg: "0px" },
                                }}
                              >
                                <Box
                                  display={"flex"}
                                  flexDirection={"column"}
                                  width={"90%"}
                                  justifyContent={"space-between"}
                                >
                                  <Typography component="div" variant="h6">
                                    {response.title}
                                  </Typography>
                                  <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                    component="div"
                                  >
                                    {response.message}
                                  </Typography>
                                </Box>
                                <Typography
                                  variant="subtitle2"
                                  color="text.secondary"
                                  component="div"
                                >
                                  {response.duration}
                                </Typography>
                              </CardContent>
                            </Box>
                          </Box>
                        </Card>
                      </Box>
                    );
                  })}

                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    mt={12}
                    pb={3}
                  >
                    <Stack spacing={2}>
                      {totalPages > 0 ? (
                        <Pagination
                          showFirstButton
                          showLastButton
                          count={ceil(total / limit)}
                          onChange={changeItem}
                        />
                      ) : (
                        ""
                      )}
                    </Stack>
                  </Box>
                </Box>
              ) : (
                <>
                  <Box
                    display={"flex"}
                    maxWidth={"100%"}
                    justifyContent={"center"}
                  >
                    <Box
                      component={"img"}
                      src={"/images/no-provider.png"}
                      alt="NO SUB CATEGORY FOUND"
                      sx={{ maxWidth: "100%" }}
                      width={"auto"}
                    />
                  </Box>

                  <Box display={"flex"} justifyContent={"center"}>
                    <Typography variant="body1">
                      {t("no_notifications")}
                    </Typography>
                  </Box>
                </>
              )}
            </>
          ) : (
            <Container>
              <Skeleton height={"100px"} />
              <Skeleton height={"100px"} />
              <Skeleton height={"100px"} />
              <Skeleton height={"100px"} />
              <Skeleton height={"100px"} />
              <Skeleton height={"100px"} />
            </Container>
          )}
        </Box>
      ) : (
        <Box>
          {!loading ? (
            <Grid
              container
              spacing={2}
              direction="column" // Stack components vertically
              alignItems="center"
              justifyContent="center"
              height="100vh" // Adjust this according to your layout
              sx={{
                marginTop: {
                  xs: 0, // No margin on extra small screens
                  md: -20, // 100px margin on medium screens and larger
                },
              }}
            >
              <Grid item>
                <CardMedia
                  component="img"
                  src={noDataImage} // Use the imported PNG image
                  alt="No Data Image"
                  sx={{
                    width: { xs: 300, sm: 600, md: 700 }, // Set width based on screen size
                    height: "auto", // Maintain aspect ratio
                    border: "none", // Remove border
                    boxShadow: "none", // Remove box shadow
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  sx={{
                    textAlign: "center", // Center the text
                    marginTop: {
                      xs: 0, // No margin on extra small screens
                      md: -22, // 100px margin on medium screens and larger
                    },
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      textAlign: "left",
                      fontFamily: "Plus Jakarta Sans",
                      fontWeight: "bold",
                      fontSize: "32px",
                      lineHeight: "32px",
                      letterSpacing: "0px",
                    }}
                  >
                    {t("something_went_wrong")}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      color: "var(--secondary-color-343f53)", // Using custom color variable
                      textAlign: "left",
                      fontFamily: "Plus Jakarta Sans",
                      fontWeight: "normal",
                      fontSize: "20px",
                      lineHeight: "32px",
                      letterSpacing: "0px",
                      opacity: 0.7,
                      marginLeft: 5,
                    }}
                  >
                    {t("try_again_later")}
                  </Typography>
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  onClick={fetchNotifications}
                  sx={{
                    textTransform: "none",
                    marginTop: {
                      xs: 0, // No margin on extra small screens
                      md: -28, // 100px margin on medium screens and larger
                    },
                  }}
                >
                  {t("retry")}
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Container>
              <Skeleton height={"100px"} />
              <Skeleton height={"100px"} />
              <Skeleton height={"100px"} />
              <Skeleton height={"100px"} />
              <Skeleton height={"100px"} />
              <Skeleton height={"100px"} />
            </Container>
          )}
        </Box>
      )}
    </>
  );
};

export default ProfileNotification;
