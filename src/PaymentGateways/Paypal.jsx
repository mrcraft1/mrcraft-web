import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { t } from "i18next";
import api from "../API/apiCollection";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useDispatch, useSelector } from "react-redux";
import { resetState } from "../redux/cart";
import { orderCartDetailsReset } from "../redux/orderCartDetails";
import { deliveryAddressReset } from "../redux/DeliveryAddress";
import { useNavigate } from "react-router";

const Paypal = ({ amount, promoCode = "" }) => {
  const settings = useSelector((state) => state?.Settings)?.settings
    ?.payment_gateways_settings;
  const orderDetails = useSelector(
    (state) => state.OrderCartDetails
  )?.orderDetails;
  const delivery_type = useSelector(
    (state) => state.DeliveryAddress
  )?.deliveryType;
  const date = orderDetails && orderDetails.date;
  const time = orderDetails && orderDetails.slot;

  const [order_id, setOrderID] = useState(0);

  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  // eslint-disable-next-line no-unused-vars
  const openLinkInNewTab = (url) => {
    const newTab = window.open(url, "_blank");
    newTab.focus();
  };

  const dispatch = useDispatch();

  const handleClose = async () => {
    setOpen(false);
    await api
      .add_transactions({ orderID: order_id, status: "cancelled" })
      .then((result) => {
        // window.location.reload();
        navigate("/profile/booking/services/" + order_id);
      });
  };

  const orderNotes = orderDetails.orderNote;

  const handlePayout = async () => {
    try {
      const result = await api.placeOrder({
        method: "paypal",
        date: date,
        time: time,
        addressId:
          delivery_type === "Home" ? orderDetails?.selectedAddress?.id : "",
        order_note: orderNotes,
        promoCode: promoCode?.length > 0 ? promoCode[0]?.promo_code : "",
      });

      setOpen(true);

      if (result.error === false || result.error === "false") {
        setOrderID(result.data.order_id);
      } else {
        if (typeof result.message === "object") {
          Object.values(result.message).forEach((e) => {
            toast.error(e);
          });
        } else {
          toast.error(result.message);
        }
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again later.");
    }
  };

  // eslint-disable-next-line no-unused-vars
  const initialOptions = {
    client_id: settings?.paypal_client_key,
    currency: "USD",
    intent: "capture",
  };

  return (
    <Box>
      <Button
        fullWidth
        sx={{ my: 3 }}
        variant="outlined"
        onClick={(e) => {
          handlePayout();
          // initializePayment(onSuccess, onClose)
        }}
      >
        {t("make_a_payment")}
      </Button>

      <Dialog open={open} maxWidth={"lg"}>
        <Box width={{ xs: "100%", md: 500 }} height={400}>
          <DialogTitle
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography variant="h6"> Pay with Paypal </Typography>
            <IconButton
              aria-label="handle-close"
              onClick={(e) => handleClose()}
            >
              <FontAwesomeIcon icon={faTimes} />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <PayPalScriptProvider
              options={{ "client-id": settings?.paypal_client_key }}
            >
              <PayPalButtons
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: amount,
                        },
                      },
                    ],
                  });
                }}
                style={{
                  layout: "vertical",
                  tagline: false,
                  color: "gold",
                  shape: "rect",
                }}
                onCancel={async (data) => {
                  toast.error("Transaction has been  cancelled");
                  await api
                    .add_transactions({
                      orderID: order_id,
                      status: "cancelled",
                    })
                    .then((result) => {
                      navigate("/profile/booking/services/" + order_id);
                    });
                }}
                onApprove={async (data, actions) => {
                  await api
                    .add_transactions({ orderID: order_id, status: "success" })
                    .then((result) => {
                      dispatch(resetState());
                      dispatch(orderCartDetailsReset());
                      dispatch(deliveryAddressReset());
                    })
                    .then((res) => {
                      navigate("/profile/booking/services/" + order_id);
                    });
                }}
                onError={async (err) => {
                  toast.error(err);
                  await api
                    .add_transactions({
                      orderID: order_id,
                      status: "cancelled",
                    })
                    .then((result) => {
                      navigate("/profile/booking/services/" + order_id);
                    });
                }}
              />
            </PayPalScriptProvider>
          </DialogContent>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Paypal;
