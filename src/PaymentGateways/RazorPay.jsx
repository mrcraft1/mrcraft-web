import { Button } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { t } from "i18next";
import api from "../API/apiCollection";
import toast from "react-hot-toast";
import { useTheme } from "@emotion/react";
import { useNavigate } from "react-router";
import { resetState } from "../redux/cart";
import { orderCartDetailsReset } from "../redux/orderCartDetails";
import { deliveryAddressReset } from "../redux/DeliveryAddress";

const RazorPay = ({ amount, promoCode }) => {
  const settings = useSelector((state) => state.Settings)?.settings;
  const currencyCountryCode =
    settings?.payment_gateways_settings?.razorpay_currency;
  const delivery_type = useSelector(
    (state) => state.DeliveryAddress
  )?.deliveryType;

  const deliveryAddress = useSelector(
    (state) => state.DeliveryAddress
  )?.delivery;

  const dispatch = useDispatch();

  const RazorKey = settings.payment_gateways_settings.razorpay_key;

  const orderDetails = useSelector(
    (state) => state.OrderCartDetails
  )?.orderDetails;

  const date = orderDetails && orderDetails.date;
  const time = orderDetails && orderDetails.slot;

  const address_id = deliveryAddress;

  const address = address_id !== "" ? deliveryAddress : "";

  const orderNotes = orderDetails.orderNote;

  const navigate = useNavigate();

  const theme = useTheme();
  const [popupClosed, setPopupClosed] = useState(false);

  const handlePayment = async () => {
    localStorage.setItem("Paymethod", "razorpay");

    await api
      .placeOrder({
        method: "razorpay",
        date: date,
        time: time,
        addressId: delivery_type === "Home" ? address?.id : "",
        order_note: orderNotes,
        promoCode: promoCode?.length > 0 ? promoCode[0]?.promo_code : "",
      })
      .then(async (result) => {
        if (result.error === false) {
          let place_Order_id = result.data.order_id;
          let intent_order_id = "";
          await api
            .createRazorOrder({ orderId: result.data.order_id })
            .then((rex) => {
              intent_order_id = rex?.data?.id;
              // notes = rex?.data?.receipt;
            });

          const options = {
            key: RazorKey,
            amount: parseInt(amount) * 100,
            currency: currencyCountryCode,
            name: process.env.REACT_APP_NAME,
            order_id: intent_order_id,
            notes: { order_id: result.data.order_id },
            description: "Payment for Your Product",
            handler: async function (response) {
              // Handle Razorpay popup closure here
              if (response && response.razorpay_payment_id) {
                setPopupClosed(true);

                await api
                  .add_transactions({
                    orderID: place_Order_id,
                    status: "success",
                  })
                  .then((res) => {
                    dispatch(orderCartDetailsReset());
                    dispatch(resetState());
                    dispatch(deliveryAddressReset());

                    // Redirect to the booking page after successful payment
                    // window.location.href = "/profile/booking/services/" + order_id;
                    navigate("/profile/booking/services/" + place_Order_id);
                  })
                  .catch((error) => {
                    console.error(
                      "Error occurred during transaction completion:",
                      error
                    );
                  });
              }
            },
            theme: {
              color: theme?.palette?.primary?.main,
            },
            modal: {
              ondismiss: async function () {
                await api
                  .add_transactions({
                    orderID: place_Order_id,
                    status: "cancelled",
                  })
                  .then((res) => {})
                  .catch((error) => {
                    console.error(
                      "Error occurred during transaction cancellation:",
                      error
                    );
                  });
              },
            },
          };

          // Open Razorpay payment popup
          window.Razorpay.open(options);
        } else {
          toast.error(result.message);
        }
      });
  };

  return (
    <div>
      <Button
        fullWidth
        mx={3}
        variant="outlined"
        onClick={(e) => handlePayment()}
      >
        {t("make_a_payment")}
      </Button>
      {popupClosed && <p>Razorpay popup closed message</p>}
    </div>
  );
};

export default RazorPay;
