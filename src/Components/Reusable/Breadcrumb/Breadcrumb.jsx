import { BreadcrumbLink } from "../../../CSS/ThemeStyle";
import { Box, Breadcrumbs, Typography } from "@mui/material";
import { Container } from "react-bootstrap";

const Breadcrumb = ({ pageOne, home }) => {
  return (
    <Box
      paddingBottom={"15px"}
      mb={"20px"}
      className="breadcrumbWrapper"
    >
      <Container maxWidth="lg" className="mainContainer ">
        <Breadcrumbs
          separator="|"
          aria-label="breadcrumb"
          className="mb-3 mt-1"
        >
          <BreadcrumbLink
            to={"/"}
            className="breadcrumb"
            sx={{ marginBottom: "0px" }}
          >
            <strong>{home}</strong>
          </BreadcrumbLink>
          <Typography color="">
            <strong>{pageOne}</strong>
          </Typography>
        </Breadcrumbs>
        <Typography variant="h4" className="pageName">
          <strong>{pageOne}</strong>
        </Typography>
      </Container>
    </Box>
  );
};

export default Breadcrumb;
