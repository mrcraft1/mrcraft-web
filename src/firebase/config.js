import firebase from "firebase/compat/app";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/messaging";
import toast from "react-hot-toast";
import { updateToken } from "../redux/UserData";
import { useDispatch } from "react-redux";
require("firebase/auth");
require("firebase/firestore");

const FirebaseData = () => {
  // api calls


  const dispatch = useDispatch();

  let firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGEING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MESUMENT_ID,
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const firebaseApp = !getApps().length
    ? initializeApp(firebaseConfig)
    : getApp();

    // eslint-disable-next-line
  const createStickyNote = () => {
    const stickyNote = document.createElement("div");
    stickyNote.style.position = "fixed";
    stickyNote.style.bottom = "0";
    stickyNote.style.width = "100%";
    stickyNote.style.backgroundColor = "#ffffff"; // White background
    stickyNote.style.color = "#000000"; // Black text
    stickyNote.style.padding = "10px";
    stickyNote.style.textAlign = "center";
    stickyNote.style.fontSize = "14px";
    stickyNote.style.zIndex = "99999"; // Set zIndex to 99999

    const closeButton = document.createElement("span");
    closeButton.style.cursor = "pointer";
    closeButton.style.float = "right";
    closeButton.innerHTML = "&times;"; // Times symbol (X) for close

    closeButton.onclick = function () {
      document.body.removeChild(stickyNote);
    };

    const link = document.createElement("a");
    link.style.textDecoration = "underline";
    link.style.color = "#3498db";
    link.innerText = "Download Now";

    // Update link with the dynamic appstoreLink
    link.href = process.env.REACT_APP_APP_ID;
    stickyNote.innerHTML =
      "Chat and Notification features are not supported on this browser. For a better user experience, please use our mobile application. ";
    stickyNote.appendChild(closeButton);
    stickyNote.appendChild(link);

    document.body.appendChild(stickyNote);
  };

  const messagingInstance = async () => {
    try {
      const isSupportedBrowser = await isSupported();
      if (isSupportedBrowser) {
        return getMessaging(firebaseApp);
      } else {
        // createStickyNote();
        return null;
      }
    } catch (err) {
      console.error("Error checking messaging support:", err);
      return null;
    }
  };

  const fetchToken = async () => {
    const messaging = await messagingInstance();
    if (!messaging) {
      console.error("Messaging not supported.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        getToken(messaging, {
          vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
        })
          .then((currentToken) => {
            if (currentToken) {
              dispatch(updateToken(currentToken));
            } else {
              toast.error("Permission is required to receive notifications.");
            }
          })
          .catch((err) => {
            console.error("Error retrieving token:", err);
            if (err.message.includes('no active Service Worker')) {
              registerServiceWorker();
            }
          });
      } else {
        toast.error("Permission is required for notifications.");
      }
    } catch (err) {
      console.error("Error requesting notification permission:", err);
    }
  };

  const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registration successful with scope: ', registration.scope);
          // After successful registration, try to fetch the token again
          fetchToken();
        })
        .catch((err) => {
          console.log('Service Worker registration failed: ', err);
        });
    }
  };


  const onMessageListener = async () => {
    const messaging = await messagingInstance();
    if (messaging) {
      return new Promise((resolve) => {
        onMessage(messaging, (payload) => {
          resolve(payload);
        });
      });
    } else {
      console.error("Messaging not supported.");
      return null;
    }
  };

  // eslint-disable-next-line
  firebase.initializeApp(firebaseConfig);

  const auth = firebase.auth();

  const googleProvider = new firebase.auth.GoogleAuthProvider();

  const messaging = firebase.messaging(); // Add this line

  // const facebookprovider = new firebase.auth.FacebookAuthProvider();

  return {
    auth,
    googleProvider,
    firebase,
    messaging,
    onMessageListener,
    fetchToken,
  };
};

export default FirebaseData;
