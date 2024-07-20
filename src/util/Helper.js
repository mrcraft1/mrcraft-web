import toast from "react-hot-toast";
import { MAP_API } from "../config/config";

export function formateCurrency(amount) {
  return amount;
}
export function capilaizeString(inputString) {
  if (typeof inputString !== "string" || inputString?.length === 0) {
    return inputString;
  }

  return inputString.charAt(0).toUpperCase() + inputString.slice(1);
}

export const extractAddress = (place) => {
  const address = {
    city: "",
    state: "",
    zip: "",
    country: "",
    plain() {
      const city_data = this.city ? this.city + ", " : "";
      const zip = this.zip ? this.zip + ", " : "";
      const state = this.state ? this.state + ", " : "";
      return city_data + zip + state + this.country;
    },
  };

  if (!Array.isArray(place?.address_components)) {
    return address;
  }

  place.address_components.forEach((component) => {
    const types = component.types;
    const long_value = component.long_name;

    if (types.includes("locality")) {
      address.city = long_value;
    }

    if (types.includes("administrative_area_level_2")) {
      address.state = long_value;
    } else if (types.includes("administrative_area_level_1")) {
      address.state = long_value;
    }

    if (types.includes("postal_code")) {
      address.zip = long_value;
    }

    if (types.includes("country")) {
      address.country = long_value;
    }
  });
  return address;
};

export async function getFormattedAddress(lat, lng) {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${MAP_API}`
    );

    const data = await response.json();
    const formattedAddress = data.results[0]?.formatted_address;

    return formattedAddress;
  } catch (error) {
    console.error("Error fetching address:", error);
    return null;
  }
}

export async function getAddress(lat, lng) {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${MAP_API}`
    );

    const data = await response.json();
    const formattedAddress = data.results[0];

    return formattedAddress;
  } catch (error) {
    console.error("Error fetching address:", error);
    return null;
  }
}

export const truncate = (text, maxLength) => {
  // Check if text is undefined or null
  if (!text) {
    return ""; // or handle the case as per your requirement
  }

  // If the text length is less than or equal to maxLength, return the original text
  if (text?.length <= maxLength) {
    return text;
  } else {
    // Otherwise, truncate the text to maxLength characters and append ellipsis
    return text.slice(0, maxLength) + "...";
  }
};

const ERROR_CODES = {
  "auth/user-not-found": "User not found",
  "auth/wrong-password": "Invalid password",
  "auth/email-already-in-use": "Email already in use",
  "auth/invalid-email": "Invalid email address",
  "auth/user-disabled": "User account has been disabled",
  "auth/too-many-requests": "Too many requests, try again later",
  "auth/operation-not-allowed": "Operation not allowed",
  "auth/internal-error": "Internal error occurred",
};

// Error handling function
export const handleFirebaseAuthError = (errorCode) => {
  // Check if the error code exists in the global ERROR_CODES object
  if (ERROR_CODES.hasOwnProperty(errorCode)) {
    // If the error code exists, log the corresponding error message
    toast.error(ERROR_CODES[errorCode]);
    //   console.error(ERROR_CODES[errorCode]);
  } else {
    // If the error code is not found, log a generic error message
    toast.error(`Unknown error occurred: ${errorCode}`);
    //   console.error(`Unknown error occurred: ${errorCode}`);
  }

  // Optionally, you can add additional logic here to handle the error
  // For example, display an error message to the user, redirect to an error page, etc.
};

export const getAuthErrorMessage = (errorCode) => {
  switch (errorCode) {
    case "auth/admin-restricted-operation":
      return toast.error("Admin Only Operation");
    case "auth/already-initialized":
      return toast.error("Already Initialized");
    case "auth/app-not-authorized":
      return toast.error("App Not Authorized");
    case "auth/app-not-installed":
      return toast.error("App Not Installed");
    case "auth/argument-error":
      return toast.error("Argument Error");
    case "auth/captcha-check-failed":
      return toast.error("Captcha Check Failed");
    case "auth/code-expired":
      return toast.error("Code Expired");
    case "auth/cordova-not-ready":
      return toast.error("Cordova Not Ready");
    case "auth/cors-unsupported":
      return toast.error("CORS Unsupported");
    case "auth/credential-already-in-use":
      return toast.error("Credential Already In Use");
    case "auth/custom-token-mismatch":
      return toast.error("Credential Mismatch");
    case "auth/requires-recent-login":
      return toast.error("Credential Too Old, Login Again");
    case "auth/dependent-sdk-initialized-before-auth":
      return toast.error("Dependent SDK Initialized Before Auth");
    case "auth/dynamic-link-not-activated":
      return toast.error("Dynamic Link Not Activated");
    case "auth/email-change-needs-verification":
      return toast.error("Email Change Needs Verification");
    case "auth/email-already-in-use":
      return toast.error("Email Already In Use");
    case "auth/emulator-config-failed":
      return toast.error("Emulator Config Failed");
    case "auth/expired-action-code":
      return toast.error("Expired OOB Code");
    case "auth/cancelled-popup-request":
      return toast.error("Expired Popup Request");
    case "auth/internal-error":
      return toast.error("Internal Error");
    case "auth/invalid-api-key":
      return toast.error("Invalid API Key");
    case "auth/invalid-app-credential":
      return toast.error("Invalid App Credential");
    case "auth/invalid-app-id":
      return toast.error("Invalid App ID");
    case "auth/invalid-user-token":
      return toast.error("Invalid Auth");
    case "auth/invalid-auth-event":
      return toast.error("Invalid Auth Event");
    case "auth/invalid-cert-hash":
      return toast.error("Invalid Cert Hash");
    case "auth/invalid-verification-code":
      return toast.error("Invalid Code");
    case "auth/invalid-continue-uri":
      return toast.error("Invalid Continue URI");
    case "auth/invalid-cordova-configuration":
      return toast.error("Invalid Cordova Configuration");
    case "auth/invalid-custom-token":
      return toast.error("Invalid Custom Token");
    case "auth/invalid-dynamic-link-domain":
      return toast.error("Invalid Dynamic Link Domain");
    case "auth/invalid-email":
      return toast.error("Invalid Email");
    case "auth/invalid-emulator-scheme":
      return toast.error("Invalid Emulator Scheme");
    case "auth/invalid-credential":
      return toast.error("Invalid IDP Response / Invalid Login Credentials");
    case "auth/invalid-message-payload":
      return toast.error("Invalid Message Payload");
    case "auth/invalid-multi-factor-session":
      return toast.error("Invalid MFA Session");
    case "auth/invalid-oauth-client-id":
      return toast.error("Invalid OAuth Client ID");
    case "auth/invalid-oauth-provider":
      return toast.error("Invalid OAuth Provider");
    case "auth/invalid-action-code":
      return toast.error("Invalid OOB Code");
    case "auth/unauthorized-domain":
      return toast.error("Invalid Origin");
    case "auth/wrong-password":
      return toast.error("Invalid Password");
    case "auth/invalid-persistence-type":
      return toast.error("Invalid Persistence");
    case "auth/invalid-phone-number":
      return toast.error("Invalid Phone Number");
    case "auth/invalid-provider-id":
      return toast.error("Invalid Provider ID");
    case "auth/invalid-recaptcha-action":
      return toast.error("Invalid Recaptcha Action");
    case "auth/invalid-recaptcha-token":
      return toast.error("Invalid Recaptcha Token");
    case "auth/invalid-recaptcha-version":
      return toast.error("Invalid Recaptcha Version");
    case "auth/invalid-recipient-email":
      return toast.error("Invalid Recipient Email");
    case "auth/invalid-req-type":
      return toast.error("Invalid Req Type");
    case "auth/invalid-sender":
      return toast.error("Invalid Sender");
    case "auth/invalid-verification-id":
      return toast.error("Invalid Session Info");
    case "auth/invalid-tenant-id":
      return toast.error("Invalid Tenant ID");
    case "auth/multi-factor-info-not-found":
      return toast.error("MFA Info Not Found");
    case "auth/multi-factor-auth-required":
      return toast.error("MFA Required");
    case "auth/missing-android-pkg-name":
      return toast.error("Missing Android Package Name");
    case "auth/missing-app-credential":
      return toast.error("Missing App Credential");
    case "auth/auth-domain-config-required":
      return toast.error("Missing Auth Domain");
    case "auth/missing-client-type":
      return toast.error("Missing Client Type");
    case "auth/missing-verification-code":
      return toast.error("Missing Code");
    case "auth/missing-continue-uri":
      return toast.error("Missing Continue URI");
    case "auth/missing-iframe-start":
      return toast.error("Missing Iframe Start");
    case "auth/missing-ios-bundle-id":
      return toast.error("Missing iOS Bundle ID");
    case "auth/missing-multi-factor-info":
      return toast.error("Missing MFA Info");
    case "auth/missing-multi-factor-session":
      return toast.error("Missing MFA Session");
    case "auth/missing-or-invalid-nonce":
      return toast.error("Missing or Invalid Nonce");
    case "auth/missing-phone-number":
      return toast.error("Missing Phone Number");
    case "auth/missing-recaptcha-token":
      return toast.error("Missing Recaptcha Token");
    case "auth/missing-recaptcha-version":
      return toast.error("Missing Recaptcha Version");
    case "auth/missing-verification-id":
      return toast.error("Missing Session Info");
    case "auth/app-deleted":
      return toast.error("Module Destroyed");
    case "auth/account-exists-with-different-credential":
      return toast.error("Need Confirmation");
    case "auth/network-request-failed":
      return toast.error("Network Request Failed");
    case "auth/no-auth-event":
      return toast.error("No Auth Event");
    case "auth/no-such-provider":
      return toast.error("No Such Provider");
    case "auth/null-user":
      return toast.error("Null User");
    case "auth/operation-not-allowed":
      return toast.error("Operation Not Allowed");
    case "auth/operation-not-supported-in-this-environment":
      return toast.error("Operation Not Supported");
    case "auth/popup-blocked":
      return toast.error("Popup Blocked");
    case "auth/popup-closed-by-user":
      return toast.error("Popup Closed By User");
    case "auth/provider-already-linked":
      return toast.error("Provider Already Linked");
    case "auth/quota-exceeded":
      return toast.error("Quota Exceeded");
    case "auth/recaptcha-not-enabled":
      return toast.error("Recaptcha Not Enabled");
    case "auth/redirect-cancelled-by-user":
      return toast.error("Redirect Cancelled By User");
    case "auth/redirect-operation-pending":
      return toast.error("Redirect Operation Pending");
    case "auth/rejected-credential":
      return toast.error("Rejected Credential");
    case "auth/second-factor-already-in-use":
      return toast.error("Second Factor Already Enrolled");
    case "auth/maximum-second-factor-count-exceeded":
      return toast.error("Second Factor Limit Exceeded");
    case "auth/tenant-id-mismatch":
      return toast.error("Tenant ID Mismatch");
    case "auth/timeout":
      return toast.error("Timeout");
    case "auth/user-token-expired":
      return toast.error("Token Expired");
    case "auth/too-many-requests":
      return toast.error("Too Many Attempts, Try Later");
    case "auth/unauthorized-continue-uri":
      return toast.error("Unauthorized Domain");
    case "auth/unsupported-first-factor":
      return toast.error("Unsupported First Factor");
    case "auth/unsupported-persistence-type":
      return toast.error("Unsupported Persistence");
    case "auth/unsupported-tenant-operation":
      return toast.error("Unsupported Tenant Operation");
    case "auth/unverified-email":
      return toast.error("Unverified Email");
    case "auth/user-cancelled":
      return toast.error("User Cancelled");
    case "auth/user-not-found":
      return toast.error("User Deleted");
    case "auth/user-disabled":
      return toast.error("User Disabled");
    case "auth/user-mismatch":
      return toast.error("User Mismatch");
    case "auth/user-signed-out":
      return toast.error("User Signed Out");
    case "auth/weak-password":
      return toast.error("Weak Password");
    case "auth/web-storage-unsupported":
      return toast.error("Web Storage Unsupported");
    default:
      return toast.error("Unknown Error");
  }
};

// urlTypeHelper.js
const imageTypes = [
  'jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'png', 'svg', 'gif', 'apng', 'webp', 'avif'
];

const videoTypes = [
  '3g2', '3gp', 'aaf', 'asf', 'avchd', 'avi', 'drc', 'flv', 'm2v', 'm3u8', 'm4p', 'm4v',
  'mkv', 'mng', 'mov', 'mp2', 'mp4', 'mpe', 'mpeg', 'mpg', 'mpv', 'mxf', 'nsv', 'ogg',
  'ogv', 'qt', 'rm', 'rmvb', 'roq', 'svi', 'vob', 'webm', 'wmv', 'yuv'
];

export const UrlType = {
  IMAGE: 'image',
  VIDEO: 'video',
  UNKNOWN: 'unknown'
};
export const getUrlType = (url) => {
  try {
    const urlObj = new URL(url);
    let extension = urlObj.pathname.split('.').pop().toLowerCase();

    if (!extension) {
      return UrlType.UNKNOWN;
    }

    if (imageTypes.includes(extension)) {
      return UrlType.IMAGE;
    } else if (videoTypes.includes(extension)) {
      return UrlType.VIDEO;
    }
  } catch (error) {
    console.error("Error determining URL type:", error);
    return UrlType.UNKNOWN;
  }

  return UrlType.UNKNOWN;
};


export const getStatusClassName = (status) => {
  switch (status) {
    case "awaiting":
      return "status-awaiting";
    case "confirmed":
      return "status-success";
    case "completed":
      return "status-success";
    case "cancelled":
      return "status-error";
    case "rescheduled":
      return "status-warning";
    case "started":
      return "status-dark";
    default:
      return "status-info";
  }
};

export const normalizeSlugTerm = (term) => {
  return term.replace(/-/g, " ");
};
