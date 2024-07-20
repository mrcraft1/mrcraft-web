import { useTheme } from '@emotion/react';
import { Box, Divider, Grid, LinearProgress, Rating, Typography } from '@mui/material'
import React from 'react'
import GradeIcon from "@mui/icons-material/Grade";
import { t } from 'i18next';

const RatingCard = ({
    overall,
    star1,
    star2,
    star3,
    star4,
    star5,
    noOfRating,
}) => {
    const arrayOfRating = [star1, star2, star3, star4, star5];
    const maxValue = Math.max(...arrayOfRating.map((value) => parseInt(value)));
    // Convert the array values to integers and create an array of objects with values and their original indices
    const ratingObjects = arrayOfRating.map((value, index) => ({
        value: parseInt(value),
        index: index,
    }));
    const theme = useTheme();

    // Sort the ratingObjects array in ascending order based on the 'value' property
    ratingObjects.sort((a, b) => b.index - a.index);
    return (
        <Box
            justifyContent={"center"} // Center horizontally
            alignItems={"center"} // Center vertically
            bgcolor={theme.palette.background.card}
            color={"white"}
            borderRadius={"10px"}
            p={{ xs: 2, md: 0 }}
            // px={2}
            // py={2}
            mt={4}
        >
            <Grid container spacing={{ xs: 0, md: 0 }} >
                <Grid item md={4} sm={12} alignItems={"center"} width={"100%"}>
                    <Box
                        m={{ xs: 0, md: 2 }}
                        display={"flex"}
                        bgcolor={"white"}
                        borderRadius={"10px"}
                        color={"black"}
                        flexDirection={"column"}
                        alignItems={"center"}
                        justifyContent={"center"} // Center horizontally
                        width={"100%"}
                        height={"283px"}
                        alignContent={"center"}
                        sx={{ alignItems: "center" }}
                    >
                        <Typography
                            className="back-343f"
                            variant="h5"
                            mb={2}
                            borderRadius={"60px"}
                            textAlign={"center"}
                            p={3}
                            sx={{
                                height: "69px",
                                width: "69px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                color: "#FFFFFF", // Set to white
                                textAlign: "left",
                                font: "normal normal bold 38px/13px Plus Jakarta Sans",
                                letterSpacing: "1.9px",
                                opacity: 1,
                            }}
                        >
                            {parseFloat(overall).toFixed(1)}
                        </Typography>

                        <Rating
                            name="average-rating"
                            className="gap-1"
                            value={parseFloat(overall)}
                            precision={0.2}
                            component="legend"
                            readOnly
                            mb={1}
                        />
                        <Typography
                            variant="h6"
                            mt={5}
                            gutterBottom
                            sx={{
                                textAlign: "left",
                                font: "normal normal medium 25px/13px Plus Jakarta Sans",
                                letterSpacing: "1.25px",
                                color: "#343F53",
                                opacity: 1,
                            }}
                        >
                            {noOfRating} {t("reviews")}
                        </Typography>
                    </Box>
                </Grid>

                <Grid item md={1} sm={12}>
                    <Divider
                        orientation={{ xs: "horizontal", md: "vertical" }}
                        sx={{
                            backgroundColor: "gray",
                            height: { xs: "1px", md: "100%" },
                            width: { xs: "225px", md: "1px" },
                            ml: { xs: 0, md: 5 },
                            mt: { xs: 2, md: 0 }
                        }}
                    />
                </Grid>

                <Grid
                    item
                    md={7}
                    sm={12}
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"space-between"}
                    width={"100%"}
                >
                    {ratingObjects.map((rating, index) => (
                        <Box
                            key={index}
                            mt={2}
                            mb={2}
                            display={"flex"}
                            alignItems={"center"}
                            flexDirection={"row"}
                            width={"100%"}
                            justifyContent={"space-between"}
                            rowGap={1} // Adjust the rowGap property to decrease the gap
                            gap={1} // Adjust the gap property to decrease the gap
                        >
                            <Box display={"flex"} alignItems={"center"}>
                                <GradeIcon fontSize="small" style={{ marginRight: "16px" }} />

                                <Typography fontSize={"medium"} variant="caption" mr={1}>
                                    {rating.index + 1}
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={(rating.value / maxValue) * 100}
                                sx={{
                                    width: "100%",
                                    borderRadius: "5px",
                                    backgroundColor: "gray",
                                    height: 9, // Set the height of the entire progress bar to 9px
                                    "& .MuiLinearProgress-bar": {
                                        backgroundColor: "#F6B313", // Set the progress bar color to #F6B313
                                    },
                                }}
                            />

                            <Typography fontSize={"medium"} variant="caption" ml={4} mr={2}>
                                {rating.value || 0}
                            </Typography>
                        </Box>
                    ))}
                </Grid>
            </Grid>
        </Box>
    );
};
export default RatingCard