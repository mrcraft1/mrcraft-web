import { ArrowBackIosNewOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import api from "../API/apiCollection";
import { handleClose, handleOpen } from "../config/config";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { t } from "i18next";
import { PromoSkeleton } from "../Components/Reusable/Sections/Skeletons";
import { setPromoCode } from "../redux/Promocode";
import { useSelector, useDispatch } from "react-redux";

const Promocode = ({ setBooking, setPromo }) => {
  const [isPromo, setIsPromo] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const baseCart = useSelector((state) => state.cart)?.base_cart;

  const partner_id = baseCart?.provider_id;

  const dispatch = useDispatch();

  // let cartX = useSelector((state) => state.cart)?.cartItems;
  let base_cartData = useSelector((state) => state.cart)?.base_cart;
  // let total = 0;
  // cartX.forEach((obj) => {
  //   let price = obj.discounted_price || obj.price;
  //   total += price * obj.qty;
  // });

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

  function back() {
    handleClose(setPromo);
    handleOpen(setBooking);
  }

  // validation of promocode
  const applyPromo = async (promo) => {
    await api
      .ValidatePromocode({
        provider_id: partner_id,
        promo_code: promo.promo_code,
        overall_amount: Number(base_cartData.sub_total),
      })
      .then((result) => {
        dispatch(setPromoCode(result.data));

        if (result.error === true) {
          toast.error(result.message);
          localStorage.setItem("selectedPromo", null);
        } else {
          back();
          toast.success("Promocode applied succesfully");
          localStorage.setItem("selectedPromo", JSON.stringify(promo));
          setIsPromo((prevPromos) =>
            prevPromos.map((prevPromo) => {
              if (prevPromo.id === promo.id) {
                return { ...prevPromo, applied: true }; // Update promo's applied status
              }
              return prevPromo;
            })
          );
        }
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <div>
      <Box mt={1} mb={1} display={"flex"} alignItems={"center"}>
        <IconButton onClick={back}>
          <ArrowBackIosNewOutlined fontSize="larges" />
        </IconButton>
        <Typography fontWeight={"bold"} fontSize={24}>
          {t("promocode")}
        </Typography>
      </Box>
      <Divider />
      <Box p={2}>
        {isLoading === false ? (
          isPromo && isPromo?.length > 0 ? (
            isPromo.map((promo) => {
              return (
                <Card key={promo.id}>
                  <Card sx={{ display: "flex", gap: 3, alignItems: "center" }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 151 }}
                      image={promo.image}
                      alt="Live from space album cover"
                    />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                      }}
                    >
                      <CardContent
                        sx={{ flex: "1 0 auto", p: 0, pb: 0, width: "100%" }}
                      >
                        <Box display={"flex"} justifyContent={"space-between"}>
                          <Box>
                            <Typography
                              variant="subtitle1"
                              color="text.secondary"
                              component="div"
                            >
                              {promo.promo_code}
                            </Typography>
                            <Typography component="div" variant="h6">
                              {promo.discount_type === "percentage" ? "%" : "$"}{" "}
                              {promo.discount} {t("off")}
                            </Typography>
                          </Box>
                          <Box mr={2}>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => applyPromo(promo)}
                              disabled={promo.applied} // Disable button if promo code is already applied
                            >
                              {promo.applied ? t("applied") : t("apply")}
                            </Button>
                          </Box>
                        </Box>
                      </CardContent>
                    </Box>
                  </Card>
                  <Box
                    my={2}
                    sx={{ textTransform: "capitalize", lineHeight: 2 }}
                  >
                    <Typography
                      variant="subtitle2"
                      display={"flex"}
                      gap={1}
                      sx={{ mb: 1 }}
                    >
                      <Box>{t("min_order_amount")}</Box>
                      <Box>{promo.minimum_order_amount}</Box>
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 1 }}
                      display={"flex"}
                      gap={1}
                    >
                      <Box>{t("max_discount")}:</Box>
                      <Box>{promo.max_discount_amount}</Box>
                    </Typography>
                    <Typography variant="subtitle2" display={"flex"} gap={1}>
                      <Box>{t("offer_valid")}</Box>
                      <Box>{dayjs(promo.start_date).format("YYYY/MM/DD")}</Box>
                      <Box>To</Box>
                      <Box>{dayjs(promo.end_date).format("YYYY/MM/DD")}</Box>
                    </Typography>
                  </Box>
                </Card>
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
              >
                <Box>
                  <Box height={"100%"} width={"100%"}>
                    <img src={"/images/no-booking.png"} alt="no time slot" />
                  </Box>
                  <Typography>{t("no_promo")}</Typography>
                </Box>
              </Box>
            </>
          )
        ) : (
          <PromoSkeleton />
        )}
      </Box>
    </div>
  );
};

export default Promocode;
