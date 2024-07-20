import React, { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
} from "@stripe/react-stripe-js";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  Typography,
  IconButton,
  DialogContent,
} from "@mui/material";
import { t } from "i18next";
import api from "../API/apiCollection";
import toast from "react-hot-toast";
import { useTheme } from "@emotion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { resetState } from "../redux/cart";
import { orderCartDetailsReset } from "../redux/orderCartDetails";
import { deliveryAddressReset } from "../redux/DeliveryAddress";

const CheckoutForm = ({ order_id, clientKey: clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const theme = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      console.error("Stripe has not loaded yet.");
      setLoading(false);
      return;
    }

    await elements.submit();

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
        },
        redirect: "if_required",
        clientSecret,
      });

      if (error) {
        setLoading(false);
        toast.error(`Payment failed: ${error.message}`);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        toast.success("Payment Successful!");
        await api
          .add_transactions({ orderID: order_id, status: "success" })
          .then((response) => {
            dispatch(resetState());
          })
          .then((res) => {
            dispatch(resetState());
            dispatch(orderCartDetailsReset());
            dispatch(deliveryAddressReset());
            setLoading(false);
            navigate("/");
            navigate("/profile/booking/services/" + order_id);
          });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form onSubmit={(e) => handleSubmit(e)}>
        <Box sx={{ color: "white" }}>
          <AddressElement options={{ mode: "billing" }} className="mt20 mb20" />
          <PaymentElement className="mt20 mb20" />
        </Box>

        <Button
          type="submit"
          disabled={!stripe || !elements || loading === true}
          variant="outlined"
          fullWidth
          sx={{
            mt: 2,
            borderRadius: "8px",
            backgroundColor: theme.palette.background.buttonColor,
          }}
        >
          {t("make_a_payment")}
        </Button>
      </form>
    </>
  );
};

function Stripe({ amount, promoCode, clientKey }) {
  const delivery_type = useSelector(
    (state) => state.DeliveryAddress
  )?.deliveryType;

  const orderDetails = useSelector(
    (state) => state.OrderCartDetails
  )?.orderDetails;
  const orderNotes = orderDetails.orderNote;

  const [open, setOpen] = useState(false);
  const [orderID, setOrderID] = useState(0);
  const deliveryAddress = useSelector(
    (state) => state.DeliveryAddress
  )?.delivery;

  const handleOpen = async () => {
    setOpen(true);
    const date = orderDetails && orderDetails.date;
    const time = orderDetails && orderDetails.slot;

    const address_id = deliveryAddress;
    const address = address_id !== "" ? deliveryAddress : "";

    await api
      .placeOrder({
        method: "stripe",
        date: date,
        time: time,
        addressId: delivery_type === "Home" ? address.id : "",
        order_note: orderNotes,
        promoCode: promoCode?.length > 0 ? promoCode[0]?.promo_code : "",
      })
      .then((response) => response)
      .then((result) => {
        if (result.error === false) {
          setOrderID(result.data.order_id);
        }
      })
      .catch((error) => console.log("error", error));
  };

  const handleClose = async (e) => {
    e.preventDefault();
    setOpen(false);
    await api
      .add_transactions({ orderID: orderID, status: "cancelled" })
      .then((response) => {});
  };

  return (
    <>
      <Button
        variant="outlined"
        fullWidth
        sx={{ my: 3 }}
        onClick={(e) => handleOpen()}
      >
        {t("make_a_payment")}
      </Button>

      <Dialog open={open} maxWidth={"lg"}>
        <Box width={{ xs: "100%", md: 500 }}>
          <DialogTitle
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography variant="h6"> {t("pay_with_stripe")} </Typography>
            <IconButton
              aria-label="handle-close"
              onClick={(e) => handleClose(e)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box my={5} sx={{ color: "white " }}>
              <CheckoutForm
                amount={amount}
                order_id={orderID}
                clientKey={clientKey}
              />
            </Box>
          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
}

export default Stripe;
