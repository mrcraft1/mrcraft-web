/* eslint eqeqeq: 0 */

import { useTheme } from "@emotion/react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  FormLabel,
  TextField,
} from "@mui/material";
import { t } from "i18next";
import React, { useRef, useState } from "react";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import toast from "react-hot-toast";
import api from "../../../API/apiCollection";
import { useSelector, useDispatch } from "react-redux";
import { handleAuth } from "../../../redux/authentication";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { setProfile, updateData } from "../../../redux/UserData";

const RegisterUser = ({ mobile, type, setAddUserDetails, formatNumber }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.UserData);
  let profileEmail = "";
  let profileUsername = "";

  if (profile?.profile?.data) {
    profileEmail = profile.profile.data.email;
    profileUsername = profile.profile.data.username;
  }

  const [userName, setUserName] = useState(profileUsername);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState(profileEmail);
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState(null);

  function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  const submite = async () => {
    setLoader(true);
    const Myname = userName;
    const emailData = email;

    if (emailData !== "" && !validateEmail(emailData)) {
      setLoader(false);
      toast.error("Invalid email Address");
      return;
    }

    let finalMobile = type === "phone" ? mobile : phoneNumber;
    await api
      .update_user({
        contact: finalMobile,
        Myname: Myname,
        email: emailData,
        profileImage: profileImage,
      })
      .then((response) => {
        setLoader(false);
        if (response.error == false) {
          toast.success(response.message);
          // dispatch(updateData(response.data));
          dispatch(handleAuth(true));
          dispatch(setProfile(response));
          navigate("/");
          setAddUserDetails(false);
        } else {
          Object.values(response.message).forEach((key) => {
            toast.error(key);
          });
        }
      })
      .catch((error) => console.log("error", error));
  };

  // input for image
  const fileInputRef = useRef(null);
  const [userimage, setUserImage] = useState(profile?.image);

  const handleFileInputChange = (event) => {
    const selectedFile = event.target.files[0];
    setProfileImage(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target.result; // Correctly obtain the image data URL
        setUserImage(imageDataUrl);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleBadgeClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // if user name already set and user want to modify that

  return (
    <div>
      <Avatar
        size="lg"
        sx={{
          height: "80px",
          width: "80px",
          border: "5px solid black",
          borderRadius: "100px",
          marginTop: "30px",
          marginBottom: "30px",
          marginInlineStart: { xs: "25%", md: "122px" },
        }}
        src={userimage ? userimage : ""}
      ></Avatar>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="display-none"
        onChange={handleFileInputChange}
      />
      <Badge onClick={handleBadgeClick}>
        <EditRoundedIcon
          sx={{
            color: "white",
            background: "blue",
            borderRadius: "50px",
            ml: { xs: "360%", md: 23 },
            mt: -9,
            border: "3px solid white",
            cursor: "pointer",
          }}
        />
      </Badge>

      <form>
        <Box display={"flex"} flexDirection={"column"} gap={2}>
          <Box sx={{ borderRadius: "10px" }}>
            <FormLabel sx={{ fontWeight: "bolder" }}>{t("name")}</FormLabel>
            <TextField
              placeholder={t("enter_name")}
              size="small"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              fullWidth
              variant="outlined"
              name="name"
              required
              sx={{
                background: theme.palette.background.input,
                borderRadius: "10px",
              }}
            />
          </Box>

          <Box sx={{ borderRadius: "10px" }}>
            <FormLabel sx={{ fontWeight: "bolder" }}>{t("email")}</FormLabel>
            {type === "phone" ? (
              <TextField
                placeholder={t("enter_email")}
                size="small"
                fullWidth
                variant="outlined"
                defaultValue={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                type="email"
                required
                sx={{
                  background: theme.palette.background.input,
                  borderRadius: "10px",
                }}
              />
            ) : (
              <TextField
                placeholder={t("enter_email")}
                size="small"
                fullWidth
                variant="outlined"
                value={email}
                disabled // Conditionally disable the TextField
                name="email"
                type="email"
                sx={{
                  background: theme.palette.background.input,
                  borderRadius: "10px",
                }}
              />
            )}
          </Box>

          <Box sx={{ borderRadius: "10px" }}>
            <FormLabel sx={{ fontWeight: "bolder" }}>{t("phone")}</FormLabel>

            {type === "phone" ? (
              <TextField
                value={mobile}
                size="small"
                fullWidth
                disabled // Conditionally disable the TextField
                variant="outlined"
                sx={{
                  background: theme.palette.background.input,
                  borderRadius: "10px",
                }}
              />
            ) : (
              <TextField
                defaultValue={mobile}
                onChange={(e) => setPhoneNumber(e.target.value)}
                size="small"
                fullWidth
                required
                variant="outlined"
                sx={{
                  background: theme.palette.background.input,
                  borderRadius: "10px",
                }}
              />
            )}
          </Box>

          <Button
            variant="contained"
            size="medium"
            fullWidth
            onClick={submite}
            disabled={loader}
            sx={{
              backgroundColor: theme.palette.background.buttonColor,
              "&:hover": {
                backgroundColor: theme.palette.background.buttonColor,
              },
            }}
            startIcon={
              loader == true ? <FontAwesomeIcon icon={faSpinner} spin /> : ""
            }
          >
            {t("save_profile")}
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default RegisterUser;
