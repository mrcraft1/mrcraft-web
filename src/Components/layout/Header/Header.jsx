import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineSettings } from "react-icons/md";
import { MdOutlineShoppingCart } from "react-icons/md";
import {
  Box,
  IconButton,
  Drawer,
  Container,
  Avatar,
  Typography,
  Badge,
} from "@mui/material";
import { handleClose, handleOpen } from "../../../config/config";
import { useDispatch, useSelector } from "react-redux";
import EmptyCart from "../Navigation/EmptyCart";
import { ArrowBackIosNewOutlined } from "@mui/icons-material";
import Cart from "../../Reusable/Sections/CartItem";
import { t } from "i18next";
import EdemandSetting from "../Navigation/EdemandSetting";
import api from "../../../API/apiCollection";
import { updateDoor, updateStore } from "../../../redux/cart";
import { handleForce } from "../../../redux/Login";
import toast from "react-hot-toast";
import Authentication from "../Navigation/Authentication";
import { useNavigate } from "react-router-dom";
import { IoReorderThree } from "react-icons/io5";
import Offcanvas from "react-bootstrap/Offcanvas";

import AddressDrawer from "../../../Drawers/AddressDrawer";
import ConfirmDateTime from "../../../Drawers/ConfirmDataTime";
import AddAddressForm from "../../../Drawers/AddAddressForm";
import BookingInfoDrawer from "../../../Drawers/BookingInfoDrawer";
import Promocode from "../../../Drawers/Promocode";
import { themesData } from "../../../redux/Theme";
import { dateDetails, slotDetails } from "../../../redux/orderCartDetails";

const Header = ({ check, changeLight, changeDark }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authentication = useSelector(
    (state) => state.authentication
  )?.isLoggedIn;

  const [islogined, setIsloggedIn] = useState(authentication);

  const [openSetting, setOpenSetting] = useState(false);
  const [cart, setCart] = useState(false);
  const [form, setForm] = useState(false);
  const [login, isLogin] = useState(false);
  let web_settings = useSelector((state) => state.Settings)?.settings;
  web_settings = web_settings?.web_settings;
  const [selectSlote, isSelectedSlote] = useState(false);
  const [addAddress, setAddAddress] = useState(false);
  // eslint-disable-next-line
  const [addressFrom, setAddressForm] = useState(false);
  const [booking, setBooking] = useState(false);
  const [promo, setPromo] = useState(false);
  const locationData = useSelector((state) => state.Location);

  const cartDetails = useSelector((state) => state.cart);

  const profile = useSelector((state) => state.UserData)?.profile?.data;

  const themeSelector = useSelector(themesData);

  const profilePicture = profile?.image;

  const handleOpenSetting = () => {
    setOpenSetting(true);
  };

  const handleCloseSetting = () => {
    setOpenSetting(false);
  };

  function ContinueClicked() {
    handleClose(setCart);
    handleOpen(setForm);
  }

  const handleOpenLogin = () => {
    isLogin(true);
  };

  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);

  function BookingDetails() {
    handleClose(setForm);
    handleOpen(setBooking);
  }

  function OpenMapDrawer() {
    handleOpen(setAddAddress);
    handleClose(setForm);
  }

  function CompleteAddress() {
    handleClose(setAddAddress);
    handleOpen(setAddressForm);
  }

  function BookingDrawer() {
    handleClose(isSelectedSlote);
    handleOpen(setBooking);
  }

  const carts = useSelector((state) => state.cart);

  const handleCartOpening = async () => {
    if (islogined) {
      handleOpen(setCart);
      if (carts?.cartItems) {
        const provider_id =
          carts &&
          carts?.cartItems[0] &&
          carts?.cartItems[0]?.servic_details?.partner_id;
        await api
          .get_providers({
            latitude: locationData.lat,
            longitude: locationData.lng,
            id: provider_id,
          })
          .then((res) => {
            dispatch(dateDetails(""));
            dispatch(slotDetails(""));
            localStorage.removeItem("selectedPromo");
            dispatch(updateDoor(res.data[0]?.at_doorstep));
            dispatch(updateStore(res.data[0]?.at_store));
          });
      }
    } else {
      dispatch(handleForce(false));
      toast.error("You must be logged in to access this page.");
    }
  };

  useEffect(() => {}, [themeSelector]);

  return (
    <>
      <header>
        <Container className="mainContainer">
          <div className="navbarWrapper">
            <div className="leftDiv">
              <div className="logoWrapper">
                <Link to={"/"}>
                  <img src={web_settings?.web_logo} alt="logo" />
                </Link>
              </div>
            </div>

            <div className="centerDiv">
              <ul className="linksWrapper">
                <Link
                  to="/"
                  className={location.pathname === "/" ? "navActive" : ""}
                >
                  {t("home")}
                </Link>
                <Link
                  to="/about"
                  className={location.pathname === "/about" ? "navActive" : ""}
                >
                  {t("about_us")}
                </Link>
                <Link
                  to="/categories"
                  className={
                    location.pathname === "/categories" ? "navActive" : ""
                  }
                >
                  {t("all_category")}
                </Link>
                <Link
                  to="/providers"
                  className={
                    location.pathname === "/providers" ? "navActive" : ""
                  }
                >
                  {t("all_providers")}
                </Link>
                <Link
                  to="/contact"
                  className={
                    location.pathname === "/contact" ? "navActive" : ""
                  }
                >
                  {t("contact")}
                </Link>
              </ul>
            </div>

            <div className="rightDiv">
              <div>
                {/* cart section that display cart items */}
                {!islogined ? (
                  <Drawer
                    anchor="right"
                    open={cart}
                    onClose={() => handleClose(setCart)}
                  >
                    <EmptyCart />
                  </Drawer>
                ) : (
                  <Drawer
                    anchor="right"
                    open={cart}
                    onClose={() => handleClose(setCart)}
                    sx={{
                      display: { xs: "block", sm: "block" },
                      "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                        width: { md: 580, xs: "100%" },
                      },
                    }}
                  >
                    <Box
                      display={"flex"}
                      width={"100%"}
                      alignItems={"center"}
                      gap={1}
                      my={1}
                    >
                      <IconButton onClick={() => handleClose(setCart)}>
                        <ArrowBackIosNewOutlined fontSize="large" />
                      </IconButton>

                      <Typography
                        variant="h6"
                        textAlign={"center"}
                        fontWeight={"bold"}
                      >
                        {cartDetails?.cartItems?.length > 0 ? (
                          <>
                            {t("from")}{" "}
                            {
                              cartDetails?.cartItems[0]?.servic_details
                                ?.partner_name
                            }
                          </>
                        ) : (
                          t("cart")
                        )}
                      </Typography>
                    </Box>
                    <Cart continueClicked={ContinueClicked} />
                  </Drawer>
                )}

                <div>
                  <Badge
                    badgeContent={
                      authentication ? cartDetails?.cartItems?.length : 0
                    }
                    color="primary"
                  >
                    <MdOutlineShoppingCart
                      className="headerIcons"
                      onClick={() => handleCartOpening()}
                    />
                  </Badge>
                </div>
              </div>

              <div>
                <MdOutlineSettings
                  className="headerIcons"
                  onClick={handleOpenSetting}
                />
              </div>

              <div>
                <Authentication
                  login={login}
                  isLogin={isLogin}
                  setIsloggedIn={setIsloggedIn}
                />

                {islogined ? (
                  <IconButton
                    id="logined_user"
                    onClick={() => navigate("/profile/booking")}
                  >
                    <Avatar
                      sx={{ height: "30px", width: "30px", color: "white" }}
                      src={profilePicture ? profilePicture : ""}
                    />
                  </IconButton>
                ) : (
                  <div className="btnWrapper" onClick={handleOpenLogin}>
                    <span>
                      <FaUserCircle />
                    </span>
                    <button className="commonBtn"> {t("sign_in")}</button>
                  </div>
                )}
              </div>
            </div>

            <span onClick={handleShowOffcanvas} id="hamburg">
              <IoReorderThree size={46} />
            </span>
          </div>

          <Offcanvas
            show={showOffcanvas}
            onHide={handleCloseOffcanvas}
            placement="end"
            scroll={true}
            backdrop={true}
            className="header-offcanvas"
          >
            <Offcanvas.Header closeButton className="btn-close-white">
              <Offcanvas.Title></Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <div className="navbarWrapper">
                <div className="centerDiv">
                  <ul className="linksWrapper">
                    <Link
                      to="/"
                      className={location.pathname === "/" ? "navActive" : ""}
                    >
                      {t("home")}
                    </Link>
                    <Link
                      to="/about"
                      className={
                        location.pathname === "/about" ? "navActive" : ""
                      }
                    >
                      {t("about_us")}
                    </Link>
                    <Link
                      to="/categories"
                      className={
                        location.pathname === "/categories" ? "navActive" : ""
                      }
                    >
                      {t("all_category")}
                    </Link>
                    <Link
                      to="/providers"
                      className={
                        location.pathname === "/providers" ? "navActive" : ""
                      }
                    >
                      {t("all_providers")}
                    </Link>
                    <Link
                      to="/contact"
                      className={
                        location.pathname === "/contact" ? "navActive" : ""
                      }
                    >
                      {t("contact")}
                    </Link>
                  </ul>
                </div>

                <div className="rightDiv">
                  <div>
                    {/* cart section that display cart items */}
                    {!islogined ? (
                      <Drawer
                        anchor="right"
                        open={cart}
                        onClose={() => handleClose(setCart)}
                      >
                        <EmptyCart />
                      </Drawer>
                    ) : (
                      <Drawer
                        anchor="right"
                        open={cart}
                        onClose={() => handleClose(setCart)}
                        sx={{
                          display: { xs: "block", sm: "block" },
                          "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: { md: 580, xs: "100%" },
                          },
                        }}
                      >
                        {/* set this box width 400 if needed */}
                        <Box
                          display={"flex"}
                          width={"100%"}
                          alignItems={"center"}
                          gap={1}
                          my={1}
                        >
                          <IconButton onClick={() => handleClose(setCart)}>
                            <ArrowBackIosNewOutlined fontSize="large" />
                          </IconButton>

                          <Typography
                            variant="h6"
                            textAlign={"center"}
                            fontWeight={"bold"}
                          >
                            {cartDetails?.cartItems?.length > 0 ? (
                              <>
                                {t("from")}{" "}
                                {
                                  cartDetails?.cartItems[0]?.servic_details
                                    ?.partner_name
                                }
                              </>
                            ) : (
                              t("cart")
                            )}
                          </Typography>
                        </Box>
                        <Cart continueClicked={ContinueClicked} />
                      </Drawer>
                    )}

                    <div>
                      <Badge
                        badgeContent={
                          authentication ? cartDetails?.cartItems?.length : 0
                        }
                        color="primary"
                      >
                        <MdOutlineShoppingCart
                          className="headerIcons"
                          onClick={() => handleCartOpening()}
                        />
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <MdOutlineSettings
                      className="headerIcons"
                      onClick={handleOpenSetting}
                    />
                  </div>

                  <div>
                    <Authentication
                      login={login}
                      isLogin={isLogin}
                      setIsloggedIn={setIsloggedIn}
                    />

                    {islogined ? (
                      <IconButton
                        id="logined_user"
                        onClick={() => navigate("/profile/booking")}
                      >
                        <Avatar
                          sx={{ height: "30px", width: "30px", color: "white" }}
                          src={profilePicture ? profilePicture : ""}
                        />
                      </IconButton>
                    ) : (
                      <div className="btnWrapper" onClick={handleOpenLogin}>
                        <span>
                          <FaUserCircle />
                        </span>
                        <button className="commonBtn"> {t("sign_in")}</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Offcanvas.Body>
          </Offcanvas>

          {/* =================eDemand-Setting================  */}
          <Drawer
            anchor="right"
            open={openSetting}
            onClose={handleCloseSetting}
            sx={{
              display: { xs: "block", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: { md: 580, xs: "100%" },
              },
            }}
          >
            <EdemandSetting
              changeDark={changeDark}
              changeLight={changeLight}
              setOpenSetting={setOpenSetting}
            />
          </Drawer>

          {/* Select Date and time and based on that We send request to check available slot */}
          <Drawer
            open={form}
            anchor="right"
            sx={{
              display: { xs: "block", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: { md: 580, xs: "100%" },
              },
            }}
          >
            <Box>
              <AddressDrawer
                setCart={setCart}
                setForm={setForm}
                isSelectedSlote={isSelectedSlote}
                continueFun={BookingDetails}
                MyFun={OpenMapDrawer}
                setBooking={setBooking}
              />
            </Box>
          </Drawer>

          {/* In this drawer we provide them clanader and list all available time slotes and on select another request send to same api */}
          <Drawer
            open={selectSlote}
            anchor="right"
            sx={{
              display: { xs: "block", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: { md: 580, xs: "100%" },
              },
            }}
          >
            <Box>
              <ConfirmDateTime
                setForm={setForm}
                isSelectSlote={isSelectedSlote}
                booking={BookingDrawer}
              />
            </Box>
          </Drawer>

          {/* if user want to address than add address drawer  */}
          <Drawer
            open={addAddress}
            anchor="right"
            sx={{
              display: { xs: "block", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: { md: 580, xs: "100%" },
              },
            }}
          >
            <Box>
              <AddAddressForm
                CompleteAddress={CompleteAddress}
                setForm={setForm}
                addAddress={setAddAddress}
              />
            </Box>
          </Drawer>

          {/* booking information drawer  */}
          <Drawer
            open={booking}
            anchor="right"
            sx={{
              display: { xs: "block", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: { md: 580, xs: "100%" },
              },
            }}
          >
            <Box>
              <BookingInfoDrawer
                setForm={setForm}
                setBooking={setBooking}
                setPromo={setPromo}
              />
            </Box>
          </Drawer>

          {/* promocode drawer  */}
          <Drawer
            open={promo}
            anchor="right"
            sx={{
              display: { xs: "block", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: { md: 580, xs: "100%" },
              },
            }}
          >
            <Box>
              <Promocode setBooking={setBooking} setPromo={setPromo} />
            </Box>
          </Drawer>
        </Container>
      </header>
    </>
  );
};

export default Header;
