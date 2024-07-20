import { Button } from "@mui/material";
import React from "react";
import { usePaystackPayment } from "react-paystack";
import { useDispatch, useSelector } from "react-redux";
import { t } from "i18next";
import api from "../API/apiCollection";
import toast from "react-hot-toast";
import { resetState } from "../redux/cart";
import { orderCartDetailsReset } from "../redux/orderCartDetails";
import { deliveryAddressReset } from "../redux/DeliveryAddress";
import { useNavigate } from "react-router";
// import { useTheme } from "@emotion/react";

const Paystack = ({ amount, promoCode }) => {
  const dispatch = useDispatch();
  const payment_gateway = useSelector((state) => state.Settings)?.settings
    ?.payment_gateways_settings;
  const user_details = useSelector((state) => state.UserData)?.profile;
  const delivery_type = useSelector(
    (state) => state.DeliveryAddress
  )?.deliveryType;

  const deliveryAddress = useSelector(
    (state) => state.DeliveryAddress
  )?.delivery;

  const orderDetails = useSelector(
    (state) => state.OrderCartDetails
  )?.orderDetails;
  const date = orderDetails && orderDetails.date;
  const time = orderDetails && orderDetails.slot;

  const address_id = deliveryAddress;
  const address = address_id !== "" ? deliveryAddress : "";
  const orderNotes = orderDetails.orderNote;

  const navigate = useNavigate();

  const email = !user_details.email
    ? user_details?.data.email
    : user_details.email;

  let config = {
    reference: new Date().getTime().toString(),
    currency: payment_gateway.paystack_currency,
    amount: amount * 100, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
    publicKey: payment_gateway.paystack_key,
  };

  if (email) config.email = email;

  // you can call this function anything

  const initializePayment = usePaystackPayment(config);

  // console.log(email);

  const handlePayout = async () => {
    if (!email) {
      toast.error("Please Update Your Email ID");
      return;
    }

    await api
      .placeOrder({
        method: "paystack",
        date: date,
        time: time,
        addressId: delivery_type === "Home" ? address?.id : "",
        order_note: orderNotes,
        promoCode: promoCode?.length > 0 ? promoCode[0]?.promo_code : "",
      })
      .then( (result) => {
        if (result.error === false) {

          const onSuccess = (reference) => {
            // Implementation for whatever you want to do with reference and after success call.

             api
              .add_transactions({
                orderID: result.data.order_id,
                status: "success",
              })
              .then((result) => {
                if (result.error === true) {
                  toast.error(result.message);
                } else {
                  toast.success("Service Booked successfully");
                }
              })
              .then((res) => {
                dispatch(resetState());
                dispatch(orderCartDetailsReset());
                dispatch(deliveryAddressReset());
              })
              .then((res) => {
                navigate("/profile/booking/services/" + result.data.order_id);
                // window.location.reload();
              });
          };

          // you can call this function anything
          const onClose =  () => {
            // implementation for  whatever you want to do when the Paystack dialog closed.

             api
              .add_transactions({ orderID: result.data.order_id, status: "cancelled" })
              .then((res) => {});
          };

          initializePayment(onSuccess, onClose);
        } else {
          toast.error(result.message);
        }
      });
  };

  return (
    <Button
      fullWidth
      sx={{ my: 3 }}
      variant="outlined"
      onClick={() => {
        handlePayout();
        // initializePayment(onSuccess, onClose)
      }}
    >
      {t("make_a_payment")}
    </Button>
  );
};

export default Paystack;
