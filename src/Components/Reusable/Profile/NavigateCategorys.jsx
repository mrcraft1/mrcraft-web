/* eslint eqeqeq: 0 */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/free-mode";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Link } from "react-router-dom";
import Partner from "../Sections/Partner";
import api from "../../../API/apiCollection";
import {
  Box,
  Breadcrumbs,
  Container,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Skeleton,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { t } from "i18next";
import slugify from "slugify";
import Layout from "../../layout/Layout";
import { PartnerSkeleton, SkeletonSubCategory } from "../Sections/Skeletons";
import { Navigation } from "swiper";
import { useSelector } from "react-redux";

const NavigateCategorys = ({ match }) => {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState([]);
  const [categoryPartner, setCategoryPartner] = useState([]);
  const [partnerTotal, setPartnerTotal] = useState(0);
  const [isLoading, setisLoading] = useState(true);
  const [age, setAge] = useState("popularity");
  const location = useSelector((state) => state.Location);
  const lat = location.lat;
  const lng = location.lng;
  // eslint-disable-next-line no-unused-vars
  const [swiper, setSwiper] = useState(null);

  const params = useParams();

  const { id } = params;

  const Partners = async (filter = null) => {
    try {
      const response = await api.get_providers({
        latitude: location.lat,
        longitude: location.lng,
        category_id: id,
        filter: filter,
      });
      return response; // Return the response data or whatever is needed
    } catch (error) {
      console.error("Error fetching partners:", error);
      throw error; // Optionally re-throw the error or handle it as needed
    }
  };

  const currentURL = window.location.href;
  const urlArray = currentURL.split("/");
  const subTittle = urlArray[5].split("-");

  const tile = (arr) => {
    if (!Array.isArray(arr)) {
      return "";
    }

    return arr
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  };

  const allData = async () => {
    setisLoading(true);

    try {
      const subCategoryResponse = await api.getSubCategory({
        latitude: lat,
        longitude: lng,
        category_id: id,
        title: title,
      });
      setData(subCategoryResponse.data);

      const categoryResponse = await api.get_category({
        latitude: lat,
        longitude: lng,
      });
      setTitle(categoryResponse.data);

      const partnersResponse = await Partners();
      setCategoryPartner(
        partnersResponse !== undefined ? partnersResponse.data : []
      );
      setPartnerTotal(
        partnersResponse !== undefined ? partnersResponse.total : 0
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    allData();
    const company_name = process.env.REACT_APP_NAME;
    document.title = `${tile(subTittle)} | ${company_name}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const handleChange = (event) => {
    setAge(event.target.value);
    Partners(event.target.value).then((result) => {
      setCategoryPartner(result !== undefined ? result.data : []);
      setPartnerTotal(result !== undefined ? result.total : 0);
      setisLoading(false);
    });
  };
  const theme = useTheme();

  return (
    <Layout>
      <div>
        <Box
          // bgcolor={theme.palette.background.heading}
          paddingTop={"48px"}
          paddingBottom={"48px"}
          mb={2}
        >
          <Breadcrumbs />
          <Container maxWidth="lg" className="mainContainer">
            <Breadcrumbs
              separator="|"
              aria-label="breadcrumb"
              className="mt-1-mb-1"
              sx={{ textDecoration: "none" }}
            >
              <Box
                component={Link}
                to={"/"}
                className="breadcrumb"
                sx={{
                  color: theme.palette.color.breadcrum,
                  mb: "0",
                }}
                underline="none"
              >
                <strong>{t("home")}</strong>
              </Box>
              <Box
                component={Link}
                className="breadcrumb"
                sx={{
                  color: theme.palette.color.breadcrum,
                  textDecoration: "none !important",
                  mb: "0",
                }}
                underline="none"
                color="inherit"
                to={"/categories"}
              >
                <strong>
                  {" "}
                  {urlArray !== undefined && urlArray[3] === "sub-categories"
                    ? t("sub_categories")
                    : t("category")}
                </strong>
              </Box>
              {/* <Typography color="text.primary">categories</Typography> */}
              {isLoading === false ? (
                <Box>
                  {urlArray[3] === "categories" && title !== undefined ? (
                    title.map((response) => {
                      if (response.id === id) {
                        return (
                          <Typography color="text.primary" key={id}>
                            <strong>{response.name}</strong>
                            {/* Assuming "title" is a property in the response object */}
                          </Typography>
                        );
                      }
                      return null;
                    })
                  ) : (
                    <strong>{tile(subTittle)}</strong>
                  )}
                </Box>
              ) : (
                <Box width={200}>
                  <Skeleton variant="text" height={50} width={200} />
                </Box>
              )}
            </Breadcrumbs>
            <Typography variant="h4" sx={{ mt: "12px" }}>
              {urlArray[3] === "categories" && title !== undefined ? (
                title.map((response) => {
                  if (response.id === id) {
                    return (
                      <Typography variant="h4" color="text.primary" key={id}>
                        {response.name}
                        {/* Assuming "title" is a property in the response object */}
                      </Typography>
                    );
                  }
                  return null;
                })
              ) : (
                <Typography variant="h4" color="text.primary" key={id}>
                  {tile(subTittle)}
                </Typography>
              )}
            </Typography>
          </Container>
        </Box>
        {isLoading === false && (data?.length > 0 || categoryPartner?.length > 0) ? (
          <Box sx={{ background: theme.palette.background.box }}>
            <Container className="mainContainer">
              <Box pt={4} mt={-2} mb={2}>
                <Swiper
                  className="myslider h-auto"
                  slidesPerView={5}
                  freeMode={true}
                  modules={[Navigation]}
                  onSwiper={(s) => {
                    setSwiper(s);
                  }}
                  navigation
                  breakpoints={{
                    0: {
                      slidesPerView: 1,
                      spaceBetween: 10,
                    },
                    640: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    768: {
                      slidesPerView: 3,
                      spaceBetween: 30,
                    },
                    1024: {
                      slidesPerView: 5,
                      spaceBetween: 30,
                    },
                  }}
                >
                  {isLoading === false ? (
                    data?.length === 0 ? (
                      categoryPartner && categoryPartner?.length > 0 ? (
                        ""
                      ) : (
                        <>
                          <Box display={"flex"} justifyContent={"center"}>
                            <img
                              src={"/images/no-provider.png"}
                              alt="NO SUB CATEGORY FOUND"
                              height={300}
                              width={"auto"}




                            />
                          </Box>
                          <Box display={"flex"} justifyContent={"center"}>
                            <Typography variant="body1">
                              {t("no_category")}
                            </Typography>
                          </Box>
                        </>
                      )
                    ) : (
                      <Box>
                        {data &&
                          data.map((response) => {
                            const slug = slugify(response.name, {
                              lower: true,
                            });
                            return (
                              <SwiperSlide
                                key={response.id}
                                className="display-flex breadcrumb"
                              >
                                <Box
                                  sx={{
                                    textAlign: "center",
                                    textDecoration: "none",
                                    display: "block",
                                    borderRadius: "15px",
                                    padding: "0px 12px",
                                  }}
                                  className="service-card"
                                  component={Link}
                                  to={
                                    "/categories/" +
                                    response.id +
                                    "/providers/" +
                                    slug
                                  }
                                >
                                  <Box
                                    sx={{
                                      maxWidth: "100%",
                                      maxHeight: "100%",
                                      height: "309px",
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        borderRadius: "15px",
                                      }}
                                      className="subcat-img"
                                      component={"img"}
                                      src={response.category_image}
                                    />
                                    <Typography
                                      sx={{ position: "relative", top: "-13%" }}
                                      fontWeight={"bolder"}
                                      variant={"body1"}
                                      color="#FFFFFF"
                                    >
                                      {response.name}
                                    </Typography>
                                  </Box>
                                </Box>
                              </SwiperSlide>
                            );
                          })}
                      </Box>
                    )
                  ) : (
                    <Box display={"flex"} gap={2}>
                      <SkeletonSubCategory />
                      <SkeletonSubCategory />
                      <SkeletonSubCategory />
                      <SkeletonSubCategory />
                    </Box>
                  )}
                </Swiper>
              </Box>

              <Box py={4} mt={4}>
                {data && data?.length === 0 ? (
                  <Box
                    mt={2}
                    mb={2}
                    sx={{ typography: { md: "h5", xs: "body1" } }}
                  >
                    {categoryPartner && categoryPartner?.length === 0 ? (
                      <>
                        <Box display={"flex"} justifyContent={"center"}>
                          <img
                            src={"/images/no-provider.png"}
                            alt="NO SUB CATEGORY FOUND"
                            height={300}
                            width={"auto"}
                          />
                        </Box>
                        <Box display={"flex"} justifyContent={"center"}>
                          <Typography variant="body1">
                            {t("no_provider")}
                          </Typography>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Typography
                          sx={{ typography: { md: "h5", xs: "body1" } }}
                          marginBottom={"-2px"}
                          marginTop={1}
                        >
                          {t("providersss")}
                        </Typography>
                        <hr />
                      </>
                    )}
                    <Box>
                      {isLoading === false ? (
                        <Box className="row">
                          {categoryPartner &&
                            categoryPartner.map((response) => {
                              return (
                                <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 col-xxl-3 mb-4">
                                  <Partner
                                    partner={response}
                                    key={response.id}
                                  />
                                </div>
                              );
                            })}
                        </Box>
                      ) : (
                        <>
                          <PartnerSkeleton />{" "}
                        </>
                      )}
                    </Box>
                  </Box>
                ) : (
                  <>
                    {categoryPartner && categoryPartner?.length > 0  ? (
                      <Box mb={2}>
                        <Box
                          display={"flex"}
                          alignItems={"center"}
                          justifyContent={"space-between"}
                          flexWrap={"wrap"}
                          gap={"12px 0px"}
                        >
                          <Box>
                            <Typography
                              fontSize={theme.palette.fonts.h2}
                              marginBottom={1}
                              marginTop={1}
                              fontWeight={"bold"}
                            >
                              {t("providers")}
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              marginBottom={1}
                              marginTop={1}
                              fontWeight={"bold"}
                            >
                              {partnerTotal} {t("service_provider_available")}
                            </Typography>
                          </Box>
                          {partnerTotal > 1 ? (
                            <Box display={"flex"} gap={2} alignItems={"center"}>
                              <Typography variant="subtitle1">
                                {t("search_filter")}
                              </Typography>
                              <Box>
                                <Box sx={{ minWidth: 150 }}>
                                  <FormControl fullWidth>
                                    <Select
                                      value={age}
                                      onChange={handleChange}
                                      variant="outlined"
                                      size="large"
                                    >
                                      <MenuItem value={"popularity"}>
                                        {t("popularity")}
                                      </MenuItem>
                                      {/* <MenuItem value={"discount"}>
                                    {t("discount_high_to_low")}
                                  </MenuItem> */}
                                      <MenuItem value={"ratings"}>
                                        {t("top_rated")}
                                      </MenuItem>
                                    </Select>
                                  </FormControl>
                                </Box>
                              </Box>
                            </Box>
                          ) : null}
                        </Box>
                        <Divider />
                      </Box>
                    ) : ""}
           
                    {isLoading === false ? (
                      <Box className="row">
                        {categoryPartner &&
                          categoryPartner.map((response) => {
                            return (
                              <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 col-xxl-3 mb-4">
                                <Partner partner={response} key={response.id} />
                              </div>
                            );
                          })}
                      </Box>
                    ) : (
                      <>
                        <PartnerSkeleton />{" "}
                      </>
                    )}
                  </>
                )}
              </Box>
            </Container>
          </Box>
        ) : (
          <>
            <Box display={"flex"} justifyContent={"center"} >
              <img
                src={"/images/no-provider.png"}
                alt="no data found"
                height={300}
                width={"auto"}
              />
            </Box>
            <Box display={"flex"} justifyContent={"center"} sx={{
              marginBottom:"30px"
            }}>
              <Typography variant="body1">{t("no_data")}</Typography>
            </Box>
          </>
        )}
      </div>
    </Layout>
  );
};

export default NavigateCategorys;
