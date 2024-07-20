import Layout from "../Components/layout/Layout";
import { useEffect } from "react";
import { t } from "i18next";
import ContactForm from "../view/Contact";

const Contact = () => {
  useEffect(() => {
    const company_name = process.env.REACT_APP_NAME
    document.title = `${t("contact")} | ${company_name}`;
  }, []);
  return (
    <Layout>
      <div>
        <ContactForm />
      </div>
    </Layout>
  );
};

export default Contact;
