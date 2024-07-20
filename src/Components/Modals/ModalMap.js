import React, { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { GoogleMap, Marker } from "@react-google-maps/api";
import api from "../../API/apiCollection";
import { useDispatch } from "react-redux";
import {
  locationAddressData,
  setLatitude,
  setLongitude,
  setModalClose,
} from "../../redux/Location";
import { setProviderAvailable } from "../../redux/Provider";
import { getFormattedAddress } from "../../util/Helper";
import toast from "react-hot-toast";
import { Divider, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";
import { t } from "i18next";

const ModalMap = ({ open, setOpen, lat, lang, redirect }) => {
  const navigate = useNavigate();
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

  const mapRef = useRef(null);

  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState(open);
  const [latitude, setLatitudex] = useState(lat);
  const [longitude, setLongitudex] = useState(lang);

  const handleClose = () => {
    setOpen(false);
    setOpenModal(false);
    dispatch(setModalClose(false));
  };

  const containerStyle = {
    width: "100%",
    height: "500px",
  };

  const [markerPosition, setMarkerPosition] = useState({
    lat: parseFloat(lat),
    lng: parseFloat(lang),
  });

  // Function to handle map click event
  const handleMapClick = (event) => {
    // Update the marker's position when the map is clicked
    let latitude = event.latLng.lat();
    let longitude = event.latLng.lng();
    setLatitudex(latitude);
    setLongitudex(longitude);

    setMarkerPosition({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });

    // Update the map bounds to fit the new marker position
    const newBounds = new window.google.maps.LatLngBounds();
    newBounds.extend(markerPosition);
    mapRef.current.fitBounds(newBounds);

    // Adjust the zoom level after updating the bounds
    const zoomLevel = mapRef.current.getZoom();
    if (zoomLevel > 15) {
      mapRef.current.setZoom(15); // Set a maximum zoom level of 15
    }
  };

  const setLocation = async () => {
    try {
      const data = await api.providerAvailable({
        latitude: latitude,
        longitude: longitude,
        isCheckout: 0,
      });
      if (data?.error === false) {
        dispatch(setProviderAvailable(true));
        dispatch(setLatitude(latitude));
        dispatch(setLongitude(longitude));
        dispatch(setModalClose(false));
        const address = await getFormattedAddress(latitude, longitude);
        dispatch(locationAddressData(address));
        navigate("/");
      } else {
        toast.error("Our service is not available in this Area");
        if (redirect) {
          dispatch(setProviderAvailable(false));
          setOpen(false);
          setOpenModal(false);
          dispatch(setModalClose(false));
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkerDragEnd = (event) => {
    const { lat, lng } = event.latLng.toJSON();
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    const newPosition = { lat: parsedLat, lng: parsedLng };
    setMarkerPosition(newPosition);
    setLatitudex(parsedLat);
    setLongitudex(parsedLng);
  };

  const theme = useTheme();

  return (
    <Box>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            mt={1}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography variant="h6" color={theme.palette.text.primary}>
              {t("select_map_location")}
            </Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>
          <Divider sx={{ width: "100%", mb: 3 }} />

          <GoogleMap
            mapContainerStyle={containerStyle}
            center={markerPosition}
            zoom={10}
            onClick={handleMapClick}
            onLoad={(map) => (mapRef.current = map)}
            options={{
              streetViewControl: false,
            }}
          >
            <Marker
              position={markerPosition}
              draggable={true}
              onDragEnd={handleMarkerDragEnd}
            />
          </GoogleMap>

          <Button
            fullWidth
            sx={{ mt: 2 }}
            variant="contained"
            color="primary"
            onClick={(e) => setLocation()}
          >
            Use this location
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default ModalMap;
