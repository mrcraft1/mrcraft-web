import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import StarIcon from "@mui/icons-material/Star";
import { t } from "i18next";
import { useDispatch, useSelector } from "react-redux";
import { capilaizeString, truncate } from "../../../util/Helper";
import { setPromoCode } from "../../../redux/Promocode";
import api from "../../../API/apiCollection";
import {
  updateBaseCart,
  updateCartItems,
  updatesubAmount,
} from "../../../redux/cart";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { DeleteOutline } from "@mui/icons-material";
import dummyUser from "../../../Images/dummyUser.jpeg"

const Services = ({ servicesData }) => {
  let settings = useSelector((state) => state.Settings)?.settings;
  let currency_symbol = settings?.app_settings?.currency;
  const cart = useSelector((state) => state.cart);
  const [loadResponse, setLoadResponse] = useState({});

  const dispatch = useDispatch();
  const authentication = useSelector(
    (state) => state.authentication
  )?.isLoggedIn;

  const removePromo = () => {
    dispatch(setPromoCode([]));
    localStorage.removeItem("promocode");
  };
  const storedCartData = JSON.stringify(cart.cartItems);
  const cartData = () => {
    if (storedCartData) {
      return JSON.parse(storedCartData);
    } else {
      return null; // or an empty default value if needed
    }
  };

  const handleAddCart = async (id, qty) => {
    try {
      removePromo();
      setLoadResponse(prevState => ({ ...prevState, [id]: true }));

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
      setLoadResponse(prevState => ({ ...prevState, [id]: false }));
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

  const theme = useTheme();

  const handleDelete = async (itemId) => {
    setLoadResponse(prevState => ({ ...prevState, [itemId]: true }));

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
            setLoadResponse(prevState => ({ ...prevState, [itemId]: false }));
          })
          .catch((e) => console.log(e));
      })
      .catch((error) => console.log("error", error));
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

  const handleDecrement = (response) => {
    cart.cartItems.forEach((obj) => {
      removePromo();
      // eslint-disable-next-line
      if (obj.service_id == response.id) {
        handleAddCart(response.id, parseInt(obj.qty) - 1);
      }
    });
  };

  return (
    <>
      {servicesData &&
        servicesData.map((elem) => (
          <div className="services-main" key={elem.id}>
            <div className="services_main_brand">
              <div className="services_profile">
                <img
                  src={elem.provider?.image ? elem.provider?.image : dummyUser} 
                  onError={dummyUser}
                  alt="services"
                />
              </div>
              <div className="serices_right_data">
                <h5>{elem.provider.username}</h5>
                <p>{elem.provider.company_name}</p>
              </div>
            </div>
            <Swiper
              breakpoints={{
                // when window width is >= 640px
                0:{
                  slidesPerView: 1.2,
                },
                640: {
                  width: 640,
                  slidesPerView: 1.2,
                },
                // when window width is >= 768px
                768: {
                  width: 768,
                  slidesPerView: 1.2,
                },
                992: {
                  width: 992,
                  slidesPerView: 1.5,
                },
                1200: {
                  width: 1200,
                  slidesPerView: 2,
                },
                1400: {
                  width: 1400,
                  slidesPerView: 2.2,
                },
              }}
              spaceBetween={15}
              pagination={false}
              className="mySwiper services-search"
            >
              {elem.provider.services.map((service, index) => (
                <SwiperSlide key={index}>
                  <div className="service-card-slider">
                    <div className="card-left">
                      <div className="overlay"></div>
                      <img src={service.image} alt={service.title} />
                      <div className="card-off">
                        <span>
                          {service.discount}% {t("off")}
                        </span>
                      </div>
                    </div>
                    <div className="card-right">
                      <div className="card-top">
                        <div className="service-name">
                          <p>{truncate(service.title, 28)}</p>
                        </div>
                        <div className="rating">
                          <span className="star">
                            <StarIcon />
                          </span>
                          {parseFloat(service.average_rating).toFixed(1)}
                        </div>
                      </div>
                      <div className="card-middle">
                        <div className="desc">
                          <p>{truncate(service.description, 90)}</p>
                        </div>
                        <div className="duration">
                          <p>
                            {service.number_of_members_required} {t("person")}{" "}
                            {service.duration} {t("min")}
                          </p>
                        </div>
                      </div>
                      <div className="card-bottom">
                        <div className="price-container">
                          <span className="discount-price">
                            {currency_symbol}
                            {service.discounted_price}
                          </span>
                          <span className="original-price">
                            {currency_symbol}
                            {service.price}
                          </span>
                        </div>
                        {/* <button className="add-btn">{t("add")}</button> */}
                        {authentication === true ? (
                          <div className="">
                            {loadResponse[service.id] ? (
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
                                <Button
                                  variant="outlined"
                                  onClick={() => handleOpen(service.id)}
                                  float="right"
                                  size="medium"
                                  color="primary"
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
                              </>
                            ) : (
                              ""
                            )}
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ))}
    </>
  );
};

export default Services;
