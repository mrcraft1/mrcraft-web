import {
  Box,
  Breadcrumbs,
  Container,
  Grid,
  Pagination,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Heading from "./Heading";
import Pnavigation from "./Pnavigation";
import Layout from "../../layout/Layout";
import BookingSection from "./Bookings/BookingSection";
import { order_statues } from "../../../config/config";
import { t } from "i18next";
import { BookingSkeleton } from "../Sections/Skeletons";
import { useParams } from "react-router";
import BookingIndex from "./Bookings/BookingIndex";
import api from "../../../API/apiCollection";
import { BreadcrumbLink } from "../../../CSS/ThemeStyle";
import { setBookings } from "../../../redux/Pages";
import { useDispatch } from "react-redux";

const ProfileBooking = () => {
  const dispatch = useDispatch();
  const company_name = process.env.REACT_APP_NAME;
  document.title = `Profile - Bookings | ${company_name}`;
  // all this section come dynamic
  const [tax, setTax] = useState(0);
  const [bookingDataLoaded, setBookingDataLoaded] = useState(false);

  useEffect(() => {
    const storedTax = JSON.parse(localStorage.getItem("tax"));
    setTax(storedTax || 0);
  }, []);

  const sub_total = localStorage.getItem("totalPrice");
  const total = parseInt(sub_total) + tax;

  localStorage.setItem("Pay", total);
  const [booking, setBooking] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState();
  const [error, setError] = useState();
  const itemsPerPage = 5;
  const { status } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setBookingDataLoaded(false);

      try {
        const result = await api.getOrders({
          id: "",
          currentPage: currentPage,
          itemsPerPage: itemsPerPage,
          status: status,
          order_statuses: order_statues,
        });
        dispatch(setBookings(result.data));
        setBooking(result.data);
        setTotalPage(result.total);
        setError(result.error);
      } catch (error) {
        console.log("error", error);
      } finally {
        setBookingDataLoaded(true); // Mark the data as loaded
      }
    };

    fetchData();
  }, [currentPage, dispatch, status]);

  const theme = useTheme();
  const totalPages = Math.ceil(totalPage / itemsPerPage);

  return (
    <Layout>
      <Box
        // bgcolor={theme.palette.background.heading}
        paddingTop={"35px"}
        paddingBottom={"35px"}
        mt={2}
      >
        <Container maxWidth="lg" className="mainContainer">
          <Breadcrumbs
            separator="|"
            aria-label="breadcrumb"
            className="mb-1 mt-1"
          >
            <BreadcrumbLink to={"/"} className="breadcrumb" sx={{ mb: 0 }}>
              <strong> {t("home")}</strong>
            </BreadcrumbLink>
            <Typography color="text.primary">
              <strong>{t("profile")}</strong>
            </Typography>
          </Breadcrumbs>
          <Typography variant="h4" gutterBottom={true} sx={{ mt: "12px" }}>
            <strong>{t("bookings")}</strong>
          </Typography>
        </Container>
      </Box>

      <Container className="mainContainer" sx={{ mb: "30px", mt: "-50px" }}>
        <Grid spacing={3} container>
          <Grid item xs={12} md={4}>
            <Pnavigation />
          </Grid>
          <Grid item xs={12} md={8}>
            <Box
              sx={{ background: theme.palette.background.box }}
              mt={3}
              minHeight={570}
              borderRadius={4}
            >
              <Heading heading={t("my_bookings")} />
              <Box padding={2}>
                <Box sx={{ mb: 3, overflow: "auto" }}>
                  <BookingIndex />
                </Box>

                <>
                  {bookingDataLoaded ? (
                    booking && booking?.length > 0 ? (
                      <BookingSection booking={booking} status={"all"} />
                    ) : (
                      <Box display="flex" justifyContent="center" m={2}>
                        <Box
                          display="block"
                          textAlign="center"
                          width="100%"
                          height="425px"
                        >
                          <Box
                            src={"/images/No-service.png"}
                            alt="No Booking Found"
                            sx={{
                              maxHeight: "100%",
                              maxWidth: "100%",
                            }}
                            component={"img"}
                          />
                          <Typography>{t("no_booking")}</Typography>
                        </Box>
                      </Box>
                    )
                  ) : (
                    // Display loading skeleton
                    <Box>
                      <BookingSkeleton />
                      <BookingSkeleton />
                      <BookingSkeleton />
                      <BookingSkeleton />
                    </Box>
                  )}
                </>
                <Box display={"flex"} justifyContent={"center"} mt={2}>
                  {error === false && (
                    <Stack spacing={2}>
                      <Pagination
                        count={totalPages}
                        page={currentPage + 1}
                        onChange={(event, page) => setCurrentPage(page - 1)}
                      />
                    </Stack>
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default ProfileBooking;
