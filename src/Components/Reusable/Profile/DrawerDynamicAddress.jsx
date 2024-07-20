import {
  ArrowBackIosNewOutlined,
  BorderColorTwoTone,
} from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  Drawer,
  Grid,
  IconButton,
  MenuItem,
  Radio,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { t } from "i18next";
import { useTheme } from "@emotion/react";
import { MAP_API, handleClose } from "../../../config/config";
import api from "../../../API/apiCollection";
import { useDispatch, useSelector } from "react-redux";
import { setAddress } from "../../../redux/UserAddress";
import { setDeliveryAddress } from "../../../redux/DeliveryAddress";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import UpdateGoogleMapBox from "../../GoogleMap/UpdateGoogleAddress";
import toast from "react-hot-toast";

export const DrawerDynamicAddress = () => {
  const [addressSelected, setAddressSelected] = useState();

  const [deleteIndex, setDeleteIndex] = useState(null);

  const dispatch = useDispatch();

  const [openDrawer, setOpenDrawer] = useState(false);

  const [index, setIndex] = useState("");

  const userAddress = useSelector((state) => state.UserAddress).address;

  const filterAddress =
    userAddress && userAddress?.filter((item) => item.id === index);

  const [checkedRadio, setCheckRadio] = useState("");

  const [loading, setLoading] = useState(false);

  const [locationName, setLocationName] = useState();

  const [latitude, setLatitudex] = useState();

  const [longitude, setLongitudex] = useState();

  const [city, setCity] = useState();

  const [appartment, setAppartment] = useState();

  const [addressType, setAddressType] = useState();

  const [isDefault, setIsDefault] = useState(1);

  // Check if filterAddress has elements before accessing properties
  const editMobileInitialValue =
    filterAddress && filterAddress?.length > 0 ? filterAddress[0]?.mobile : "";

  const [editMobile, setEditMobile] = useState(editMobileInitialValue);

  const AddAddress = async () => {
    setLoading(true);
    await api
      .AddAddress({
        id: index,
        mobile: editMobile,
        address: locationName,
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
        if (result.message === "address not exist") {
          toast.error("Address not exist");
        }
        if (result.error === true) {
          for (var key of Object.keys(result.message)) {
            if (key === "address") toast.error("Address is required");
            if (key === "city_name") toast.error("City Name is required");
            if (key === "area") toast.error("Area/Appartment Name is required");
            if (key === "mobile") toast.error("Mobile Number is required");
            if (key === "type") toast.error("The type field is required");
          }
        } else {
          toast.success(result.message);
          await api.getAddress().then((res) => {
            setLoading(false);
            const defaultData = res?.data?.filter(
              (item) => item.is_default === "1"
            );
            dispatch(setDeliveryAddress(defaultData[0]));
            dispatch(setAddress(res.data));
            back();
          });
          handleClose(setOpenDrawer);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const back = () => {
    handleClose(setOpenDrawer);
  };

  const handleMobileChang = (e) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/\D/g, "");
    // Limit the input to a maximum of 16 characters
    if (numericValue?.length <= 16 || numericValue === "") {
      setEditMobile(numericValue);
    }
  };

  const handleDelete = (index) => {
    setDeleteIndex(index);
  };

  const handleDeleteClose = () => {
    setDeleteIndex(null);
  };

  const handleSelect = (index, address) => {
    setAddressSelected(address);
    setCheckRadio(address.id);
    dispatch(setDeliveryAddress(address));
  };

  const editAddressDrawer = (address) => {
    setOpenDrawer(!openDrawer);
    setIndex(address.id);
    setLocationName(address.address);
    setAppartment(address.area);
    setCity(address.city_name);
    setLongitudex(address.longitude);
    setLatitudex(address.lattitude);
    setEditMobile(address.mobile);
    setAddressType(address.type.toLowerCase());
    dispatch(setDeliveryAddress(address));

    if (address.is_default === "1") {
      setIsDefault(1);
    } else {
      setIsDefault(0);
    }
  };

  // Use useEffect to watch for changes in addressSelected and then update localStorage
  useEffect(() => {
    if (addressSelected !== undefined) {
      dispatch(setDeliveryAddress(addressSelected));
    }
  }, [addressSelected]);

  // to delete particular address
  const handleDeleteAddress = async (address_id) => {
    await api
      .DeleteAddress({ address_id: address_id })
      .then(async (result) => {
        toast.success(result.message);

        await api
          .getAddress()
          .then((response) => {
            dispatch(setAddress(response.data));
          })
          .catch((error) => console.log("error", error));
      })
      .catch((error) => console.log("error", error));
    handleDeleteClose();
  };

  const theme = useTheme();

  const handleLocationSelect = (address) => {
    setCity(address.city);
  };

  // set for first time default check
  useEffect(() => {
    const defaultAddress =
      userAddress && userAddress?.filter((item) => item.is_default === "1");
    setCheckRadio(defaultAddress[0]?.id);
    dispatch(setDeliveryAddress(defaultAddress[0]));
  }, []);

  const commonProps = { editLatitude: latitude, editLongitude: longitude };
  return (
    <Box
      sx={{
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      }}
      width={"100%"}
      alignContent={"center"}
    >
      <Grid container width={"100%"}>
        {userAddress?.length > 0 ? (
          userAddress?.map((address, index) => (
            <Grid item xs key={index} width={"100%"} sm={12} md={6}>
              <Box
                key={index}
                display={"block"}
                sx={{
                  mx: 1,
                  my: 2,
                  maxWidth: "100%",
                  border: "1px solid gray",
                  borderRadius: "10px",
                  p: 1,
                }}
              >
                <Box width={"100%"} textAlign={"center"} alignItems={"center"}>
                  <Grid container width={"100%"}>
                    <Grid
                      item
                      xs
                      width={"100%"}
                      display={"flex"}
                      sm={12}
                      md={6}
                      alignItems={"center"}
                      flexWrap={"wrap"}
                    >
                      <Typography
                        gutterBottom
                        variant="p"
                        component="div"
                        display={"flex"}
                        alignItems={"center"}
                      >
                        <Radio
                          checked={checkedRadio == address.id}
                          onChange={() => {
                            handleSelect(index, address);
                          }}
                          value={address.id}
                          name="radio-buttons"
                          inputProps={{ "aria-label": "A" }}
                        />
                        {address.city_name}
                      </Typography>
                      <Chip
                        variant="outlined"
                        size="small"
                        color="primary"
                        sx={{
                          width: "auto",
                          ml: 1,
                          borderRadius: "5px",
                          borderColor: "gray",
                        }}
                        label={address.type}
                      />
                    </Grid>
                    <Grid
                      item
                      width={"100%"}
                      sm={12}
                      md={6}
                      display={"flex"}
                      alignItems={"center"}
                      sx={{ mb: { sm: 2, md: 0 }, float: "right" }}
                    >
                      <Box
                        width={"100%"}
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"end"}
                      >
                        <IconButton
                          aria-label="edit"
                          size="small"
                          onClick={(e) => {
                            editAddressDrawer(address);
                          }}
                          sx={{
                            backgroundColor: "green",
                            color: "white",
                            mr: 1,
                            borderRadius: 2,
                            "&:hover": {
                              backgroundColor: "green",
                            },
                          }}
                        >
                          <BorderColorTwoTone fontSize="small" />
                        </IconButton>

                        <IconButton
                          aria-label="delete"
                          size="small"
                          sx={{
                            backgroundColor: "red",
                            color: "white",
                            mr: 1,
                            borderRadius: 2,
                            "&:hover": {
                              backgroundColor: "red",
                            },
                          }}
                          onClick={() => handleDelete(index)}
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                        </IconButton>
                      </Box>

                      <Backdrop open={deleteIndex === index}>
                        <Box
                          sx={{ background: theme.palette.background.box }}
                          p={4}
                        >
                          <Typography>{t("delete_address")}</Typography>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleDeleteAddress(address.id)}
                          >
                            {t("delete")}
                          </Button>
                          <Button onClick={handleDeleteClose}>
                            {t("close")}
                          </Button>
                        </Box>
                      </Backdrop>
                    </Grid>
                  </Grid>
                </Box>
                <Typography color="text.secondary" variant="body2" p={1}>
                  {address.address}
                </Typography>
                <Typography color="text.secondary" variant="body2" p={1}>
                  {address.mobile}
                </Typography>
              </Box>
            </Grid>
          ))
        ) : (
          <Box width={"100%"}>
            <Typography py={4} width={"100%"} textAlign={"center"}>
              {t("no_address")}
            </Typography>
          </Box>
        )}
      </Grid>
      <Drawer
        open={openDrawer}
        anchor="right"
        sx={{
          display: { xs: "block", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: { md: 580, xs: "100%" },
          },
        }}
      >
        <Box>
          <Box mt={1} mb={1} display={"flex"} alignItems={"center"}>
            <IconButton onClick={back}>
              <ArrowBackIosNewOutlined />
            </IconButton>
            <h3>{t("complete_address")}</h3>
          </Box>
          <Divider />
          <UpdateGoogleMapBox
            apiKey={MAP_API}
            onSelectLocation={handleLocationSelect}
            {...commonProps}
          />
          <Box p={2}>
            <Box>
              <Typography>{t("house_flat")}</Typography>
              <TextField
                placeholder="Enter House no"
                fullWidth
                className="address-form"
                value={locationName}
                sx={{
                  mb: 2,
                  backgroundColor: theme.palette.background.input,
                }}
                onChange={(e) => setLocationName(e.target.value)}
              />
              <Typography>{t("appartment_road")}</Typography>
              <TextField
                id="apartment"
                placeholder="Enter Road Name"
                fullWidth
                defaultValue={appartment}
                sx={{
                  mb: 2,
                  backgroundColor: theme.palette.background.input,
                }}
                onChange={(e) => setAppartment(e.target.value)}
                className="address-form"
              />
              <Typography>{t("city")}</Typography>
              <TextField
                id="city"
                placeholder="Enter City Name"
                value={city}
                sx={{
                  mb: 2,
                  backgroundColor: theme.palette.background.input,
                }}
                onChange={(e) => setCity(e.target.value)}
                fullWidth
                className="address-form"
              />
              <Typography>{t("mobile")}</Typography>
              <TextField
                id="mobile"
                placeholder="Enter Mobile Number"
                fullWidth
                className="address-form"
                value={editMobile}
                required
                sx={{
                  mb: 2,
                  backgroundColor: theme.palette.background.input,
                }}
                onChange={handleMobileChang}
                inputProps={{
                  pattern: "[0-9]*", // Allow only numeric input
                  inputMode: "numeric", // Display numeric keyboard on mobile devices
                }}
              />
            </Box>
            <Box display={"flex"} gap={3}>
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
                    checked={isDefault == 0 ? false : true}
                    onClick={(e) => setIsDefault(!isDefault)}
                  />
                  <Typography>{t("default_address")}</Typography>
                </Box>
              </Box>
            </Box>

            <Button
              variant="contained"
              fullWidth
              className="address-form"
              onClick={(e) => AddAddress(e)}
              disabled={loading === true ? true : false}
            >
              {loading === true ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                ""
              )}
              {t("continue")}
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};
