import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  TextareaAutosize,
  Typography,
  IconButton,
  Divider,
  Drawer,
  ButtonGroup,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { t } from "i18next";
import api from "../../API/apiCollection";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import StarIcon from "@mui/icons-material/Star";
import Dropzone from "react-dropzone";
import { AiFillPicture } from "react-icons/ai";
import SwiperCore, { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import { updateBookings } from "../../redux/Pages";

SwiperCore.use([Navigation, Pagination]);

const RatingModal = ({ open, setOpen, service, company }) => {
  const [openModal, setOpenModal] = useState(open);
  const handleClose = () => {
    setOpenModal(false);
    setOpen(false);
  };
  const theme = useTheme();

  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [defaultImages, setDefaultImages] = useState([]);

  const [DefaultValue, setDefaultValue] = useState({
    defaultComment: service.comment,
    defaultRating: service.rating,
  });

  // Fetch and convert images to binary format
  useEffect(() => {
    const fetchAndConvertImages = async () => {
      const imagePromises = (service.images || []).map(async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return blob;
      });

      const blobs = await Promise.all(imagePromises);
      setDefaultImages(blobs);
    };

    fetchAndConvertImages();
  }, [service.images]);

  const handleDrop = (acceptedFiles) => {
    const imageFiles = acceptedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    if (acceptedFiles.length !== imageFiles.length) {
      toast.error("Only image files are allowed.");
      return;
    }

    setImages([...images, ...acceptedFiles]);
  };

  const handleRatingClick = (rating) => {
    setDefaultValue({ ...DefaultValue, defaultRating: rating });
  };

  const give_rating = async (e) => {
    try {
      const combinedImages = [...defaultImages, ...images];
      await api
        .apply_rating({
          id: service.service_id,
          rating: DefaultValue.defaultRating,
          comment: DefaultValue.defaultComment,
          images: combinedImages,
        })
        .then((result) => {
          const response = result.data;
          const serviceID = service?.service_id;
          const mainID = service?.order_id;
          const ratingUpdate = response?.rating;
          const commentData = response?.comment;
          const imagesData = response?.images;
          if (result.error === false) {
            dispatch(
              updateBookings({
                serviceID,
                mainID,
                ratingUpdate,
                commentData,
                imagesData,
              })
            );
            toast.success(result.message);
            handleClose();
          } else {
            if (typeof result.message == "object") {
              Object.values(result.message).forEach((e) => {
                toast.error(e);
              });
            } else {
              toast.error(result.message);
            }
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const swiperOption = {
    loop: false,
    speed: 750,
    spaceBetween: 10,
    slidesPerView: 3.5,
    navigation: false,
    autoplay: false,
    breakpoints: {
      0: {
        slidesPerView: 2.5,
      },

      768: {
        slidesPerView: 2.5,
      },

      992: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4.5,
      },
    },
  };

  const removeImage = (index, fromDefault = false) => {
    if (fromDefault) {
      setDefaultImages(defaultImages.filter((_, i) => i !== index));
    } else {
      setImages(images.filter((_, i) => i !== index));
    }
  };

  return (
    <Drawer
      anchor="right"
      open={openModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        p: 5,
        display: { xs: "block", sm: "block" },
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: { md: "45%", xs: "100%", sm: "100%" },
        },
      }}
    >
      <Box
        sx={{
          p: 1,
        }}
      >
        <Box display={"flex"} alignItems={"center"} maxWidth={"100%"}>
          <IconButton
            aria-label="Close Button"
            onClick={() => handleClose(setOpen)}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h6"
            color={theme.palette.color.navLink}
          >
            {company}
          </Typography>
        </Box>
        <Divider />
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignSelf={"center"}
          p={2}
        >
          <Box>
            <Typography
              id="modal-modal-title"
              variant="subtitle1"
              component="h6"
              color={theme.palette.color.navLink}
            >
              {service.service_title}
            </Typography>
            <Box sx={{ width: { xs: "100%", md: "100%" }, mt: 0.5 }}>
              <Box>
                <FormControl
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography variant="subtitle1">{t("rate")}</Typography>
                  <Box display={"flex"} flexWrap={"wrap"} gap={2}>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <ButtonGroup
                        key={rating}
                        variant="contained"
                        size="small"
                        aria-label={`rating ${rating}`}
                      >
                        <Button
                          sx={{
                            backgroundColor:
                              rating === Number(DefaultValue.defaultRating)
                                ? "#FFEB8E"
                                : "transparent",
                            borderColor: "gray",
                            color: "inherit",
                          }}
                          onClick={() => handleRatingClick(rating)}
                          endIcon={<StarIcon sx={{ color: "#F4BE18" }} />}
                        >
                          {rating}
                        </Button>
                      </ButtonGroup>
                    ))}
                  </Box>
                </FormControl>
              </Box>
              <Box mt={2}>
                <FormControl sx={{ maxWidth: "100%", width: "100%" }}>
                  <FormLabel sx={{ mb: 1 }}> {t("message")} </FormLabel>
                  <Box
                    component={TextareaAutosize}
                    id="comment"
                    p={2}
                    placeholder={t("write_review")}
                    size="small"
                    defaultValue={DefaultValue.defaultComment}
                    onChange={(e) =>
                      setDefaultValue({
                        ...DefaultValue,
                        defaultComment: e.target.value,
                      })
                    }
                    name="name"
                    required
                    color={theme.palette.color.textColor}
                    minRows={5}
                    sx={{
                      borderRadius: "10px",
                      backgroundColor: theme.palette.background.paper,
                    }}
                  ></Box>
                </FormControl>
              </Box>

              <div className="other_image mb-2">
                <Dropzone onDrop={handleDrop} multiple={true}>
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()} className="dropzone">
                      <input
                        {...getInputProps()}
                        className=""
                        accept="image/*"
                      />
                      <AiFillPicture className="me-1" />
                      {t("uploadImage")}
                    </div>
                  )}
                </Dropzone>
              </div>
              <div className="image_slider">
                <Swiper {...swiperOption}>
                  {defaultImages &&
                    defaultImages?.map((file, index) => (
                      <SwiperSlide key={index}>
                        <Box position="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Uploaded ${index}`}
                            style={{ width: "100%", height: "auto" }}
                          />
                        </Box>
                      </SwiperSlide>
                    ))}
                  {images &&
                    images.map((file, index) => (
                      <SwiperSlide key={index}>
                        <Box position="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Uploaded ${index}`}
                            style={{ width: "100%", height: "auto" }}
                          />
                          <IconButton
                            onClick={() => removeImage(index)}
                            sx={{
                              position: "absolute",
                              top: 5,
                              right: 5,
                              backgroundColor: "rgba(0, 0, 0, 0.5)",
                              color: "white",
                              "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.7)",
                              },
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </SwiperSlide>
                    ))}
                </Swiper>
              </div>
              <Box mt={2}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ textTransform: "none" }}
                  onClick={(e) => give_rating()}
                >
                  {t("submit")}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default RatingModal;
