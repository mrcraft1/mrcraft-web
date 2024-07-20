import React, { useEffect, useState } from "react";
import { ProviderFlexSkeleton } from "../Sections/Skeletons";
import api from "../../../API/apiCollection";
import NoBookmark from "./Mini-Sections/NoBookmark";
import { useDispatch, useSelector } from "react-redux";
import { Pagination } from "@mui/material";
import toast from "react-hot-toast";
import {
  Box,
  Card,
  CardMedia,
  Grid,
  Rating,
  Typography,
  CardContent,
  Checkbox,
} from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useTheme } from "@emotion/react";
import { Link } from "react-router-dom";
import slugify from "slugify";
import { t } from "i18next";
import { Done } from "@mui/icons-material";
import { setBookmark } from "../../../redux/Bookmark";

const Bookmark = () => {
  const [bookmarkData, setBookmarkData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [booked, setBooked] = useState({});
  const theme = useTheme();
  const locationData = useSelector((state) => state.Location);
  const marked = useSelector((state) => state.Bookmark)?.bookmark;
  const { lat, lng } = locationData;
  const limit = 5;
  const dispatch = useDispatch();
  const fetchBookmarks = async (type, partner_id) => {
    setLoading(true);
    try {
      const result = await api.bookmark({
        type: type,
        lat: lat,
        lng: lng,
        limit: limit,
        partner_id: partner_id || "",
        offset: (page - 1) * limit,
      });
      setBookmarkData(result.data);
      setTotalPages(Math.ceil(result.total / limit));

      if (result?.data?.length === 0 && page > 1) {
        setPage(1);
        const newResult = await api.bookmark({
          type: type,
          lat: lat,
          lng: lng,
          limit: limit,
          offset: 0,
        });
        setBookmarkData(newResult.data);
        setTotalPages(Math.ceil(newResult.total / limit));
      }

      const initialBooked = {};
      result.data.forEach((item) => {
        initialBooked[item.partner_id] = true;
      });
      setBooked(initialBooked);

      setLoading(false);
    } catch (error) {
      console.log("Error fetching bookmarks:", error);
      setLoading(false);
      toast.error("Failed to load bookmarks");
    }
  };

  useEffect(() => {
    fetchBookmarks("list", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleBookmark = async (partner_id) => {
    try {
      await api.bookmark({
        type: "remove",
        partner_id: partner_id,
      });
      fetchBookmarks("list", "");
      dispatch(
        setBookmark(
          marked?.filter((bookmark) => bookmark.partner_id !== partner_id)
        )
      );
      toast.success("Bookmark removed successfully");
    } catch (error) {
      console.error("Error removing bookmark:", error);
      toast.error("Failed to remove bookmark");
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div>
      {loading ? (
        <ProviderFlexSkeleton />
      ) : bookmarkData?.length === 0 ? (
        <NoBookmark />
      ) : (
        <>
          {bookmarkData &&
            bookmarkData.map((response) => (
              <Card
                sx={{ mb: "16px", borderRadius: "14px", padding: "10px" }}
                key={response.partner_id}
              >
                <Grid container spacing={5} sx={{ borderRadius: "8px" }}>
                  {/* Left Side (Image) */}
                  <Grid item sm={12} md={4} width={"100%"}>
                    <Box
                      sx={{
                        backgroundColor: "white",
                        borderRadius: "8px",
                        position: "absolute",
                        m: "8px",
                      }}
                    >
                      <Checkbox
                        size="small"
                        checked={booked[response.partner_id] || false}
                        sx={{ color: "white", p: "4px" }}
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
                          handleBookmark(response.partner_id);
                        }}
                      />
                    </Box>
                    <Box
                      display={"flex"}
                      sx={{ flexDirection: { xs: "column", md: "row" } }}
                      alignItems={"center"}
                    >
                      <CardMedia
                        component="img"
                        height="auto"
                        width={"100%"}
                        image={response.banner_image}
                        alt="Image"
                        sx={{ borderRadius: "15px", aspectRatio: "1.46/1" }}
                      />
                      <Box maxWidth={"100%"}>
                        <Box
                          position={"relative"}
                          width={"68px"}
                          left={{ xs: "-15%", md: "-50%" }}
                          mt={{ xs: "-50%", md: "0" }}
                          border={8}
                          borderColor={theme.palette.background.card}
                          borderRadius={"50%"}
                          component={"img"}
                          src={response.image}
                        />
                      </Box>
                    </Box>
                  </Grid>
                  {/* Right Side (Text and Buttons) */}
                  <Grid
                    item
                    md={8}
                    sm={12}
                    pt={{ xs: "0 !important", md: "40px !important" }}
                    width={"100%"}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: { xs: "center", md: "space-between" },
                      }}
                    >
                      <Box
                        display={"flex"}
                        flexDirection={{ xs: "column", md: "row" }}
                        justifyContent={"space-between"}
                        alignItems={{ xs: "center", md: "start" }}
                      >
                        <Box>
                          <Box
                            display={"flex"}
                            flexDirection={{ xs: "column", md: "row" }}
                            justifyContent={"space-between"}
                          >
                            <Typography variant="h6">
                              {response.company_name}
                            </Typography>
                          </Box>
                          <Box
                            display={"flex"}
                            alignContent={"center"}
                            justifyItems={"center"}
                          >
                            <Rating
                              readOnly
                              value={parseFloat(response.ratings).toFixed(1)}
                            ></Rating>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              ml={1}
                              mt={"3px"}
                            >
                              ( {parseFloat(response.ratings).toFixed(1)}/5)
                            </Typography>
                          </Box>
                        </Box>
                        <Box>
                          <Box
                            bgcolor={theme?.palette?.primary?.main}
                            display={"flex"}
                            gap={0.5}
                            py={0.5}
                            px={1}
                            borderRadius={"5px"}
                          >
                            <Box
                              bgcolor={"white"}
                              display={"flex"}
                              alignItems={"center"}
                              borderRadius={"50%"}
                            >
                              <Done color="success" fontSize="small" />
                            </Box>
                            <Typography variant="caption" color="white">
                              {response.number_of_orders}
                            </Typography>
                            <Typography variant="caption" color="white">
                              {t("orders_complete")}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Box
                        display={"flex"}
                        width={"100%"}
                        mt={2}
                        alignItems={"center"}
                        justifyContent={{ md: "start", xs: "center" }}
                      >
                        <Box
                          border={1}
                          borderRadius={"5px"}
                          p={0.5}
                          px={"10px"}
                          borderColor={"gray"}
                        >
                          <Link
                            className="text-decoration-none"
                            to={`/providers/services/${
                              response.partner_id
                            }/${slugify(response.company_name)}`}
                          >
                            <Typography
                              display={"flex"}
                              gap={1.5}
                              alignItems={"center"}
                              variant="body1"
                              fontWeight={"lighter"}
                              color={theme.palette.color.navLink}
                            >
                              <Box>{t("view_all_services")}</Box>
                              <Box>&rarr;</Box>
                            </Typography>
                          </Link>
                        </Box>
                      </Box>
                    </CardContent>
                  </Grid>
                </Grid>
              </Card>
            ))}
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            sx={{ mt: 2, display: "flex", justifyContent: "center" }}
          />
        </>
      )}
    </div>
  );
};

export default Bookmark;
