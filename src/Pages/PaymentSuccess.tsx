import React from "react";
import { Paper, Typography, Button, Box } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { t } from "i18next";
import { useNavigate } from "react-router";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const backToHome = () => {
    navigate("/")
  }
  return (
    <Paper elevation={3} sx={{ padding: "24px" }}>
      <Box display="flex" alignItems="center">
        <CheckIcon sx={{ fontSize: "48px", color: "green" }} />
        <Typography variant="h4" component="h1" sx={{ marginLeft: "16px" }}>
          {t("payment_succesfull")}
        </Typography>
      </Box>
      <Typography sx={{ marginTop: "16px" }}>
        {t("payment_successfully_procced")}
      </Typography>
      <Button onClick={() => backToHome()} variant="contained" color="secondary" sx={{ marginTop: "16px" }}>
        {t("back_to_home")}
      </Button>
    </Paper>
  );
};

export default PaymentSuccess;
