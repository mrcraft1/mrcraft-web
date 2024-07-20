/* eslint eqeqeq: 0 */
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  Grid,
  MenuItem,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MAP_API } from "../../../config/config";
import { t } from "i18next";
import api from "../../../API/apiCollection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import GoogleMapBox from "../../GoogleMap/GoogleMapBox";
import { useDispatch } from "react-redux";
import { setAddress } from "../../../redux/UserAddress";

const AddressForm = ({ closeModal }) => {
  const [mobile, setmobile] = useState(null);
  const [isDefault, setIsDefault] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedLocationAddress, setSelectedLocationAddress] = useState("");
  const [addressType, setAddressType] = useState("home");
  const [locationName, setLocationName] = useState("");
  const [appartment, setAppartment] = useState("");
  const [city, setCity] = useState("");
  const dispatch = useDispatch();

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
            if (key == "address") toast.error("Address is required");
            if (key == "city_name") toast.error("City Name is required");
            if (key == "area") toast.error("Area/Appartment Name is required");
            if (key == "mobile") toast.error("Mobile Number is required");
          }
        } else {
          setmobile("");
          await api
            .getAddress()
            .then((res) => {
              setLoading(false);
              dispatch(setAddress(res.data));
            })
            .then((e) => {
              closeModal();
            });
        }
      })
      .catch((error) => console.log("error", error));
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
    setSelectedLocationAddress(address);
  };

  useEffect(() => {}, [dispatch]);

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography>{t("click_drag_map_pointer")}</Typography>

          <Box sx={{ height: "100%", maxHeight: "100%" }}>
            <GoogleMapBox
              apiKey={MAP_API}
              onSelectLocation={handleLocationSelect}
            />
            {/* <Box ref={mapRefe} sx={{ height: "550px", maxHeight: "100%" }} id="map-1" className=""></Box> */}
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box>
            <Typography ml={1} gutterBottom>
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
      </Grid>
    </div>
  );
};

export default AddressForm;
