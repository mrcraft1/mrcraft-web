import React, { useEffect, useState } from "react";
import { Box, CardMedia, Divider, Typography } from "@mui/material";
import { PromoSkeleton } from "../../Reusable/Sections/Skeletons";
import api from "../../../API/apiCollection";
import { t } from "i18next";
import dayjs from "dayjs";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@emotion/react";
import { useParams } from "react-router";

const Promocodes = ({ partner_id }) => {
  const theme = useTheme();

  const [isPromo, setIsPromo] = useState([]);
  const [isLoading, setIsloading] = useState(true);

  const params = useParams();
  const { company_name } = params;

  useEffect(() => {
    const company = process.env.REACT_APP_NAME;
    document.title = `${company_name}-Promocodes|${company}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //fetching promocodes
  useEffect(() => {
    const fetchPromoCode = async () => {
      try {
        if (isPromo?.length === 0) {
          const result = await api.Promocode({ partner_id: partner_id });
          setIsPromo(result.data);
          setIsloading(false);
        }
      } catch (error) {
        console.error("Error fetching promo code:", error);
        // Optionally handle error state or show an error message
      }
    };

    fetchPromoCode();
  }, [isPromo?.length, partner_id]);

  return (
    <Box
      ml={{ xs: 3, md: 0 }}
      mr={{ xs: 0, md: 3.5 }}
      mt={1}
      sx={{ backgroundColor: theme.palette.background.box }}
    >
      {isLoading === false ? (
        isPromo && isPromo?.length > 0 ? (
          isPromo.map((promo, index) => {
            return (
              <Grid
                key={index}
                container
                mb={2}
                spacing={2}
                position={"relative"}
                sx={{
                  background: theme.palette.background.box,
                  padding: { xs: 0, md: "15px" },
                  //backgroundColor: theme.palette.background.paper,
                  borderRadius: "10px",
                  marginTop: index > 0 ? "30px" : 0, // Add marginTop conditionally
                }}
              >
                {/* Image Grid (50%) Off*/}
                <Grid
                  item
                  md={1}
                  xs={12}
                  display={"flex"}
                  alignItems={{ xs: "center", md: "baseline" }}
                  justifyContent={"center"}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      width: 133,
                      height: 133,
                      borderRadius: "50%",
                      marginLeft: 2,
                    }}
                    image={promo.image}
                    alt="Live from space album cover"
                  />
                </Grid>
                {/* Promo code Information */}
                <Grid
                  item
                  md={7}
                  xs={12}
                  mt={2}
                  ml={{ xs: 0, md: 6 }}
                  display={"flex"}
                  flexDirection={"column"}
                >
                  <Grid item>
                    <Typography
                      sx={{
                        letterSpacing: "1.1px",
                        color: theme.palette.color.textColor,
                        opacity: 0.9,
                        marginLeft: "0px",
                      }}
                      variant="h6"
                      fontWeight={"bold"}
                      textAlign={{ xs: "center", md: "left" }}
                    >
                      {promo.promo_code}
                    </Typography>

                    <Typography
                      sx={{
                        marginTop: "7px",
                        font: "normal normal normal 18px/35px Plus Jakarta Sans",
                        letterSpacing: "0.9px",
                        color: theme.palette.color.textColor,
                        opacity: 0.59,
                        marginLeft: "0px",
                        mr: { xs: 0, md: 4 },
                      }}
                      textAlign={{ xs: "center", md: "left" }}
                    >
                      {promo.message}
                    </Typography>
                  </Grid>

                  <Grid item mb={2}>
                    <Box
                      my={2}
                      sx={{
                        textTransform: "capitalize",
                        lineHeight: 2,
                        marginLeft: "0px",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          mb: 1,
                          mt: 1,
                          // font: "normal normal bold 18px/8px Plus Jakarta Sans",
                          // letterSpacing: "0.9px",
                          color: theme.palette.color.textColor,
                          opacity: "0.61",
                        }}
                        fontWeight={"bold"}
                      >
                        <Box
                          display={"flex"}
                          flexDirection={{ xs: "column", md: "row" }}
                          alignItems={"center"}
                          gap={1}
                          textAlign={{ xs: "center", md: "left" }}
                        >
                          <Box>{t("min_order_value")}</Box>
                          <Box>${promo.minimum_order_amount}</Box>
                        </Box>
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          mb: 1,
                          mt: 1,
                          // font: "normal normal bold 18px/8px Plus Jakarta Sans",
                          letterSpacing: "0.9px",
                          color: theme.palette.color.textColor,
                          opacity: " 0.61",
                        }}
                        fontWeight={"bold"}
                      >
                        <Box
                          display={"flex"}
                          flexDirection={{ xs: "column", md: "row" }}
                          alignItems={"center"}
                          gap={1}
                          textAlign={{ xs: "center", md: "left" }}
                        >
                          <Box>{t("instant_discount_of")}</Box>
                          <Box>${promo.max_discount_amount}</Box>
                        </Box>
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight={"bold"}
                        sx={{
                          mb: 1,
                          mt: 1,
                          // font: "normal normal bold 18px/8px Plus Jakarta Sans",
                          letterSpacing: "0.9px",
                          color: theme.palette.color.textColor,
                          opacity: " 0.61",
                        }}
                      >
                        <Box
                          display={"flex"}
                          flexDirection={{ xs: "column", md: "row" }}
                          alignItems={"center"}
                          gap={1}
                          textAlign={{ xs: "center", md: "left" }}
                        >
                          <Box>{t("offer_valid_from")}</Box>
                          <Box>
                            {dayjs(promo.start_date).format("DD-MM-YYYY")}{" "}
                            {t("to")}
                          </Box>
                          <Box>
                            {dayjs(promo.end_date).format("DD-MM-YYYY")}
                          </Box>
                        </Box>
                      </Typography>
                      {promo && promo.repeat_usage >= 1 ? (
                        <Typography
                          variant="body1"
                          fontWeight={"bold"}
                          sx={{
                            mb: 1,
                            mt: 1,
                            // font: "normal normal bold 18px/8px Plus Jakarta Sans",
                            letterSpacing: "0.9px",
                            color: theme.palette.color.textColor,
                            opacity: " 0.61",
                          }}
                        >
                          <Box
                            display={"flex"}
                            flexDirection={{ xs: "column", md: "row" }}
                            alignItems={"center"}
                            gap={1}
                            textAlign={{ xs: "center", md: "left" }}
                          >
                            <Box>{t("promo_maximum_times")}</Box>
                            {promo?.no_of_repeat_usage}
                            <Box>{t("promo_times")}</Box>
                          </Box>
                        </Typography>
                      ) : null}
                    </Box>
                  </Grid>
                </Grid>

                <Box
                  sx={{
                    position: "relative",
                    display: { xs: "none", sm: "none", md: "block" },
                  }}
                >
                  {/* Top half-circle */}
                  <CircularProgress
                    variant="determinate"
                    value={-50}
                    size={45}
                    thickness={2}
                    sx={{
                      backgroundColor: theme.palette.background.promoCode, // Set the desired background color
                      // backgroundColor: "#041C32", // Set the desired background color
                      color: "transparent",
                      borderRadius: "50%", // Make it a circle
                    }}
                    style={{
                      position: "absolute",
                      top: "-15%", // Adjust this value to center the circle on the bottom of the line
                      left: "50%",
                      transform: "translate(-45%, 35%)",
                      zIndex: "1",
                      border: "none",
                    }}
                  />

                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                      mr: "-2px",
                      borderRight: "2px dotted #343F53",
                      top: -12,
                      position: "absolute",
                      height: "100%", // Adjust the height to make room for the top half-circle
                    }}
                  />

                  {/* Bottom half-circle */}
                  <CircularProgress
                    variant="determinate"
                    value={-50}
                    size={45}
                    thickness={2}
                    sx={{
                      backgroundColor: theme.palette.background.promoCode, // Set the desired background color
                      color: "transparent",
                      borderRadius: "50%", // Make it a circle
                    }}
                    style={{
                      position: "absolute",
                      bottom: "-20%", // Adjust this value to center the circle on the bottom of the line
                      left: "50%",
                      zIndex: "1",
                      transform: "translate(-45%, -65%)",
                    }}
                  />
                </Box>

                <Grid
                  item
                  ml={{ xs: 0, md: 5 }}
                  md={3}
                  xs={12}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"center"}
                    alignItems={"center"} // Center content horizontally
                    textAlign={"center"}
                    //my={2}
                    mt={4}
                  >
                    <Typography
                      component="div"
                      variant="h3"
                      sx={{
                        width: "116px",
                        height: "58px",
                        color: theme.palette.color.textColor,
                        opacity: "0.9",
                        font: 'normal normal bold 46px/8px "Plus Jakarta Sans"',
                        letterSpacing: "2.3px",
                      }}
                    >
                      {promo.discount}
                      {promo.discount_type === "percentage" ? "%" : "$"}{" "}
                    </Typography>
                    <Typography
                      component="div"
                      variant="h3"
                      mb={1}
                      sx={{
                        width: "114px",
                        height: "58px",
                        opacity: "0.9",
                        color: theme.palette.color.textColor,
                        font: 'normal normal bold 46px/8px "Plus Jakarta Sans"',
                        letterSpacing: "2.3px",
                      }}
                    >
                      OFF
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            );
          })
        ) : (
          <>
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              textAlign={"center"}
              sx={{ flexDirection: { xs: "column", md: "row" } }}
              maxWidth={"100%"}
            >
              <Box>
                <Box>
                  <Box
                    component={"img"}
                    src={"/images/no-booking.png"}
                    alt="no promo code"
                    maxHeight={"100%"}
                    maxWidth={"100%"}
                  />
                </Box>
                <Typography sx={{ color: theme.palette.color.textColor }}>
                  {t("no_promo")}
                </Typography>
              </Box>
            </Box>
          </>
        )
      ) : (
        <PromoSkeleton />
      )}
    </Box>
  );
};

export default Promocodes;
