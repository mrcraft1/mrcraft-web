import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  CssBaseline,
  Box,
  Container,
  useTheme,
  Grid,
  Button,
  Card,
  CardMedia,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import api from "../API/apiCollection";
import SwiperHome from "../Components/Reusable/Sections/Slider";
import CategoriesSection from "../Components/Reusable/Sections/CategoriesSection";
import ProviderSection from "../Components/Reusable/Sections/ProviderSection";
import SubCategories from "../Components/Reusable/Sections/SubCategories";
import {
  PartnerSkeleton,
  SkeletonSubCategory,
} from "../Components/Reusable/Sections/Skeletons";
import { useSelector, useDispatch } from "react-redux";
import { setHomePage } from "../redux/Pages";
import { t } from "i18next";
import noDataImage from "../Images/No__data-pana.png";

const HomeFinal = () => {
  const [slider, setSlider] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false); // State for drawer
  const dispatch = useDispatch();
  const locationData = useSelector((state) => state.Location);
  const web_settings = useSelector((state) => state.Settings)?.settings?.web_settings;
  const theme = useTheme();

  const fetchHome = async () => {
    setLoading(true);
    setFetchError(false);

    try {
      const response = await api.get_home_screen({
        latitude: locationData.lat,
        longitude: locationData.lng,
      });
      setSlider(response?.data?.sliders);
      setCategories(response?.data?.categories);
      setSections(response?.data?.sections);
      dispatch(setHomePage(response?.data));
    } catch (error) {
      console.log(error);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHome();
  }, [web_settings, locationData]);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const menuItems = [
    { text: 'Home', link: '/' },
    { text: 'About', link: '/about' },
    { text: 'Services', link: '/services' },
    { text: 'Contact', link: '/contact' },
  ];

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            My App
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {menuItems.map((item, index) => (
              <ListItem button key={index} component="a" href={item.link}>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      {fetchError ? (
        <Grid
          container
          spacing={2}
          direction="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
          sx={{ marginTop: { xs: 0, md: -20 } }}
        >
          <Grid item>
            <Card sx={{ boxShadow: "none !important" }}>
              <CardMedia
                component="img"
                src={noDataImage}
                alt="No Data Image"
                sx={{ width: { xs: 300, sm: 600, md: 700 }, height: "auto", border: "none", boxShadow: "none" }}
              />
            </Card>
          </Grid>
          <Grid item>
            <Typography sx={{ textAlign: "center", marginTop: { xs: 0, md: -22 } }}>
              <Typography
                variant="body1"
                sx={{ textAlign: "left", fontFamily: "Plus Jakarta Sans", fontWeight: "bold", fontSize: "32px", lineHeight: "32px", letterSpacing: "0px" }}
              >
                {t("something_went_wrong")}
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "var(--secondary-color-343f53)", textAlign: "left", fontFamily: "Plus Jakarta Sans", fontWeight: "normal", fontSize: "20px", lineHeight: "32px", letterSpacing: "0px", opacity: 0.7, marginLeft: 5 }}
              >
                {t("try_again_later")}
              </Typography>
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={fetchHome}
              sx={{ textTransform: "none", marginTop: { xs: 0, md: -28 } }}
            >
              {t("retry")}
            </Button>
          </Grid>
        </Grid>
      ) : (
        <>
          <SwiperHome sliderData={slider} loading={loading} />
          <Box my={3}>
            <CategoriesSection categories={categories} loading={loading} />
          </Box>
          {loading ? (
            <Box
              className="display-flex gap-12"
              sx={{ overflow: "auto", background: theme.palette.background.box }}
            >
              <Container>
                <Box display={"flex"} gap={2} mt={1} mb={1}>
                  {Array.from(Array(4).keys()).map((index) => (
                    <SkeletonSubCategory key={index} />
                  ))}
                </Box>
                <Box display={"flex"} gap={2} mt={1} mb={1}>
                  {Array.from(Array(3).keys()).map((index) => (
                    <PartnerSkeleton key={index} />
                  ))}
                </Box>
              </Container>
            </Box>
          ) : (
            sections.map((section) => {
              if (section.section_type === "partners" || section.section_type === "top_rated_partner") {
                return (
                  <ProviderSection key={section.id} Provider={section} loading={loading} isHome={true} />
                );
              } else if (section.section_type === "sub_categories") {
                return (
                  <SubCategories key={section.id} subCategory={section} loading={loading} />
                );
              }
              return null;
            })
          )}
        </>
      )}
    </>
  );
};

export default HomeFinal;
