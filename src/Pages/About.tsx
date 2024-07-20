import AboutPage from "../view/About";
import Layout from "../Components/layout/Layout";
import { useEffect } from "react";
import { t } from "i18next";

const About = () => {
  useEffect(() => {
    const company_name = process.env.REACT_APP_NAME
    document.title = `${t("about")} | ${company_name}`;
  }, []);
  return (
    <Layout>
      <div>
        <AboutPage />
      </div>
    </Layout>
  );
};

export default About;
