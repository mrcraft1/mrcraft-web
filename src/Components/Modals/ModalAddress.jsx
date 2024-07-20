import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import api from "../../API/apiCollection";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  Checkbox,
  Divider,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { t } from "i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { setAddress } from "../../redux/UserAddress";
import { MAP_API } from "../../config/config";
import UpdateGoogleMapBox from "../GoogleMap/UpdateGoogleAddress";
import { useTheme } from "@emotion/react";

const ModalAddress = ({ open, setOpen, selectedAddress }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", md: "60%" },
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: "var(--global-border-radius)",
    p: 2,
  };
  const theme = useTheme();
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(open);
  const [latitude, setLatitudex] = useState(
    parseFloat(selectedAddress[0]?.lattitude)
  );
  const [longitude, setLongitudex] = useState(
    parseFloat(selectedAddress[0]?.longitude)
  );
  const [locationName, setLocationName] = useState(selectedAddress[0]?.address);
  const [city, setCity] = useState(selectedAddress[0]?.city_name);
  const [mobile, setmobile] = useState(selectedAddress[0]?.mobile);
  const [appartment, setAppartment] = useState(selectedAddress[0]?.area);
  const [addressType, setAddressType] = useState(
    selectedAddress[0]?.type.toLowerCase()
  );
  const [isDefault, setIsDefault] = useState(
    selectedAddress[0]?.is_default === "1" ||
      selectedAddress[0]?.is_default === 1
      ? true
      : false
  );
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setOpenModal(false);
  };

  const setLocation = async (e) => {
    await api
      .AddAddress({
        id: selectedAddress[0]?.id,
        mobile: mobile,
        address: locationName,
        city_id: 0,
        city_name: city,
        latitude: latitude,
        longitude: longitude,
        area: appartment,
        type: addressType,
        country_code: 91,
        is_default: isDefault ? 1 : 0,
      })
      .then(async (result) => {
        setLoading(false);
        if (result.error) {
          for (var key of Object.keys(result.message)) {
            if (key === "address") toast.error("Address is required");
            if (key === "city_name") toast.error("City Name is required");
            if (key === "area") toast.error("Area/Appartment Name is required");
            if (key === "mobile") toast.error("Mobile Number is required");
          }
        } else {
          setLocationName("");
          setAppartment("");
          setmobile("");
          setCity("");

          await api
            .getAddress()
            .then((res) => {
              dispatch(setAddress(res?.data));
              setLoading(false);
            })
            .then((e) => {
              handleClose();
            });
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleMobileChang = (e) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/\D/g, "");
    // Limit the input to a maximum of 16 characters
    if (numericValue?.length <= 16 || numericValue === "") {
      setmobile(numericValue);
    }
  };

  const handleLocationSelect = (address) => {
    let latitude = address?.lat;
    let longitude = address?.lng;
    setLatitudex(latitude);
    setLongitudex(longitude);
    setAppartment(address?.areaName);
    // setLocationName(address?.formatted_address);
    setCity(address?.city);
  };

  const commonProps = { editLatitude: latitude, editLongitude: longitude };

  return (
    <Box>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="updateAddressModal">
          <Box
            mt={1}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography color={theme.palette.text.primary} variant="h6">
              {t("update_address")}
            </Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>
          <Divider sx={{ width: "100%", mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <>
                <UpdateGoogleMapBox
                  apiKey={MAP_API}
                  onSelectLocation={handleLocationSelect}
                  {...commonProps}
                />
              </>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography
                  ml={1}
                  gutterBottom
                  color={theme.palette.text.primary}
                >
                  {t("provide_additional")}
                </Typography>
                <Box display={"flex"} flexWrap={"wrap"}>
                  <div>
                    <FormControl
                      className="m-1-w-52"
                      sx={{ mb: 2 }}
                      fullWidth
                      variant="outlined"
                    >
                      <OutlinedInput
                        id="area"
                        value={locationName}
                        onChange={(e) => {
                          setLocationName(e.target.value);
                        }}
                        required
                        placeholder="House/ Flat/ Block"
                      />
                    </FormControl>

                    <FormControl
                      className="m-1-w-52"
                      sx={{ mb: 2 }}
                      fullWidth
                      variant="outlined"
                    >
                      <OutlinedInput
                        id="appartment"
                        placeholder="Appartment/ Road/ Area"
                        value={appartment}
                        onChange={(e) => setAppartment(e.target.value)}
                      />
                    </FormControl>
                    <FormControl
                      className="m-1-w-52"
                      sx={{ mb: 2 }}
                      fullWidth
                      variant="outlined"
                    >
                      <OutlinedInput
                        id="city"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </FormControl>
                    <FormControl className="m-1-w-52" sx={{ mb: 2 }} fullWidth>
                      <OutlinedInput
                        id="mobile"
                        placeholder="Mobile no"
                        value={mobile}
                        type="tel"
                        required
                        inputProps={{
                          min: 0,
                          maxLength: 16,
                          pattern: "[0-9]*",
                        }}
                        onChange={handleMobileChang}
                      />
                    </FormControl>
                  </div>
                  <Box width={"100%"}>
                    <TextField
                      select
                      label=""
                      id="location-type"
                      className="m-1-w-52"
                      sx={{ mb: 2 }}
                      fullWidth
                      placeholder="type"
                      value={addressType}
                      defaultValue="home"
                      onChange={(e) => setAddressType(e.target.value)}
                    >
                      <MenuItem value="home" selected={true}>
                        {t("home")}
                      </MenuItem>
                      <MenuItem value="office">{t("office")}</MenuItem>
                      <MenuItem value="other">{t("other")}</MenuItem>
                    </TextField>
                    <Box alignItems={"center"} display={"flex"}>
                      <Checkbox
                        checked={isDefault}
                        onClick={(e) => setIsDefault(!isDefault)}
                      />
                      <Typography color={theme.palette.text.primary}>
                        {t("default_address")}
                      </Typography>
                    </Box>
                  </Box>
                  <Box width={"52ch"}>
                    <Button
                      fullWidth
                      sx={{ mt: 2, textTransform: "none" }}
                      variant="contained"
                      color="primary"
                      onClick={(e) => setLocation()}
                      disabled={loading === true ? true : false}
                    >
                      {loading === true ? (
                        <FontAwesomeIcon icon={faSpinner} spin />
                      ) : (
                        ""
                      )}
                      {t("location_update")}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
};

export default ModalAddress;
