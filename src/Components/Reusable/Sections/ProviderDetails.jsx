import React from "react";
import { Box, Skeleton } from "@mui/material";
import ProviderDetailedCard from "./ProviderDetailedCard";

const ProviderDetails = ({ isProvierLoading, provider, partner_id }) => {
  return (
    <Box
      sx={{
        ml: -3,
        mt: -3,
        mr: -3,
        borderRadius: "10px",
      }}
    >
      {isProvierLoading ? (
        <>
          {provider.map((response) => {
            if (response.partner_id === partner_id) {
              const overallRating = response.ratings;
              const star1 = response["1_star"];
              const star2 = response["2_star"];
              const star3 = response["3_star"];
              const star4 = response["4_star"];
              const star5 = response["5_star"];
              const noOfRating = response.number_of_ratings;
              const partnerID = response.partner_id;

              return (
                <ProviderDetailedCard
                  key={partnerID}
                  overallRating={overallRating}
                  star1={star1}
                  star2={star2}
                  star3={star3}
                  star4={star4}
                  star5={star5}
                  noOfRating={noOfRating}
                  partnerID={partnerID}
                  partner={response}
                />
              );
            }

            return null;
          })}
        </>
      ) : (
        <Box display={"flex"} flexDirection={"column"} gap={3}>
          <Skeleton variant="rectangular" height={"800px"} />
          <Skeleton variant="rectangular" height={"500px"} />
        </Box>
      )}
    </Box>
  );
};

export default ProviderDetails;
