import { CloseRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Typography,
  Dialog,
} from "@mui/material";
import React, { useState } from "react";
import { t } from "i18next";
import { useTheme } from "@emotion/react";
import AddressForm from "./AddressForm";
import { DrawerDynamicAddress } from "./DrawerDynamicAddress";

const Address = ({ onSelectAddress }) => {
  return (
    <div>
      <Box>
        <DrawerDynamicAddress onSelectAddress={onSelectAddress} />
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

        <Dialog
          open={openAdd}
          sx={{
            zIndex: 1101,
            width: "100%",
          }}
          maxWidth={"lg"}
          PaperProps={{
            sx: {
              overflow: {
                xs: "auto",
                sm: "auto",
                md: "hidden",
                lg: "hidden",
                xl: "hidden",
              },
            },
            className: "custom-paper-class",
          }}
        >
          <Box
            sx={{ background: theme.palette.background.box }}
            borderRadius={"10px"}
            padding={1}
            className="ddddd"
          >
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              className="rrrrrr"
            >
              <Typography variant="h6">{t("add_address")}</Typography>
              <IconButton className="mt-m1" onClick={handleCloseAdderss}>
                <CloseRounded />
              </IconButton>
            </Box>
            <Divider />
            <AddressForm closeModal={handleCloseAdderss} />
          </Box>
        </Dialog>
      </Box>
    </>
  );
};

export default Address;
