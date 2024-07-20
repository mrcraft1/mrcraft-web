/* eslint eqeqeq: 0 */
import {
  ArrowBackIosNewOutlined,
  ConfirmationNumber,
  Place,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  tableCellClasses,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { handleClose, handleOpen } from "../config/config";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import { t } from "i18next";
import toast from "react-hot-toast";
import api from "../API/apiCollection";
import { useSelector, useDispatch } from "react-redux";
import Stripe from "../PaymentGateways/Stripe";
import { setPromoCode } from "../redux/Promocode";
import { useTheme } from "@emotion/react";
import Paystack from "../PaymentGateways/Paystack";
import RazorPay from "../PaymentGateways/RazorPay";
import Paypal from "../PaymentGateways/Paypal";
import { DECIMAL_POINT } from "../config/config";
import { cartDetails, orderCartDetailsReset } from "../redux/orderCartDetails";
import { resetState } from "../redux/cart";
import { useNavigate } from "react-router";
import DeleteIcon from "@mui/icons-material/Delete";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

//closedrawer
const BookingInfoDrawer = ({ setForm, setPromo, setBooking }) => {
  const decimal_point = DECIMAL_POINT();
  const dispatch = useDispatch();
  // for fetching cart details
  const [rows, setRows] = useState([]);
  const [amount, setAmount] = useState();
  const [visitingCharges, setVisitingCharges] = useState();
  const [coupn, setCoupn] = useState([]);
  const [addressInfo, setAddressInfo] = useState();
  const settings = useSelector((state) => state.Settings)?.settings;
  const currency_symbol = settings?.app_settings?.currency;
  const navigate = useNavigate();

  const delivery_type = useSelector(
    (state) => state.DeliveryAddress
  )?.deliveryType;
  const orderDetails = useSelector(
    (state) => state.OrderCartDetails
  )?.orderDetails;
  const orderNotes = orderDetails.orderNote;

  // we need this in razorpay order place api
  const theme = useTheme();

  const deliveryAddress = useSelector(
    (state) => state.DeliveryAddress
  )?.delivery;

  const promo = useSelector((state) => state.Promocode);
  const codes = promo.promocode;
  // open and close drawer
  function back() {
    handleClose(setBooking);
    handleOpen(setForm);
  }

  //table row styling
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  //table cell styling
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  let promocode = useSelector((state) => state.Promocode)?.promocode;

  //for fetching cart information when drawer open
  let cartX = useSelector((state) => state.cart)?.cartItems;
  let cartY = useSelector((state) => state.cart)?.base_cart;

  useEffect(() => {
    if (delivery_type === "shop") {
      setAmount(Number(cartY.sub_total));
    } else {
      setAmount(Number(cartY.sub_total) + Number(cartX[0]?.visiting_charges));
    }
    setRows(cartX);
    setVisitingCharges(Number(cartX[0]?.visiting_charges));
    // setPayOnService();

    const appliedPromo = localStorage.getItem("selectedPromo");
    if (appliedPromo) {
      const promo = JSON.parse(appliedPromo);
      setCoupn(promo);
    } else {
      setCoupn(null);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // to open promocode drawer
  function openPromo() {
    handleClose(setBooking);
    handleOpen(setPromo);
  }

  const removePromo = () => {
    dispatch(setPromoCode(""));
    localStorage.removeItem("promocode");

    const isPromoAvailable = localStorage.getItem("selectedPromo");
    if (isPromoAvailable) {
      localStorage.setItem("selectedPromo", "");
      toast.success("Coupon Remove Successfully");
      setCoupn();
    } else toast.error("No Coupn Selected");
  };

  //delivery method and other stuff

  const selectedDate = orderDetails && orderDetails.date;
  const selectedTime = orderDetails && orderDetails.slot;

  useEffect(() => {
    if (deliveryAddress) {
      setAddressInfo(deliveryAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==========payment integrations==============
  //when user place order
  const placeOrder = async () => {
    const method = localStorage.getItem("Paymethod");

    let address = "";
    if (delivery_type === "Home") {
      address = deliveryAddress;
    }

    await api
      .placeOrder({
        method: method,
        date: selectedDate,
        time: selectedTime,
        addressId: delivery_type === "Home" ? address?.id : "",
        order_note: orderNotes,
        promoCode: promocode[0]?.promo_code,
      })
      .then((response) => response)
      .then(async (result) => {
        if(method === "cod"){
          toast.success(t("Service booked successfully"));
        }else{
          toast.success(result.message);
        }
        if (result.error === false) {
          setTimeout(async () => {
            await api
              .add_transactions({
                orderID: result.data.order_id,
                status: "success",
              })
              .then((response) => response)
              .then((res) => {
                dispatch(orderCartDetailsReset());
                dispatch(resetState());
                navigate("/profile/booking/services/" + result.data.order_id);
                dispatch(cartDetails({ orderNote: "" }));
              });
          }, 2000);
        }
      })
      .catch((error) => console.log("error", error));
  };

  //we set payment integration setting into our localstorage and from that we fetch data

  const [Key, setStripekey] = useState("");

  const [StripeStatus, setStripeStatus] = useState(false);
  const [razorStatus, setRazorStatus] = useState(false);
  const [paypalStatus, setPaypalStatus] = useState(false);
  const [paystackStatus, setPaystackStatus] = useState(false);
  const [payment_type, setPaymentType] = useState("");

  useEffect(() => {
    const StripeStatus = settings.payment_gateways_settings.stripe_status;

    const RazorStatus = settings.payment_gateways_settings.razorpayApiStatus;
    const PayStackStatuss = settings.payment_gateways_settings.paystack_status;

    if (StripeStatus === "enable") {
      const stripeKey =
        settings.payment_gateways_settings.stripe_publishable_key;
      const clientSecret = settings.payment_gateways_settings.stripe_secret_key;
      localStorage.setItem("stripeKey", stripeKey);
      localStorage.setItem("clientSecret", clientSecret);
      setStripekey(stripeKey);
      setStripeStatus(true);
    } else if (RazorStatus === "enable") {
      const RazorKey = settings.payment_gateways_settings.razorpay_key;
      setStripekey(RazorKey);
      setRazorStatus(true);
    } else if (PayStackStatuss === "enable") {
      const PayStackKey = settings.payment_gateways_settings.paystack_key;
      setStripekey(PayStackKey);
      setPaystackStatus(true);
    } else {
      setStripekey("");
      setPaypalStatus(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      cartY.is_pay_later_allowed === 1 &&
      cartY.is_online_payment_allowed === 0
    ) {
      setPaymentType("pay_on_service");
    } else if (
      cartY.is_pay_later_allowed === 0 &&
      cartY.is_online_payment_allowed === 1
    ) {
      setPaymentType("pay_now");
    } else {
      setPaymentType("");
    }
    // eslint-disable-next-line
  }, []);

  const key = localStorage.getItem("stripeKey");
  const stripekey = key;
  const stripePromise = loadStripe(stripekey);

  const currencyCountryCode =
    settings?.payment_gateways_settings?.stripe_currency;
  const paymentsettings = settings?.payment_gateways_settings;

  let stripe_secret = paymentsettings?.stripe_secret_key;
  const stripeX = require("stripe")(stripe_secret);

  const [clientKey, setClientKey] = useState("");

  useEffect(() => {
    const createPaymentIntent = async () => {
      if (amount) {
        try {
          const paymentIntent = await stripeX.paymentIntents.create({
            amount: amount, // Amount in cents
            currency: currencyCountryCode,
            description: "payment",
           
            // Add other parameters as needed
          });
          setClientKey(paymentIntent.client_secret);
          // Handle the created payment intent here
        } catch (error) {
          console.error("Error creating payment intent:", error);
          // Handle any errors here
        }
      }
    };

    createPaymentIntent();
  }, [amount, currencyCountryCode]);

  const options = {
    clientSecret: clientKey,
    // Fully customizable with appearance API.
    appearance: {
      theme: "stripe",
    },
  };

  useEffect(() => {}, [clientKey]);

  return (
    <Box display={"block"} width={"80"}>
      <Box mt={1} mb={1} display={"flex"} alignItems={"center"}>
        <IconButton onClick={back}>
          <ArrowBackIosNewOutlined />
        </IconButton>
        <h3>{t("booking_info")}</h3>
      </Box>
      <Divider />
      <Box mt={2} p={2}>
        <Box border={"1px solid gray"} borderRadius={2}>
          <Box display={"flex"} p={1} gap={2} alignItems={"center"}>
            <AccessTimeIcon
              className="icon"
              sx={{ fontWeight: "thin" }}
              fontSize="large"
            />
            <Box>
              <Typography variant="caption" fontSize={14}>
                {t("booking_date")}
              </Typography>
              <Typography fontWeight={"bold"}>
                {dayjs(selectedDate).format("DD/MM/YYYY")}, {selectedTime}
              </Typography>
            </Box>
          </Box>
          {delivery_type === "Home" ? (
            <>
              <Divider />
              <Box display={"flex"} p={1} gap={2} alignItems={"center"}>
                <Place className="icon" fontSize="large" />
                <Box>
                  <Typography color={"gray"} fontSize={14}>
                    {t("your_booking_address")}
                  </Typography>
                  <Typography fontWeight={"bold"}>
                    {addressInfo ? addressInfo.address : ""}
                  </Typography>
                </Box>
              </Box>
            </>
          ) : (
            ""
          )}
        </Box>

        <Box sx={{ my: 5 }}>
          <Button
            variant="contained"
            fullWidth
            className="promocode-btn"
            mt={2}
            border={"1px solid"}
            sx={{
              textTransform: "none",
              borderRadius: "10px",
              backgroundColor: theme.palette.background.buttonColor,
            }}
            p={2}
            onClick={openPromo}
            borderRadius={"8px"}
          >
            {t("aplly_promo")}
          </Button>
        </Box>

        {codes !== null && codes?.length > 0 ? (
          <Box
            my={5}
            px={2}
            py={2}
            sx={{ backgroundColor: "#343F53", borderRadius: "8px" }}
          >
            <Box display={"flex"} flexDirection={"column"}>
              <Box display={"flex"} justifyContent={"space-between"}>
                <Box display={"flex"} gap={2}>
                  <ConfirmationNumber sx={{ color: "white" }} />
                  <Typography
                    color={"white"}
                    fontWeight={"400"}
                    variant="subtitle2"
                  >
                    {coupn !== undefined && coupn !== null
                      ? coupn.promo_code
                      : ""}
                  </Typography>
                </Box>
                <Typography variant="body1" color={"white"}>
                  {coupn !== undefined && coupn !== null ? (
                    <Typography
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      gap={0.4}
                      variant="subtitle2"
                      color={"white"}
                    >
                      <Box>{coupn?.discount}</Box>
                      <Box>
                        {coupn?.discount_type === "percentage"
                          ? "%"
                          : currency_symbol}
                      </Box>
                    </Typography>
                  ) : (
                    "Coupons"
                  )}
                </Typography>
                <Button
                  variant="contained"
                  mt={2}
                  border={"1px solid"}
                  sx={{
                    textTransform: "none",
                    borderRadius: "10px",
                    backgroundColor: theme.palette.background.buttonColor,
                  }}
                  p={2}
                  onClick={removePromo}
                  borderRadius={"8px"}
                >
                  <DeleteIcon />
                </Button>
              </Box>
            </Box>
          </Box>
        ) : (
          ""
        )}

        <Box mt={2}>
          <Typography variant="h6">{t("payment_mode")}</Typography>
          <Box mt={2}>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              value={payment_type}
              onChange={(e) => setPaymentType(e.target.value)}
              name="radio-buttons-group"
            >
              {cartY.is_pay_later_allowed === 1 && (
                <FormControlLabel
                  value="pay_on_service"
                  control={<Radio />}
                  label={t("pay_service_home")}
                />
              )}

              {cartY.is_online_payment_allowed === 1 && (
                <FormControlLabel
                  value="pay_now"
                  control={<Radio />}
                  label={t("pay_now")}
                />
              )}
            </RadioGroup>
          </Box>
        </Box>

        {/* Table that contain information about our cart  */}
        <TableContainer
          className="add-address-btn"
          component={Paper}
          sx={{ mt: 5 }}
        >
          <Table className="booking-info-table" aria-label="customized table">
            <TableBody>
              {rows.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell component="th" scope="row">
                    {row.servic_details.title}
                  </StyledTableCell>
                  <StyledTableCell align="right">{row.qty}</StyledTableCell>
                  <StyledTableCell align="right">
                    {currency_symbol} {row.servic_details.price_with_tax}
                  </StyledTableCell>
                </StyledTableRow>
              ))}

              <StyledTableRow>
                <StyledTableCell component="th" scope="row">
                  {t("sub_total")}
                </StyledTableCell>
                <StyledTableCell align="right"></StyledTableCell>
                <StyledTableCell align="right">
                  {currency_symbol} {cartY.sub_total}
                </StyledTableCell>
              </StyledTableRow>
              {delivery_type === "Home" ? (
                <>
                  <StyledTableRow>
                    <StyledTableCell component="th" scope="row">
                      {t("visiting_charges")}
                    </StyledTableCell>
                    <StyledTableCell align="right"></StyledTableCell>
                    <StyledTableCell align="right">
                      +{currency_symbol} {visitingCharges}
                    </StyledTableCell>
                  </StyledTableRow>
                </>
              ) : (
                ""
              )}

              {coupn !== undefined &&
              coupn !== null &&
              promocode &&
              promocode?.length > 0 &&
              promocode[0]?.final_discount > 0 ? (
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    {t("promocode_discount")}
                  </StyledTableCell>
                  <StyledTableCell align="right"></StyledTableCell>
                  <StyledTableCell align="right">
                    - {currency_symbol}
                    {promocode[0]?.final_discount}
                  </StyledTableCell>
                </StyledTableRow>
              ) : null}
              <StyledTableRow>
                <StyledTableCell component="th" scope="row">
                  <Typography variant="body1" fontWeight={"bold"}>
                    {t("total_amount")}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="right"></StyledTableCell>
                <StyledTableCell align="right">
                  <Typography
                    variant="body1"
                    fontWeight={"bold"}
                    color={theme?.palette?.primary?.main}
                  >
                    {currency_symbol}
                    {coupn !== undefined && coupn !== null
                      ? amount -
                        (promocode && promocode?.length > 0
                          ? promocode[0]?.final_discount
                          : 0)
                      : amount}
                  </Typography>
                </StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* at a time only one single payent gateway is enable */}
        {/* payment method integrations  */}

        {/* if pay on server is enabled then cod true else payment method shows */}
        {payment_type === "pay_on_service" && (
          <Box mt={2}>
            <Button
              variant="outlined"
              fullWidth
              className="place-order-btn"
              onClick={() => {
                localStorage.setItem("Paymethod", "cod");
                placeOrder();
              }}
            >
              {t("place_order")}
            </Button>
          </Box>
        )}

        {payment_type === "pay_now" && (
          <Box mt={2}>
            {/* Render StripeCheckout only when StripeKey is available */}
            {Key && StripeStatus === true ? (
              <>
                {clientKey && (
                  <Elements stripe={stripePromise} options={options}>
                    <Stripe
                      clientKey={clientKey}
                      amount={
                        coupn !== undefined && coupn !== null
                          ? parseFloat(
                              amount - promocode[0]?.final_discount
                            ).toFixed(decimal_point)
                          : parseFloat(amount)
                      }
                      promoCode={promocode?.length > 0 ? promocode : []}
                    ></Stripe>
                  </Elements>
                )}
              </>
            ) : null}

            {/* if paystack is enable  */}
            {paystackStatus ? (
              <>
                <Paystack
                  amount={
                    coupn !== undefined && coupn !== null
                      ? parseFloat(
                          amount - promocode[0]?.final_discount
                        ).toFixed(decimal_point)
                      : parseFloat(amount)
                  }
                  promoCode={promocode?.length > 0 ? promocode : []}
                />
              </>
            ) : (
              ""
            )}
            {paypalStatus ? (
              <>
                <Paypal
                  amount={
                    coupn !== undefined && coupn !== null
                      ? parseFloat(
                          amount - promocode[0]?.final_discount
                        ).toFixed(decimal_point)
                      : parseFloat(amount)
                  }
                  promoCode={promocode?.length > 0 ? promocode : []}
                />
              </>
            ) : (
              ""
            )}

            {/* ifrazorpay is enable */}
            <Box mt={2}>
              {razorStatus ? (
                <RazorPay
                  amount={
                    coupn !== undefined && coupn !== null
                      ? parseFloat(
                          amount - promocode[0]?.final_discount
                        ).toFixed(decimal_point)
                      : parseFloat(amount)
                  }
                  promoCode={promocode?.length > 0 ? promocode : []}
                />
              ) : (
                ""
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BookingInfoDrawer;
