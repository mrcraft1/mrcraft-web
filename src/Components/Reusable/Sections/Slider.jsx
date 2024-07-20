import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  TextField,
  Skeleton,
  Autocomplete,
  IconButton,
} from "@mui/material";
import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper";
import "swiper/swiper.min.css";
import "swiper/css/navigation";
import { Search } from "@mui/icons-material";
import { useTheme } from "@emotion/react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import slugify from "slugify";
import { useSelector, useDispatch } from "react-redux";
import {
  locationAddressData,
  setLatitude,
  setLongitude,
  setModalOpen,
} from "../../../redux/Location";
import { getFormattedAddress } from "../../../util/Helper";
import ModalMap from "../../Modals/ModalMap";
import { useLoadScript } from "@react-google-maps/api";
import { MAP_API } from "../../../config/config";
import CloseIcon from "@mui/icons-material/Close";
import { t } from "i18next";

const libraries = ["places"];

const SwiperHome = ({ sliderData, loading }) => {
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const location = useSelector((state) => state.Location);
  const theme = useTheme();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState(location.locationAddress || "");
  const [suggestions, setSuggestions] = useState([]);
  const [providerSearchValue, setProviderSearchValue] = useState("");
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: MAP_API,
    libraries,
  });

  const fetchLocationName = (lat, lng) => {
    getFormattedAddress(lat, lng).then((res) => {
      dispatch(locationAddressData(res));
    });
  };

  const handleMapData = async (description) => {
    try {
      if (!description) return; // Early return if description is falsy

      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        description
      )}&key=${MAP_API}`;

      const response = await fetch(geocodeUrl);
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      const { results } = data;

      if (results?.length === 0) {
        toast.error("Pick another Location");
        return;
      }

      const { lat, lng } = results[0].geometry.location;
      dispatch(setLatitude(lat));
      dispatch(setLongitude(lng));
      fetchLocationName(lat, lng);
      dispatch(setModalOpen(true));
    } catch (error) {
      console.error(error);
      // Handle error appropriately here, e.g., show an error message to the user
    }
  };

  const handleSearchInputChange = (event) => {
    const { value } = event.target;
    setProviderSearchValue(value);
  };

  useEffect(() => {
    if (isLoaded && !loadError) {
      const autocompleteService =
        new window.google.maps.places.AutocompleteService();

      const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);

        if (value) {
          autocompleteService.getPlacePredictions(
            { input: value },
            (predictions, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                setSuggestions(predictions);
              } else {
                setSuggestions([]);
              }
            }
          );
        } else {
          setSuggestions([]);
        }
      };

      const inputElement = inputRef.current;

      if (inputElement) {
        inputElement.addEventListener("input", handleInputChange);
      }

      return () => {
        if (inputElement) {
          inputElement.removeEventListener("input", handleInputChange);
        }
      };
    }
  }, [isLoaded, loadError]);

  const handleSuggestionClick = (suggestion) => {
    const { description } = suggestion;
    setInputValue(description);
    setSuggestions([]);
    handleMapData(description);
  };

  useEffect(() => {
    if (location.modalOpen) {
      setOpen(true);
    }
    // eslint-disable-next-line
  }, [location.modalOpen]);

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  const handleSearch = () => {
    try {
      if (providerSearchValue !== "") {
        navigate(
          "/search-and-provider/" +
            slugify(providerSearchValue, { lower: true })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Box display={{ md: "block" }}>
        <Container sx={{ my: 5 }} className="mainContainer">
          <Box
            position={"relative"}
            mt={5}
            overflow={"hidden"}
            borderRadius={"10px"}
            className="object-fit"
            sx={{ maxWidth: { sx: "200px", md: "100%" } }}
          >
            <Swiper
              navigation={true}
              modules={[Navigation, Autoplay]}
              className="mySwiper max-h-500"
              loop={true}
              autoplay={{ delay: 3000 }}
              
            >
              {loading ? (
                <Skeleton
                  variant="rectangular"
                  height={"500px"}
                  width={"100%"}
                />
              ) : (
                <Swiper
                  navigation={true}
                  modules={[Navigation]}
                  className="mySwiper max-h-500"
                >
                  {sliderData.map((response) => {
                    const type = response.type;
                    const type_id = response.type_id;
                    return (
                      <SwiperSlide key={response.id}>
                        {type === "Category" && type_id !== "0" ? (
                          <Link
                            to={
                              "./categories/" +
                              response.type_id +
                              "/" +
                              slugify(response.category_name, { lower: true })
                            }
                          >
                            <Box
                              component={"img"}
                              src={response.slider_image}
                              width={"100%"}
                              sx={{
                                objectFit: {xs:"cover",md:"fill"},
                                height: { xs: "200px", md: "100%" },
                                borderRadius:{xs:"10px"}
                              }}
                               className="object-fit"
                            />
                          </Link>
                        ) : (
                          <Box
                            component={"img"}
                            src={response.slider_image}
                            width={"100%"}
                            sx={{
                              objectFit: {xs:"cover",md:"fill"},
                              height: { xs: "200px", md: "512px" },
                              borderRadius:{xs:"10px"}
                            }}
                             className="object-fit"
                          />
                        )}
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              )}
            </Swiper>
          </Box>
          <Box
            sx={{
              marginTop: {
                xs: "20px",
                md: "-20px",
              },
            }}
            alignItems={"center"}
            justifyContent={"center"}
            display={"flex"}
            position={"relative"}
          >
            <Paper
              component="form"
              className="swiper-paper"
              sx={{
                backgroundColor: theme.palette.background.input,
              }}
            >
              <Autocomplete
                sx={{ width: "100%" }}
                freeSolo
                options={suggestions.map(
                  (suggestion) => suggestion.description
                )}
                clearIcon={
                  <IconButton
                    sx={{
                      width: "1.5rem",
                      height: "1.5rem",
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    inputRef={inputRef}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={"Search Location, Area or City"}
                    InputProps={{
                      ...params.InputProps,
                      disableUnderline: true,
                    }}
                  />
                )}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                onChange={(event, value) => {
                  const selectedSuggestion = suggestions.find(
                    (suggestion) => suggestion.description === value
                  );
                  if (selectedSuggestion) {
                    handleSuggestionClick(selectedSuggestion);
                  }
                }}
              />
              <Divider
                className="swiper-input-divider"
                sx={{ height: "28px" }}
                orientation="vertical"
              />
              <Box className="searchbar_customn">
                <TextField
                  variant="standard"
                  className="swiper-input-search"
                  sx={{ width: { xs: "aurto", md: "500px" }, pl: 1 }}
                  onChange={(e) => handleSearchInputChange(e)}
                  placeholder={t("search_services_provider")}
                  InputProps={{
                    type: "search",
                    disableUnderline: true,
                  }}
                />
                <Button
                  startIcon={<Search />}
                  size="small"
                  variant="contained"
                  sx={{ textTransform: "none" }}
                  className="swiper-button search-btn"
                  onClick={handleSearch}
                ></Button>
              </Box>
            </Paper>
          </Box>
        </Container>
      </Box>

      {/* <Box display={{ xs: "block", md: "none" }}>
        <Container>
          <Box
            position={"relative"}
            overflow={"hidden"}
            borderRadius={"10px"}
            className="object-fit"
            mt={5}
            sx={{ maxWidth: { sx: "200px", md: "300px" } }}
          >
            <Swiper
              navigation={true}
              modules={[Navigation, Autoplay]}
              className="mySwiper "
              loop={true}
              autoplay={{ delay: 3000 }}
            >
              {loading ? (
                <Skeleton
                  variant="rectangular"
                  height={"500px"}
                  width={"100%"}
                />
              ) : (
                <Swiper
                  navigation={true}
                  modules={[Navigation]}
                  className="mySwiper "
                >
                  {sliderData.map((response) => {
                    const type = response.type;
                    const type_id = response.type_id;
                    return (
                      <SwiperSlide key={response.id}>
                        {type === "Category" && type_id != "0" ? (
                          <Box sx={{ height: { xs: 200, md: 500 } }}>
                            <Link
                              to={
                                "./categories/" +
                                response.type_id +
                                "/" +
                                slugify(response.category_name, { lower: true })
                              }
                            >
                              <Box
                                component={"img"}
                                src={response.slider_image}
                                width={"100%"}
                                height={"100%"}
                                sx={{ objectFit: "cover" }}
                                alt=""
                                className="object-fit"
                              />
                            </Link>
                          </Box>
                        ) : (
                          <Box sx={{ height: { xs: 200, md: 500 } }}>
                            <Box
                              component={"img"}
                              src={response.slider_image}
                              sx={{ objectFit: "cover" }}
                              width={"100%"}
                              height={"100%"}
                              alt=""
                              className="object-fit"
                            />
                          </Box>
                        )}
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              )}
            </Swiper>
          </Box>
          <Box
            mt={2}
            alignItems={"center"}
            justifyContent={"center"}
            flexWrap={"wrap"}
            position={"relative"}
            display={{ xs: "flex", md: "none" }}
          >
            <Paper
              component="form"
              className="swiper-paper"
              sx={{
                backgroundColor: theme.palette.background.input,
              }}
            >
              <Autocomplete
                sx={{ width: "100%" }}
                freeSolo
                options={suggestions.map(
                  (suggestion) => suggestion.description
                )}
                clearIcon={
                  <IconButton
                    sx={{
                      width: "1.5rem",
                      height: "1.5rem",
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    inputRef={inputRef}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={"Search Location, Area or City"}
                    InputProps={{
                      ...params.InputProps,
                      disableUnderline: true,
                    }}
                  />
                )}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                onChange={(event, value) => {
                  const selectedSuggestion = suggestions.find(
                    (suggestion) => suggestion.description === value
                  );
                  if (selectedSuggestion) {
                    handleSuggestionClick(selectedSuggestion);
                  }
                }}
              />
              <Divider
                className="swiper-input-divider"
                sx={{ height: "28px" }}
                orientation="vertical"
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <TextField
                  variant="standard"
                  className="swiper-input-search"
                  sx={{ width: "100%", pl: 1 }}
                  onChange={(e) => handleSearchInputChange(e)}
                  placeholder={t("search_services_provider")}
                  InputProps={{
                    type: "search",
                    disableUnderline: true,
                  }}
                />
                <Button
                  startIcon={<Search />}
                  size="small"
                  variant="contained"
                  sx={{ textTransform: "none" }}
                  className="swiper-button search-btn"
                  onClick={handleSearch}
                ></Button>
              </Box>
            </Paper>
          </Box>
        </Container>
      </Box> */}
      {open && (
        <ModalMap
          open={open}
          setOpen={setOpen}
          lat={location.lat}
          lang={location.lng}
          redirect={false}
        />
      )}
    </>
  );
};

export default SwiperHome;
