import {
  Avatar,
  Box,
  Rating,
  Typography,
  useTheme,
  Skeleton,
  Pagination,
  Divider,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { t } from "i18next";
import { formatDistanceToNow } from "date-fns"; // Import date-fns function
import api from "../../../API/apiCollection";

const CustomerReview = ({ partnerID, limit, displayPagination = true }) => {
  const theme = useTheme();
  const [review, setReview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);

  const changeItem = (e, v) => {
    const newOffset = limit !== undefined ? (v - 1) * limit : (v - 1) * 5;

    setOffset(newOffset);
  };

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const result = await api.getRating(partnerID, limit, offset);
        setReview(result.data);
        setTotal(result.total);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching ratings:", error);
        // Optionally, you can handle the error state or show an error message here
      }
    };

    fetchRating();
  }, [limit, offset, partnerID]);

  return (
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

              {review.images ? (
                review.images.map((image) => {
                  return (
                    <Box marginTop={3} marginBottom={3}>
                      <img
                        src={image}
                        height={"60px"}
                        width={"60px"}
                        alt=""
                        className="m-2 border-radius-10"
                      />
                    </Box>
                  );
                })
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
          <Skeleton variant="rectangular" sx={{ mt: 2 }} height={"100px"} />
          <Skeleton variant="rectangular" sx={{ mt: 2 }} height={"100px"} />
          <Skeleton variant="rectangular" sx={{ mt: 2 }} height={"100px"} />
          <Skeleton variant="rectangular" sx={{ mt: 2 }} height={"100px"} />
          <Skeleton variant="rectangular" sx={{ mt: 2 }} height={"100px"} />
          <Skeleton variant="rectangular" sx={{ mt: 2 }} height={"100px"} />
          <Skeleton variant="rectangular" sx={{ mt: 2 }} height={"100px"} />
        </Box>
      )}

      {loading === false && review?.length > 0 && displayPagination === true ? (
        <Box
          spacing={2}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Pagination
            count={
              limit !== undefined
                ? Math.ceil(total / limit)
                : Math.ceil(total / 5)
            }
            color="primary"
            onChange={changeItem}
          />
        </Box>
      ) : (
        ""
      )}
    </Box>
  );
};

export default CustomerReview;
