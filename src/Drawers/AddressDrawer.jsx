import { ArrowBackIosNewOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

import React, { useState, useEffect } from "react";
import { handleClose, handleOpen } from "../config/config";
import { t } from "i18next";
import api from "../API/apiCollection";
import { useTheme } from "@emotion/react";
import { useSelector, useDispatch } from "react-redux";

// Redux files
import { cartDetails } from "../redux/orderCartDetails";
import { DrawerDynamicAddress } from "../Components/Reusable/Profile/DrawerDynamicAddress";
import { setDeliveryAddressType } from "../redux/DeliveryAddress";
import toast from "react-hot-toast";

const AddressDrawer = ({
  setForm,
  isSelectedSlote,
  MyFun,
  setCart,
  setBooking,
}) => {
  const dispatch = useDispatch();
  const orderDetails = useSelector(
    (state) => state.OrderCartDetails
  )?.orderDetails;

  const isselectedTime = orderDetails && orderDetails.slot;
  const baseCart = useSelector((state) => state.cart)?.base_cart;
  const users_address = useSelector((state) => state.UserAddress)?.address;

  const delivery_type = useSelector(
    (state) => state.DeliveryAddress
  )?.deliveryType;

  const deliveryAddress = useSelector(
    (state) => state.DeliveryAddress
  )?.delivery;

  const cart = useSelector((state) => state.cart);

  const selectedDate = orderDetails && orderDetails.date;

  const [note, setNote] = useState(orderDetails.orderNote);

  useEffect(() => {
    // Check if either cart.at_store or cart.at_door is 1, then show both
    if (cart.at_store === "1" && cart.at_door === "1") {
      // dispatch(setDeliveryAddressType(""));
    } else if (cart.at_store === "0" && cart.at_door === "1") {
      dispatch(setDeliveryAddressType("Home"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.at_store, cart.at_door, dispatch]);

  // check slot and if error is false than only drawer should open otherwise it show error message
  const checkSlot = async () => {
    const partner_id = baseCart && baseCart.provider_id;

    await api
      .checkSlots({
        partner_id: partner_id,
        date: selectedDate,
        time: isselectedTime,
      })
      .then((response) => {
        if (response.error === false) {
          //if address or doorstep selected than only provider check availablility at that particular location
          if (deliveryAddress !== "" && delivery_type === "Home") {
            providerAvailable(
              deliveryAddress.lattitude,
              deliveryAddress.longitude
            );
          } else {
            handleClose(setForm);
            handleOpen(setBooking);
          }
        } else toast.error(response.message);
      })
      .catch((error) => console.log(error));
  };

  // call providerAvailable before open next drawer...
  const providerAvailable = async (lat, lng) => {
    //check provider availability and checkout process should be 1 before placing order
    await api
      .providerAvailable({ latitude: lat, longitude: lng, isCheckout: 1 })
      .then((result) => {
        if (result.error === false) {
          toast.success(result.message);
          handleClose(setForm);
          handleOpen(setBooking);
        } else toast.error(result.message);
      });
  };

  let type = localStorage.getItem("SelectedView");

  function ContinueClicked() {
    if (cart.at_store === "1" && cart.at_door === "1") {
      if (type === null) {
        toast.error("Please select delivery type");
        return;
      }
      if (selectedDate.trim() === "" || isselectedTime.trim() === "") {
        toast.error("Please select date, time before continuing.");
        return;
      }
    }

    if (delivery_type && delivery_type === "") {
      toast.error("Please select Delivery method before continuing.");
      return;
    }

    if (delivery_type === "Home") {
      if (users_address?.length === 0) {
        toast.error("Please select an address before continuing.");
        return;
      }
    }

    if (cart.at_store === "1" && cart.at_door === "0") {
      dispatch(setDeliveryAddressType("shop"));
    }
    checkSlot();
  }

  const OpenNext = () => {
    handleClose(setForm);
    handleOpen(isSelectedSlote);
  };

  function back() {
    handleClose(setForm);
    handleOpen(setCart);
  }

  function handleSelectMethodHome() {
    dispatch(setDeliveryAddressType("Home"));
  }
  function handleSelectMethodShop() {
    dispatch(setDeliveryAddressType("shop"));
  }

  const [view, setView] = useState(type);

  const handleChange = (event, nextView) => {
    setView(nextView);
    localStorage.setItem("SelectedView", nextView); // Store the selected view
  };
  const theme = useTheme();

  const handleOrderNote = (value) => {
    setNote(value);
    dispatch(cartDetails({ orderNote: value }));
  };

  return (
    <div className="overflow-hidden">
      <Box
        mt={1}
        mb={1}
        display={"flex"}
        sx={{ fontWeight: "bold" }}
        alignItems={"center"}
      >
        <IconButton onClick={back}>
          <ArrowBackIosNewOutlined fontSize="large" />
        </IconButton>
        <h3>
          {t("from")} {baseCart && baseCart.company_name}
        </h3>
      </Box>
      <Divider />
      {/* <Box py={4} px={"8px"}>
        <Typography fontSize={16}>{t("choose_location")}</Typography>
        <ToggleButtonGroup
          orientation="vertical"
          value={view}
          exclusive
          fullWidth
          onChange={handleChange}
        >
          {door === "1" ? (
            <ToggleButton
              value="list"
              aria-label="list"
              onClick={(e) => handleSelectMethodHome()}
            >
              <div>
                <Typography>{t("at_door")}</Typography>
                <Typography
                  variant="body2"
                  color={"gray"}
                  textTransform={"none"}
                >
                  {t("door_details")}
                </Typography>
              </div>
            </ToggleButton>
          ) : (
            ""
          )}
          {store === "1" ? (
            <ToggleButton
              value="module"
              aria-label="module"
              onClick={(e) => handleSelectMethodShop()}
            >
              <div>
                <Typography>{t("at_store")}</Typography>
                <Typography
                  variant="body2"
                  color={"gray"}
                  textTransform={"none"}
                >
                  {t("store_details")}
                </Typography>
              </div>
            </ToggleButton>
          ) : (
            ""
          )}
        </ToggleButtonGroup>
      </Box> */}

      {cart.at_store === "1" && cart.at_door === "1" ? (
        <Box py={4} px={"8px"}>
          <Typography fontSize={16}>{t("choose_location")}</Typography>
          <ToggleButtonGroup
            orientation="vertical"
            value={view}
            exclusive
            fullWidth
            onChange={handleChange}
          >
            <ToggleButton
              value="list"
              aria-label="list"
              onClick={(e) => handleSelectMethodHome()}
            >
              <div>
                <Typography>{t("at_door")}</Typography>
                <Typography
                  variant="body2"
                  color={"gray"}
                  textTransform={"none"}
                >
                  {t("door_details")}
                </Typography>
              </div>
            </ToggleButton>

            <ToggleButton
              value="module"
              aria-label="module"
              onClick={(e) => handleSelectMethodShop()}
            >
              <div>
                <Typography>{t("at_store")}</Typography>
                <Typography
                  variant="body2"
                  color={"gray"}
                  textTransform={"none"}
                >
                  {t("store_details")}
                </Typography>
              </div>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      ) : null}

      <Box display={"block"} px={"8px"} py={1}>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          gap={3}
        >
          <Box width={"100%"}>
            <Typography fontSize={16}>{t("select_date")}</Typography>
            <TextField
              id="date"
              type="date"
              fullWidth
              sx={{ borderRadius: "8px" }}
              value={selectedDate ? selectedDate : ""}
              disabled
            />
          </Box>

          <Box width={"100%"}>
            <Typography fontSize={16}>{t("select_time")}</Typography>
            <TextField
              id="time"
              type="time"
              fullWidth
              value={isselectedTime ? isselectedTime : ""}
              disabled
            />
          </Box>
        </Box>

        <Box mt={2} mb={2}>
          <Button
            className="drawer-button"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: theme.palette.background.buttonColor,
              borderRadius: "var( --global-border-radius)",
              textTransform: "none",
              "&:hover": {
                backgroundColor: theme.palette.background.buttonColor,
              },
            }}
            onClick={() => OpenNext()}
          >
            {t("select_date_time")}
          </Button>
        </Box>
      </Box>

      {cart.at_door === "1" && delivery_type === "Home" ? (
        <>
          <Box display={"block"}>
            <Typography px={"8px"} fontSize={18}>
              {t("your_address")}
            </Typography>
            <DrawerDynamicAddress />
            <Box px={"8px"} mb={2}>
              <Button
                variant="outlined"
                sx={{ textTransform: "none" }}
                fullWidth
                className="drawer-button-address"
                onClick={MyFun}
              >
                {t("add_address_button")}
              </Button>
            </Box>
          </Box>
        </>
      ) : (
        ""
      )}
      <Box px={"8px"}>
        <Typography fontSize={16} mb={0.5}>
          {t("provider_instruction")}
        </Typography>
        <TextField
          fullWidth
          multiline // Add this prop to allow multiple lines
          rows={4} // Optionally set the number of rows to display initially
          variant="outlined" // Optional: You can change the variant if needed
          value={note}
          onChange={(e) => handleOrderNote(e.target.value)}
        />
      </Box>

      <Box px={"8px"} pt={2} mb={2}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: theme.palette.background.buttonColor,
            padding: 1,
            textTransform: "none",
            borderRadius: "var( --global-border-radius)",
            "&:hover": {
              backgroundColor: theme.palette.background.buttonColor,
            },
          }}
          fullWidth
          onClick={() => ContinueClicked()}
        >
          {t("continue")}
        </Button>
      </Box>
    </div>
  );
};

export default AddressDrawer;
