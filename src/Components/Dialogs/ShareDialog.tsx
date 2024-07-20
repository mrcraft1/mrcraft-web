import React, { useState } from "react";
import { WhatsappIcon } from "react-share";
import { Box, Dialog, DialogTitle } from "@mui/material";
import { t } from "i18next";
import { ShareDialogProps } from "../../typescriptTypes/globalTypes";

const ShareDialog: React.FC<ShareDialogProps> = ({ open, setOpen }) => {
  const [isOpen, setIsOpen] = useState<boolean>(open);

  const handleClose = (): void => {
    setIsOpen(false);
    setOpen(false);
  };

  return (
    <Dialog onClose={handleClose} open={isOpen}>
      <Box>
        <DialogTitle>{t("share_provider_services")}</DialogTitle>
        <WhatsappIcon xlinkTitle="Share" size={32} round={true} />
      </Box>
    </Dialog>
  );
};

export default ShareDialog;