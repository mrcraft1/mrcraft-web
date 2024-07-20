import React, { useEffect, useRef, useState } from "react";
import { GpsFixed } from "@mui/icons-material";
import toast from "react-hot-toast";
import { GOOGLE_MAP, MAP_API, loadAsyncScript } from "../config/config";
import { useSelector, useDispatch } from "react-redux";
import ModalMap from "../Components/Modals/ModalMap";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Footer from "../Components/layout/Footer";
import {
  locationAddressData,
  setLatitude,
  setLongitude,
} from "../redux/Location";
import { getFormattedAddress } from "../util/Helper";
import { RootState } from "../redux/store";
import {
  HowItWorksItem,
  Settings,
  WebSettings,
} from "../typescriptTypes/globalTypes";

const StartPage: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const settings = useSelector(
    (state: RootState) => state.Settings?.settings as Settings | undefined
  );
  const web_settings: WebSettings | undefined = settings?.web_settings;

  const [open, setOpen] = useState<boolean>(false);
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);

  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission !== "granted") {
        Notification.requestPermission();
      }
    } else {
      console.log("This browser does not support desktop notifications.");
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // Permission granted
        },
        (error: GeolocationPositionError) => {
          if (error.code === error.PERMISSION_DENIED) {
            console.log("err.code", error);
            console.log("Location services are disabled");
          } else {
            console.log("An error occurred while getting location:", error);
          }
        }
      );
    }
  }, []);

  const initMapScript = (): Promise<void> => {
    if (window.google) {
      return Promise.resolve();
    }
    const src = `${GOOGLE_MAP}?key=${MAP_API}&libraries=places&v=weekly`;
    return loadAsyncScript(src);
  };

  const initAutocomplete = (): void => {
    const isGoogleMapsAvailable =
      inputRef.current && window.google && window.google.maps;

    if (isGoogleMapsAvailable) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          fields: ["address_component", "geometry"],
        }
      );

      autocomplete.addListener("place_changed", () => {});
    }
  };

  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  const handleSearch = (): void => {
    const value = inputRef.current?.value;
    if (value) {
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        value
      )}&key=${MAP_API}`;

      fetch(geocodeUrl)
        .then((response) => response.json())
        .then((data) => {
          const { results } = data;
          if (results?.length > 0) {
            const { lat, lng } = results[0].geometry.location;
            setLat(lat);
            setLng(lng);
            setOpen(true);
          } else {
            console.log("No results found");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  useEffect(() => {
    initMapScript().then(() => initAutocomplete());
  }, []);

  const getCurrentLocation = (): void => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
          dispatch(setLatitude(position.coords.latitude));
          dispatch(setLongitude(position.coords.longitude));
          setOpen(true);
          getFormattedAddress(
            position.coords.latitude,
            position.coords.longitude
          ).then((res) => {
            dispatch(locationAddressData(res));
          });
        },
        (error: GeolocationPositionError) => {
          if (error.code === error.PERMISSION_DENIED) {
            toast.error("Please enable location services");
          } else {
            console.error(error.message);
            toast.error("Error getting location: " + error.message);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser");
    }
  };

  const howitwork: HowItWorksItem[] = [
    {
      id: "01",
      title: web_settings?.step_1_title || "",
      desc: web_settings?.step_1_description || "",
      img: web_settings?.step_1_image || "",
    },
    {
      id: "02",
      title: web_settings?.step_2_title || "",
      desc: web_settings?.step_2_description || "",
      img: web_settings?.step_2_image || "",
    },
    {
      id: "03",
      title: web_settings?.step_3_title || "",
      desc: web_settings?.step_3_description || "",
      img: web_settings?.step_3_image || "",
    },
    {
      id: "04",
      title: web_settings?.step_4_title || "",
      desc: web_settings?.step_4_description || "",
      img: web_settings?.step_4_image || "",
    },
  ];

  return (
    <>
      <div className="startpage">
        <div className="header-main">
          <div className="container custom-Container">
            <div className="row">
              <div className="edemand-logo">
                <img src={web_settings?.landing_page_logo} alt="logo" />
              </div>
            </div>
          </div>
        </div>
        <div className="edemand-content">
          <div className="container custom-Container">
            <div className="row">
              <div className="edemand-center-data">
                <div className="edemand-title">
                  <h1>{web_settings?.landing_page_title}</h1>
                </div>
                <div className="edemand-input">
                  <LocationOnIcon />
                  <input
                    type="text"
                    placeholder="Enter Location, Area or City Name etc..."
                    ref={inputRef}
                    onKeyPress={handleKeyPress}
                  />
                  <div className="edemand-current-location-get">
                    <button className="btn" onClick={getCurrentLocation}>
                      {" "}
                      <GpsFixed className="location-icon" />
                      <span>locate me</span>
                    </button>
                  </div>
                  <div className="edemand-search">
                    <button className="btn btn-theme" onClick={handleSearch}>
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="edemand-backgroung-image"
          style={{
            backgroundImage: `url(${web_settings?.landing_page_backgroud_image})`,
          }}
        ></div>
        {/* how it works */}
        <div className="how-it-works">
          <div className="container custom-Container">
            <div className="how-title">
              <h2>{web_settings?.process_flow_title}</h2>
              <p>{web_settings?.process_flow_description}</p>
            </div>

            <div className="row">
              {howitwork &&
                howitwork.map((data, key) => (
                  <div className="col-md-3 col-12" key={key}>
                    <div className="card">
                      <div className="how-it-works-card-body">
                        <div className="card-image">
                          <img src={data.img} alt="works" />
                          <div className="card-numbers">
                            <p>{data.id}</p>
                          </div>
                        </div>

                        <h5 className="how-it-works-card-title">
                          <i className="fas fa-map-marker-alt"></i>
                        </h5>
                        <p className="how-it-works-card-text">{data.title}</p>
                        <p className="how-it-works-card-content">{data.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* footer */}
        <Footer />
      </div>

      <div className="container ">
        {open === true ? (
          <ModalMap
            open={open}
            setOpen={setOpen}
            lat={lat}
            lang={lng}
            redirect={true}
          ></ModalMap>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default StartPage;
