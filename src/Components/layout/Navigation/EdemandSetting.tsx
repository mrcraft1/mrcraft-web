import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { useTranslation } from "react-i18next";
import { useTheme } from "@emotion/react";
import { BsCloudSun, BsCloudMoon } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { themeSuccess } from "../../../redux/Theme";
import { EdemandSettingProps, ThemeRootState } from "../../../typescriptTypes/globalTypes";


const EdemandSetting: React.FC<EdemandSettingProps> = ({
  changeLight,
  changeDark,
  setOpenSetting,
}) => {
  const [lang, setLang] = useState<string>("en");
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const themeSelector = useSelector((state: ThemeRootState) => state.theme);

  useEffect(() => {
    const storedLang = localStorage.getItem("i18nextLng");
    if (storedLang) {
      setLang(
        storedLang === "en" || storedLang === "en-US" ? "en" : storedLang
      );
    }
  }, [lang]);

  const changeLanguage = (lng: string) => {
    localStorage.setItem("language", lng);
    i18n.changeLanguage(lng);
    setLang(lng);
  };

  const handleCloseSetting = () => {
    setOpenSetting(false);
  };

  const handleChangeLanguage = (event: SelectChangeEvent<string>) => {
    const selectedLang = event.target.value;
    if (!selectedLang) {
      setLang("en");
    } else {
      setLang(selectedLang);
      localStorage.setItem("i18nextLng", selectedLang);
      handleCloseSetting();
    }
    changeLanguage(selectedLang);
  };

  const darkMode = localStorage.getItem("darkMode");

  const handleChangeTheme = (
    event: React.MouseEvent<HTMLElement>,
    nextView: string
  ) => {
    dispatch(themeSuccess(nextView));
  };

  const theme = useTheme() as any;

  return (
    <div>
      <Box width="100%">
        <AppBar
          position="static"
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: theme?.palette?.primary?.main,
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              gap={2}
            >
              <IconButton
                size="medium"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{
                  border: 1,
                  borderRadius: "12px",
                  backgroundColor: "white",
                  "&:hover": {
                    backgroundColor: "white",
                  },
                }}
              >
                <SettingsOutlinedIcon fontSize="medium" color="primary" />
              </IconButton>

              <Typography
                variant="body1"
                component="div"
                className="edemand-flexgrow"
              >
                {process.env.REACT_APP_NAME + " " + t("settings")}
              </Typography>
            </Box>
            <Box>
              <IconButton
                onClick={handleCloseSetting}
                sx={{
                  border: 1,
                  backgroundColor: "white",
                  padding: 0,
                  "&:hover": {
                    backgroundColor: "white",
                  },
                }}
                size="small"
              >
                <CloseIcon color="primary" fontSize="small" />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        <Box display="flex" mx={3} my={5} flexDirection="column">
          <FormLabel sx={{ fontWeight: "bold" }}> {t("theme")} </FormLabel>
          <Box mt={1}>
            <ToggleButtonGroup
              value={themeSelector?.data}
              exclusive
              onChange={handleChangeTheme}
              sx={{ width: "100%", display: "flex", gap: "2" }}
            >
              <Box
                display="flex"
                width="100%"
                gap={4}
                flexDirection={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                alignContent="center"
              >
                <ToggleButton
                  onClick={changeLight}
                  value="list"
                  aria-label="list"
                  sx={{
                    backgroundColor: "#2560FC1A",
                    width: "100%",
                    "&:hover": {
                      backgroundColor: "#2560FC1A",
                    },
                  }}
                >
                  <Box
                    display="flex"
                    width="100%"
                    justifyContent="space-between"
                    alignContent="center"
                    gap={1}
                  >
                    <Box display="flex" alignContent="center" gap={2}>
                      <BsCloudSun className="theme-btn" />
                      <Box display="flex" flexDirection="column">
                        <Typography variant="body1">{t("light")}</Typography>
                        <Typography variant="caption">{t("mode")}</Typography>
                      </Box>
                    </Box>
                    <Box>
                      <RadioGroup
                        defaultValue="light"
                        name="radio-buttons-group"
                      >
                        <FormControlLabel
                          label=""
                          value={darkMode === "true" ? "dark" : "light"}
                          control={<Radio size="small" />}
                        />
                      </RadioGroup>
                    </Box>
                  </Box>
                </ToggleButton>

                <ToggleButton
                  onClick={changeDark}
                  value="module"
                  aria-label="module"
                  sx={{
                    width: "100%",
                    backgroundColor: "#343F53",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#343F53",
                    },
                  }}
                >
                  <Box
                    display="flex"
                    alignContent="center"
                    justifyContent="space-between"
                    width="100%"
                    gap={1}
                  >
                    <Box display="flex" alignContent="center" gap={2}>
                      <BsCloudMoon className="theme-btn" />
                      <Box display="flex" flexDirection="column">
                        <Typography variant="body1">{t("dark")}</Typography>
                        <Typography variant="caption">{t("mode")}</Typography>
                      </Box>
                    </Box>
                    <Box>
                      <RadioGroup
                        defaultValue="dark"
                        name="radio-buttons-group"
                      >
                        <FormControlLabel
                          label=""
                          value={darkMode === "true" ? "dark" : "light"}
                          control={<Radio size="small" />}
                        />
                      </RadioGroup>
                    </Box>
                  </Box>
                </ToggleButton>
              </Box>
            </ToggleButtonGroup>
          </Box>
        </Box>
        {/* Language selection section */}
        <Box display="flex" justifyContent="center" mx={3}>
          <FormControl sx={{ maxWidth: "100%", width: "100%" }}>
            <FormLabel sx={{ mb: 1 }}> {t("language")} </FormLabel>
            <Select
              id="language"
              fullWidth
              input={<OutlinedInput fullWidth />}
              onChange={handleChangeLanguage}
              defaultValue={lang}
            >
              <MenuItem
                value="en"
                onClick={() => {
                  changeLanguage("en");
                }}
              >
                {t("english")}
              </MenuItem>
              <MenuItem value="de" onClick={() => changeLanguage("de")}>
                {t("german")}
              </MenuItem>
              <MenuItem value="es" onClick={() => changeLanguage("es")}>
                {t("spanish")}
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    </div>
  );
};

export default EdemandSetting;
