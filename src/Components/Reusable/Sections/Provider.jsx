/* eslint eqeqeq: 0 */

import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Skeleton,
  TextField,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { t } from "i18next";
import Layout from "../../layout/Layout";
import Partner from "./Partner";
import api from "../../../API/apiCollection";
import { PersonSearch } from "@mui/icons-material";
import { useTheme } from "@emotion/react";
import { useSelector } from "react-redux";

export default function Provider() {
  const [provider, setProvider] = useState([]);
  const [category, setCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState("asc");
  const [searchPartner, setSearchPartner] = useState(null);
  const location = useSelector((state) => state.Location);
  const searchList = [
    {
      value: "asc",
      label: "Ascending",
    },
    {
      value: "desc",
      label: "Descending",
    },
  ];

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseProviders = await api.get_providers({
          latitude: location.lat,
          longitude: location.lng,
        });
        setProvider(responseProviders.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching providers:", error);
      } finally {
        setIsLoading(true);
      }

      try {
        const responseCategories = await api.get_category({
          latitude: location.lat,
          longitude: location.lng,
        });
        const categories = responseCategories.data.map((e) => ({
          name: e.name,
          id: e.id,
        }));
        setIsLoading(false);
        setCategory(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchData();
  }, [location.lat, location.lng]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleOrderChange = (e) => {
    setSelectedOrder(e.target.value);
  };

  const handleSearch = async () => {
    setIsLoading(true); // Start loading state
    try {
      const response = await api.get_providers({
        latitude: location.lat,
        longitude: location.lng,
        search: searchPartner,
        category_id: selectedCategory,
        order: selectedOrder,
      });
      setIsLoading(false);
      setProvider(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false); // Stop loading state
    }
  };

  return (
    <Box>
      <Box display={"flex"} flexWrap={"wrap"} m={0} justifyContent={"space-between"}>
        <Box sx={{ width: "100%" }}>
          <Box
            display={"flex"}
            sx={{
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 2, md: 1 },
            }}
            width={"100%"} // Ensure the container takes full width
            mb={3}
            alignContent={"center"}
          >
            <Box width={{ xs: "100%", md: "15%" }}>
              {" "}
              {/* Adjust the width */}
              <Typography variant="h6">{t("search_filter")}</Typography>
            </Box>

            <Box width={{ xs: "100%", md: "46%" }}>
              {" "}
              {/* Adjust the width */}
              <TextField
                id="outlined-basic"
                onChange={(e) => setSearchPartner(e.target.value)}
                fullWidth
                size="small"
                label="Search Provider"
                placeholder="Search Provider"
                variant="outlined"
              />
            </Box>

            <Box width={{ xs: "100%", md: "25%" }}>
              {" "}
              {/* Adjust the width */}
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="demo-multiple-name-label">
                  {t("select_category")}
                </InputLabel>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  size="small"
                  onChange={handleCategoryChange}
                  value={selectedCategory}
                  input={<OutlinedInput label={t("select_category")} />}
                  MenuProps={MenuProps}
                >
                  <MenuItem key={0} value={0}>
                    {t("select_category")}
                  </MenuItem>
                  {category.map((opt) => (
                    <MenuItem key={opt.id} value={opt.id}>
                      {opt.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box width={{ xs: "100%", md: "25%" }}>
              {" "}
              {/* Adjust the width */}
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="demo-multiple-name-label">
                  {t("sort_by")}
                </InputLabel>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  value={selectedOrder}
                  size="small"
                  onChange={handleOrderChange}
                  input={<OutlinedInput label={t("sort_by")} />}
                  MenuProps={MenuProps}
                >
                  {searchList.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box>
              {" "}
              {/* Adjust the width */}
              <Button
                startIcon={<PersonSearch />}
                variant="contained"
                onClick={handleSearch}
              >
                {t("search")}
              </Button>
            </Box>
          </Box>
        </Box>
        
      </Box>
      {isLoading ? (
          <Grid container spacing={2} mb={13}>
            <Grid
              item
              lg={12}
              display={"flex"}
              flexWrap={"wrap"}
              justifyContent={"space-evenly"}
              gap={2}
              mt={5}
            >
              <MySkeleton />
            </Grid>
          </Grid>
        ) : (
          <Box pb={"12px"} mt={2} mb={2}>
            <div className="ghello row">
              {provider && provider?.length > 0 ? (
                provider.map((response) => (
                  <div
                    key={response.id}
                    className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 col-xxl-3 mb-4"
                  >
                    <Partner partner={response} />
                  </div>
                ))
              ) : (
                <Grid width={"100%"} item xs={12}>
                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <img
                      src={"/images/no-provider.png"}
                      alt="There is no providers"
                    />
                    <Typography variant="body1">{t("no_provider")}</Typography>
                  </Box>
                </Grid>
              )}
            </div>
          </Box>
        )}
    </Box>
  );
}

export const MySkeleton = () => {
  return (
    <Skeleton
      height={500}
      sx={{ width: { sx: 200, md: 345 } }}
      variant="rectangular"
    ></Skeleton>
  );
};

export const SpecificProvider = () => {
  const [provider, setProvider] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useSelector((state) => state.Location);
  const param = useParams();
  const { id } = param;

  const get_provider = async () => {
    try {
      const response = await api.get_providers({
        latitude: location.lat,
        longitude: location.lng,
        category_id: id,
      });
      setProvider(response.data);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const { name } = param;
  const formattedName = name
    .replace(/-/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());

  const company_name = process.env.REACT_APP_NAME;
  document.title = `${formattedName} | ${company_name}`;

  useEffect(() => {
    get_provider();
  }, [id, location.lat, location.lng]);

  const theme = useTheme();

  return (
    <Layout>
      <Box paddingTop={"40px"} paddingBottom={"44px"} mt={2}>
        <Container maxWidth="lg" className="mainContainer">
          <Breadcrumbs
            separator="|"
            aria-label="breadcrumb"
            className="mt-1 mb-1 breadcrumb"
          >
            <Box
              component={Link}
              to={"/"}
              className="breadrumb"
              sx={{
                color: theme.palette.color.breadcrum,
                textDecoration: "none",
              }}
              underline="none"
            >
              <strong>{t("home")}</strong>
            </Box>

            <Box
              component={Link}
              to={"/categories"}
              className="breadrumb"
              sx={{
                textDecoration: "none",
                color: theme.palette.color.breadcrum,
              }}
              underline="none"
            >
              <strong>{t("sub_categories")}</strong>
            </Box>

            <Typography color="text.primary">{formattedName}</Typography>
          </Breadcrumbs>
          <Typography variant="h4" gutterBottom>
            <strong>
              {formattedName} {t("provider")}
            </strong>
          </Typography>
        </Container>
      </Box>
      <Container className="mainContainer">
        <Box
          sx={{
            background: theme.palette.background.box,
            pt: "15px",
            pl: "15px",
            pr: "15px",
            mb: "15px",
          }}
        >
          {isLoading ? (
            <Grid container spacing={2}>
              <Grid
                item
                lg={12}
                display={"flex"}
                flexWrap={"wrap"}
                justifyContent={"space-evenly"}
                gap={2}
                mt={5}
              >
                <MySkeleton />
              </Grid>
            </Grid>
          ) : (
            <div className="row">
              {provider && provider?.length > 0 ? (
                provider.map((response) => (
                  <div
                    key={response.id}
                    className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 col-xxl-3 mb-4"
                  >
                    <Partner partner={response} />
                  </div>
                ))
              ) : (
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <img
                    src={"/images/no-provider.png"}
                    alt="There is no providers"
                  />
                  <Typography variant="body1">{t("no_provider")}</Typography>
                </Box>
              )}
            </div>
          )}
        </Box>
      </Container>
    </Layout>
  );
};
