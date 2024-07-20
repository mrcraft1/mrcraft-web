/* eslint eqeqeq: 0 */
import {
  AccessTime,
  BrowseGalleryRounded,
  CancelOutlined,
  CloseOutlined,
  EventNoteOutlined,
  LocationOnOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogTitle,
  Divider,
  Grid,
  Typography,
  useTheme,
  IconButton,
  FormLabel,
  Radio,
  Card,
  CardMedia,
} from "@mui/material";
import { t } from "i18next";
import React, { useEffect, useState } from "react";
import Heading from "../Heading";
import { useNavigate, useParams } from "react-router";
import Layout from "../../../layout/Layout";
import Pnavigation from "../Pnavigation";
import api from "../../../../API/apiCollection";
import toast from "react-hot-toast";
import Calendar from "react-calendar";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faSpinner } from "@fortawesome/free-solid-svg-icons";
import RatingModal from "../../../Modals/RatingModal";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  updateCartItems,
  updateBaseCart,
  updatesubAmount,
} from "../../../../../src/redux/cart";
import { capilaizeString, getStatusClassName } from "../../../../util/Helper";
import { setPromoCode } from "../../../../../src/redux/Promocode";
import "react-calendar/dist/Calendar.css";
import UrlTypeComponent from "../../../LightBox/UrlTypeComponent";

const SpecificService = () => {
  const theme = useTheme();
  const [bookingInfo, setBookingInfo] = useState([]);
  const { id } = useParams();
  const settings = useSelector((state) => state.Settings)?.settings;
  const otpSystem = settings?.general_settings?.otp_system;
  const currency_symbol = settings?.app_settings?.currency;
  const authentication = useSelector(
    (state) => state.authentication
  )?.isLoggedIn;
  const [service, setService] = useState(0);
  const [company, setCompany] = useState("");
  const [open, setOpen] = useState(false);

  const [checked, setchecked] = useState();
  const [openRescheduleDialog, setOpenRescheduleDialog] = useState(false);
  const [slot, setSlot] = useState("");
  const [timeSlot, setTimeSlot] = useState([]);
  const [noSlotAvailable, setNoSlotAvailable] = useState("");
  const [submission, setSubmission] = useState(false);
  const [cancellation, setCancellation] = useState(false);
  const [providerID, setProviderID] = useState(0);
  const [Downloading, setDownloading] = useState(false);
  const baseCart = useSelector((state) => state.cart)?.base_cart;
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  const orderDetails = useSelector(
    (state) => state.OrderCartDetails
  )?.orderDetails;
  const dispatch = useDispatch();
  const selectedCalendarDate = orderDetails && orderDetails.date;

  const handleService = (serviceData, company) => {
    setService(serviceData);
    setCompany(company);
    setOpen(!open);
  };

  const handleReschedule = async (e) => {
    setService(e);
    setOpenRescheduleDialog(!openRescheduleDialog);
  };

  const newHandleReschedule = async (id) => {
    const date = dayjs(selectedDate).format("YYYY-MM-DD");
    try {
      const response = await api.get_available_slot({
        partner_id: id,
        selectedDate: date,
      });
      setTimeSlot(response?.data?.all_slots);
      setNoSlotAvailable(response?.message);
      setProviderID(id);
      if (response.error) {
        // toast.error(response.message);
        setNoSlotAvailable(response?.message);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    newHandleReschedule(providerID);
  }, [selectedDate]);

  const TransferedData = useSelector((state) => state.Pages).bookings?.filter(
    (booking) => {
      return booking.id == id;
    }
  );

  useEffect(() => {
    const fetchBookingInfo = async () => {
      if (TransferedData?.length !== 0) {
        setBookingInfo(TransferedData);
      } else if (bookingInfo?.length === 0) {
        try {
          const result = await api.getOrders({ id: id });
          setBookingInfo(result.data);
        } catch (error) {
          console.log("error", error);
        }
      }
    };

    fetchBookingInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, open]);

  useEffect(() => {
    const company_name = process.env.REACT_APP_NAME;
    document.title = `My Booking - Bookings | ${company_name}`;
  }, []);

  const handleChange = (event, slot) => {
    setchecked(slot);
    setSlot(event.time);
  };

  const handleScheduleChnage = async () => {
    if (slot === "") {
      return toast.error("Please select Time From available slots");
    }
    setSubmission(true);
    await api
      .change_order_status({
        order_id: id,
        status: "rescheduled",
        date: selectedDate,
        time: slot,
      })
      .then((result) => {
        setSubmission(false);
        if (result.error == true) {
          if (typeof result.message == "string") toast.error(result.message);
          else {
            Object.values(result.message).forEach((e) => {
              toast.error(e);
            });
          }
        } else {
          toast.success(result.message);
          setBookingInfo(result?.data?.data);
          setOpenRescheduleDialog(!openRescheduleDialog);
        }
        // window.location.reload();
      });
  };

  const handleOrderCancelattion = async () => {
    setCancellation(true);
    await api
      .change_order_status({ order_id: id, status: "cancelled" })
      .then((result) => {
        setCancellation(false);
        if (result.error == true) {
          if (typeof result.message == "string") toast.error(result.message);
          else {
            Object.values(result.message).forEach((e) => {
              toast.error(e);
            });
          }
        } else {
          setBookingInfo(result?.data?.data);
          toast.success(result.message);
        }
      });
  };

  const DownloadInvoice = async () => {
    setDownloading(true);

    await api.download_invoices({ order_id: id }).then(async (result) => {
      // Convert the API response to a Blob object
      const blob = new Blob([result], { type: "application/pdf" });
      // Create a new anchor element and set its href attribute to the Blob object
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = `eDemand-invoice-${id}.pdf`;

      // Append the anchor element to the DOM and click it to initiate the download
      document.body.appendChild(downloadLink);
      downloadLink.click();

      // Remove the anchor element from the DOM
      document.body.removeChild(downloadLink);

      // Set your state, if needed (e.g., setDownloading(false))
      setDownloading(false);
    });
  };

  const advanceBookingDays = baseCart && baseCart.advance_booking_days;
  const disableDateAfter = dayjs().add(advanceBookingDays, "day");

  const shouldDisableDate = (date) => {
    const today = dayjs().startOf("day"); // Get the start of today
    return date.isBefore(today) || date.isAfter(disableDateAfter);
  };

  const navigate = useNavigate();

  const removePromo = () => {
    dispatch(setPromoCode([]));
    localStorage.removeItem("promocode");
  };
  // general function that we reuse to increment and decrement of items
  const handleAddCart = async (id, qty) => {
    try {
      removePromo();

      const response = await api.ManageCart({ id: id, qty: qty.toString() });

      let sub_amout = 0;

      if (response && response.data) {
        response.data.forEach((item) => {
          const itemPrice = parseFloat(item.servic_details.price_with_tax);
          const itemQty = parseFloat(item.qty);

          sub_amout += itemPrice * itemQty;
        });

        dispatch(updatesubAmount(sub_amout));
        dispatch(updateCartItems(response.data));
        dispatch(updateBaseCart(response));

        let message = capilaizeString(response.message);
        toast.success(message);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  // Arrow function for when user click on add button request sent to api with 1 Qty
  const handleOpen = (response, qty = 1) => {
    if (authentication === false) {
      toast.error("You need to login before adding Items to your account");
      return true;
    }

    handleAddCart(response[0].service_id, 1);
    // handleModalOpen();
  };

  const getTimeOfDay = (time) => {
    const hours = parseInt(time.split(":")[0]);

    if (hours >= 0 && hours < 6) {
      return "Night";
    } else if (hours < 12) {
      return "Morning";
    } else if (hours < 14) {
      return "Noon";
    } else if (hours < 18) {
      return "Afternoon";
    } else if (hours < 20) {
      return "Evening";
    } else if (hours < 24) {
      return "Night";
    } else {
      return "Midnight";
    }
  };

  const copyOtp = async (otp) => {
    try {
      await navigator.clipboard.writeText(otp);
      // Show toast message
      toast.success("OTP copied successfully!");
    } catch (err) {
      // Show error toast message
      toast.error("Failed to copy OTP");
    }
  };

  return (
    <Layout>
      <Container className="mainContainer">
        <Grid spacing={3} container>
          <Grid item xs={12} md={4}>
            <Pnavigation />
          </Grid>
          <Grid item xs={12} md={8}>
            <Heading heading={t("booking_information")} />
            <Box
              padding={2}
              maxWidth={"100%"}
              borderColor={"#707070"}
              className="details_specific_service"
              borderRadius={"10px"}
              marginBottom={"20px"}
            >
              {bookingInfo ? (
                bookingInfo.map((bookData) => {
                  return (
                    <Box
                      key={bookData.id}
                      border={"1px solid"}
                      borderColor={"#707070"}
                      borderRadius={3}
                    >
                      <Box
                        display={"flex"}
                        justifyContent={"space-between"}
                        p={1}
                        maxWidth={"100%"}
                        sx={{ flexDirection: { xs: "column", md: "row" } }}
                        alignItems={"center"}
                        mb={1}
                      >
                        <Box
                          display={"flex"}
                          sx={{
                            flexDirection: { xs: "column", md: "row" },

                            textAlign: { xs: "center", md: "left" },
                          }}
                          alignItems={"center"}
                        >
                          <Box height={"100px"} width={"100px"}>
                            <img
                              src={bookData.profile_image}
                              height={"100%"}
                              width={"100%"}
                              alt="serviceimage"
                              className="border-radius-10"
                            />
                          </Box>
                          <Box display={"block"}>
                            <Typography variant="h5" ml={2} fontWeight={"bold"}>
                              {bookData.partner}
                            </Typography>
                            <Typography ml={2} display={"flex"} gap={1}>
                              <span>{t("invoice")}:</span>
                              <Box sx={{ color: "#0277FA" }}>
                                {bookData.invoice_no}
                              </Box>
                            </Typography>
                            <Typography ml={2} display={"flex"} gap={1}>
                              <span>{t("service_at")}:</span>
                              <Box sx={{ color: "#0277FA" }}>
                                {bookData.address_id == "0"
                                  ? "STORE"
                                  : "DOORSTEP"}
                              </Box>
                            </Typography>
                            <Typography
                              ml={2}
                              mt={0.2}
                              sx={{ color: "#0277FA" }}
                              fontWeight={"bolder"}
                            >
                              {currency_symbol} {bookData.final_total}
                            </Typography>
                          </Box>
                        </Box>
                        <Box p={1}>
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{
                              width: "100%",
                            }}
                            className={`mt-1 mr-1 ${getStatusClassName(
                              bookData.status
                            )}`}
                            // color={
                            //   bookData.status === "awaiting"
                            //     ? "primary"
                            //     : bookData.status === "confirmed" ||
                            //       bookData.status === "completed"
                            //     ? "success"
                            //     : bookData.status === "cancelled"
                            //     ? "error"
                            //     : bookData.status === "rescheduled"
                            //     ? "warning"
                            //     : bookData.status === "started"
                            //     ? "dark"
                            //     : "info"
                            // }
                          >
                            {bookData.status}
                          </Button>

                          {bookData.status !== "completed" ||
                          bookData.status !== "started" ||
                          bookData.status !== "awaiting" ||
                          bookData.status !== "confirmed" ? (
                            <Box>
                              {bookData.status !== "cancelled" ? (
                                <>
                                  <>
                                    {bookData.status == "awaiting" ||
                                    bookData.status == "confirmed" ? (
                                      <>
                                        <IconButton
                                          key={bookData.id}
                                          variant="contained"
                                          className="reschedule"
                                          size="small"
                                          sx={{
                                            fontSize: "small",
                                            border: " 1px solid",
                                            borderRadius: "5px",
                                            marginTop: "5px",
                                            fontWeight: "600",
                                            width: "100%",
                                          }}
                                          color="primary"
                                          onClick={(e) => {
                                            handleReschedule(1);
                                            newHandleReschedule(
                                              bookData.partner_id
                                            );
                                          }}
                                        >
                                          {/* <img
                                            src="/images/reschedule.svg"
                                            alt="reschedule"
                                          /> */}
                                          {t("reschedule")}
                                        </IconButton>
                                      </>
                                    ) : (
                                      ""
                                    )}
                                  </>
                                  {bookData.is_cancelable == 1 ? (
                                    <IconButton
                                      key={bookData.id}
                                      variant="contained"
                                      className="button-background cancel-btn"
                                      size="small"
                                      color="error"
                                      onClick={(e) =>
                                        handleOrderCancelattion(bookData)
                                      }
                                      disabled={
                                        cancellation == true ? true : false
                                      }
                                    >
                                      {cancellation == false ? (
                                        <>
                                          {/* <CancelOutlined className="cancel-icon" /> */}
                                          {t("cancel_order")}
                                        </>
                                      ) : (
                                        <>
                                          {/* <FontAwesomeIcon
                                            icon={faSpinner}
                                            spin
                                          /> */}
                                          {t("cancel_order")}
                                        </>
                                      )}
                                    </IconButton>
                                  ) : (
                                    ""
                                  )}
                                </>
                              ) : null}
                            </Box>
                          ) : (
                            ""
                          )}

                          {/* otp button */}
                          {otpSystem === "1" && (
                            <Box
                              sx={{
                                marginTop: "5px",
                              }}
                            >
                              <Button
                                size="medium"
                                sx={{
                                  border: "1px solid #ffc200",
                                  color: "#bd8d00",
                                  backgroundColor: "#FFF3CD",
                                  textTransform: "none",
                                  width: "100%",
                                  height: "30.75px",
                                }}
                                onClick={() => copyOtp(bookData.otp)}
                              >
                                {t("otp")} {bookData.otp}
                              </Button>
                            </Box>
                          )}

                          {bookData.status == "completed" ? (
                            <>
                              <Button
                                sx={{
                                  marginTop: "5px",
                                }}
                                key={bookData.id}
                                variant="outlined"
                                className="button-background"
                                size="small"
                                // color="primary"
                                onClick={(e) => DownloadInvoice(bookData.id)}
                                disabled={Downloading === true}
                              >
                                {Downloading === false ? (
                                  <>
                                    {t("download")}
                                    {""}
                                    {t("invoice")}
                                  </>
                                ) : (
                                  <>
                                    {/* <FontAwesomeIcon icon={faDownload} bounce /> */}
                                    {t("download")}
                                    {t("invoice")}
                                  </>
                                )}
                              </Button>

                              {/* reorder Button */}

                              <Box mt={1}>
                                <Button
                                  variant="outlined"
                                  size="medium"
                                  sx={{
                                    textTransform: "none",
                                    width: "100%",
                                    height: "30.75px",
                                  }}
                                  onClick={() => handleOpen(bookData.services)}
                                >
                                  {t("reorder")}
                                </Button>
                              </Box>
                            </>
                          ) : null}
                        </Box>
                      </Box>
                      <Divider />

                      <Box
                        mx={1}
                        my={2}
                        px={2}
                        maxWidth={"100%"}
                        display={"flex"}
                        flexDirection={"column"}
                        gap={2}
                      >
                        <Box display={"flex"} alignItems={"flex-start"} gap={3}>
                          <AccessTime />
                          <Box>
                            <Typography fontSize={"16px"} fontWeight={"bold"}>
                              {bookData.new_start_time_with_date}
                            </Typography>
                            <Typography variant="caption">
                              {t("schedule")}
                            </Typography>
                          </Box>
                        </Box>

                        <Box
                          display={"flex"}
                          width={"100%"}
                          alignItems={"flex-start"}
                          gap={3}
                          overflow={"auto"}
                        >
                          <LocationOnOutlined />
                          <Box>
                            {bookData.address_id != "0" ? (
                              <>
                                <Typography
                                  fontSize={"16px"}
                                  fontWeight={"bold"}
                                  sx={{ overflow: "hidden" }}
                                  className="booking-information"
                                >
                                  {bookData.address}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  className="booking-information"
                                >
                                  {t("address")}
                                </Typography>
                              </>
                            ) : (
                              <>
                                <Typography
                                  fontSize={"16px"}
                                  fontWeight={"bold"}
                                  sx={{ overflow: "hidden" }}
                                  className="booking-information"
                                >
                                  {bookData.partner_address}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  className="booking-information"
                                >
                                  {t("provider_address")}
                                </Typography>
                              </>
                            )}
                          </Box>
                        </Box>

                        {bookData.remarks == "null" ||
                        bookData.remarks == null ? (
                          ""
                        ) : (
                          <Box
                            display={"flex"}
                            alignItems={"flex-start"}
                            gap={3}
                          >
                            <EventNoteOutlined />
                            <Box
                              sx={{
                                maxWidth: {
                                  xs: "80%",
                                  sm: "90%",
                                  md: "93%",
                                },
                              }}
                            >
                              {" "}
                              {/* Adjust max-width as needed */}
                              <Typography
                                fontSize={"16px"}
                                fontWeight={"bold"}
                                sx={{
                                  whiteSpace: "pre-line",
                                  wordWrap: "break-word",
                                }}
                              >
                                {bookData.remarks}
                              </Typography>
                              <Typography variant="caption">
                                {t("notes")}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </Box>

                      {/* work proof */}
                      <Box
                        mx={1}
                        my={2}
                        px={2}
                        maxWidth={"100%"}
                        display={"flex"}
                        flexDirection={"column"}
                        gap={2}
                      >
                        {bookData &&
                        bookData?.work_started_proof?.length > 0 ? (
                          <>
                            <Box className="started_proof">
                              <Typography fontSize={"16px"} fontWeight={"bold"}>
                                {t("work_start_proof")}
                              </Typography>
                              <UrlTypeComponent
                                urls={bookData.work_started_proof}
                              />
                            </Box>
                          </>
                        ) : null}

                        {bookData &&
                        bookData?.work_completed_proof?.length > 0 ? (
                          <>
                            <Box className="completed_proof">
                              <Typography fontSize={"16px"} fontWeight={"bold"}>
                                {t("work_complete_proof")}
                              </Typography>
                              <UrlTypeComponent
                                urls={bookData.work_completed_proof}
                              />
                            </Box>
                          </>
                        ) : null}
                      </Box>

                      <Divider />
                      <Box mt={1} ml={3} mr={3} pl={1}>
                        <Box mt={2} mb={2}>
                          {bookData &&
                            bookData.services.map((service) => {
                              return (
                                <Box
                                  key={service.id}
                                  display={"flex"}
                                  sx={{
                                    justifyContent: "space-between",
                                    flexDirection: { xs: "column", md: "row" },
                                  }}
                                  gap={2}
                                  mb={2}
                                >
                                  <Box>
                                    <Typography>
                                      {service.service_title}
                                    </Typography>
                                    <Typography>
                                      {service.quantity} * {currency_symbol}
                                      {service.price_with_tax}
                                    </Typography>
                                  </Box>

                                  <Box>
                                    <Typography
                                      color={"var(--global-theme)"}
                                      fontWeight={"bold"}
                                    >
                                      {currency_symbol} {service.price_with_tax}
                                    </Typography>
                                    {service.status == "completed" ? (
                                      <Button
                                        key={service.id}
                                        variant="contained"
                                        className="button-background"
                                        size="small"
                                        sx={{
                                          backgroundColor:
                                            theme.palette.background
                                              .buttonColor,
                                          "&:hover": {
                                            backgroundColor:
                                              theme.palette.background
                                                .buttonColor,
                                          },
                                        }}
                                        onClick={(e) =>
                                          handleService(
                                            service,
                                            bookData.company_name
                                          )
                                        }
                                      >
                                        {t("rate")}
                                      </Button>
                                    ) : (
                                      ""
                                    )}
                                  </Box>
                                </Box>
                              );
                            })}
                        </Box>
                      </Box>

                      <Divider />
                      <Box bgcolor={"#2560FC1A"}>
                        <Box ml={3} mr={3} pl={1}>
                          <Box py={2}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  flexDirection: "column",
                                  gap: 1,
                                }}
                              >
                                <Typography className="booking-information">
                                  {t("sub_total")}
                                </Typography>
                                <Typography className="booking-information">
                                  {t("Tax")}
                                </Typography>
                                <Typography className="booking-information">
                                  {t("visiting_charge")}
                                </Typography>
                                {bookData.promo_code !== "" ? (
                                  <Typography className="booking-information">
                                    {t("promo_code_discount")}
                                  </Typography>
                                ) : (
                                  ""
                                )}
                                <Typography
                                  className="booking-information"
                                  fontWeight={"bold"}
                                >
                                  {t("total")}
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  flexDirection: "column",
                                  gap: 1,
                                }}
                              >
                                <Typography className="booking-information">
                                  {currency_symbol}
                                  {bookData.total}
                                </Typography>
                                <Typography className="booking-information">
                                  + {currency_symbol}
                                  {bookData.tax_amount}
                                </Typography>
                                <Typography className="booking-information">
                                  + {currency_symbol}
                                  {bookData.visiting_charges}
                                </Typography>
                                {bookData.promo_code !== "" ? (
                                  <Typography className="booking-information">
                                    - {currency_symbol}
                                    {bookData.promo_discount}
                                  </Typography>
                                ) : (
                                  ""
                                )}
                                <Typography
                                  className="booking-information"
                                  fontWeight={"bold"}
                                >
                                  {currency_symbol}
                                  {bookData.final_total}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  );
                })
              ) : (
                <Box
                  className="textaling-center minHeight-550"
                  display={"flex"}
                  flexDirection={"column"}
                  gap={3}
                >
                  <h2>{t("no_bookings_yet")}</h2>
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    textAlign={"center"}
                  >
                    <img
                      src={"/images/no-booking.png"}
                      height={"300px"}
                      width={"300px"}
                      alt="no bookings"
                    />
                  </Box>
                  <p>{t("book_first_service")}</p>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/providers")}
                  >
                    {t("explore")}
                  </Button>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>

        {open === true ? (
          <RatingModal
            open={open}
            setOpen={setOpen}
            service={service}
            company={company}
          />
        ) : (
          ""
        )}

        {/* Reshdule Order */}
        <Dialog
          maxWidth="lg"
          sx={{
            "& .MuiDialog-container": {
              "& .MuiPaper-root": {
                margin: {
                  xs: 1,
                },
              },
            },
            maxWidth: { xs: "100%", md: "100%" },
          }}
          open={openRescheduleDialog}
        >
          <DialogTitle>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Typography variant="h6">{t("order_reschedule")}</Typography>

              <IconButton
                aria-label="Close Button"
                onClick={(e) => setOpenRescheduleDialog(!openRescheduleDialog)}
              >
                <CloseOutlined />
              </IconButton>
            </Box>
          </DialogTitle>
          <Divider />
          <Box
            sx={{ width: { xs: "100%", md: 700 } }}
            display={"flex"}
            flexDirection={"column"}
            gap={3}
            m={1}
          >
            <Box>
              <FormLabel htmlFor="select_date"> {t("select_date")}</FormLabel>

              <Box sx={{ mt: 1 }}>
                <Calendar
                  value={
                    selectedCalendarDate
                      ? selectedCalendarDate
                      : dayjs(selectedDate)
                  }
                  onChange={(newValue) => {
                    setSelectedDate(dayjs(newValue).format("YYYY-MM-DD"));
                  }}
                  tileDisabled={({ date, view }) =>
                    shouldDisableDate(dayjs(date))
                  }
                  prev2Label={null} // Hide the "previous year" navigation label
                  next2Label={null} // Hide the "next year" navigation label
                />
              </Box>

              <FormLabel
                htmlFor="time"
                sx={{
                  py: "15px",
                }}
              >
                {" "}
                {t("select_time")}
              </FormLabel>
              <Box className="slot_data">
                {timeSlot && timeSlot?.length !== 0 ? (
                  timeSlot.map((slot, index) => (
                    <Box
                      key={slot.time}
                      sx={{
                        width: { xs: "46%", md: "15%" },
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        border: "1px solid",
                        borderRadius: "15px",
                        p: 1,
                        backgroundColor: slot.is_available === 0 ? "gray" : "",
                      }}
                    >
                      <Radio
                        checked={index === checked}
                        onChange={() => handleChange(slot, index)}
                        value={index}
                        name="radio-buttons"
                        inputProps={{ "aria-label": slot.time }}
                        disabled={slot.is_available === 0}
                        sx={{ p: "2px" }}
                      />
                      <Divider sx={{ width: "100%" }} />
                      <Box pt={"5px"} textAlign={"center"}>
                        <Typography variant="subtitle2">
                          {getTimeOfDay(slot.time)}
                        </Typography>
                        <Typography variant="body2">{slot.time}</Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    textAlign={"center"}
                  >
                    <Box>
                      <Card sx={{ boxShadow: "none" }}>
                        <CardMedia
                          component="img"
                          src="/images/no-booking.png"
                          alt="no time slot"
                          sx={{ width: 260, height: 260 }}
                        />
                      </Card>
                      <Typography variant="h6" sx={{ width: 260 }}>
                        {noSlotAvailable}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>

              <Box mt={2}>
                <Button
                  variant="contained"
                  onClick={(e) => handleScheduleChnage()}
                  disabled={submission == true ? true : false}
                  startIcon={
                    submission == true ? (
                      <FontAwesomeIcon icon={faSpinner} spin />
                    ) : (
                      ""
                    )
                  }
                >
                  {t("change_schedule")}{" "}
                </Button>
              </Box>
            </Box>
          </Box>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default SpecificService;
