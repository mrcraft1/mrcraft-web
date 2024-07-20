import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Rating,
  LinearProgress,
  Grid,
  Button,
  Skeleton,
  Avatar,
} from "@mui/material";
import { t } from "i18next";

import React, { useEffect, useState } from "react";
import GradeIcon from "@mui/icons-material/Grade";
// import CustomerReview from "./CustomerReview";
import { useTheme } from "@mui/material";
import api from "../../../API/apiCollection";
import { useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns"; // Import date-fns function
import UrlTypeComponent from "../../LightBox/UrlTypeComponent";

const ProviderDetailedCard = ({
  overallRating,
  star1,
  star2,
  star3,
  star4,
  star5,
  noOfRating,
  partnerID,
  partner,
}) => {
  const [rateTotal, setRateTotal] = useState(5);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(5);
  const [review, setReview] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [open, setOpen] = useState(false);
  const theme = useTheme();

  const params = useParams();
  const { company_name } = params;

  useEffect(() => {
    const company_name1 = process.env.REACT_APP_NAME;
    document.title = `${company_name}-Reviews | ${company_name1}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await api.getRating({
          partner_id: partner.partner_id,
          offset: offset.toString(),
          limit: limit.toString(),
        });

        setReview((prevReviews) => [...prevReviews, ...response.data]);
        setLoading(false);
        setRateTotal(response?.data?.length);
      } catch (error) {
        console.error("Error loading reviews:", error);
        // Optionally handle error state or show an error message
      }
    };

    loadReviews();
  }, [offset, limit, partner.partner_id]);

  const handleLoadMore = () => {
    setOffset((prevOffset) => prevOffset + limit);
  };

  return (
    <>
      {/* Review Tab Content */}
      <Card
        sx={{
          borderRadius: "10px",
        }}
      >
        <CardContent
          sx={{
            backgroundColor: theme.palette.background.box,
            maxWidth: "100%",
            pb: "5px !important",
          }}
        >
          {/* REVIEW & RATING */}
          <Typography variant="h5" fontWeight={"bold"} mb={2} pl={2}>
            {t("overall_rating")}
          </Typography>
          <Divider orientation="horizontal" sx={{ mx: -2 }} />

          <RatingCard
            overall={Number(overallRating)}
            star1={star1}
            star2={star2}
            star3={star3}
            star4={star4}
            star5={star5}
            noOfRating={noOfRating}
          />
          {/* Dynamic content coming from API */}
          {/* <CustomerReview
              partnerID={partnerID}
              limit={5}
              displayPagination={false}
            /> */}

          <Box mx={1}>
            {loading === false ? (
              review && review?.length === 0 ? (
                <div className="textaling-center">
                  <Box mt={5}>
                    <img
                      src={"/images/no-booking.png"}
                      height={300}
                      width={300}
                      alt="not found"
                    />
                  </Box>
                  <p>{t("no_review_found")}</p>
                </div>
              ) : (
                review &&
                review.map((review) => (
                  <Box
                    key={review.id}
                    sx={{
                      background: theme.palette.background.box,
                      padding: 2,
                      marginBottom: 1,
                      borderRadius: "10px",
                    }}
                    gap={2}
                  >
                    <Box
                      // marginTop={2}
                      // marginLeft={1}
                      display={"flex"}
                      textAlign={"start"}
                      alignItems={"center"}
                      // marginBottom={2}
                    >
                      <Avatar
                        alt={review.user_name}
                        className="avatar"
                        src={review.profile_image}
                      />
                      <Box marginLeft={3} width={"100%"}>
                        <Box
                          sx={{
                            float: "right",
                            justifyContent: "end",
                            textAlign: "end",
                          }}
                        >
                          <Typography variant="body1" fontSize={"small"}>
                            {review.rating}
                          </Typography>
                          <Typography paddingTop={-2} color={"gray"}>
                            {formatDistanceToNow(new Date(review.rated_on), {
                              addSuffix: true,
                            })}
                          </Typography>
                        </Box>
                        <Typography
                          variant="h6"
                          color={theme?.palette?.primary?.main}
                          fontSize={"medium"}
                        >
                          <strong>{review.user_name}</strong>
                        </Typography>
                        <Rating
                          name="read-only"
                          className="font-medium"
                          value={review.rating}
                          readOnly
                        />
                      </Box>
                    </Box>
                    {review.comment ? (
                      <Typography marginTop={1}>{review.comment}</Typography>
                    ) : (
                      ""
                    )}

                    {review?.images ? (
                      <Box marginTop={3} marginBottom={3}>
                        <UrlTypeComponent urls={review.images} />
                      </Box>
                    ) : (
                      <></>
                    )}
                    <Divider sx={{ mt: 2 }} />
                  </Box>
                ))
              )
            ) : (
              <Box>
                <Skeleton variant="rectangular" height={"100px"} />
                <Skeleton
                  variant="rectangular"
                  sx={{ mt: 2 }}
                  height={"100px"}
                />
                <Skeleton
                  variant="rectangular"
                  sx={{ mt: 2 }}
                  height={"100px"}
                />
                <Skeleton
                  variant="rectangular"
                  sx={{ mt: 2 }}
                  height={"100px"}
                />
                <Skeleton
                  variant="rectangular"
                  sx={{ mt: 2 }}
                  height={"100px"}
                />
                <Skeleton
                  variant="rectangular"
                  sx={{ mt: 2 }}
                  height={"100px"}
                />
                <Skeleton
                  variant="rectangular"
                  sx={{ mt: 2 }}
                  height={"100px"}
                />
                <Skeleton
                  variant="rectangular"
                  sx={{ mt: 2 }}
                  height={"100px"}
                />
              </Box>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            {rateTotal > 0 && (
              <Button
                variant="contained"
                disableElevation
                size="small"
                onClick={handleLoadMore}
              >
                {t("load_more")}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </>

    /* THIS IS HAVE TO BE UPPER SHIFT */
  );
};

export default ProviderDetailedCard;

const RatingCard = ({
  overall,
  star1,
  star2,
  star3,
  star4,
  star5,
  noOfRating,
}) => {
  const arrayOfRating = [star1, star2, star3, star4, star5];
  const maxValue = Math.max(...arrayOfRating.map((value) => parseInt(value)));
  // Convert the array values to integers and create an array of objects with values and their original indices
  const ratingObjects = arrayOfRating.map((value, index) => ({
    value: parseInt(value),
    index: index,
  }));

  // Sort the ratingObjects array in ascending order based on the 'value' property
  ratingObjects.sort((a, b) => b.index - a.index);
  return (
    <Box
      justifyContent={"center"} // Center horizontally
      alignItems={"center"} // Center vertically
      bgcolor={"#343F53"}
      color={"white"}
      borderRadius={"10px"}
      p={{ xs: 2, md: 0 }}
      // px={2}
      // py={2}
      m={2}
    >
      <Grid container spacing={{ xs: 0, md: 0 }}>
        <Grid item md={4} sm={12} alignItems={"center"} width={"100%"}>
          <Box
            m={{ xs: 0, md: 3 }}
            display={"flex"}
            bgcolor={"white"}
            borderRadius={"10px"}
            color={"black"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"} // Center horizontally
            height={"283px"}
            alignContent={"center"}
            sx={{ alignItems: "center" }}
          >
            <Typography
              className="back-343f"
              variant="h5"
              mb={2}
              borderRadius={"60px"}
              textAlign={"center"}
              sx={{
                height: "100px",
                width: "100px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#FFFFFF", // Set to white
                textAlign: "left",
                font: "normal normal bold 38px/13px Plus Jakarta Sans",
                letterSpacing: "1.9px",
                opacity: 1,
              }}
            >
              {parseFloat(overall).toFixed(1)}
            </Typography>

            <Rating
              name="average-rating"
              className="gap-1"
              value={parseFloat(overall)}
              precision={0.2}
              component="legend"
              readOnly
              mb={1}
            />
            <Typography
              variant="h6"
              mt={1}
              gutterBottom
              sx={{
                textAlign: "left",
                font: "normal normal medium 25px/13px Plus Jakarta Sans",
                letterSpacing: "1.25px",
                color: "#343F53",
                opacity: 1,
              }}
            >
              {noOfRating} {t("reviews")}
            </Typography>
          </Box>
        </Grid>

        <Grid item md={0.1} sm={12}>
          <Divider
            orientation={{ xs: "horizontal", md: "vertical" }}
            sx={{
              backgroundColor: "gray",
              height: { xs: "1px", md: "100%" },
              width: { xs: "225px", sm: "100%", md: "1px" },
              ml: { xs: 0, md: 0.2 },

              mt: { xs: 2, md: 0 },
            }}
          />
        </Grid>

        <Grid
          item
          md={7.9}
          sm={12}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"space-between"}
          width={"100%"}
          p={2}
          my={4}
        >
          {ratingObjects.map((rating, index) => (
            <Box
              key={index}
              mt={0}
              mb={0}
              display={"flex"}
              alignItems={"center"}
              flexDirection={"row"}
              width={"100%"}
              justifyContent={"space-between"}
              rowGap={1} // Adjust the rowGap property to decrease the gap
              gap={1} // Adjust the gap property to decrease the gap
            >
              <Box display={"flex"} alignItems={"center"}>
                <GradeIcon fontSize="small" sx={{ marginRight: "16px" }} />

                <Typography fontSize={"medium"} variant="caption" mr={1}>
                  {rating.index + 1}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(rating.value / maxValue) * 100}
                sx={{
                  width: "100%",
                  borderRadius: "5px",
                  backgroundColor: "gray",
                  height: 9, // Set the height of the entire progress bar to 9px
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#F6B313", // Set the progress bar color to #F6B313
                  },
                }}
              />

              <Typography fontSize={"medium"} variant="caption" ml={4} mr={2}>
                {rating.value || 0}
              </Typography>
            </Box>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};
