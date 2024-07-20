/* eslint eqeqeq: 0 */

import React, { useState, useEffect } from "react";
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
import DeleteIcon from "@mui/icons-material/Delete";
import { t } from "i18next";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import {
  updateCartItems,
  updateBaseCart,
  updatesubAmount,
} from "../../../redux/cart";
import StarIcon from "@mui/icons-material/Star";
import { setPromoCode } from "../../../redux/Promocode";
import { DECIMAL_POINT } from "../../../config/config";

import api from "../../../API/apiCollection";
import { useTheme } from "@emotion/react";
import { cartDetails } from "../../../redux/orderCartDetails";
import { setDeliveryAddress } from "../../../redux/DeliveryAddress";

const CartItem = ({ item, onDelete, itemQuantities }) => {
  const cart = useSelector((state) => state.cart);
  // eslint-disable-next-line no-unused-vars
  const [loadResponse, setLoadResponse] = useState(false);

  const dispatch = useDispatch();

  function capitalizeFirstLetter(inputString) {
    if (typeof inputString !== "string" || inputString?.length === 0) {
      return inputString;
    }
    return inputString.charAt(0).toUpperCase() + inputString.slice(1);
  }

  const totalPrice = item.discounted_price * (itemQuantities[item.id] || 1);
  localStorage.setItem("Pay", totalPrice);
  const removePromo = () => {
    dispatch(setPromoCode([]));
    localStorage.removeItem("promocode");
  };

  // general function that we reuse to increment and decrement of items
  const handleAddCart = async (id, qty) => {
    try {
      removePromo();
      setLoadResponse(true);

      const result = await api.ManageCart({ id: id, qty: qty.toString() });
      const response = await api.get_cart_plain();
      dispatch(updateCartItems(response.data.data));
      dispatch(updateBaseCart(response.data));

      let sub_amout = 0;

      if (response && response.data) {
        response.data.data.forEach((item) => {
          const itemPrice = parseFloat(item.servic_details.price_with_tax);
          const itemQty = parseFloat(item.qty);
          sub_amout += itemPrice * itemQty;
        });

        dispatch(updatesubAmount(sub_amout));

        let message = capitalizeFirstLetter(result.message);
        toast.success(message);
        setLoadResponse(false);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoadResponse(false);
    }
  };

  // function handleAddCart(id, qty) {
  //   removePromo();
  //   setLoadResponse(true);
  //   api
  //     .ManageCart({ id: id, qty: qty.toString() })
  //     .then((result) => {
  //       api
  //         .get_cart_plain()
  //         .then((response) => {
  //           dispatch(updateCartItems(response.data.data));
  //           dispatch(updateBaseCart(response.data));

  //           let sub_amout = 0;

  //           response.data.data.forEach((item) => {
  //             const itemPrice = parseFloat(item.servic_details.price_with_tax);
  //             const itemQty = parseFloat(item.qty);
  //             sub_amout += itemPrice * itemQty;
  //           });

  //           dispatch(updatesubAmount(sub_amout));
  //           let message = capitalizeFirstLetter(result.message);
  //           toast.success(message);
  //           setLoadResponse(false);
  //         })
  //         .catch((e) => console.log(e));
  //     })
  //     .catch((error) => console.log("error", error));
  // }

  const handleIncrement = (response) => {
    removePromo();
    cart.cartItems.forEach((obj) => {
      if (obj.service_id === response.service_id && obj.qty > 0) {
        const quantity = parseInt(obj.qty);

        const allowed = parseInt(item.servic_details.max_quantity_allowed);

        if (allowed > quantity) {
          handleAddCart(response.service_id, quantity + 1);
        } else {
          toast.error(
            `Maximum Quantity is ${item.servic_details.max_quantity_allowed}`
          );
        }
      }
    });
  };

  // Arrow function forr when user decrement items it update Qty and send api request
  const handleDecrement = (response) => {
    removePromo();
    cart.cartItems.forEach((obj) => {
      if (obj.service_id == response.service_id && parseInt(obj.qty) === 1) {
        return toast.error("Already at minimum quantity");
      }
      if (obj.service_id == response.service_id) {
        handleAddCart(response.service_id, parseInt(obj.qty) - 1);
      }
    });
  };

  const theme = useTheme();

  return (
    <Card
      sx={{
        display: "flex",
        gap: 2,
        padding: "10px",
        bgcolor: "transparent",
        boxShadow: "none",
      }}
    >
      <CardMedia
        component="img"
        sx={{ width: 145, borderRadius: "8px" }}
        image={item.servic_details.image_of_the_service}
        alt={item.servic_details.title}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          borderRadius: "8px",
        }}
      >
        <CardContent sx={{ flex: "1 0 auto", pt: 0 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
            }}
          >
            <Typography
              component="div"
              color={theme?.palette?.primary?.main}
              fontWeight={"bold"}
              variant="subtitle1"
            >
              {item.servic_details.title}
            </Typography>
            <Box display={"flex"} alignItems={"self-start"}>
              <Typography component="div" variant="caption">
                <StarIcon sx={{ color: "gold" }} />
              </Typography>
              <Typography component="div" variant="subtitle1">
                {parseFloat(item.servic_details.rating).toFixed(1)}
              </Typography>
            </Box>
          </Box>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
          >
            {item.servic_details.number_of_members_required} Person |{" "}
            {item.servic_details.duration} Min
          </Typography>
        </CardContent>
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 2, pl: 1, pb: 2 }}
        >
          <Box
            display="flex"
            alignItems="center"
            sx={{
              background: "#0277FA",
              width: "max-content",
              borderRadius: 2,
            }}
          >
            <IconButton
              onClick={() => {
                handleDecrement(item);
              }}
              disabled={cart.cartItems.some((obj) => {
                if (obj.service_id == item.service_id && obj.qty === 1) {
                  return true;
                }
                return false;
              })}
            >
              <RemoveIcon className="color-white" />
            </IconButton>
            <Typography variant="body2" color={"white"}>
              {cart.cartItems.map((obj) => {
                if (obj.service_id === item.service_id && obj.qty > 0) {
                  return <span key={obj.service_id}>{obj.qty}</span>;
                }
                return <></>;
              })}
            </Typography>
            <IconButton
              onClick={() => {
                handleIncrement(item);
              }}
            >
              <AddIcon className="color-white" />
            </IconButton>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            sx={{
              backgroundColor: "#F44336",
              width: "max-content",
              borderRadius: 2,
            }}
          >
            <IconButton
              color="white"
              aria-label="Delete"
              onClick={() => {
                removePromo();
                onDelete(item);
              }}
            >
              <DeleteIcon sx={{ color: "white" }} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export const Cart = ({ continueClicked }) => {
  const decimal_point = DECIMAL_POINT();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const baseCart = useSelector((state) => state.cart)?.base_cart;
  localStorage.removeItem("SelectedView");
  dispatch(setDeliveryAddress(""));
  dispatch(cartDetails({ orderNote: "" }));

  // eslint-disable-next-line no-unused-vars
  const [quantity, setQuantity] = useState(baseCart?.total);

  let sub_amout = cart && cart.subAmount;

  const itemQuantities = (() => {
    const storedItemQuantities = JSON.parse(
      localStorage.getItem("itemQuantities")
    );
    return storedItemQuantities || {};
  })();

  useEffect(() => {
    localStorage.setItem("itemQuantities", JSON.stringify(itemQuantities));
  }, [itemQuantities]);
  const theme = useTheme();

  const handleQuantityChange = (itemId, quantity) => {};

  const handleDelete = async (itemId) => {
    await api
      .removeCart({ itemId: itemId.service_id })
      .then(async (result) => {
        await api
          .get_cart()
          .then((response) => {
            dispatch(updateCartItems(response.data));

            let sub_amout = 0;
            setQuantity(response?.data?.length);
            response.data.forEach((item) => {
              const itemPrice = parseFloat(
                item.discounted_price > 0 ? item.discounted_price : item.price
              );
              const itemQty = parseFloat(item.qty);

              sub_amout += itemPrice * itemQty;
            });
            dispatch(updatesubAmount(sub_amout));
            toast.success(result.message);
          })
          .catch((e) => console.log(e));
      })
      .catch((error) => console.log("error", error));
  };

  const settings = useSelector((state) => state.Settings)?.settings;
  const currency_symbol = settings?.app_settings?.currency;

  return (
    <div>
      <Box padding={1}>
        <Divider />
        {cart?.cartItems === undefined || cart.cartItems?.length === 0 ? (
          <Box textAlign={"center"} maxWidth={"100%"}>
            <Box
              component={"img"}
              src={"/images/no-provider.png"}
              alt="Nothing in cart"
              sx={{ width: "100%", borderRadius: "500px" }}
            />
            <h3>{t("no_products")}</h3>
          </Box>
        ) : (
          <>
            {cart?.cartItems?.map((item) => (
              <Box key={item.id}>
                <Box my={2} key={item.id}>
                  <CartItem
                    item={item}
                    key={item.id}
                    onDelete={handleDelete}
                    onQuantityChange={handleQuantityChange}
                    itemQuantities={itemQuantities}
                  />
                </Box>
                <Divider sx={{ marginTop: 2 }} />
              </Box>
            ))}
          </>
        )}

        {cart.cartItems == null || cart.cartItems?.length === 0 ? (
          ""
        ) : (
          <Box
            mt={2}
            mb={2}
            borderRadius={"var( --global-border-radius)"}
            sx={{ backgroundColor: theme.palette.background.buttonColor }}
          >
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "transparent",
                textAlign: "start",
                borderRadius: "var( --global-border-radius)",
                textTransform: "none",
                "&:hover": {
                  // Remove the hover effect styles here
                  backgroundColor: theme.palette.background.buttonColor,
                  // For example, make the background transparent on hover
                },
              }}
              onClick={() => continueClicked()}
            >
              <Box
                display={"flex"}
                width={"100%"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Box display={"flex"} flexDirection={"column"}>
                  <Typography
                    variant="caption"
                    display={"flex"}
                    gap={0.5}
                    color={"white"}
                  >
                    {cart.cartItems?.length}
                    <Box>{t("items")}</Box>
                  </Typography>
                  <Typography variant="body2" color={"white"}>
                    {currency_symbol}{" "}
                    {parseFloat(sub_amout).toFixed(decimal_point)}
                  </Typography>
                </Box>
                <Typography variant="body2" color={"white"}>
                  {t("continue")}
                </Typography>
              </Box>
            </Button>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default Cart;
