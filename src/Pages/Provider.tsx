import React from "react";
import Providers from "../view/Providers";
import Layout from "../Components/layout/Layout";
import { useEffect } from "react";
import { t } from "i18next";

const Provider = () => {
  useEffect(() => {
    const company_name = process.env.REACT_APP_NAME
    document.title = `${t("providers")} | ${company_name}`;
  }, []);
  return (
    <Layout>
      <Providers />
    </Layout>
  );
};

export default Provider;
