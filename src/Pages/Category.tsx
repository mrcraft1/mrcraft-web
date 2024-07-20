import Layout from "../Components/layout/Layout";
import { useEffect } from "react";
import { t } from "i18next";
import Categorys from "../view/Categorys";

const Category = () => {
  useEffect(() => {
    const company_name = process.env.REACT_APP_NAME
    document.title = `${t("categories")} | ${company_name}`;
  }, []);

  return (
    <Layout>
      <div>
        <Categorys />
      </div>
    </Layout>
  );
};

export default Category;
