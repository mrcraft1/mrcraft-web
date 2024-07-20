import React, { useState } from "react";
import {
  Avatar,
  Backdrop,
  Box,
  Button,
  Dialog,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Typography,
} from "@mui/material";

import {
  Book,
  KeyboardArrowRight,
  Logout,
  FavoriteBorder,
  AccountBalanceWalletOutlined,
  DeleteOutline,
  NotificationsOutlined,
  LocationCityOutlined,
} from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import { Link } from "react-router-dom";
import { useTheme } from "@emotion/react";
import toast from "react-hot-toast";
import { t } from "i18next";
import EditProfile from "./EditProfile";
import { useEffect } from "react";
import api from "../../../API/apiCollection";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setProfile } from "../../../redux/UserData";
import { handleAuth } from "../../../redux/authentication";
import FirebaseData from "../../../firebase/config";
import { resetState } from "../../../redux/cart";
import { resetAddressState } from "../../../redux/UserAddress";
import { resetbookmarkState } from "../../../redux/Bookmark";

const Pnavigation = () => {
  const navigate = useNavigate();
  const [deleteAccount, setDeleteAccount] = useState(false);
  const [logout, setLogout] = useState(false);
  const [open, setOpen] = React.useState(false);
  const { auth } = FirebaseData();

  const settings = useSelector((state) => state.Settings).settings;

  const mode = settings?.general_settings?.demo_mode;

  const profile = useSelector((state) => state.UserData)?.profile?.data;
  const authLogin = useSelector((state) => state.authentication)?.isLoggedIn;

  const name = profile?.username;
  const email = profile?.email;
  const profilePicture = profile?.image;
  const mobileNumber = profile?.phone;

  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const theme = useTheme();

  useEffect(() => {
    if (authLogin === false) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //when user want to delete acount
  const handleDeleteAccount = async () => {
    if (mode === "1") {
      return toast.error("You cannot delete this account in Demo mode.");
    }
    await api
      .deleteUserAccount()
      .then((result) => {
        toast.success(result.message);
        localStorage.removeItem("userInfo");
        const firebaseUser = auth.currentUser;
        firebaseUser
          .delete()
          .then(() => {
            // User deleted.
          })
          .catch((error) => {
            console.log(error);
          });
        dispatch(setProfile({}));
        dispatch(resetState());
        dispatch(resetAddressState());
        dispatch(resetbookmarkState());
        dispatch(handleAuth(false));
        navigate("/");
      })
      .catch((error) => console.log("error", error));

    handleClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    dispatch(handleAuth(false));
    dispatch(setProfile({}));
    handleClose();
    navigate("/");
    window.recaptchaVerifier = null
  };

  return (
    <div>
      <Box display={"flex"} maxWidth={"100%"}>
        <Box
          sx={{
            width: "100%",
            height: "auto",
            bgcolor: theme.palette.background.box,
            borderRadius: "10px",
            p: 0,
            mt: 3,
            mb: 3,
          }}
        >
          <Box
            display={"flex"}
            alignItems={"center"}
            maxWidth={"100%"}
            sx={{
              padding: "10px",
              background: theme?.palette?.primary?.main,
              borderRadius: "10px",
              height: { md: 150, xs: "auto" },
            }}
          >
            <Avatar
              onClick={handleOpen}
              size="large"
              className=""
              sx={{
                height: "80px",
                width: "80px",
                border: "5px solid white",
                cursor: "pointer",
                transition: "box-shadow 0.3s",
                "&:hover": {
                  boxShadow: "0 0 10px 2px rgba(0, 0, 0, 0.5)", // Adjust the glow effect as needed
                },
              }}
              src={profilePicture ? profilePicture : ""}
            />

            <Box ml={3} overflow={"hidden"}>
              <Box>
                <Typography variant="h6" color={"white"}>
                  {name !== null ? (
                    name
                  ) : (
                    <Box
                      display={"flex"}
                      gap={1}
                      alignItems={"center"}
                      onClick={handleOpen}
                      sx={{ cursor: "pointer", color: "white" }}
                    >
                      {t("set_name")}
                    </Box>
                  )}
                </Typography>
              </Box>
              <Box>
                <Typography color={"white"} variant={"subtitle2"}>
                  {email !== null ? (
                    email
                  ) : (
                    <Box
                      display={"flex"}
                      mb={1}
                      gap={1}
                      alignItems={"center"}
                      onClick={handleOpen}
                      sx={{ cursor: "pointer", color: "white" }}
                    >
                      {t("set_email")}
                    </Box>
                  )}
                </Typography>
              </Box>
              <Typography variant="subtitle2" color={"white"}>
                {mobileNumber}
              </Typography>
            </Box>

            <Button
              variant="outlined"
              size="small"
              onClick={handleOpen}
              sx={{
                alignSelf: "flex-start",
                ml: "auto",
                backgroundColor: "white",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "white",
                },
              }}
            >
              {t("edit")}
            </Button>
          </Box>

          <Dialog
            sx={{
              color: "#fff",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={open}
          >
            <Box
              sx={{
                background: theme.palette.background.box,
                color: "black",
                width: { xs: "100%", md: "400px" },
              }}
            >
              <Box
                marginLeft={3}
                marginRight={3}
                marginTop={3}
                marginBottom={3}
              >
                <Box display={"flex"}>
                  <Typography
                    fontWeight={"bolder"}
                    marginRight={"auto"}
                    color={theme.palette.color.navLink}
                  >
                    {t("edit_profile")}
                  </Typography>
                  {
                    <ClearIcon
                      onClick={handleClose}
                      sx={{ color: theme.palette.color.navLink }}
                    />
                  }
                </Box>
                <EditProfile handleClose={handleClose} />
              </Box>
            </Box>
          </Dialog>

          <List
            component="nav"
            aria-label="main mailbox folders"
            sx={{ maxHeight: "100%" }}
          >
            {/* link for booking  */}
            <Link
              to={"/profile/booking"}
              className="breadcrumb"
              style={{ marginBottom: "0px" }}
            >
              <ListItem button className="pt-1-pb-1" href="/">
                <ListItemIcon>
                  <Book sx={{ color: theme?.palette?.primary?.main }}/>
                </ListItemIcon>
                <Box
                  component={Link}
                  to={"/profile/booking"}
                  className="breadcrumb"
                  sx={{
                    color: theme.palette.color.navLink,
                  }}
                  primary="My Bookings"
                >
                  {t("bookings")}
                </Box>
                {/* booking address url  */}
                <IconButton
                  sx={{
                    marginLeft: "auto",
                  }}
                >
                  <KeyboardArrowRight fontSize="24px" color="text.tertiary" />
                </IconButton>
              </ListItem>
            </Link>
            <Divider />

            {/* link for address */}
            <Link
              to={"/profile/address"}
              className="breadcrumb"
              style={{ marginBottom: "0px" }}
            >
              <ListItem button className="pt-1-pb-1" href="/">
                <ListItemIcon>
                  <LocationCityOutlined
                    sx={{ color: theme?.palette?.primary?.main }}
                  />
                </ListItemIcon>

                <Box
                  component={Link}
                  to={"/profile/address"}
                  className="breadcrumb"
                  sx={{
                    color: theme.palette.color.navLink,
                  }}
                  primary="My Bookings"
                >
                  {t("manage_addresses")}
                </Box>
                <IconButton
                  sx={{
                    marginLeft: "auto",
                  }}
                >
                  <KeyboardArrowRight fontSize="24px" color="text.tertiary" />
                </IconButton>
              </ListItem>
            </Link>
            <Divider />

            {/* link for paymnet  */}
            <Link
              to={"/profile/payment"}
              className="breadcrumb"
              style={{ marginBottom: "0px" }}
            >
              <ListItem button className="pt-1-pb-1" href="/">
                <ListItemIcon>
                  <AccountBalanceWalletOutlined
                    sx={{ color: theme?.palette?.primary?.main }}
                  />
                </ListItemIcon>

                <Box
                  component={Link}
                  to={"/profile/payment"}
                  className="breadcrumb"
                  sx={{
                    color: theme.palette.color.navLink,
                  }}
                  primary="My Bookings"
                >
                  {t("payment_history")}
                </Box>
                <IconButton
                  sx={{
                    marginLeft: "auto",
                  }}
                >
                  <KeyboardArrowRight fontSize="24px" color="text.tertiary" />
                </IconButton>
              </ListItem>
            </Link>
            <Divider />

            {/* link for bookmark */}
            <Link
              to={"/profile/bookmark"}
              className="breadcrumb"
              style={{ marginBottom: "0px" }}
            >
              <ListItem button className="pt-1-pb-1" href="/">
                <ListItemIcon>
                  <FavoriteBorder
                    sx={{ color: theme?.palette?.primary?.main }}
                  />
                </ListItemIcon>
                <Box
                  component={Link}
                  to={"/profile/bookmark"}
                  className="breadcrumb"
                  sx={{
                    color: theme.palette.color.navLink,
                  }}
                  primary="My Bookings"
                >
                  {t("bookmark")}
                </Box>
                <IconButton
                  sx={{
                    marginLeft: "auto",
                  }}
                >
                  <KeyboardArrowRight fontSize="24px" color="text.tertiary" />
                </IconButton>
              </ListItem>
            </Link>
            <Divider />

            {/* link for notifications  */}
            <Link
              to={"/profile/notifications"}
              className="breadcrumb"
              style={{ marginBottom: "0px" }}
            >
              <ListItem button className="pt-1-pb-1" href="/">
                <ListItemIcon>
                  <NotificationsOutlined
                    sx={{ color: theme?.palette?.primary?.main }}
                  />
                </ListItemIcon>

                <Box
                  component={Link}
                  to={"/profile/notifications"}
                  className="breadcrumb"
                  sx={{
                    color: theme.palette.color.navLink,
                  }}
                  primary="My Bookings"
                >
                  {t("notifications")}
                </Box>
                <IconButton
                  sx={{
                    marginLeft: "auto",
                  }}
                >
                  <KeyboardArrowRight fontSize="24px" color="text.tertiary" />
                </IconButton>
              </ListItem>
            </Link>
            <Divider />

            {/* link for logout form account  */}
            <Box onClick={() => setLogout(true)} className="breadcrumb">
              <ListItem button className="pt-1-pb-1" href="/">
                <ListItemIcon>
                  <Logout sx={{ color: theme?.palette?.primary?.main }} />
                </ListItemIcon>

                <Typography
                  className="breadcrumb"
                  sx={{
                    color: theme.palette.color.navLink,
                    mt: "0px",
                  }}
                  primary="My Bookings"
                  onClick={() => setLogout(true)}
                >
                  {t("logout")}
                </Typography>

                <IconButton
                  sx={{
                    marginLeft: "auto",
                  }}
                >
                  <KeyboardArrowRight fontSize="24px" color="text.tertiary" />
                </IconButton>
              </ListItem>
            </Box>
            <Divider />

            {/* backdrop to open logout account conformation  */}
            <Backdrop className="backdrop" open={logout}>
              <Box
                width={{ xs: 300, md: 500 }}
                height={190}
                display={"flex"}
                alignItems={"cente"}
                borderRadius={"10px"}
                p={2}
                sx={{ background: theme.palette.background.box }}
              >
                <Box display={"block"} alignItems={"cente"} width={"inherit"}>
                  <Typography id="modal-title" variant="h6" component="h2">
                    {t("logout_confirmation")}
                  </Typography>
                  <Typography
                    id="modal-description"
                    className="mt-2"
                    component="p"
                  >
                    {t("are_you_sure_logout")}
                  </Typography>
                  <Box
                    display={"flex"}
                    gap={5}
                    my={5}
                    justifyContent={"center"}
                  >
                    <Button
                      variant="outlined"
                      onClick={() => setLogout(false)}
                      className="mt-2 mr-3"
                    >
                      {t("cancel")}
                    </Button>
                    <Button
                      onClick={handleLogout}
                      variant="contained"
                      color="error"
                      className="mt-2"
                    >
                      {t("logout")}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Backdrop>

            {/* link for delete account  */}
            <Box className="breadcrumb" onClick={() => setDeleteAccount(true)}>
              <ListItem button className="pt-1-pb-1" href="/">
                <ListItemIcon>
                  <DeleteOutline sx={{ color: theme.palette.color.danger }} />
                </ListItemIcon>
                <Typography
                  className="breadcrumb"
                  sx={{
                    color: theme.palette.color.navLink,
                  }}
                  onClick={() => setDeleteAccount(true)}
                  primary="My Bookings"
                >
                  {t("delete_account")}
                </Typography>

                <IconButton
                  sx={{
                    marginLeft: "auto",
                  }}
                >
                  <KeyboardArrowRight fontSize="24px" color="text.tertiary" />
                </IconButton>
              </ListItem>
            </Box>

            {/* backdrop to open delete account conformation  */}
            <Backdrop className="backdrop" open={deleteAccount}>
              <Box
                width={{ xs: 300, md: 500 }}
                height={{ xs: 350, md: 250 }}
                display={"flex"}
                alignItems={"cente"}
                borderRadius={"10px"}
                p={2}
                sx={{ background: theme.palette.background.box }}
              >
                <Box display={"block"} alignItems={"cente"}>
                  <Typography id="modal-title" variant="h6" component="h2">
                    {t("delete_confirmation")}
                  </Typography>
                  <Typography
                    id="modal-description"
                    className="mt-2"
                    component="p"
                  >
                    {t("are_you_sure_delete")}
                  </Typography>
                  <Box
                    display={"flex"}
                    gap={5}
                    my={5}
                    justifyContent={"center"}
                  >
                    <Button
                      variant="outlined"
                      onClick={() => setDeleteAccount(false)}
                    >
                      {t("cancel")}
                    </Button>
                    <Button
                      onClick={handleDeleteAccount}
                      variant="contained"
                      color="error"
                    >
                      {t("delete")}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Backdrop>
          </List>
        </Box>
      </Box>
    </div>
  );
};

export default Pnavigation;
