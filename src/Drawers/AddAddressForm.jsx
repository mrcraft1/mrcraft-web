import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { t } from "i18next";
import api from "../API/apiCollection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import { useDispatch, useSelector } from "react-redux";
import { setAddress } from "../redux/UserAddress";
import { MAP_API, handleClose, handleOpen } from "../config/config";
import GoogleMapBox from "../Components/GoogleMap/GoogleMapBox";
import { ArrowBackIosNewOutlined } from "@mui/icons-material";
import { setDeliveryAddress } from "../redux/DeliveryAddress";

const AddressForm = ({ setForm, addAddress }) => {
  const [mobile, setmobile] = useState(null);
  const [isDefault, setIsDefault] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedLocationAddress, setSelectedLocationAddress] = useState("");
  const [addressType, setAddressType] = useState("home");
  const [locationName, setLocationName] = useState("");
  const [appartment, setAppartment] = useState("");
  const [city, setCity] = useState("");
  const dispatch = useDispatch();

  const userAddress = useSelector((state) => state.UserAddress).address;

  const isGetDefault =
    userAddress && userAddress?.filter((item) => item.is_default === "1");

  //when user fire add address button to submit request on api
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    handleAddAddress();
  };

  //when user fire add address button to submit request on api
  const handleAddAddress = async () => {
    await api
      .AddAddress({
        mobile: mobile,
        address: locationName,
        city_name: selectedLocationAddress?.city
          ? selectedLocationAddress?.city
          : city,
        latitude: selectedLocationAddress?.lat,
        longitude: selectedLocationAddress?.lng,
        area: appartment,
        type: addressType,
        is_default: isDefault ? 1 : 0,
      })
      .then(async (result) => {
        setLoading(false);
        if (result.error) {
          for (let key of Object.keys(result.message)) {
            // eslint-disable-next-line
            if (key == "address") toast.error("Address is required");
            // eslint-disable-next-line
            if (key == "city_name") toast.error("City Name is required");
            // eslint-disable-next-line
            if (key == "area") toast.error("Area/Appartment Name is required");
            // eslint-disable-next-line
            if (key == "mobile") toast.error("Mobile Number is required");
          }
        } else {
          setmobile("");
          await api
            .getAddress()
            .then((res) => {
              setLoading(false);
              const defaultData = res?.data?.filter(
                (item) => item.is_default === "1"
              );
              dispatch(setDeliveryAddress(defaultData[0]));
              dispatch(setAddress(res.data));
            })
            .then((e) => {
              back();
            });
        }
      })
      .catch((error) => console.log("error", error));
  };

  function back() {
    handleOpen(setForm);
    handleClose(addAddress);
  }

  const handleMobileChang = (e) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/\D/g, "");
    // Limit the input to a maximum of 16 characters
    if (numericValue?.length <= 16 || numericValue === "") {
      setmobile(numericValue);
    }
  };

  const handleLocationSelect = (address) => {
    setSelectedLocationAddress(address);
  };

  useEffect(() => {
    dispatch(setDeliveryAddress(isGetDefault[0]));
  }, []);

  return (
    <Box>
      <Box mt={1} mb={1} display={"flex"} alignItems={"center"}>
        <IconButton onClick={back}>
          <ArrowBackIosNewOutlined />
        </IconButton>
        <h3>{t("complete_address")}</h3>
      </Box>
      <Divider />
      <Grid item xs={12} md={6} p={2}>
        <Box>
          <Box sx={{ height: "100%", maxHeight: "100%" }}>
            <GoogleMapBox
              apiKey={MAP_API}
              onSelectLocation={handleLocationSelect}
            />
            {/* <Box ref={mapRefe} sx={{ height: "550px", maxHeight: "100%" }} id="map-1" className=""></Box> */}
          </Box>
          <Box mt={2} display={"flex"} flexWrap={"wrap"}>
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
                  value={
                    selectedLocationAddress?.city
                      ? selectedLocationAddress?.city
                      : city
                  }
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
                  inputProps={{ min: 0, maxLength: 16, pattern: "[0-9]*" }}
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
                <Typography>{t("default_address")}</Typography>
              </Box>
            </Box>
            <Box width={"52ch"}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                className="address-btn"
                fullWidth
                disabled={loading}
              >
                {loading && <FontAwesomeIcon icon={faSpinner} spin />}
                {t("add_address_button")}
              </Button>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default AddressForm;
