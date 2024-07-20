import Layout from "../Components/layout/Layout";
import { Box } from "@mui/material";

const PageNotFound = () => {
  const company_name = process.env.REACT_APP_NAME
  document.title = `Page Not Found | ${company_name}`;
  return (
    <Layout>
      <Box
        textAlign={"center"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        maxWidth={"100%"}
        maxHeight={"100%"}
        width={"100%"}
        mt={5}
        mb={5}
      >
        <Box
          component={"img"}
          src={"/images/404.png"}
          alt="page not found"
          width={{ xs: "100%", md: "auto" }}
        />
      </Box>
    </Layout>
  );
};

export default PageNotFound;
