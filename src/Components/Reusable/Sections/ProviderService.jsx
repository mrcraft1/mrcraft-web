/* eslint eqeqeq: 0 */
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  CardMedia,
  IconButton,
  CircularProgress,
  Divider,
  Modal,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import { NorthWest } from "@mui/icons-material";
import api from "../../../API/apiCollection";
import React, { useState, useEffect } from "react";
import StarIcon from "@mui/icons-material/Star";
import toast from "react-hot-toast";
import { t } from "i18next";
import { DeleteOutline } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import {
  updateCartItems,
  updateBaseCart,
  updatesubAmount,
} from "../../../redux/cart";
import { capilaizeString } from "../../../util/Helper";
import { useTheme } from "@emotion/react";
import { setPromoCode } from "../../../redux/Promocode";
import { useParams } from "react-router";
import CloseIcon from "@mui/icons-material/Close";
import ImageOutlined from "@mui/icons-material/ImageOutlined";
import ButtonBase from "@mui/material/ButtonBase"; // Import ButtonBase component
import TextSnippetIcon from "@mui/icons-material/TextSnippet";

const ProviderService = ({ service, index, provider, partner_id }) => {
  // Added index as a prop

  const [isAvailableAtLocation, setisAvailableAtLocation] = useState(null);

  useEffect(() => {
    // Find the response with the matching partner_id
    const foundObject = provider.find(
      (response) => response.partner_id === partner_id
    );

    // If a matching response is found, update the state
    if (foundObject) {
      setisAvailableAtLocation(foundObject.is_Available_at_location);
    }
  }, [partner_id, provider]);

  const authentication = useSelector(
    (state) => state.authentication
  )?.isLoggedIn;

  const theme = useTheme();
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const storedCartData = JSON.stringify(cart.cartItems);
  const cartData = () => {
    if (storedCartData) {
      return JSON.parse(storedCartData);
    } else {
      return null; // or an empty default value if needed
    }
  };
  const [loadResponse, setLoadResponse] = useState(false);

  const params = useParams();
  const { company_name } = params;

  useEffect(() => {
    document.title = `${company_name}-Services`;
  }, [company_name]); // Include company_name in the dependency array

  const removePromo = () => {
    dispatch(setPromoCode([]));
    localStorage.removeItem("promocode");
  };

  // general function that we reuse to increment and decrement of items
  const handleAddCart = async (id, qty) => {
    try {
      removePromo();
      setLoadResponse(true);

      const response = await api.ManageCart({ id: id, qty: qty.toString() });
      let sub_amout = 0;

      if (response && response.data) {
        response.data.forEach((item) => {
          const itemPrice = parseFloat(item.servic_details.price_with_tax);
          const itemQty = parseFloat(item.qty);

          sub_amout += itemPrice * itemQty;
        });

        dispatch(updatesubAmount(sub_amout));
        dispatch(updateCartItems(response.data));
        dispatch(updateBaseCart(response));

        let message = capilaizeString(response.message);
        toast.success(message);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoadResponse(false);
    }
  };

  // Arrow function for when user click on add button request sent to api with 1 Qty
  const handleOpen = (response, qty = 1) => {
    if (authentication === false) {
      toast.error("You need to login before adding Items to your account");
      return true;
    }

    handleAddCart(response, 1);
    // handleModalOpen();
  };

  const partnerNotAvailable = () => {
    // Assuming you have logic to check if the partner is not available at the location
    const partnerNotAvailableAtLocation = true; // Replace with your logic

    if (partnerNotAvailableAtLocation) {
      toast.error("The partner is not available at your location");
    } else {
      // Logic for removing the partner
    }
  };

  // Arrow function for when user increment items it update Qty and send api request -> Backup code
  const handleIncrement = (response) => {
    removePromo();
    const item = cartData().find((item) => item.service_id === response.id);

    cart.cartItems.forEach((obj) => {
      if (obj.service_id === response.id && obj.qty > 0) {
        const quantity = parseInt(obj.qty);
        if (!item) {
          handleAddCart(response.id, quantity + 1);

          return;
        }
        if (item.servic_details.max_quantity_allowed > quantity) {
          handleAddCart(response.id, quantity + 1);
          return;
        }

        toast.error(
          `Maximum Quantity is ${item.servic_details.max_quantity_allowed}`
        );
      }
    });
  };

  // Arrow function forr when user decrement items it update Qty and send api request
  const handleDecrement = (response) => {
    cart.cartItems.forEach((obj) => {
      removePromo();

      if (obj.service_id == response.id) {
        handleAddCart(response.id, parseInt(obj.qty) - 1);
      }
    });
  };

  const settings = useSelector((state) => state.Settings)?.settings;
  const currency_symbol = settings?.app_settings?.currency;

  // Arrow function for delete from cart
  const handleDelete = async (itemId) => {
    setLoadResponse(true);

    await api
      .removeCart({ itemId: itemId })
      .then(async (result) => {
        await api
          .get_cart()
          .then((response) => {
            removePromo();
            dispatch(updateCartItems(response.data));
            let message = capilaizeString(result.message);
            toast.success(message);
            setLoadResponse(false);
          })
          .catch((e) => console.log(e));
      })
      .catch((error) => console.log("error", error));
  };

  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalOpen2(false);
  };

  const htmlToText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };
  const [modalOpen2, setModalOpen2] = useState(false);

  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box mt={2}>
      <Card
        className="provider-service-card"
        sx={{
          background: theme.palette.background.box,
          boxShadow: "none !important",
        }}
      >
        {/* PC SCREEN ONLY  */}
        <Box className="w-100">
          <Box className="row align-items-center">
            <Box item className="col-xxl-2 col-xl-2 col-lg-2 col-md-3 col-12">
              <ButtonBase
                onClick={handleModalOpen}
                className="provider-services"
              >
                <img
                  src={service.image_of_the_service}
                  alt="hi"
                  className="provider-service-card1"
                />
              </ButtonBase>
            </Box>

            <Box
              item
              className="col-xxl-10 col-xl-10 col-lg-10 col-md-9 col-12"
            >
              <CardContent
                sx={{
                  padding: "0",
                }}
              >
                <Box display={"block"} textAlign={"start"} key={index}>
                  {/* Added key prop */}
                  <Box display={"flex"} justifyContent={"space-between"}>
                    <Typography
                      color={theme?.palette?.primary?.main}
                      sx={{ fontSize: "22px", cursor: "pointer" }}
                      fontWeight={"bold"}
                      mr={"auto"}
                      onClick={(e) => handleModalOpen()}
                    >
                      {service.title}
                    </Typography>
                    <StarIcon color="gold" className="color-gold" />
                    {/* only one digit after decimal point  */}
                    {parseFloat(service.rating).toFixed(1)}
                  </Box>
                  <Box>
                    <Typography
                      className="provider-typo"
                      fontSize={14}
                      pt={2}
                      sx={{
                        wordBreak: "break-word",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: "2",
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {service.description}
                    </Typography>
                  </Box>
                  <Typography color={"gray"} fontSize={14}>
                    {service.number_of_members_required} {t("person")}
                    {service.duration} {t("min")}
                  </Typography>
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    mt={1}
                  >
                    <Typography
                      mr={"auto"}
                      fontWeight={"bold"}
                      color={theme?.palette?.primary?.main}
                    >
                      <Box
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"end"}
                        gap={"5px"}
                      >
                        <Typography
                          mr={"auto"}
                          fontWeight={"bold"}
                          color={theme?.palette?.primary?.main}
                        >
                          {currency_symbol}
                          {service.price_with_tax}
                        </Typography>
                        <del>
                          {currency_symbol}
                          {service.original_price_with_tax}
                        </del>
                      </Box>
                    </Typography>

                    {authentication === true ? (
                      <div className="">
                        {loadResponse ? (
                          <CircularProgress size={24} />
                        ) : cart.cartItems !== null &&
                          cart.cartItems?.some(
                            (obj) => obj.service_id === service.id
                          ) ? (
                          <Box
                            size="large"
                            width={109.88}
                            height={42.5}
                            borderRadius={"5px"}
                            bgcolor={theme?.palette?.primary?.main}
                            color={"white"}
                            display={"flex"}
                            justifyContent={"space-around"}
                            alignItems={"center"}
                            variant="outlined"
                          >
                            {cart.cartItems.some(
                              (obj) =>
                                obj.service_id === service.id &&
                                parseInt(obj.qty) === 1
                            ) ? (
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(service.id)}
                              >
                                <DeleteOutline className="delete-icon" />
                              </IconButton>
                            ) : (
                              <IconButton
                                size="small"
                                onClick={() => {
                                  handleDecrement(service);
                                }}
                                sx={{ color: "white" }}
                              >
                                -
                              </IconButton>
                            )}

                            {cart.cartItems.map((obj) => {
                              if (
                                obj.service_id === service.id &&
                                obj.qty > 0
                              ) {
                                return (
                                  <Typography color={"white"}>
                                    {obj.qty}
                                  </Typography>
                                );
                              }
                              return <></>;
                            })}

                            <IconButton
                              size="small"
                              onClick={() => handleIncrement(service)}
                              sx={{ color: "white" }}
                            >
                              +
                            </IconButton>
                          </Box>
                        ) : authentication === true ? (
                          <>
                            {isAvailableAtLocation == true ? (
                              <Button
                                variant="outlined"
                                onClick={() => handleOpen(service.id)}
                                float="right"
                                size="medium"
                                // color="primary"
                                sx={{
                                  px: 5,
                                  py: 1,
                                  borderColor: "gray",
                                  textTransform: "none",
                                  "&:hover": {
                                    borderColor: "gray",
                                  },
                                }}
                              >
                                {t("add")}
                              </Button>
                            ) : (
                              <Button
                                variant="outlined"
                                onClick={partnerNotAvailable} // Assuming you have a handleRemove function
                                float="right"
                                size="medium"
                                // color="secondary" // You can change the color according to your design
                                sx={{
                                  px: 5,
                                  py: 1,
                                  borderColor: "gray",
                                  textTransform: "none",
                                  "&:hover": {
                                    borderColor: "gray",
                                  },
                                }}
                              >
                                {t("add")}
                              </Button>
                            )}
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    ) : (
                      <></>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Box>
          </Box>
        </Box>
      </Card>
      <Divider sx={{ marginTop: 2 }} />

      {/* The Modal */}
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="service-modal"
        aria-describedby="service-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "100%", md: 500 },
            height: 800,
            maxHeight: "90vh",
            overflowY: "auto",
            bgcolor: theme.palette.background.box,
            boxShadow: 24,
            borderRadius: "10px",
            m: 0,
            p: 0,
            "&::-webkit-scrollbar": {
              width: 0,
            },
            // Relative positioning for close icon
            // position: "relative",
          }}
        >
          {/* Close icon */}
          <IconButton
            onClick={handleModalClose}
            sx={{
              position: "absolute",
              top: 0,
              right: 0,

              m: 1,
              zIndex: 1,
              color: "#FFFFFF", // Ensure it's above other content
              backgroundColor: "#343F53 !important", // Add !important rule
              "&:hover": {
                backgroundColor: "#343F53 !important", // Add !important rule
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          <Grid container md={12} xs={12} mb={2}>
            <Grid item md={12} xs={12}>
              <CardMedia
                component="img"
                width={"100%"}
                image={service.image_of_the_service}
                alt={service.title}
                sx={{
                  cursor: "default", // Prevent mouse pointer from changing
                }}
              />
            </Grid>
          </Grid>

          <Grid container display={"flex"} justifyContent={"center"}>
            <Grid item md={10} xs={6} px={2} mb={2} mt={1}>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontFamily: "Plus Jakarta Sans",
                  fontWeight: "bold",
                  fontSize: "24px",
                  lineHeight: "32px", // Adjusted line height
                  letterSpacing: "1.2px",
                  color: theme.palette.color.textColor,
                  textAlign: "left",
                  wordBreak: "break-word",
                }}
              >
                {service.title}
              </Typography>

              <Typography
                fontWeight={"bold"}
                color={theme.palette.color.textColor}
              >
                <Box
                  display={"flex"}
                  justifyContent={"start"}
                  alignItems={"center"}
                  gap={"14px"}
                  my={1}
                >
                  <Typography
                    variant="h5" // Adjust the variant as needed
                    sx={{
                      fontFamily: "Plus Jakarta Sans",
                      fontWeight: "bold",
                      fontSize: "16px", // Adjust the font size as needed
                      lineHeight: "26px", // Adjust the line height as needed
                      letterSpacing: "0.8px",
                      color: theme.palette.color.textColor,
                      textAlign: "left",
                      marginTop: 1,
                      wordBreak: "break-word",
                    }}
                  >
                    {currency_symbol}
                    {service.price_with_tax}
                  </Typography>

                  <del>
                    <Typography
                      variant="h5" // Adjust the variant as needed
                      sx={{
                        fontFamily: "Plus Jakarta Sans",
                        fontWeight: "normal", // Adjust the font weight as needed
                        fontSize: "16px", // Adjust the font size as needed
                        lineHeight: "26px", // Adjust the line height as needed
                        letterSpacing: "0.8px",
                        color: theme.palette.color.textColor,
                        opacity: 0.4,
                        textAlign: "left",
                        marginTop: 1,
                        wordBreak: "break-word",
                      }}
                    >
                      {currency_symbol}
                      {service.original_price_with_tax}
                    </Typography>
                  </del>
                </Box>
              </Typography>
              <Typography color={"gray"} fontSize={14} mt={0}>
                {service.number_of_members_required} {t("person")}
                {service.duration} {t("min")}
              </Typography>
            </Grid>

            <Grid item md={2} xs={6} px={2} mt={2} mb={2}>
              <Box display={"flex"} justifyContent={"end"} mr={3}>
                <StarIcon color="gold" className="color-gold" />
                {/* only one digit after decimal point  */}
                <Box
                  sx={{
                    fontFamily: "Plus Jakarta Sans",
                    color: theme.palette.color.textColor,
                  }}
                >
                  {parseFloat(service.rating).toFixed(1)}
                </Box>
              </Box>
              {authentication === true ? (
                <Box display={"flex"} justifyContent={"end"} mt={1}>
                  <div className="">
                    {loadResponse ? (
                      <CircularProgress size={24} />
                    ) : cart.cartItems !== null &&
                      cart.cartItems?.some(
                        (obj) => obj.service_id === service.id
                      ) ? (
                      <Box
                        size="large"
                        width={80}
                        height={40}
                        borderRadius={"5px"}
                        bgcolor={theme?.palette?.primary?.main}
                        color={"white"}
                        display={"flex"}
                        justifyContent={"space-around"}
                        alignItems={"center"}
                        variant="outlined"
                      >
                        {cart.cartItems.some(
                          (obj) =>
                            obj.service_id === service.id &&
                            parseInt(obj.qty) === 1
                        ) ? (
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(service.id)}
                          >
                            <DeleteOutline className="delete-icon" />
                          </IconButton>
                        ) : (
                          <IconButton
                            size="small"
                            onClick={() => {
                              handleDecrement(service);
                            }}
                            sx={{ color: "white" }}
                          >
                            -
                          </IconButton>
                        )}

                        {cart.cartItems.map((obj) => {
                          if (obj.service_id === service.id && obj.qty > 0) {
                            return (
                              <Typography color={"white"}>{obj.qty}</Typography>
                            );
                          }
                          return <></>;
                        })}

                        <IconButton
                          size="small"
                          onClick={() => handleIncrement(service)}
                          sx={{ color: "white" }}
                        >
                          +
                        </IconButton>
                      </Box>
                    ) : authentication === true ? (
                      <>
                        {isAvailableAtLocation == true ? (
                          <Button
                            variant="outlined"
                            onClick={() => {
                              handleOpen(service.id);
                            }}
                            float="right"
                            size="medium"
                            // color="primary"
                            sx={{
                              px: 5,
                              py: 1,
                              borderColor: "gray",
                              textTransform: "none",
                              "&:hover": {
                                borderColor: "gray",
                              },
                            }}
                          >
                            {t("add")}
                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            onClick={partnerNotAvailable} // Assuming you have a handleRemove function
                            float="right"
                            size="medium"
                            // color="secondary" // You can change the color according to your design
                            sx={{
                              px: 5,
                              py: 1,
                              borderColor: "gray",
                              textTransform: "none",
                              "&:hover": {
                                borderColor: "gray",
                              },
                            }}
                          >
                            {t("add")}
                          </Button>
                        )}
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                </Box>
              ) : (
                <></>
              )}
            </Grid>
          </Grid>

          <Grid container p={2} sx={{ borderTop: "1px solid #A5A9B0" }}>
            <Grid item md={12} xs={12}>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "Plus Jakarta Sans",
                  fontWeight: "bold",
                  fontSize: "24px",
                  lineHeight: "32px",
                  letterSpacing: "0px",
                  color: theme.palette.color.textColor,
                  opacity: 1,
                  textAlign: "left",
                  wordBreak: "break-word",
                }}
              >
                {t("about_service")}
              </Typography>
            </Grid>
            <Grid item md={12} xs={12} mt={1}>
              <Box>
                <Typography
                  key={index}
                  fontSize="16px"
                  lineHeight="24px"
                  fontFamily="Plus Jakarta Sans"
                  color={theme.palette.color.textColor}
                  textAlign="left"
                  sx={{
                    fontWeight: "normal",
                    letterSpacing: "0px",
                    wordBreak: "break-word",
                  }}
                >
                  {service.description}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {service?.long_description?.length > 0 && (
            <Grid container p={2} sx={{ borderTop: "1px solid #A5A9B0" }}>
              <Grid item md={12} xs={12}>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: "Plus Jakarta Sans",
                    fontWeight: "bold",
                    fontSize: "24px",
                    lineHeight: "32px",
                    letterSpacing: "0px",
                    color: theme.palette.color.textColor,
                    opacity: 1,
                    textAlign: "left",
                    wordBreak: "break-word",
                  }}
                >
                  {t("service_description")}
                </Typography>
              </Grid>
              <Grid item md={12} xs={12} mt={1}>
                <Box>
                  <Typography
                    key={index}
                    fontSize="16px"
                    lineHeight="24px"
                    fontFamily="Plus Jakarta Sans"
                    color={theme.palette.color.textColor}
                    textAlign="left"
                    sx={{
                      fontWeight: "normal",
                      letterSpacing: "0px",
                      wordBreak: "break-word",
                    }}
                  >
                    {htmlToText(service.long_description)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}

          {service?.other_images?.length > 0 && (
            <Grid container p={2} sx={{ borderTop: "1px solid #A5A9B0" }}>
              <Grid item md={12} xs={12}>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: "Plus Jakarta Sans",
                    fontWeight: "bold",
                    fontSize: "24px",
                    lineHeight: "32px",
                    letterSpacing: "0px",
                    color: theme.palette.color.textColor,
                    opacity: 1,
                    textAlign: "left",
                    wordBreak: "break-word",
                  }}
                >
                  {t("photos")}
                </Typography>
              </Grid>

              <Grid
                item
                md={12}
                xs={12}
                display={"flex"}
                flexWrap={"wrap"}
                alignItems={"center"}
                justifyContent={"center"}
                my={2}
              >
                {/* Check if service.other_images array exists and has elements */}
                {service?.other_images && service?.other_images?.length > 0 && (
                  <>
                    {[0, 1].map((row) => (
                      <Box
                        key={row}
                        sx={{
                          display: "flex",
                          marginBottom: "16px",
                          position: "relative",
                        }}
                      >
                        {/* Map through the images for the current row */}
                        {service.other_images
                          .slice(row * 2, row * 2 + 2)
                          .map((otherImage, index) => (
                            <Box
                              key={index}
                              sx={{
                                marginRight: index === 0 ? "16px" : "0px",
                                position: "relative",
                              }}
                            >
                              <Card
                                sx={{
                                  width: "200px",
                                  borderRadius: "10px",
                                  position: "relative",
                                }}
                              >
                                <CardMedia
                                  component="img"
                                  image={otherImage} // Assuming otherImage is a valid image URL
                                  alt={`Image ${row * 2 + index + 1}`} // Use the index for alt text
                                  sx={{ width: "200px", height: "200px" }}
                                />
                                {row === 1 &&
                                  index === 1 && ( // Check if it's the last image
                                    <>
                                      <Box
                                        sx={{
                                          position: "absolute",
                                          top: 0,
                                          left: 0,
                                          width: "100%",
                                          height: "100%",
                                          backgroundColor: "rgba(0, 0, 0, 0.5)", // Gray texture
                                          borderRadius: "10px",
                                        }}
                                      />
                                      <Box
                                        sx={{
                                          position: "absolute",
                                          top: "50%",
                                          left: "50%",
                                          transform: "translate(-50%, -50%)",
                                          zIndex: 1,
                                        }}
                                      >
                                        <Button
                                          variant="contained"
                                          // color="secondary"
                                          sx={{
                                            width: "150px",
                                            textTransform: "none",
                                          }}
                                          onClick={() => {
                                            setModalOpen2(true);
                                          }}
                                        >
                                          <ImageOutlined
                                            sx={{ width: "20%" }}
                                          />
                                          {t("see_all")}
                                        </Button>
                                      </Box>
                                    </>
                                  )}
                              </Card>
                            </Box>
                          ))}
                      </Box>
                    ))}
                  </>
                )}
              </Grid>
            </Grid>
          )}

          {/* files */}
          {service?.files?.length > 0 ? (
            <Grid
              container
              spacing={2}
              mb={4}
              p={2}
              bgcolor={theme.palette.background.box}
              borderRadius={"10px"}
            >
              <Grid item md={12}>
                <Typography
                  variant="body1"
                  sx={{
                    font: "normal normal bold 24px/32px 'Plus Jakarta Sans'",
                    color: theme.palette.color.textColor,
                    textAlign: { xs: "center", md: "left" },
                    letterSpacing: "0px",
                    opacity: 1,
                    marginBottom: "30px",
                    wordBreak: "break-word",
                  }}
                >
                  {t("brochure")}/{t("files")}
                </Typography>
              </Grid>

              <Grid item md={12} mt={-2}>
                <div className="files_data">
                  {service?.files.map((fileUrl, index) => {
                    const fileName = fileUrl.split("/").pop();
                    const fileNameWithoutExtension = fileName.replace(
                      /\.[^/.]+$/,
                      ""
                    );
                    return (
                      <Box mb={"16px"} key={index}>
                        <TextSnippetIcon />
                        <a
                          href={fileUrl}
                          download={fileName}
                          style={{
                            textDecoration: "none",
                            color: theme.palette.color.textColor,
                          }}
                        >
                          {fileNameWithoutExtension}
                        </a>
                      </Box>
                    );
                  })}
                </div>
              </Grid>
            </Grid>
          ) : null}

          {/* FAQS */}
          {service?.faqs?.length > 0 ? (
            <Grid
              container
              spacing={2}
              mb={4}
              p={2}
              bgcolor={theme.palette.background.box}
              borderRadius={"10px"}
            >
              <Grid item md={12}>
                <Typography
                  variant="body1"
                  sx={{
                    font: "normal normal bold 24px/32px 'Plus Jakarta Sans'",
                    color: theme.palette.color.textColor,
                    textAlign: { xs: "center", md: "left" },
                    letterSpacing: "0px",
                    opacity: 1,
                    marginBottom: "30px",
                    wordBreak: "break-word",
                  }}
                >
                  {t("faq")}
                </Typography>
              </Grid>

              <Grid item md={12} mt={-2}>
                <div>
                  {service?.faqs.map((faq, index) => (
                    <Box mb={"16px"} key={index}>
                      <Accordion
                        expanded={expanded === `panel${index}`}
                        onChange={handleChange(`panel${index}`)}
                        style={{
                          backgroundColor: theme.palette.background.box,
                          boxShadow: "none",
                          border: "1px solid #CCCCCC",
                          color: "#000000",
                        }}
                      >
                        <AccordionSummary
                          expandIcon={
                            expanded === `panel${index}` ? (
                              <NorthWest sx={{ color: "black" }} /> // Render SouthEastIcon when expanded
                            ) : (
                              <NorthEastIcon sx={{ color: "black" }} /> // Render NorthEastIcon when collapsed
                            )
                          }
                          aria-controls={`panel${index}-content`}
                          id={`panel${index}-header`}
                          style={{
                            backgroundColor: "#FFFFFF",
                            color: "#000000",
                            boxShadow: "none",
                            borderBottom:
                              expanded === `panel${index}`
                                ? "none"
                                : "1px solid #CCCCCC",
                          }}
                        >
                          {/* Show the number with 2 digits */}
                          <Typography>
                            {String(index + 1).padStart(2, "0")}. {faq.question}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails
                          style={{
                            backgroundColor: "#FFFFFF",
                            color: "#000000",
                            marginTop: "-8px",
                          }}
                        >
                          <Typography
                            sx={{
                              font: "var(--unnamed-font-style-normal) normal var(--unnamed-font-weight-normal) 20px/var(--unnamed-line-spacing-32) var(--unnamed-font-family-plus-jakarta-sans)",
                              color: "var(--secondary-color-343f53)",
                              textAlign: "left",
                              letterSpacing: "0px",
                              opacity: 0.6,
                              wordBreak: "break-word",
                            }}
                          >
                            {faq.answer}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    </Box>
                  ))}
                </div>
              </Grid>
            </Grid>
          ) : null}
        </Box>
      </Modal>
      <Modal open={modalOpen2} onClose={() => setModalOpen2(false)}>
        <Box
          sx={{
            position: "relative", // Set position to relative
            width: "80%",
            height: "80%",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            border: "2px solid #000",
            borderRadius: "10px",
            boxShadow: 24,
            p: { xs: 0, md: 4 },
            overflowY: "auto",
          }}
        >
          {/* Close icon */}
          <Box
            display={"flex"}
            width={"100%"}
            alignItems={"center"}
            justifyContent={"flex-end"}
          >
            <IconButton
              onClick={handleModalClose}
              sx={{
                position: "sticky",
                top: "5px",
                // marginLeft: "1200px",
                display: "flex",
                justifyContent: "end",
                color: theme.palette.color.textColor,
                zIndex: 1,
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Grid for displaying images */}
          <Grid container spacing={0} alignItems="stretch">
            {service.other_images.map((image, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Card sx={{ margin: "8px" }}>
                  <CardMedia
                    component="img"
                    image={image}
                    alt={`Image ${index + 1}`}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
};

export default ProviderService;
