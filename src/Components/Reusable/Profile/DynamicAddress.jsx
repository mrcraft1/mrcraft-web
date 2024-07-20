/*eslint no-empty-pattern: 0*/
import { BorderColorTwoTone } from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { t } from "i18next";
import { useTheme } from "@emotion/react";
import api from "../../../API/apiCollection";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { setAddress, updateAddress } from "../../../redux/UserAddress";
import ModalAddress from "../../Modals/ModalAddress";

export const DynamicAddress = () => {
  // eslint-disable-next-line no-unused-vars
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [index, setIndex] = useState("");
  const [open, setOpen] = useState(false);
  const addresses = useSelector((state) => state.UserAddress)?.address;

  const handleDelete = (index) => {
    setDeleteIndex(index);
  };

  const handleDeleteClose = () => {
    setDeleteIndex(null);
  };

  const dispatch = useDispatch();
  // to delete particular address
  const handleDeleteAddress = async (address_id) => {
    await api
      .DeleteAddress({ address_id: address_id })
      .then((result) => {
        toast.success(result.message);
      })
      .catch((error) => console.log("error", error));

    const updatedAddresses = addresses?.filter(
      (item) => item.id !== address_id
    );
    dispatch(setAddress(updatedAddresses));
    handleDeleteClose();
  };

  const theme = useTheme();

  const selectedAddress =
    addresses && addresses?.filter((item) => item.id === index);

  useEffect(() => {
    dispatch(updateAddress(selectedAddress));
  }, [index, dispatch]);

  return (
    <Box
      sx={{
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        my: 2,
      }}
      width={"100%"}
      alignContent={"center"}
    >
      <Grid container width={"100%"} spacing={2}>
        {addresses?.length > 0 ? (
          addresses.map((address, index) => (
            <Grid key={address.id} item width={"100%"} sm={12} md={6}>
              <Box
                key={index}
                display={"block"}
                sx={{
                  mx: 2,
                  maxWidth: "100%",
                  border: "1px solid gray",
                  borderRadius: "5px",
                  p: 1,
                }}
              >
                {/* <Box width={"100%"} textAlign={"center"}> */}
                <Grid container width={"100%"}>
                  <Grid
                    item
                    xs
                    width={"100%"}
                    sm={12}
                    height={{ xs: "auto", sm: "auto", md: "120px" }}
                  >
                    <Box
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <Box pl={1} display={"flex"} alignItems={"center"}>
                        <Box>
                          <Typography gutterBottom variant="p" component="div">
                            {address.city_name}
                          </Typography>
                        </Box>
                        <Box>
                          <Chip
                            variant="outlined"
                            size="small"
                            color="primary"
                            sx={{
                              width: "auto",
                              ml: 1,
                              borderRadius: "5px",
                              borderColor: "gray",
                            }}
                            label={address.type}
                          />
                        </Box>
                      </Box>
                      <Box display={"flex"} alignItems={"center"} gap={1}>
                        <IconButton
                          key={index}
                          aria-label="edit"
                          size="small"
                          onClick={() => {
                            setOpen(true);
                            setIndex(address.id);
                            // handleCurrentDataGet()
                          }}
                          sx={{
                            backgroundColor: "green",
                            color: "white",
                            borderRadius: 2,
                            "&:hover": {
                              backgroundColor: "green",
                            },
                          }}
                        >
                          <BorderColorTwoTone sx={{ fontSize: "17px" }} />
                        </IconButton>

                        <IconButton
                          aria-label="delete"
                          size="small"
                          sx={{
                            backgroundColor: "red",
                            color: "white",
                            borderRadius: 2,
                            "&:hover": {
                              backgroundColor: "red",
                            },
                          }}
                          onClick={() => handleDelete(index)}
                        >
                          <FontAwesomeIcon
                            icon={faTrashCan}
                            className="fa-1x"
                          />
                        </IconButton>
                      </Box>
                    </Box>
                    <Box textAlign={"left"}>
                      <Typography
                        color="text.secondary"
                        variant="body2"
                        p={1}
                        sx={{
                          wordBreak: "break-word",
                          overflow: {
                            xs: "visible",
                            sm: "visible",
                            md: "hidden",
                          },
                          textOverflow: {
                            xs: "clip",
                            sm: "clip",
                            md: "ellipsis",
                          },
                          display: {
                            xs: "block",
                            sm: "block",
                            md: "-webkit-box",
                          },
                          WebkitLineClamp: { xs: "none", sm: "none", md: "2" },
                          WebkitBoxOrient: {
                            xs: "horizontal",
                            sm: "horizontal",
                            md: "vertical",
                          },
                        }}
                      >
                        {address.address}
                      </Typography>
                      <Typography color="text.secondary" variant="body2" p={1}>
                        {address.mobile}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Backdrop open={deleteIndex === index} sx={{ zIndex: 1101 }}>
                  <Box
                    sx={{ background: theme.palette.background.box }}
                    p={4}
                    display={"flex"}
                    flexDirection={"column"}
                    gap={3}
                  >
                    <Typography textAlign={"center"}>
                      {t("delete_address")}
                    </Typography>

                    <Box
                      display={"flex"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      gap={2}
                    >
                      <Button onClick={handleDeleteClose}>{t("close")}</Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDeleteAddress(address.id)}
                      >
                        {t("delete")}
                      </Button>
                    </Box>
                  </Box>
                </Backdrop>
              </Box>
            </Grid>
          ))
        ) : (
          <Box width={"100%"}>
            <Typography py={4} width={"100%"} textAlign={"center"}>
              {t("no_address")}
            </Typography>
          </Box>
        )}

        {open === true ? (
          <>
            <ModalAddress
              open={open}
              setOpen={setOpen}
              selectedAddress={selectedAddress}
            />
          </>
        ) : (
          ""
        )}
      </Grid>
    </Box>
  );
};
