import React from "react";
import { useSelector } from "react-redux";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import CallIcon from "@mui/icons-material/Call";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import { IoLogoApple, IoLogoGooglePlaystore } from "react-icons/io5";
import { t } from "i18next";
import { Link } from "react-router-dom";
import {
  FooterRootState,
  FooterSettings,
} from "../../typescriptTypes/globalTypes";

const Footer: React.FC = () => {
  const settings: FooterSettings | undefined = useSelector(
    (state: FooterRootState) => state.Settings

    
  )?.settings;
  const web_settings = settings?.web_settings;

  return (
    <>
      <div className="startpage">
        <div className="edemand-footer">
          <div className="container custom-Container">
            <div className="row">
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="footer-left-one">
                  <div className="footer-logo">
                    <img src={web_settings?.footer_logo} alt="logo" />
                  </div>
                  <div className="footer-desc">
                    <p>{web_settings?.footer_description}</p>
                  </div>
                  <div className="footer-social">
                    {web_settings?.social_media?.map((data, key) => (
                      <a href={data?.url} key={key}>
                        <img src={data.file} alt="social-media" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="footer-left-two">
                  <div className="f-title">{t("quick_links")}</div>
                  <div className="f-links">
                    <ul>
                      <li>
                        <Link to="/about">{t("about_us")}</Link>
                      </li>
                      <li>
                        <Link to="/contact">{t("contact_us")}</Link>
                      </li>
                      <li>
                        <Link to="/terms-and-conditions">
                          {t("terms_and_conditions")}
                        </Link>
                      </li>
                      <li>
                        <Link to="/privacy-policies">
                          {t("privacy_policy")}
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {settings?.general_settings?.support_email ||
              settings?.general_settings?.phone ||
              settings?.general_settings?.support_hours ||
              settings?.general_settings?.address ? (
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="footer-right-one">
                    <div className="f-title">{t("contact_info")}</div>
                    <div className="f-links">
                      <ul>
                        <li>
                          <a
                            href={`mailto:${settings.general_settings.support_email}`}
                          >
                            <EmailIcon className="icon" />
                            {settings.general_settings.support_email}
                          </a>
                        </li>
                        <li>
                          <a href={`tel:${settings.general_settings.phone}`}>
                            <CallIcon className="icon" />
                            {settings.general_settings.phone}
                          </a>
                        </li>
                        <li>
                          {/* eslint-disable-next-line */}
                          <a>
                            <AccessTimeFilledIcon className="icon" />
                            {settings.general_settings.support_hours}
                          </a>
                        </li>
                        <li>
                          {/* eslint-disable-next-line */}
                          <a>
                            <LocationOnIcon className="icon" />
                            {settings.general_settings.address}
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : null}

              {web_settings?.app_section_status ? (
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="footer-right-two">
                    <div className="f-title">
                      <p>{t("downlaod_app_toady")}</p>
                    </div>
                    <div className="f-desc">
                      <p>{web_settings?.web_title}</p>
                    </div>
                    <div className="f-store">
                      <div className="google-store">
                        {web_settings?.playstore_url !== "" ? (
                          <>
                            {/* eslint-disable-next-line */}
                            <a
                              onClick={() =>
                                window.open(
                                  web_settings?.playstore_url,
                                  "_blank"
                                )
                              }
                            >
                              <IoLogoGooglePlaystore className="store-icon" />{" "}
                              {t("google_play")}
                            </a>
                          </>
                        ) : null}
                      </div>
                      {web_settings?.applestore_url !== "" ? (
                        <div className="apple-store">
                          {/* eslint-disable-next-line */}
                          <a
                            onClick={() =>
                              window.open(
                                web_settings?.applestore_url,
                                "_blank"
                              )
                            }
                          >
                            {" "}
                            <IoLogoApple className="store-icon" />{" "}
                            {t("apple_store")}
                          </a>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <hr />
            <div className="f-copyright">
              <p>{settings && settings.general_settings?.copyright_details}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
