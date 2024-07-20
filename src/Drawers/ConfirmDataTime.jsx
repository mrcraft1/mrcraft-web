import {
  Add,
  ArrowBackIosNewOutlined,
  CloseRounded,
} from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  Divider,
  FormLabel,
  IconButton,
  Radio,
  Typography,
  useTheme,
  Card,
  CardMedia,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { handleClose, handleOpen } from "../config/config";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { t } from "i18next";
import Calendar from "react-calendar";
import api from "../API/apiCollection";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { dateDetails, slotDetails } from "../redux/orderCartDetails";
import "react-calendar/dist/Calendar.css";

const ConfirmDateTime = ({ setForm, isSelectSlote }) => {
  function back() {
    handleClose(isSelectSlote);
    handleOpen(setForm);
  }

  const dispatch = useDispatch();

  const [checked, setchecked] = useState();
  const [timeSlot, setTimeSlot] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [customTime, setCustomTime] = useState(false);
  const [customTimeValue, setCustomTimeValue] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  const orderDetails = useSelector(
    (state) => state.OrderCartDetails
  )?.orderDetails;

  const [noSlotAvailable, setNoSlotAvailable] = useState("");
  const baseCart = useSelector((state) => state.cart)?.base_cart;

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        const partner_id = baseCart && baseCart.provider_id;
        const date = dayjs(selectedDate).format("YYYY-MM-DD");
        const response = await api.get_available_slot({
          partner_id: partner_id,
          selectedDate: date,
        });
        setTimeSlot(response?.data?.all_slots);
        setNoSlotAvailable(response?.message);
        setCustomTimeValue("");
        // if there is an error with the slots
        if (response.error) {
          toast.error(response.message);
          setNoSlotAvailable(response.message);
          setCustomTimeValue("");
        }
      } catch (error) {
        setNoSlotAvailable("");
        console.log("error", error);
      }
    };

    fetchAvailableSlots();
    // eslint-disable-next-line
  }, [selectedDate]);

  const theme = useTheme();
  const customSelectedTime = orderDetails && orderDetails.slot;
  const selectedCalendarDate = orderDetails && orderDetails.date;

  const advanceBookingDays = baseCart && baseCart.advance_booking_days;
  const disableDateAfter = dayjs().add(advanceBookingDays - 1, "day");

  const shouldDisableDate = (date) => {
    const today = dayjs().startOf("day"); // Get the start of today
    return date.isBefore(today) || date.isAfter(disableDateAfter);
  };

  const handleChange = (event, slot) => {
    setchecked(slot);
    setCustomTimeValue(event);
    dispatch(slotDetails(event.time));
    setSelectedTimeSlot(event.time);
  };

  const customTimeSelected = () => {
    handleOpen(setCustomTime);
  };

  const handleCustomTime = () => {
    // eslint-disable-next-line
    dispatch(slotDetails(customTimeValue));
    handleClose(setCustomTime);
  };

  const handleTimeChange = (selectedTime) => {
    const formattedTime = selectedTime && selectedTime.format("HH:mm:ss");
    setCustomTimeValue(formattedTime); // Format time
  };

  const OpenNext = () => {
    if (selectedTimeSlot === "" && customSelectedTime === "") {
      return toast.error("Please select Time From available slots");
    }
    dispatch(dateDetails(selectedDate));
    handleClose(isSelectSlote);
    handleOpen(setForm);
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

  const calenderDateSelect = (value) => {
    setSelectedDate(dayjs(value).format("YYYY-MM-DD"));
  };

  return (
    <Box>
      <Box
        mt={1}
        mb={1}
        fontWeight={"bolder"}
        display={"flex"}
        alignItems={"center"}
      >
        <IconButton
          onClick={back}
          sx={{ fontSize: "28px" }}
          fontWeight={"bolder"}
        >
          <ArrowBackIosNewOutlined />
        </IconButton>
        <Typography fontWeight={"bolder"} variant="h6">
          {t("from")} {baseCart && baseCart.company_name}
        </Typography>
      </Box>
      <Divider />

      <Box
        mt={2}
        mb={2}
        p={2}
        borderRadius={3}
        overflow={"auto"}
        display={"block"}
      >
        <Box mb={2}>
          <FormLabel>{t("select_date")}</FormLabel>
        </Box>

        <Box sx={{ borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}>
          <Typography
            p={2}
            className="select-calendar-heading"
            sx={{ borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}
          >
            {t("preferred_date")}
          </Typography>
        </Box>
        <Box display={"flex"} justifyContent={"center"}>
          <Calendar
            value={
              selectedCalendarDate ? selectedCalendarDate : dayjs(selectedDate)
            }
            onChange={(newValue) => {
              calenderDateSelect(newValue);
            }}
            prev2Label={null} // Hide the "previous year" navigation label
            next2Label={null} // Hide the "next year" navigation label
            tileDisabled={({ date, view }) => shouldDisableDate(dayjs(date))}
          />
        </Box>
      </Box>
      {timeSlot && timeSlot?.length !== 0 ? (
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          p={2}
        >
          <Typography>{t("select_time")}</Typography>
          <Box>
            <Button onClick={customTimeSelected} sx={{ textTransform: "none" }}>
              {customSelectedTime ? (
                "Selected Time: " + customSelectedTime
              ) : (
                <>
                  {" "}
                  <Add /> {t("custom_time")}
                </>
              )}
            </Button>
          </Box>
        </Box>
      ) : (
        ""
      )}

      <Backdrop
        open={customTime}
        sx={{
          zIndex: 1,
        }}
      >
        <Box
          display={"block"}
          sx={{
            background: theme.palette.background.box,
            p: 3,
            borderRadius: 3,
          }}
        >
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            mb={1}
          >
            <Typography>{t("select_time")}</Typography>
            <IconButton onClick={() => handleClose(setCustomTime)}>
              <CloseRounded />
            </IconButton>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            flexDirection={"column"}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="Select Time"
                onChange={handleTimeChange} // Call the function when time is changed
              />
            </LocalizationProvider>

            <Button size="small" sx={{ mt: 1 }} onClick={handleCustomTime}>
              {t("submit")}
            </Button>
          </Box>
        </Box>
      </Backdrop>

      <Box className="slot_data drawer_slot p-3">
        {timeSlot && timeSlot?.length !== 0 ? (
          timeSlot.map((slot, index) => (
            <Box
              key={slot.time}
              sx={{
                width: { xs: "46%", md: "23%" },
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
            mt={-2}
            alignItems={"center"}
            textAlign={"center"}
            margin={"auto"}
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

      <Box p={2}>
        <Button variant="contained" fullWidth onClick={() => OpenNext()}>
          {t("continue")}
        </Button>
      </Box>
    </Box>
  );
};

export default ConfirmDateTime;
