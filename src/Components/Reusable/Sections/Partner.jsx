/* eslint eqeqeq: 0 */
import { useTheme } from "@emotion/react";
import { ArrowRightAltOutlined, Done } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Checkbox,
  Divider,
  Rating,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import slugify from "slugify";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import toast from "react-hot-toast";
import { t } from "i18next";
import api from "../../../API/apiCollection";
import { useSelector, useDispatch } from "react-redux";
import { setBookmark } from "../../../redux/Bookmark";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const Partner = ({ partner, isHome = false }) => {
  if (partner.number_of_ratings) {
    partner.number_of_ratings = parseInt(partner.number_of_ratings);
  }
  const authentication = useSelector(
    (state) => state.authentication
  )?.isLoggedIn;
  const theme = useTheme();
  const locationData = useSelector((state) => state.Location);
  const lat = locationData.lat;
  const lng = locationData.lng;
  const slug = slugify(partner.company_name, {
    lower: true, // Convert the slug to lowercase
  });

  const partner_id =
    partner.partner_id !== undefined ? partner.partner_id : partner.id;

  const dispatch = useDispatch();
  const marked = useSelector((state) => state.Bookmark);

  const handle = async (item) => {
    try {
      // Ensure marked.bookmark is an array
      const bookmarks = marked?.bookmark ?? [];

      const isBookmarked1 = bookmarks.some(
        (bookmark) => bookmark.partner_id === item.partner_id
      );

      if (isBookmarked1) {
        dispatch(
          setBookmark(
            marked.bookmark.filter(
              (bookmark) => bookmark.partner_id !== item.partner_id
            )
          )
        );
      } else {
        const newMark = { partner_id: item.partner_id };
        let updatedMarkedArray = [...bookmarks, newMark];
        dispatch(setBookmark(updatedMarkedArray));
      }

      if (authentication) {
        const response = await api.bookmark({
          type: isBookmarked1 ? "remove" : "add",
          lat: lat,
          lng: lng,
          partner_id: item.partner_id !== undefined ? item.partner_id : item.id,
        });
        if (response && response.data) {
          toast.success(response.message);
        } else {
          dispatch(
            setBookmark(
              marked.bookmark.filter(
                (bookmark) => bookmark.partner_id !== item.partner_id
              )
            )
          );
        }
      }
    } catch (error) {
      console.error("Error handling bookmark:", error);
    }
  };

  const isBookmarked =
    marked &&
    marked.bookmark &&
    marked.bookmark.some(
      (bookmark) => bookmark.partner_id === partner.partner_id
    );

  return (
    <Card
      key={partner.id}
      mb={{ xs: "10px", md: 5 }}
      sx={{
        my: { xs: "10px", md: 0 },
        borderRadius: "var(--global-border-radius)",
        position: "relative",
      }}
    >
      <Box display={"flex"} className="serviceBookMarkBox">
        {isHome === false && authentication === true ? (
          <Checkbox
            key={partner.id}
            size="small"
            {...label}
            id={partner.id}
            checked={isBookmarked}
            sx={{ color: "white" }}
            icon={
              <BookmarkBorderIcon
                sx={{ color: theme?.palette?.primary?.main }}
              />
            }
            checkedIcon={
              <BookmarkIcon sx={{ color: theme?.palette?.primary?.main }} />
            }
            onClick={(event) => {
              event.stopPropagation();
              handle(partner);
            }}
          />
        ) : (
          ""
        )}
      </Box>

      <Link
        key={partner.id}
        to={`/providers/services/${partner_id}/${slug}`}
        className="breadcrumb text-light"
      >
        <CardMedia
          height={240}
          width={"max-content"}
          component={"img"}
          sx={{
            borderRadius: "var(--global-border-radius)",
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
          }}
          image={partner.banner_image}
        />

        <Box
          className="partner-cardmedia"
          p={"5px"}
          sx={{ bgcolor: "white", borderColor: theme?.palette?.primary?.main }}
        >
          <CardMedia
            image={partner.image}
            alt={partner.company_name}
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
            }}
          />
        </Box>

        <Box textAlign={"center"} sx={{ margin: "auto", width: "100%" }}>
          <CardContent sx={{ pb: "0!important", px: "0!important" }}>
            <Typography
              variant="h5"
              component="div"
              textAlign={"center"}
              color={theme.palette.color.navLink}
            >
              {partner.company_name}
            </Typography>

            <Box
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems={"center"}
              gap={1}
            >
              <Box display={"flex"} alignItems={"center"} gap={1}>
                <Rating
                  name="read-only"
                  value={parseInt(partner.ratings ?? partner.average_rating)}
                  readOnly
                  className="aling-content"
                />
                <Typography
                  variant="body1"
                  color={theme.palette.color.textColor}
                >
                  (
                  {partner.ratings !== undefined
                    ? parseFloat(partner.ratings).toFixed(1)
                    : parseFloat(partner.average_rating).toFixed(2)}{" "}
                  / 5 )
                </Typography>
              </Box>

              <Button
                size="small"
                sx={{ borderRadius: "8px", textTransform: "none" }}
                variant="contained"
                startIcon={
                  <Done
                    sx={{
                      backgroundColor: "white",
                      borderRadius: "50%",
                      color: theme?.palette?.primary?.main,
                    }}
                  />
                }
              >
                <Box display={"flex"} gap={0.5}>
                  <Box>{partner.number_of_orders}</Box>
                  <Box>{t("order_completed")}</Box>
                </Box>
              </Button>
            </Box>

            <Divider sx={{ mt: 2 }} />

            <CardActionArea
              sx={{
                height: "100%",
                transition: "ease-in",
                "&:hover": {
                  backgroundColor: theme?.palette?.primary?.main,
                  color: "white",
                  "& .MuiBox-root": {
                    color: "white",
                  },
                  // Other CSS properties for the hover effect
                },
              }}
            >
              <Box
                color={theme.palette.color.navLink}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                sx={{
                  width: "100%",
                  height: "100%",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  fontWeight: 700,
                }}
              >
                {t("view_all_services")} <ArrowRightAltOutlined />
              </Box>
            </CardActionArea>
          </CardContent>
        </Box>
      </Link>
    </Card>
  );
};

export default Partner;
