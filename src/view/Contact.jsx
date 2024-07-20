import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";
import { useTheme } from "@emotion/react";
import { t } from "i18next";
import { ContactGrid, TextFieldTheme } from "../CSS/ThemeStyle";
import api from "../API/apiCollection";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setContacts } from "../redux/Pages";
import toast from "react-hot-toast";
import { IoLocationOutline } from "react-icons/io5";
import { GoClock } from "react-icons/go";
import { FiAtSign } from "react-icons/fi";
import { LuPhoneCall } from "react-icons/lu";
import {
  faAt,
  faClock,
  faLocationDot,
  faPhoneVolume,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "@mui/material";
import Breadcrumb from "../Components/Reusable/Breadcrumb/Breadcrumb.jsx";

const ContactForm = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const pages = useSelector((state) => state.Pages);
  let settings = useSelector((state) => state.Settings);

  settings = settings && settings.settings.general_settings;

  // eslint-disable-next-line no-unused-vars
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        if (pages?.contact === undefined) {
          // Added nullish check for pages
          const response = await api.get_settings();
          dispatch(setContacts(response.data.contact_us.contact_us));
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, [pages.contact, dispatch]);

  const SendMessage = async () => {
    if (email !== "" && !validateEmail(email)) {
      toast.error("Invalid email Address");
      return;
    }

    try {
      const response = await api.send_message({
        name: name,
        subject: subject,
        message: message,
        email: email,
      });

      if (response.error === true) {
        Object.values(response.message).forEach((e) => {
          toast.error(e);
        });
      } else {
        toast.success(response.message);
        setName(" ");
        setSubject(" ");
        setMessage(" ");
        setEmail(" ");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again later.");
    }
  };

  const CompanyMapLocation = ({ mapLocation }) => {
    // Extract the iframe code from the mapLocation string
    const iframeCode =
      mapLocation && mapLocation.match(/<iframe(.*?)<\/iframe>/s)[0];

    // Modify the width and height attributes of the iframe
    const modifiedIframeCode =
      iframeCode &&
      iframeCode.replace(/(width|height)=".*?"/g, (match, attr) => {
        if (attr === "width") {
          return 'width="100%"';
        } else if (attr === "height") {
          return 'height="450px"';
        }
        return match;
      });

    return <div dangerouslySetInnerHTML={{ __html: modifiedIframeCode }} />;
  };

  return (
    <>
      <Breadcrumb home={t("home")} pageOne={t("contact_us")} />

      <Container sx={{ pr: { xs: 0, md: "16px" } }} className="mainContainer">
        <ContactGrid container spacing={3} borderRadius={"10px"} mt={3}>
          {/* Grid setting for left navigation/section */}
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <Box
              p={{ xs: "16px", md: "20px" }}
              sx={{
                borderRight: "0.1px solid  #c8b4b430",
              }}
            >
              <Typography
                variant="body1"
                color={theme?.palette?.primary?.main}
                fontSize={16}
              >
                {t("lets_talk")}
              </Typography>
              <Typography variant="h5" gutterBottom>
                <strong>{t("get_in_touch")}</strong>
              </Typography>
              <Box mt={6}>
                {/* Call here */}
                <Box display={"flex"} alignItems={"center"} gap={2} mb={5}>
                  <Box
                    sx={{ backgroundColor: theme?.palette?.primary?.main }}
                    borderRadius={"8px"}
                    p={1.5}
                  >
                    <LuPhoneCall
                      icon={faPhoneVolume}
                      class="fa-2xl w-100"
                      color="white"
                    />
                  </Box>

                  <Box display={"flex"} flexDirection={"column"}>
                    <Typography
                      variant="body1"
                      color={theme?.palette?.primary?.main}
                      fontSize={16}
                    >
                      {t("talk_with_us")}
                    </Typography>
                    <Box
                      component={"a"}
                      href={`tel: +${process.env.REACT_APP_DIAL_CODE}${settings?.phone}`}
                      sx={{ textDecoration: "none" }}
                    >
                      <Typography
                        sx={{ textDecoration: "none" }}
                        color={theme.palette.color.navLink}
                        fontSize={18}
                      >
                        <Link
                          href={`tel: +${process.env.REACT_APP_DIAL_CODE}${settings?.phone}`}
                        >
                          {settings?.country_code} {settings?.phone}
                        </Link>
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Divider
                  sx={{
                    width: { xs: "100%", md: "106.5%" },
                  }}
                />

                {/* Email Here */}
                <Box display={"flex"} alignItems={"center"} gap={2} my={5}>
                  <Box
                    sx={{ backgroundColor: theme?.palette?.primary?.main }}
                    borderRadius={"8px"}
                    p={1.5}
                  >
                    <FiAtSign
                      icon={faAt}
                      class="fa-2xl"
                      width={"100%"}
                      color="white"
                    />
                  </Box>

                  <Box display={"flex"} flexDirection={"column"}>
                    <Typography
                      variant="body1"
                      color={theme?.palette?.primary?.main}
                      fontSize={16}
                    >
                      {t("quick_email")}
                    </Typography>
                    <Box
                      component={"a"}
                      href={`mailto: ${settings?.support_email}`}
                      sx={{ textDecoration: "none" }}
                    >
                      <Typography
                        sx={{ textDecoration: "none" }}
                        color={theme.palette.color.navLink}
                        fontSize={18}
                      >
                        <Link href={"mailto:" + settings?.support_email}>
                          {settings?.support_email}
                        </Link>
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Divider
                  sx={{
                    width: { xs: "100%", md: "106.5%" },
                  }}
                />

                {/* offuce address here */}
                <Box display={"flex"} alignItems={"center"} gap={2} my={5}>
                  <Box
                    sx={{ backgroundColor: theme?.palette?.primary?.main }}
                    borderRadius={"8px"}
                    p={1.5}
                  >
                    <IoLocationOutline
                      icon={faLocationDot}
                      class="fa-2xl"
                      width={"100%"}
                      color="white"
                    />
                  </Box>

                  <Box display={"flex"} flexDirection={"column"}>
                    <Typography
                      variant="body1"
                      color={theme?.palette?.primary?.main}
                      fontSize={16}
                    >
                      {t("office_address")}
                    </Typography>
                    <Typography
                      color={theme.palette.color.navLink}
                      fontSize={18}
                      dangerouslySetInnerHTML={{ __html: settings?.address }}
                    ></Typography>
                  </Box>
                </Box>
                <Divider
                  sx={{
                    width: { xs: "100%", md: "106.5%" },
                  }}
                />

                {/* opening Time */}
                <Box display={"flex"} alignItems={"center"} gap={2} mt={5}>
                  <Box
                    sx={{ backgroundColor: theme?.palette?.primary?.main }}
                    borderRadius={"8px"}
                    p={1.5}
                  >
                    <GoClock
                      icon={faClock}
                      class="fa-2xl"
                      width={"100%"}
                      color="white"
                    />
                  </Box>

                  <Box display={"flex"} flexDirection={"column"}>
                    <Typography
                      variant="body1"
                      color={theme?.palette?.primary?.main}
                      fontSize={16}
                    >
                      {t("opening_hours")}
                    </Typography>
                    <Typography
                      color={theme.palette.color.navLink}
                      fontSize={18}
                    >
                      9:00 AM to 7:00 PM
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* grid setting for right navigation/section  */}
          <Grid
            item
            xs={12}
            sm={12}
            md={8}
            lg={8}
            xl={8}
            sx={{ pr: "24px" }}
            mb={5}
          >
            <Box display={{ md: "block" }}>
              <Box
                component="form"
                padding={{ xs: "16px", md: "32px" }}
                mt={{ xs: "15px", md: "80px" }}
                height={"500px"}
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                marginTop={10}
              >
                <Typography variant="h3" display={{ xs: "none", md: "none" }}>
                  {t("contact_us")}
                </Typography>

                <Box display={{ md: "flex" }} sx={{ position: "relative" }}>
                  <Typography
                    display={{ xs: "none", md: "flex" }}
                    justifyContent="start"
                    variant="h6"
                    fontSize={16}
                  >
                    {t("name")}
                  </Typography>
                  <Typography
                    textAlign="center"
                    display={{ xs: "none", md: "flex" }}
                    // marginLeft={{ xs: 10, md: 57 }}
                    sx={{ position: "absolute", left: "51.5%" }}
                    variant="h6"
                    fontSize={16}
                  >
                    {t("email")}
                  </Typography>
                </Box>

                <Box display={{ xs: "block", md: "flex" }} mb={6}>
                  <TextFieldTheme
                    fullWidth
                    size="small"
                    id="name"
                    placeholder="Enter Name"
                    variant="outlined"
                    sx={{
                      marginBottom: { xs: 4, md: 0 },
                      marginRight: { md: 2 },
                      borderRadius: "5px", // Apply border radius to the input field
                      "& fieldset": {
                        borderRadius: "5px", // Apply border radius to the background
                      },
                    }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <TextFieldTheme
                    value={email}
                    fullWidth
                    size="small"
                    id="email"
                    placeholder="Enter Email"
                    variant="outlined"
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{
                      marginLeft: { xs: 0, md: 1 },
                      borderRadius: "5px", // Apply border radius to the input field
                      "& fieldset": {
                        borderRadius: "5px", // Apply border radius to the background
                      },
                    }}
                  />
                </Box>

                <Typography
                  justifyContent="start"
                  variant="h6"
                  display={{ xs: "none", md: "flex" }}
                  fontSize={16}
                >
                  {t("subject")}
                </Typography>
                <TextFieldTheme
                  fullWidth
                  size="small"
                  id="email"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter Subject"
                  variant="outlined"
                  sx={{
                    marginBottom: 6,
                    borderRadius: "5px", // Apply border radius to the input field
                    "& fieldset": {
                      borderRadius: "5px", // Apply border radius to the background
                    },
                  }}
                />

                <Typography
                  justifyContent="start"
                  variant="h6"
                  display={{ xs: "none", md: "flex" }}
                  fontSize={16}
                >
                  {t("message")}
                </Typography>
                <TextFieldTheme
                  fullWidth
                  multiline
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter Message"
                  variant="outlined"
                  sx={{
                    marginBottom: "16px",
                    borderRadius: "5px", // Apply border radius to the input field
                    "& fieldset": {
                      borderRadius: "5px", // Apply border radius to the background
                    },
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  className="back-theme mt-2"
                  sx={{
                    marginLeft: { xs: "auto%", md: "78.5%" },
                    textTransform: "none",
                    padding: "10px 12px",
                    backgroundColor: theme.palette.background.buttonColor,
                    "&:hover": {
                      backgroundColor: theme.palette.background.buttonColor,
                    },
                  }}
                  onClick={(e) => SendMessage()}
                >
                  {t("submit_message").replace(" ", "\u00A0")}
                </Button>
              </Box>
            </Box>
          </Grid>
        </ContactGrid>

        {/* Map of location Time Square  */}
        <Box marginTop={5} marginBottom={3} ml={-3}>
          <CompanyMapLocation mapLocation={settings?.company_map_location} />
        </Box>
      </Container>
    </>
  );
};

export default ContactForm;
