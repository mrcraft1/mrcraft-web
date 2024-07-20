/* eslint eqeqeq: 0 */
import { Box, Button, Typography, Dialog, Stack, Divider } from "@mui/material";
import OtpInput from "otp-input-react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import firebaseConfig from "../../../firebase/config";
import toast from "react-hot-toast";
import ClearIcon from "@mui/icons-material/Clear";
import { NavLink } from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";
import { useTheme } from "@emotion/react";
import api from "../../../API/apiCollection";
import { t } from "i18next";
import { useDispatch, useSelector } from "react-redux";
import { setBookmark } from "../../../redux/Bookmark";
import { updateCartItems } from "../../../redux/cart";
import { setAddress } from "../../../redux/UserAddress";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { setProfile, setToken, updateData } from "../../../redux/UserData";
import { handleForce } from "../../../redux/Login";
import { handleAuth } from "../../../redux/authentication";
import RegisterUser from "../../Reusable/Profile/RegisterUser";
import {
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
} from "firebase/auth";
import FirebaseData from "../../../firebase/config";
import {
  getAuthErrorMessage,
  handleFirebaseAuthError,
} from "../../../util/Helper";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";

const Authentication = ({ login, isLogin, setIsloggedIn }) => {
  const settings = useSelector((state) => state.Settings).settings;
  const country_dail_code = process.env.REACT_APP_DIAL_CODE;
  const country_code = process.env.REACT_APP_COUNTRY_CODE;
  // let general_settings = settings?.general_settings;
  const mode = settings?.general_settings?.demo_mode;
  // let country_code = general_settings?.country_code;
  //TODO: might use later.
  const initialBackdrop = false;
  const initialshowOtp = false;
  const [otp, setOtp] = useState(mode === "0" ? "" : "123456");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(initialshowOtp);
  const theme = useTheme();
  const [isMenuBackdropOpen, setIsMenuBackdropOpen] = useState(initialBackdrop);
  const [addUserDetails, setAddUserDetails] = useState(false);
  const [verification, setVerification] = useState(0);
  const [type, setType] = useState("");
  const firebase = firebaseConfig();
  const { auth } = FirebaseData();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.UserData);
  const phoneUtil = PhoneNumberUtil.getInstance();

  const generateRecaptcha = useCallback(() => {
    if (!window?.recaptchaVerifier) {
      const recaptchaContainer = document.getElementById("recaptcha-container");
      if (recaptchaContainer) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          recaptchaContainer,
          {
            size: "invisible",
            callback: (response) => {
              // Recaptcha callback if needed
            },
          }
        );
      } else {
        console.error("recaptcha-container element not found");
      }
    }
  }, [auth]);

  // Effect to initialize recaptchaVerifier and cleanup on unmount
  useEffect(() => {
    generateRecaptcha();
    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier = null;
        } catch (error) {
          console.error("Error clearing recaptchaVerifier:", error);
        }
      }
    };
  }, [generateRecaptcha]);

  // Function to clear recaptchaVerifier
  const clearRecaptcha = useCallback(() => {
    const recaptchaContainer = document.getElementById("recaptcha-container");

    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
        if (recaptchaContainer) {
          recaptchaContainer.remove();
        }
        window.recaptchaVerifier = null;
      } catch (error) {
        console.error("Error clearing recaptchaVerifier:", error);
      }
    }
  }, []);

  const [selectedCountryCode, setSelectedCountryCode] =
    useState(country_dail_code);

  // Event handler to update the selected country code state
  const handlePhoneChange = useCallback((value) => {
    if (value !== undefined) {
      const stringValue = value.toString();
      if (stringValue === "" || isValidPhoneNumber(stringValue)) {
        if (typeof value === "string" && value) {
          try {
            const phoneNumberObject = parsePhoneNumber(value);
            setSelectedCountryCode(phoneNumberObject.countryCallingCode);
          } catch (error) {
            if (error.name === "ParseError") {
              setSelectedCountryCode("");
            }
          }
        } else {
          setSelectedCountryCode("");
        }
      }
    }
  }, []);

  const formatNumber = () => {
    if (ph) {
      try {
        const phoneNumberObject = parsePhoneNumber(ph);
        // Remove country code from the phone number
        const phoneNumber = phoneNumberObject.nationalNumber;
        return phoneNumber;
      } catch (error) {
        if (error.name === "ParseError") {
          return "";
        }
      }
    } else {
      return "";
    }
  };

  // Function to return formatted phone number without country code if it starts with the selected country code

  const resetTimer = () => {
    clearInterval(intervalId); // Clear the existing interval
    setResendTimer(60); // Reset the timer state to 60
    setDisableResend(false); // Re-enable the resend button
    setIntervalId(null); // Reset the intervalId state
  };

  const handleClose = useCallback(() => {
    isLogin(false);
    setShowOTP(initialshowOtp);
    setOtp("");
    setIsMenuBackdropOpen(initialBackdrop);
    setAddUserDetails(false);
    dispatch(handleForce(true));
    resetTimer();
    // Clear recaptchaVerifier on dialog close
    clearRecaptcha();
    // Clear the PhoneInput field
    setPh("");
  }, [clearRecaptcha, dispatch, handleForce, isLogin, resetTimer]);

  const signInWithGoogle = useCallback(
    async (e) => {
      e.preventDefault();
      const provider = new GoogleAuthProvider();
      try {
        const googleResponse = await signInWithPopup(auth, provider);
        const { user } = googleResponse;
        const {
          uid: firebase_id,
          email,
          phoneNumber: phone,
          displayName,
        } = user;

        if (googleResponse) {
          const response = await api.VerifyUser({
            uid: firebase_id,
          });

          setType("google");

          switch (response.message_code) {
            case "101":
              const resultData = await api.registerUser({
                email: email,
                username: displayName,
                mobile: phone ? phone : "",
                web_fcm_id: profile.web_fcm_token,
                loginType: "google",
                uid: firebase_id,
              });
              if (resultData.error === false) {
                isLogin(false);
                setIsloggedIn(true);
                dispatch(setToken(resultData.token));
                dispatch(setProfile(resultData));
                dispatch(handleAuth(true));
                setIsMenuBackdropOpen(true);
                setVerification(1);
                dispatch(
                  updateData({
                    phone: phone,
                    username: displayName,
                    loginType: "google",
                  })
                );
              }
              try {
                const cartResponse = await api.get_cart();
                dispatch(updateCartItems(cartResponse.data));
              } catch (error) {
                console.error("Error fetching cart items:", error);
              }
              break;
            case "102":
              const result = await api.registerUser({
                email: email,
                username: displayName,
                mobile: phone ? phone : "",
                web_fcm_id: profile.web_fcm_token,
                loginType: "google",
                uid: firebase_id,
              });
              if (result.error === false) {
                isLogin(false);
                setIsloggedIn(true);
                dispatch(setToken(result.token));
                dispatch(handleAuth(true));
                dispatch(setProfile(result));
                dispatch(
                  updateData({
                    phone: phone,
                    username: displayName,
                    loginType: "google",
                  })
                );
                setVerification(0);
                setAddUserDetails(() => true); // Call setAddUserDetails with a callback
              }
              break;
            case "103":
              toast.error(
                "Your account is Deactivated. Please contact admin for more information"
              );
              setVerification(0);
              isLogin(false);
              break;
            default:
              toast.error("something went wrong");
          }
        }
      } catch (error) {
        handleFirebaseAuthError(error.code);
        setVerification(0);
        setLoading(false);
      }
    },
    [auth, dispatch, isLogin, setIsloggedIn, handleAuth]
  );

  // Function for SignUP
  const onSignup = useCallback(() => {
    if (!ph) {
      toast.error(t("please enter phone number"));
      return;
    }

    let phoneNumber;
    try {
      // Attempt to parse the phone number
      phoneNumber = phoneUtil.parse(ph, country_code);
    } catch (error) {
      console.error("Error parsing phone number:", error);
      toast.error(t("please enter valid phone number"));
      return;
    }

    if (!phoneUtil.isValidNumber(phoneNumber)) {
      toast.error(t("please enter valid phone number"));
      return;
    }

    // Format the phone number to E.164 format for Firebase
    const formattedPhoneNumber = phoneUtil.format(
      phoneNumber,
      PhoneNumberFormat.E164
    );

    handlePhoneChange(ph);

    setLoading(true);
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, formattedPhoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        isLogin(false);
        toast.success("OTP sent successfully!");
        setType("phone");
      })
      .catch((error) => {
        console.log("error", error);
        setLoading(false);
        getAuthErrorMessage(error.code);
        clearRecaptcha();
      });
  }, [firebase.auth, ph, country_code, phoneUtil, isLogin, generateRecaptcha]);

  const verifyUser = useCallback(
    async (res) => {
      try {
        const formattedPhoneNumber = formatNumber();
        const response = await api.VerifyUser({
          phone: formattedPhoneNumber,
          country_code: "+" + selectedCountryCode,
          uid: res.user.uid,
        });

        switch (response.message_code) {
          case "101":
            setVerification(1);
            await getToken(res);
            handleClose();
            clearRecaptcha();
            break;
          case "102":
            setVerification(0);
            setIsMenuBackdropOpen(true);
            setAddUserDetails(true);
            const result = await api.registerUser({
              mobile: formattedPhoneNumber,
              country: "+" + selectedCountryCode,
              web_fcm_id: profile.web_fcm_token,
              uid: res.user.uid,
              loginType: "phone",
            });
            dispatch(setToken(result.token));
            dispatch(setProfile(result));
            break;
          case "103":
            setVerification(0);
            toast.error(
              "Your account is Deactivated. Please contact admin for more information"
            );
            handleClose();
            break;
          default:
            setVerification(1);
            await getToken(res);
        }
      } catch (error) {
        console.log("error", error);
        setVerification(0);
        console.error("Verify User Error:", error);
        // Handle error appropriately, e.g., show an error message to the user
      }
      // eslint-disable-next-line
    },
    // eslint-disable-next-line
    [ph, selectedCountryCode, dispatch, clearRecaptcha, verification]
  );

  //function to getting token when user logged in

  const getToken = useCallback(
    async (res) => {
      try {
        const formattedPhoneNumber = formatNumber();
        const response = await api.registerUser({
          mobile: formattedPhoneNumber,
          country: "+" + selectedCountryCode,
          web_fcm_id: profile.web_fcm_token,
          loginType: "phone",
          uid: res.user.uid,
        });

        isLogin(false);
        setIsloggedIn(true);

        const { lat, lng } = localStorage; // Destructuring for concise variable access
        dispatch(setToken(response.token));
        dispatch(setProfile(response));
        dispatch(handleAuth(true));
        toast.success(response.message);

        if (verification === 1) {
          try {
            const bookmarksResponse = await api.bookmark({
              type: "list",
              lat: lat,
              lng: lng,
            });

            if (!bookmarksResponse.error) {
              const markedArray = bookmarksResponse.data.map((item, index) => ({
                id: index + 1,
                partner_id: item.partner_id,
              }));
              dispatch(setBookmark(markedArray));
            }
          } catch (error) {
            console.error("Error fetching bookmarks:", error);
          }

          try {
            const cartResponse = await api.get_cart();
            dispatch(updateCartItems(cartResponse.data));
          } catch (error) {
            console.error("Error fetching cart items:", error);
          }

          try {
            const addressResponse = await api.getAddress();
            dispatch(setAddress(addressResponse.data));
          } catch (error) {
            console.error("Error fetching address:", error);
          }
        }
      } catch (error) {
        console.error("Error getting token:", error);
      }
      // eslint-disable-next-line
    },
    [ph, dispatch, isLogin, selectedCountryCode, verification]
  );

  //Function for Otp Verification
  const onOTPVerify = useCallback(async () => {
    if (otp === "") {
      toast.error("Please enter the verification code!");
      return;
    }

    setLoading(true);

    try {
      const res = await window.confirmationResult.confirm(otp);
      if (res.user) {
        setLoading(false);
        await verifyUser(res);
        clearRecaptcha();
      } else {
        window.recaptchaVerifier.render().then((widgetId) => {
          window.recaptchaVerifier.reset(widgetId);
        });
        setLoading(false);
        toast.error("Invalid verification code. Please try again!");
      }
    } catch (error) {
      switch (error.code) {
        case "INVALID_CODE":
          toast.error("Invalid Code");
          break;
        case "auth/invalid-verification-code":
          toast.error("Invalid Verification Code");
          break;
        case 400:
          toast.error("To many request please try again later");
          break;
        case "auth/too-many-requests":
          toast.error(
            "Have blocked all requests from this device due to unusual activity. Try again later."
          );
          break;
        // Add more cases for other error types if needed
        default:
          toast.error("An error occurred. Please try again later.");
          break;
      }

      setLoading(false);
    }
  }, [otp, verifyUser, clearRecaptcha]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onOTPVerify();
    }
  };

  //Resend OTP
  const [resendTimer, setResendTimer] = useState(60);
  const [disableResend, setDisableResend] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const onResendOTP = async () => {
    try {
      onSignup(); // Send OTP
      setDisableResend(true);

      const id = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      setIntervalId(id); // Store the intervalId in state

      setTimeout(() => {
        clearInterval(id);
        setResendTimer(60);
        setDisableResend(false);
      }, 60000);
    } catch (error) {
      console.error("Error sending OTP:", error);
      // Handle OTP sending error (e.g., display an error message to the user)
    }
  };

  useEffect(() => {
    // Clear the timer interval when the component unmounts
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  useEffect(() => {
    if (!showOTP) {
      resetTimer();
    }
  }, [showOTP]);

  return (
    <Box>
      {/* Enter Mobile Number */}

      <Dialog
        className="qqq"
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "540px", // Set your width here
            },
          },
        }}
        open={login}
      >
        <Box
          sx={{
            color: "black",
            background: theme.palette.background.box,
            width: { xs: "100%", md: "100%" },
            textAlign: "center",
          }}
          className="sdfdf"
        >
          <Box maxWidth={"100%"} marginTop={3} marginBottom={3}>
            <Box
              display={isMenuBackdropOpen ? "none" : "flex"}
              alignItems={"center"}
              marginRight={3}
              marginLeft={3}
              className="login_screen"
            >
              <Typography
                marginRight={"auto"}
                fontSize={26}
                fontWeight={600}
                color={theme.palette.color.textColor}
              >
                {t("login")}
              </Typography>
              {
                <ClearIcon
                  onClick={() => handleClose()}
                  sx={{ color: theme.palette.icons.icon, cursor: "pointer" }}
                  fontSize="medium"
                />
              }
            </Box>

            <hr className="divider_line " />

            <Box marginRight={3} marginLeft={3}>
              <Box
                sx={{
                  marginTop: "40px",
                  marginBottom: "60px",
                }}
              >
                <Typography
                  sx={{
                    color: theme.palette.color.textColor,
                    letterSpacing: 1,
                  }}
                  textAlign={"left"}
                  fontSize={22}
                  fontWeight={600}
                >
                  {t("welcome")}
                </Typography>

                <Typography
                  sx={{ color: theme.palette.color.textColor, opacity: 0.76 }}
                  fontSize={16}
                  fontWeight={400}
                  textAlign={"left"}
                >
                  {t("send_verification_code")}
                </Typography>
              </Box>
              <Box
                sx={{
                  mt: 5,
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <PhoneInput
                  defaultCountry={country_code}
                  disabledCountryCode={true}
                  countryCallingCodeEditable={true}
                  international={true}
                  value={ph}
                  onChange={setPh}
                  inputStyle={{ width: "100%", height: "54px" }}
                  className="custom-phone-input"
                />
              </Box>
              <Button
                onClick={onSignup}
                variant="contained"
                disableElevation
                size="large"
                fullWidth
                className="border-radius-2 lower-case-btn"
                sx={{ borderRadius: "8px", textTransform: "initial" }}
                disabled={loading == true ? true : false}
              >
                {loading && <FontAwesomeIcon icon={faSpinner} spin />}
                <span>{t("continue")}</span>
              </Button>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  margin: "30px auto",
                }}
              >
                <Divider
                  sx={{ flex: "1", color: theme.palette.color.textColor }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    margin: "0 10px",
                    whiteSpace: "nowrap",
                  }}
                  color={theme.palette.color.textColor}
                >
                  {t("or_sign_with")}
                </Typography>
                <Divider
                  sx={{ flex: "1", color: theme.palette.color.textColor }}
                />
              </Box>
              <Button
                onClick={signInWithGoogle}
                disableElevation
                className="google_btn"
                size="large"
                fullWidth
                sx={{ mb: 5, borderRadius: "8px", textTransform: "initial" }}
              >
                <span>
                  <img src={"/images/Google.svg"} alt="google" />
                  {t("login_with_gmail")}
                </span>
              </Button>
              <Typography color={"gray"} fontSize={15}>
                {t("agree_to_out")}
              </Typography>
              <Typography
                fontSize={15}
                display={"flex"}
                justifyContent={"center"}
              >
                <NavLink
                  style={{
                    color: theme?.palette?.primary?.main,
                    textDecoration: "none",
                    fontWeight: "500",
                  }}
                  to={"/terms-and-conditions"}
                  onClick={() => isLogin(false)}
                >
                  {t("terms")}
                </NavLink>
                &nbsp;
                <p style={{ color: theme.palette.color.navLink }}>&</p>
                &nbsp;
                <NavLink
                  style={{
                    color: theme?.palette?.primary?.main,
                    textDecoration: "none",
                    fontWeight: "500",
                  }}
                  to={"/privacy-policies"}
                  onClick={() => isLogin(false)}
                >
                  {t("privacy")}
                </NavLink>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Dialog>

      {/* Enter OTP */}

      <Dialog
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        maxWidth="lg"
        open={showOTP}
      >
        <Box
          sx={{
            color: "black",
            background: theme.palette.background.box,
            width: { xs: "100%", md: "100%" },
            textAlign: "center",
          }}
        >
          <Box
            marginLeft={3}
            maxWidth={"100%"}
            marginRight={3}
            marginTop={3}
            marginBottom={3}
          >
            <Box
              display={isMenuBackdropOpen ? "none" : "flex"}
              alignItems={"center"}
            >
              <Typography
                marginRight={"auto"}
                fontSize={20}
                color={theme.palette.color.textColor}
              >
                {t("login")}
              </Typography>
              {
                <ClearIcon
                  onClick={() => handleClose()}
                  sx={{ color: theme.palette.icons.icon, cursor: "pointer" }}
                  fontSize="large"
                />
              }
            </Box>

            <Box mt={4}>
              <label
                htmlFor="otp"
                className="font-bold text-xl text-white text-center"
              >
                <Typography
                  sx={{
                    color: theme.palette.color.navLink,
                    letterSpacing: 1,
                  }}
                  variant="h6"
                  fontSize={22}
                >
                  {t("enter_verification_code")}
                </Typography>
                <Typography
                  sx={{
                    color: theme.palette.color.secondary,
                    fontSize: 15,
                    mt: 1,
                  }}
                >
                  {t("sent_verification_code")}
                </Typography>
                <Typography color={theme?.palette?.primary?.main} fontSize={15}>
                  {ph}
                </Typography>
              </label>
            </Box>
            <Box marginTop={5} mb={2} onKeyPress={handleKeyPress}>
              <OtpInput
                value={otp}
                onChange={setOtp}
                OTPLength={6}
                otpType="number"
                disabled={false}
                autoFocus
                className="opt-container"
              ></OtpInput>
            </Box>

            <Stack spacing={3}>
              <Box width={"100%"} display={"flex"} justifyContent={"center"}>
                <Button
                  variant="outlined"
                  sx={{
                    color: theme?.palette?.primary?.main,
                    border: "1px solid gray",
                    textTransform: "none",
                    borderRadius: "8px",
                    width: "50%",
                  }}
                  onClick={onResendOTP}
                  disabled={disableResend}
                >
                  {disableResend ? (
                    <Box display={"flex"} alignItems={"center"} gap={1}>
                      {t("resend_otp")} :
                      <Typography variant="subtitle2" color={"#0277FA"}>
                        {resendTimer}s
                      </Typography>
                    </Box>
                  ) : (
                    "Resend OTP"
                  )}
                </Button>
              </Box>

              <Button
                onClick={onOTPVerify}
                disabled={loading == true ? true : false}
              >
                <Button
                  variant="contained"
                  size="medium"
                  fullWidth
                  disabled={loading == true ? true : false}
                  sx={{
                    borderRadius: "8px",
                    textTransform: "none",
                    width: "100% !important",
                  }}
                >
                  {loading && <FontAwesomeIcon icon={faSpinner} spin />}
                  {t("verify_and_process")}
                </Button>
              </Button>
            </Stack>
            {/* <Box sx={{ mt: 4, mb: 2, width: "100%" }} display={"flex"} flexDirection={"column"} alignItems={"center"}>
                                        </Box> */}
          </Box>
        </Box>
      </Dialog>

      {/* Edit Profile */}

      <Dialog
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={addUserDetails}
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
            maxWidth={"100%"}
            marginRight={3}
            marginTop={3}
            marginBottom={3}
          >
            <Box
              display={isMenuBackdropOpen ? "none" : "flex"}
              alignItems={"center"}
            >
              <Typography
                marginRight={"auto"}
                fontSize={20}
                color={theme.palette.color.textColor}
              >
                {t("sign_up")}
              </Typography>
              {
                <ClearIcon
                  onClick={() => handleClose()}
                  sx={{ color: theme.palette.icons.icon, cursor: "pointer" }}
                  fontSize="large"
                />
              }
            </Box>

            <Box mt={4}>
              <RegisterUser
                mobile={ph}
                type={type}
                setAddUserDetails={setAddUserDetails}
                formatNumber={formatNumber}
              />
            </Box>
          </Box>
        </Box>
      </Dialog>

      <div id="recaptcha-container"></div>
    </Box>
  );
};

export default Authentication;
