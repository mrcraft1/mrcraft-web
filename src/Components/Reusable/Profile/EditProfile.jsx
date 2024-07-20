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
import { setProfile, updateData } from "../../../redux/UserData";
import { handleAuth } from "../../../redux/authentication";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const EditProfile = ({ handleClose }) => {
  const theme = useTheme();

  const dispatch = useDispatch();
  const profile = useSelector((state) => state.UserData)?.profile;

  const [userName, setUserName] = useState(profile?.data?.username);
  const [email, setEmail] = useState(profile?.data?.email);
  const [loader, setLoader] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(profile?.data?.phone);
  const [profileImage, setProfileImage] = useState(null);

  function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  const submit = async () => {
    try {
      setLoader(true);

      const Myname = document?.getElementById("editName").value || "";
      const email = document?.getElementById("editEmail").value || "";

      if (Myname === "" && email === "") {
        setLoader(false);
        toast.error(
          "Please fill in the required information in order to update the details."
        );
        return;
      }

      if (email !== "" && !validateEmail(email)) {
        setLoader(false);
        toast.error("Invalid email Address");
        return;
      }

      // dispatch(
      //   updateData({
      //     phone: phoneNumber,
      //   })
      // );

      const response = await api.update_user({
        contact: phoneNumber,
        Myname: Myname,
        email: email,
        profileImage: profileImage,
      });

      setLoader(false);

      if (response.error === false) {
        toast.success(response.message);
        // const temp = { ...profile };
        // temp.data = response.data;
        // dispatch(handleAuth(true));
        dispatch(setProfile(response));
        handleClose();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      handleClose();
      console.error("Error:", error);
      // Optionally, handle specific errors here (e.g., network errors)
      toast.error("An error occurred. Please try again later.");
    }
  };

  // input for image
  const fileInputRef = useRef(null);
  const [userimage, setUserImage] = useState(profile?.data?.image);

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
              id="editName"
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
            {profile?.data?.loginType === "phone" ? (
              <TextField
                id="editEmail"
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
                id="editEmail"
                size="small"
                fullWidth
                variant="outlined"
                value={email}
                disabled
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
            {profile?.data?.loginType === "phone" ? (
              <TextField
                id="editPhone"
                value={profile?.data?.phone}
                size="small"
                fullWidth
                required
                disabled
                variant="outlined"
                sx={{
                  background: theme.palette.background.input,
                  borderRadius: "10px",
                }}
              />
            ) : (
              <TextField
                id="editPhone"
                defaultValue={profile?.data?.phone}
                size="small"
                fullWidth
                required
                onChange={(e) => setPhoneNumber(e.target.value)}
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
            onClick={submit}
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

export default EditProfile;
