import { AccessTime } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Typography,
  Grid,
  CardMedia,
  useTheme,
} from "@mui/material";
import { t } from "i18next";
import React from "react";
import { useSelector } from "react-redux";
import { getStatusClassName } from "../../../../util/Helper";

const Book = ({ bookData }) => {
  let settings = useSelector((state) => state.Settings)?.settings;

  const currency_symbol = settings?.app_settings?.currency;

  const theme = useTheme();


  return (
    <Box width={"100%"}>
      <Grid spacing={3} container>
        <Grid item sm={12} md={2} sx={{ maxWidth: "100%" }}>
          <Box sx={{ maxHeight: "100%", maxWidth: "100%", p: 2 }}>
            <CardMedia
              title="this title"
              component={"img"}
              src={bookData.profile_image}
              image={bookData.profile_image}
              sx={{
                objectFit: "cover",
                width: { xs: "100%", md: 100 },
                height: "100%",
              }}
            />
          </Box>
        </Grid>
        <Grid item sm={12} md={7}>
          <Box display={"block"} sx={{ ml: { xs: 0, md: 2 } }} p={2}>
            <Typography variant="h5" fontWeight={"bold"}>
              {bookData.partner}
            </Typography>
            <Box display={"flex"} gap={1}>
              <Typography variant="body1" color={"gray"}>
                {t("invoice")}:
              </Typography>
              <Typography
                variant="body1"
                fontWeight={"medium"}
                color={theme?.palette?.primary?.main}
              >
                {bookData.invoice_no}
              </Typography>
            </Box>

            <Typography
              fontWeight={"bold"}
              color={theme?.palette?.primary?.main}
              mt={0.2}
            >
              {currency_symbol}
              {bookData.final_total}
            </Typography>
          </Box>
        </Grid>
        <Grid item sm={12} md={3}>
          <Box px={1} py={2} sx={{ float: "right", mr: "10px" }}>
            <Box display={"flex"} flexDirection={"column"}>
              <Button
                variant="outlined"
                size="small"
                sx={{ borderColor: "#BFC1C9" }}
                className={`${getStatusClassName(bookData.status)}`}
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
                //     ? "secondary"
                //     : "info"
                // }
              >
                {bookData.status}
              </Button>
              {settings.otp_system === 1 || settings.otp_system === "1" ? (
                <Box display={"flex"} gap={1}>
                  <Typography variant="subtitle2" color={"gray"}>
                    {t("otp")}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    fontWeight={"medium"}
                    color={theme?.palette?.primary?.main}
                  >
                    {bookData.otp}
                  </Typography>
                </Box>
              ) : (
                ""
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Divider />

      <Box mt={1} ml={3} mr={3} pl={1}>
        <Box mt={2} mb={2}>
          {bookData.services.map((service) => {
            return (
              <Typography color={"gray"} key={service.id}>
                {service.quantity} * {service.service_title}
              </Typography>
            );
          })}
        </Box>
      </Box>
      <Divider />

      <Box pl={2}>
        <Box display={"flex"} alignItems={"start"} gap={2} py={2}>
          <Box>
            <AccessTime />
          </Box>
          <Box display={"flex"} flexDirection={"column"}>
            <Typography fontWeight={"bold"} variant="body1">
              {bookData.new_start_time_with_date}
            </Typography>
            <Typography color={"gray"} fontWeight={"light"} variant="subtitle2">
              {t("schedule")}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Book;
