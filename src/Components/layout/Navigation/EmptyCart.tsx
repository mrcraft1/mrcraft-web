import { Box } from "@mui/material";
import { t } from "i18next";
import React from "react";

const EmptyCart = () => {
  return (
    <div>
      <Box width={400}>
        <Box textAlign={"center"} mb={6}>
          <img
            className="empty-cart-img"
            alt="empty"
            src="https://img.freepik.com/free-vector/corrugated-box-white-background_1308-111117.jpg"
          />
          <h3>{t("no_products")}</h3>
          {t("your_cart_empty")}
          {t("login_and_add")}
          <h4 className="color-gray">{t("can_serve_you")}</h4>
        </Box>
      </Box>
    </div>
  );
};

export default EmptyCart;
