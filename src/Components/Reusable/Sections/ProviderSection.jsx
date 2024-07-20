import {
  Box,
  Container,
  Divider,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import React from "react";
import "swiper/swiper.min.css";
import "swiper/css/navigation";
import { useTheme } from "@emotion/react";
import Partner from "./Partner";

const ProviderSection = ({ Provider, loading, isHome = false }) => {
  const theme = useTheme();
  return (
    <div>
      <>
        <Box sx={{ background: theme.palette.background.box }}>
          <Container className="mainContainer servicesSections">
            <Box
              key={Provider.key}
              sx={{ padding: "30px 0px", margin: "30px 0px" }}
            >
              {loading ? (
                <Skeleton variant="rectangular" width={200} height={50} />
              ) : (
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <Box>
                    <Typography
                      sx={{
                        typography: { md: "h5", xs: "body1" },
                        fontWeight: "600 !important",
                      }}
                      mt={1}
                    >
                      {Provider.title}
                    </Typography>
                  </Box>
                </Box>
              )}

              <Divider sx={{ my: 1 }} />
              <Box
                pb={"12px"}
                mt={2}
                mb={2}
                sx={{
                  mr: { xs: 0 }, // Set mr to -2.1 for md screen size only
                }}
              >
                <div className="row">
                  {Provider.partners.slice(0, 4).map((partner) => {
                    return (
                      <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 col-xxl-3 mb-4">
                        <Partner
                          key={partner.id}
                          partner={partner}
                          isHome={isHome}
                        />
                      </div>
                    );
                  })}
                </div>
              </Box>
            </Box>
          </Container>
        </Box>
      </>
    </div>
  );
};

export default ProviderSection;
