/*eslint no-empty-pattern: 0*/
import { CloseRounded } from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { t } from "i18next";
import { useTheme } from "@emotion/react";
import AddressForm from "../Profile/AddressForm";
import { DynamicAddress } from "../Profile/DynamicAddress";

const ViewAddress = () => {
  return (
    <div>
      <Box>
        <DynamicAddress />
      </Box>
    </div>
  );
};

export const AddAddress = () => {
  const [openAdd, isOpenAdd] = useState(false);

  const handleOpenAddress = () => {
    isOpenAdd(true);
  };

  const handleCloseAdderss = () => {
    isOpenAdd(false);
  };

  const theme = useTheme();

  return (
    <>
      <Box mx={2}>
        <Button
          variant="outlined"
          className="mt-3-h-100"
          fullWidth
          onClick={handleOpenAddress}
        >
          +{t("add_address")}
        </Button>

        <Backdrop open={openAdd} sx={{ zIndex: 20000 }}>
          <Box
            sx={{ background: theme.palette.background.box }}
            width={"1000px"}
            borderRadius={"10px"}
            padding={1}
          >
            <Box display={"flex"} justifyContent={"space-between"}>
              <Typography>{t("add_address")}</Typography>
              <IconButton className="mt-m1" onClick={handleCloseAdderss}>
                <CloseRounded />
              </IconButton>
            </Box>
            <Divider />
            <AddressForm closeModal={handleCloseAdderss} />
          </Box>
        </Backdrop>
      </Box>
    </>
  );
};

export default ViewAddress;
