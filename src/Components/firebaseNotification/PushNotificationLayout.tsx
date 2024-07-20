import React, { useEffect, useState } from "react";
import "firebase/messaging";
import FirebaseData from "../../firebase/config";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  NotificationData,
  ProfileRootState,
  PushNotificationLayoutProps,
} from "../../typescriptTypes/globalTypes";

const PushNotificationLayout: React.FC<PushNotificationLayoutProps> = ({
  children,
}) => {
  const [notification, setNotification] = useState<NotificationData | null>(
    null
  );
  const [userToken, setUserToken] = useState<string | null>(null);
  const { fetchToken, onMessageListener } = FirebaseData();
  const profile = useSelector(
    (state: ProfileRootState) => state.UserData?.profile?.data
  );

  const FcmToken = profile && profile?.fcm_id;

  const handleFetchToken = async (): Promise<void> => {
    await fetchToken();
  };

  useEffect(() => {
    handleFetchToken();
    // eslint-disable-next-line
  }, [FcmToken]);

  useEffect(() => {
    // eslint-disable-next-line
    if (typeof window !== "undefined") {
      setUserToken(FcmToken || null);
    }
    // eslint-disable-next-line
  }, [userToken]);

  useEffect(() => {
    onMessageListener()
      .then((payload: { data: NotificationData }) => {
        if (payload && payload.data) {
          // console.log("pylosf",payload);
          setNotification(payload.data);
          // onNotificationReceived(payload.data);
        }
      })
      .catch((err: Error) => {
        console.error("Error handling foreground notification:", err);
        toast.error("Error handling notification.");
      });
    // eslint-disable-next-line
  }, [notification]);

  // service worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("./firebase-messaging-sw.js").then(
          function (registration) {
            console.log(
              "Service Worker registration successful with scope: ",
              registration.scope
            );

            // Pass environment variables to the service worker
            registration.active?.postMessage({
              type: "ENV_VARIABLES",
              env: {
                API_KEY: process.env.REACT_APP_FIREBASE_API_KEY,
                PROJECT_ID: process.env.REACT_APP_FIREBASE_PROJECT_ID,
                STORAGE_BUCKET: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
                MESSAGEING_SENDER_ID: process.env.REACT_APP_FIREBASE_MESSAGEING_SENDER_ID,
                APP_ID: process.env.REACT_APP_FIREBASE_APP_ID,
                MESUMENT_ID: process.env.REACT_APP_FIREBASE_MESUMENT_ID,
              },
            });
          },
          function (err) {
            console.log("Service Worker registration failed: ", err);
          }
        );
      });
    }
  }, []);

  return <div>{React.cloneElement(children)}</div>;
};

export default PushNotificationLayout;
