import {
  Avatar,
  Box,
  Card,
  Rating,
  Skeleton,
  CardMedia,
  Typography,
  Grid,
  Checkbox,
  Container,
} from "@mui/material";
import { t } from "i18next";

import React, { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import GradeIcon from "@mui/icons-material/Grade";
// import CustomerReview from "./CustomerReview";
import StarIcon from "@mui/icons-material/Star";
import { useTheme, IconButton } from "@mui/material";
// import { Link } from "react-router-dom";
//import slugify from "slugify";
import api from "../../../API/apiCollection";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { setBookmark } from "../../../redux/Bookmark";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { ShareTwoTone } from "@mui/icons-material";
import ShareDialog from "../../Dialogs/ShareDialog";

const ProviderCard = ({
  partnerID,
  partner,

  isProvierLoading,
}) => {
  const [rateTotal, setRateTotal] = useState(1);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  // const slug = slugify(partner.company_name, {
  //   lower: true, // Convert the slug to lowercase
  // });
  const dispatch = useDispatch();
  const marked = useSelector((state) => state.Bookmark)?.bookmark;
  const isLoggedIn = useSelector((state) => state.authentication)?.isLoggedIn;
  const locationData = useSelector((state) => state.Location);
  const lat = locationData.lat;
  const lng = locationData.lng;
  // let settings = useSelector((state) => state.Settings)?.settings;
  // settings = settings.general_settings;

  let isMark = marked && marked?.filter((e) => e.partner_id === partnerID);

  const [booked, setBooked] = useState(isMark?.length > 0 ? true : false);

  useEffect(() => {
    const fetchRatingTotal = async () => {
      if (rateTotal == null) {
        try {
          const response = await api.getRating({
            partner_id: partner.partner_id,
            offset: 0,
            limit: 5,
          });
          setRateTotal(response.total);
        } catch (error) {
          console.error("Error fetching rating total:", error);
          // Optionally handle error state or show an error message
        }
      }
    };

    fetchRatingTotal();
  }, [partner.partner_id, rateTotal]); // Ensure rateTotal is in the dependency array

  const handleBookmark = async (x) => {
    try {
      setBooked(!booked);

      let formdata = new FormData();
      formdata.append("latitude", lat);
      formdata.append("longitude", lng);

      if (booked === true) {
        // Remove bookmark
        dispatch(
          setBookmark(
            marked.filter((bookmark) => bookmark.partner_id !== x.partner_id)
          )
        );

        await api
          .bookmark({
            type: "remove",
            lat: lat,
            lng: lng,
            partner_id: x.partner_id !== undefined ? x.partner_id : x.id,
          })
          .then((response) => {
            if (response && response.data) {
              // Show success toast for removal
              toast.success(response.message);
            } else {
              dispatch(
                setBookmark(
                  marked.filter(
                    (bookmark) => bookmark.partner_id !== x.partner_id
                  )
                )
              );
            }
          })
          .catch((error) => {
            // Show error toast for removal
            toast.error("Failed to remove bookmark");
          });
      } else {
        // Add bookmark
        const newMark = { partner_id: x.partner_id };

        let updatedMarkedArray = marked;
        updatedMarkedArray = [...updatedMarkedArray, newMark];

        dispatch(setBookmark(updatedMarkedArray));

        formdata.append("type", "add");
        formdata.append(
          "partner_id",
          x.partner_id !== undefined ? x.partner_id : x.id
        );

        await api
          .bookmark({
            type: "add",
            lat: lat,
            lng: lng,
            partner_id: x.partner_id !== undefined ? x.partner_id : x.id,
          })
          .then((response) => {
            // Show success toast for addition
            if (response && response.data) {
              toast.success(response.message);
            } else {
              dispatch(
                setBookmark(
                  marked.filter(
                    (bookmark) => bookmark.partner_id !== x.partner_id
                  )
                )
              );
            }
          })
          .catch((error) => {
            // Show error toast for addition
            toast.error("Failed to add bookmark");
          });
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  const handleCopy = () => {
    // Copy text to clipboard using JavaScript
    const textArea = document.createElement("textarea");
    textArea.value = window.location.href;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);

    // Show a success toast message
    toast.success(t("copied"));
  };
  const overallRating = partner.ratings;
  // console.log(overallRating);

  return (
    <>
      {/*///////////////////////////////////////////////////////////////////////////////////////// */}
      <Container
        sx={{
          background: theme.palette.background.box,
          borderRadius: "10px",
          maxWidth: "100%",
        }}
        className="mainContainer"
      >
        <Grid container spacing={2}>
          <Grid
            item
            md={5}
            sm={6}
            mb={3}
            mt={1}
            alignItems={"center"}
            width={"100%"}
          >
            <Card sx={{ position: "relative" }}>
              <Box
                sx={{ borderRadius: "8px", float: "right", mt: 1.5, mr: 1.5 }}
                display={"flex"}
                gap={2}
              >
                <IconButton
                  aria-label="share"
                  onClick={(e) => handleCopy()}
                  sx={{
                    color: theme?.palette?.primary?.main,
                    backgroundColor: theme.palette.background.input,
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: theme.palette.background.input, // Keep the same background color on hover
                    },
                  }}
                >
                  <ShareTwoTone
                    fontSize="small"
                    color="action"
                    sx={{ color: theme?.palette?.primary?.main }}
                  />
                </IconButton>

                {open === true ? (
                  <ShareDialog open={open} setOpen={setOpen} />
                ) : (
                  ""
                )}

                {isLoggedIn === true ? (
                  <Box
                    sx={{
                      backgroundColor: theme.palette.background.input,
                      borderRadius: "8px",
                    }}
                  >
                    <Checkbox
                      key={partner.id}
                      size="small"
                      checked={booked}
                      sx={{ color: "white" }}
                      icon={
                        <BookmarkBorderIcon
                          sx={{ color: theme?.palette?.primary?.main }}
                        />
                      }
                      checkedIcon={
                        <BookmarkIcon
                          sx={{ color: theme?.palette?.primary?.main }}
                        />
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookmark(partner);
                      }}
                    />
                  </Box>
                ) : (
                  ""
                )}
              </Box>
              <Box width={"100%"}>
                <CardMedia
                  sx={{ objectFit: "cover", height: 228, width: "100%" }}
                  image={partner.banner_image}
                />
                <CardMedia
                  sx={{
                    position: "absolute",
                    zIndex: 10,
                    top: 108,
                    left: 20,
                  }}
                  className="provider_service_logo"
                  image={partner.image}
                />
              </Box>
            </Card>
          </Grid>
          <Grid item md={3} sm={6} xs={12} mb={3} maxWidth={"100%"}>
            {isProvierLoading ? (
              <>
                <Box
                  mt={3}
                  display={"flex"}
                  flexDirection={{ xs: "column" }}
                  alignItems={{ xs: "center", md: "baseline" }}
                  justifyContent={"center"}
                >
                  <Typography
                    key={partner.partner_id}
                    variant="h6"
                    mt={{ xs: 1, md: 2 }}
                    sx={{
                      letterSpacing: "1.2px", // Enclosed property names with quotes
                      color: theme.palette.color.textColor,
                      textAlign: { xs: "center", md: "left" },
                    }}
                    gutterBottom
                  >
                    <strong>{partner.company_name}</strong>
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    // fontWeight={"bold"}
                    sx={{
                      color: theme.palette.color.textColor,
                      mt: { xs: 0, md: 2 },
                      textAlign: { xs: "center", md: "left" },
                    }}
                  >
                    {t("provider_rating")}
                  </Typography>

                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <Rating
                      name="average-rating"
                      className="gap-1"
                      value={parseFloat(overallRating)}
                      precision={0.2}
                      component="legend"
                      readOnly
                      mb={1}
                      sx={{ fontSize: "29px" }}
                    />
                    <Typography variant="h6" sx={{ marginLeft: "8px" }}>
                      ({parseFloat(partner.ratings).toFixed(1)})
                    </Typography>
                  </Box>
                </Box>
              </>
            ) : (
              <Skeleton width={200} height={50} />
            )}
          </Grid>
          <Grid item md={2} sm={6} xs={6} mb={3} mt={1}>
            <Box
              display={"flex"}
              width={"228px"}
              height={{ xs: "190px", md: "228px" }}
              maxWidth={"100%"}
              borderRadius={"8px"}
              sx={{
                backgroundColor: theme?.palette?.primary?.main,
                alignItems: "center", // Horizontally center the items
                justifyContent: "center", // Vertically center the items
                flexDirection: "column", // Set to "column" to stack items vertically
                margin: "auto", // Center the Box within the Grid item
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "white",
                  marginTop: 0,
                  height: "60px",
                  width: "60px",
                }}
              >
                <CheckCircleIcon
                  sx={{ p: 1, height: "50px", width: "50px" }}
                  className="color-blue border-radius-50"
                />
              </Avatar>

              <Box
                textAlign="center"
                mt={{ xs: 2, md: 5 }}
                color={theme.palette.color.text}
              >
                <Typography variant="h5" fontWeight="bold">
                  {partner.number_of_orders}
                </Typography>
                <Typography variant="subtitle1" fontWeight="medium">
                  {t("orders_complete")}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item md={2} sm={6} xs={6} mb={3} mt={1}>
            <Box
              display={"flex"}
              width={"228px"}
              height={{ xs: "190px", md: "228px" }}
              mb={3}
              maxWidth={"100%"}
              borderRadius={"8px"}
              sx={{
                backgroundColor: theme.palette.secondary.main,
                alignItems: "center", // Horizontally center the items
                justifyContent: "center", // Vertically center the items
                flexDirection: "column", // Set to "column" to stack items vertically
                margin: "auto", // Center the Box within the Grid item
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "white",
                  marginTop: 0,
                  height: "60px",
                  width: "60px",
                }}
              >
                <StarIcon
                  sx={{ color: "#343f53", height: "50px", width: "50px" }}
                  className="border-radius-50"
                />
              </Avatar>
              <Box
                textAlign="center"
                mt={{ xs: 2, md: 5 }}
                color={theme.palette.color.text}
              >
                <Typography variant="h5" fontWeight="bold">
                  {parseFloat(partner.ratings).toFixed(1)}
                </Typography>
                <Typography variant="subtitle1" fontWeight="medium">
                  {t("provider_reviewers")}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ProviderCard;
