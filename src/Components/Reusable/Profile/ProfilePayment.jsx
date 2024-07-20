/* eslint eqeqeq: 0 */
import {
  Box,
  Chip,
  Container,
  Grid,
  Button,
  Pagination,
  Stack,
  Typography,
  Breadcrumbs,
  CardMedia,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { BreadcrumbLink } from "../../../CSS/ThemeStyle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Heading from "./Heading";
import { useTheme } from "@mui/material/styles";
import Pnavigation from "./Pnavigation";
import { t } from "i18next";
import Layout from "../../layout/Layout";
import api from "../../../API/apiCollection";
import noDataImage from "../../../Images/No__data-pana.png";
import { useSelector } from "react-redux";

const ProfilePayment = () => {
  const company_name = process.env.REACT_APP_NAME;
  document.title = `Profile - Payment | ${company_name}`;

  const [data, setData] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const [limit, setLimit] = useState(5);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState();
  const [error, setError] = useState();
  const [fetchError, setFetchError] = useState(false);
  const settings = useSelector((state) => state.Settings)?.settings;
  const currency_symbol = settings?.app_settings?.currency;

  const fetchTransactions = async (limit, offset) => {
    setLoading(true);
    try {
      const response = await api.getTransaction({
        limit: limit,
        offset: offset,
      });
      if (response !== undefined) {
        setFetchError(false);
        setData(response.data);
        setError(response.error);
        setTotalRecords(response.total);
      }
    } catch (error) {
      setFetchError(true);
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(limit, offset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, offset]);

  const formatDate = (inputDate) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const date = new Date(inputDate);
    return date.toLocaleDateString("en-US", options);
  };

  const totalPages = Math.ceil(totalRecords / limit);
  const theme = useTheme();

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
              <strong>{t("home")}</strong>
            </BreadcrumbLink>
            <Typography color="text.primary">
              <strong>{t("profile")}</strong>
            </Typography>
          </Breadcrumbs>
          <Typography variant="h4" gutterBottom={true} sx={{ mt: "12px" }}>
            <strong>{t("payment_history")}</strong>
          </Typography>
        </Container>
      </Box>
      <Container className="mainContainer" sx={{ mt: "-40px" }}>
        {!fetchError ? (
          <Grid container spacing={3} mb={5}>
            <Grid item xs={12} md={4}>
              <Pnavigation />
            </Grid>
            <Grid item xs={12} md={8}>
              <Box
                sx={{
                  mt: 3,
                  background: theme.palette.background.box,
                  borderRadius: "10px",
                }}
              >
                <Heading heading={t("payment")} />
                <Box p={3}>
                  <TableContainer
                    component={Paper}
                    sx={{ borderRadius: "10px !important" }}
                  >
                    <Table className="minwidth-650" aria-label="simple table">
                      <TableHead>
                        <TableRow
                          sx={{ bgcolor: theme?.palette?.primary?.main }}
                        >
                          <TableCell className="color-white">
                            {t("transaction_id")}
                          </TableCell>
                          <TableCell className="color-white" align="start">
                            {t("payment_method")}
                          </TableCell>
                          <TableCell className="color-white" align="start">
                            {t("transaction_date")}
                          </TableCell>
                          <TableCell className="color-white" align="start">
                            {t("amount")}
                          </TableCell>
                          <TableCell className="color-white" align="center">
                            {t("status")}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      {loading ? (
                        <>
                          <TableRow>
                            <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                              <Typography variant="h6">
                                {t("please_wait")} {t("loading")}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </>
                      ) : (
                        <TableBody
                          sx={{ bgcolor: theme.palette.background.box }}
                        >
                          {data?.length > 0 ? (
                            data.map((row) => (
                              <TableRow
                                key={row.name}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell
                                  component="th"
                                  scope="row"
                                  sx={{ textAlign: "start" }}
                                >
                                  {row.id}
                                </TableCell>
                                <TableCell
                                  align="start"
                                  className="textalign-start"
                                  sx={{ transform: "translateX(10px)" }}
                                >
                                  {row.method}
                                </TableCell>
                                <TableCell
                                  align="start"
                                  className="textalign-start"
                                  sx={{ transform: "translateX(10px)" }}
                                >
                                  {formatDate(row.transaction_date)}
                                </TableCell>
                                <TableCell
                                  align="start"
                                  className="textalign-start"
                                  sx={{
                                    color: "#51BD88",
                                    transform: "translateX(10px)",
                                  }}
                                >
                                  {currency_symbol} {row.amount}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  className="textalign-start color-green"
                                >
                                  {row.status === "success" ? (
                                    <Chip
                                      label="Success"
                                      color="success"
                                      variant="outlined"
                                      sx={{
                                        borderRadius: "8px",
                                        transform: "translateX(5px)",
                                        backgroundColor: "#C8E6C9", // Light green color
                                        width: "77.25px", // Adjust the width as needed
                                      }}
                                    />
                                  ) : row.status === "failed" ? (
                                    <Chip
                                      label="Failed"
                                      color="error"
                                      variant="outlined"
                                      sx={{
                                        borderRadius: "8px",
                                        transform: "translateX(5px)",
                                        backgroundColor: "#FFCDD2",
                                        width: "77.25px", // Adjust the width as needed
                                      }}
                                    />
                                  ) : (
                                    <Chip
                                      label="Pending"
                                      color="warning"
                                      variant="outlined"
                                      sx={{
                                        borderRadius: "8px",
                                        transform: "translateX(5px)",
                                        backgroundColor: "#FFF9C4", // Light warning color
                                        width: "77.25px", // Adjust the width as needed
                                      }}
                                    />
                                  )}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <>
                              <TableRow>
                                <TableCell colSpan={15} align="center">
                                  {t("no_transaction")}
                                </TableCell>
                              </TableRow>
                            </>
                          )}
                        </TableBody>
                      )}
                    </Table>
                  </TableContainer>
                  <Box display={"flex"} justifyContent={"center"} mt={2}>
                    {error === false && (
                      <Stack spacing={2}>
                        <Pagination
                          count={totalPages}
                          page={currentPage}
                          onChange={(event, page) => {
                            setCurrentPage(page);
                            setOffset((page - 1) * limit);
                          }}
                        />
                      </Stack>
                    )}
                  </Box>
                </Box>

                {/* <Stack spacing={2}>
                                <Pagination count={10} color="primary" showFirstButton showLastButton />
                            </Stack> */}
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Grid
            container
            spacing={2}
            direction="column" // Stack components vertically
            alignItems="center"
            justifyContent="center"
            height="100vh" // Adjust this according to your layout
            sx={{
              marginTop: {
                xs: 0, // No margin on extra small screens
                md: -20, // 100px margin on medium screens and larger
              },
            }}
          >
            <Grid item>
              <CardMedia
                component="img"
                src={noDataImage} // Use the imported PNG image
                alt="No Data Image"
                sx={{
                  width: { xs: 300, sm: 600, md: 700 }, // Set width based on screen size
                  height: "auto", // Maintain aspect ratio
                  border: "none", // Remove border
                  boxShadow: "none", // Remove box shadow
                }}
              />
            </Grid>
            <Grid item>
              <Typography
                sx={{
                  textAlign: "center", // Center the text
                  marginTop: {
                    xs: 0, // No margin on extra small screens
                    md: -22, // 100px margin on medium screens and larger
                  },
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: "left",
                    fontFamily: "Plus Jakarta Sans",
                    fontWeight: "bold",
                    fontSize: "32px",
                    lineHeight: "32px",
                    letterSpacing: "0px",
                  }}
                >
                  {t("something_went_wrong")}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: "var(--secondary-color-343f53)", // Using custom color variable
                    textAlign: "left",
                    fontFamily: "Plus Jakarta Sans",
                    fontWeight: "normal",
                    fontSize: "20px",
                    lineHeight: "32px",
                    letterSpacing: "0px",
                    opacity: 0.7,
                    marginLeft: 5,
                  }}
                >
                  {t("try_again_later")}
                </Typography>
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={fetchTransactions}
                sx={{
                  textTransform: "none",
                  marginTop: {
                    xs: 0, // No margin on extra small screens
                    md: -28, // 100px margin on medium screens and larger
                  },
                }}
              >
                {t("retry")}
              </Button>
            </Grid>
          </Grid>
        )}
      </Container>
    </Layout>
  );
};

export default ProfilePayment;
