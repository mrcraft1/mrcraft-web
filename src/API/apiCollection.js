import { store } from "../redux/store";
import toast from "react-hot-toast";
import api from "./apiMiddleware";
import * as apiEndPoints from "./apiEndPoints";

const get_home_screen = async ({ latitude = "", longitude = "" }) => {
  try {
    const formData = new FormData();
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);

    const response = await api.post(apiEndPoints.getHomePage, formData);

    if (response.status !== 200) {
      throw new Error("Failed to fetch data");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

/* function for fetching Category  */
const get_category = async ({
  latitude = "",
  longitude = "",
  search = null,
}) => {
  try {
    const formData = new FormData();
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    if (search) {
      formData.append("search", search);
    }

    const response = await api.post(apiEndPoints.getCategory, formData);

    if (response.status !== 200) {
      throw new Error("Failed to fetch categories");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return null;
  }
};

const get_providers = async ({
  latitude = "",
  longitude = "",
  id = "",
  search = "",
  category_id = 0,
  subcategory_id = 0,
  order = "asc",
  filter = null,
}) => {
  try {
    const formData = new FormData();
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    if (id > 0) {
      formData.append("partner_id", id);
    }
    if (search) {
      formData.append("search", search);
    }
    if (category_id > 0) {
      formData.append("category_id", category_id);
    }
    if (subcategory_id > 0) {
      formData.append("subcategory_id", subcategory_id);
    }
    formData.append("order", order);
    if (filter) {
      formData.append("filter", filter);
    }

    const response = await api.post(apiEndPoints.getProviders, formData);

    if (response.status !== 200) {
      throw new Error("Failed to fetch providers");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching providers:", error);
    return null;
  }
};

const allServices = async ({
  partner_id = "",
  company_name = "",
  latitude = "",
  longitude = "",
}) => {
  try {
    const formData = new FormData();
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("partner_id", partner_id);
    formData.append("company_name", company_name);

    const response = await api.post(apiEndPoints.getServices, formData);

    if (response.status === 401) {
      toast.error("Something Went Wrong");
      return false;
    }

    return response.data; // Assuming response.data contains the services data
  } catch (error) {
    console.error("Error in allServices:", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

const get_settings = async () => {
  try {
    const response = await api.post(apiEndPoints.getSettings);

    if (response.status !== 200) {
      throw new Error("Failed to fetch settings");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
};

const bookmark = async ({
  type = "",
  lat = "",
  lng = "",
  partner_id = "",
  limit = "",
  offset = "",
}) => {
  try {
    const formData = new FormData();
    formData.append("type", type);
    formData.append("latitude", lat);
    formData.append("longitude", lng);
    formData.append("order", "desc");
    formData.append("limit", limit);
    formData.append("offset", offset);
    if (partner_id) {
      formData.append("partner_id", partner_id);
    }

    const response = await api.post(apiEndPoints.getBookmark, formData);

    if (response.status !== 200) {
      throw new Error("Failed to fetch bookmarks");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return null;
  }
};

const get_cart = async () => {
  try {
    const response = await api.post(apiEndPoints.getCart)

    if (response.status === 401) {
      toast.error("Something Went Wrong");
      return false;
    }

    const responseData = response.data;
    responseData.data = responseData.data?.cart_data?.data || [];

    return responseData;
  } catch (error) {
    console.error(error);
    return null;
  }
};


const get_cart_plain = async () => {
  try {
    const response = await api.post(apiEndPoints.getCart)
    const data = response.data;
    data.data = data.data?.cart_data || [];
    return data;
  } catch (error) {
    console.error(error);
  }
}

//function for check is provider avilable for this location
const providerAvailable = async ({
  latitude = "",
  longitude = "",
  isCheckout = 0,
}) => {
  try {
    const formData = new FormData();
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("is_checkout_process", isCheckout);

    const response = await api.post(
      apiEndPoints.providerCheckAvailability,
      formData
    );

    return response.data;
  } catch (error) {
    console.error("Error in providerAvailable:", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

//function to add address
const AddAddress = async ({
  id = "",
  mobile = "",
  address = "",
  city_id = 0,
  city_name = "",
  latitude = "",
  longitude = "",
  area = "",
  type = "",
  country_code = "",
  pincode = "",
  state = "",
  country = "",
  is_default = "",
  landmark = "",
}) => {
  try {
    const formData = new FormData();
    if (id !== null) {
      formData.append("address_id", id);
    }
    formData.append("mobile", mobile);
    formData.append("address", address);
    formData.append("city_id", city_id);
    formData.append("city_name", city_name);
    formData.append("lattitude", latitude); // Corrected spelling to latitude
    formData.append("longitude", longitude);
    formData.append("area", area);
    formData.append("type", type);
    formData.append("country_code", country_code);
    formData.append("pincode", pincode);
    formData.append("state", state);
    formData.append("country", country);
    formData.append("is_default", is_default);
    formData.append("landmark", landmark);
    formData.append("alternate_mobile", mobile); // Assuming alternate_mobile is same as mobile

    const response = await api.post(apiEndPoints.addAddress, formData);

    return response.data;
  } catch (error) {
    console.error("Error in AddAddress:", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

//function to check available slots
const checkSlots = async ({ partner_id = "", date = "", time = "" }) => {
  try {
    const formData = new FormData();
    formData.append("partner_id", partner_id);
    formData.append("date", date);
    formData.append("time", time);

    const response = await api.post(apiEndPoints.checkAvailableSlot, formData);

    return response.data;
  } catch (error) {
    console.error("Error in checkSlots:", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

// to place order
const placeOrder = async ({
  method = "",
  date = "",
  time = "",
  addressId = 0,
  order_note,
  promoCode = "",
}) => {
  try {
    const state = store.getState(); // Assuming you have a store object available

    const formData = new FormData();
    formData.append("payment_method", method);
    // If delivery mode is home, include address_id; otherwise, leave it empty
    formData.append(
      "address_id",
      state?.DeliveryAddress?.deliveryType === "Home" ? addressId : ""
    );
    formData.append("status", "awaiting");
    if (order_note) formData.append("order_note", order_note);
    formData.append("date_of_service", date);
    formData.append("starting_time", time);
    if (promoCode) formData.append("promo_code", promoCode);
    formData.append(
      "at_store",
      state?.DeliveryAddress?.deliveryType === "Home" ? 0 : 1
    );

    const response = await api.post(apiEndPoints.placeOrder, formData);

    return response.data;
  } catch (error) {
    console.error("Error in placeOrder:", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

// create razorpay order
const createRazorOrder = async ({ orderId = "" }) => {
  try {
    const formData = new FormData();
    formData.append("order_id", orderId);

    const response = await api.post(apiEndPoints.createRazorOrder, formData);

    return response.data;
  } catch (error) {
    console.error("Error in createRazorOrder:", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

// to get awailable slots
const get_available_slot = async ({
  partner_id = 0,
  selectedDate = new Date(),
}) => {
  try {
    const formData = new FormData();
    formData.append("partner_id", partner_id);
    formData.append("date", selectedDate); // Convert date to ISO string format

    const response = await api.post(apiEndPoints.getAvailableSlot, formData);

    return response.data;
  } catch (error) {
    console.error("Error in get_available_slot:", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

// for manage cart and update cart
const ManageCart = async ({ id = 0, qty = 0 }) => {
  try {
    const formData = new FormData();
    formData.append("service_id", id);
    formData.append("qty", qty);

    const response = await api.post(apiEndPoints.manageCart, formData);

    if (response.status === 401) {
      toast.error("Something Went Wrong");
      return false;
    }

    return response.data;
  } catch (error) {
    console.error("Error in ManageCart:", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

const Promocode = async ({ partner_id = 0 }) => {
  try {
    const formData = new FormData();
    formData.append("partner_id", partner_id);

    const response = await api.post(apiEndPoints.getPromoCodes, formData);

    if (response.status === 401) {
      toast.error("Something Went Wrong");
      return false;
    }
    return response.data; // Assuming response.data contains the promo codes data
  } catch (error) {
    console.error("Error in Promocode:", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

const ValidatePromocode = async ({
  provider_id = "",
  promo_code = "",
  overall_amount = "",
}) => {
  try {
    const formData = new FormData();
    formData.append("partner_id", provider_id);
    formData.append("promo_code", promo_code);
    formData.append("final_total", overall_amount);

    const response = await api.post(apiEndPoints.validatePromoCode, formData);

    if (response.status === 401) {
      toast.error("Something Went Wrong");
      return false;
    }

    return response.data; // Assuming response.data contains validation result
  } catch (error) {
    console.error("Error in ValidatePromocode:", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

const VerifyUser = async ({ phone = "", country_code = "", uid = "" }) => {
  try {
    const formData = new FormData();
    formData.append("mobile", phone);
    formData.append("country_code", country_code);
    formData.append("uid", uid);

    const response = await api.post(apiEndPoints.verifyUser, formData);

    if (response.status === 401) {
      toast.error("Something Went Wrong");
      return false;
    }

    return response.data; // Assuming response.data contains verification result
  } catch (error) {
    console.error("Error in VerifyUser:", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

const registerUser = async ({
  email = "",
  mobile = "",
  country = "",
  web_fcm_id = "",
  loginType = "",
  uid = "",
  countryCodeName = "",
  username = "",
}) => {
  try {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("mobile", mobile);
    formData.append("country_code", country);
    formData.append("web_fcm_id", web_fcm_id);
    formData.append("loginType", loginType);
    formData.append("uid", uid);
    formData.append("countryCodeName", countryCodeName);
    formData.append("username", username);

    const response = await api.post(apiEndPoints.manageUser, formData);

    if (response.status === 401) {
      toast.error("Something Went Wrong");
      return false;
    }

    return response.data; // Assuming response.data contains registration result
  } catch (error) {
    console.error("Error in registerUser:", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

const DeleteAddress = async ({ address_id = 0 }) => {
  try {
    const formData = new FormData();
    formData.append("address_id", address_id);

    const response = await api.post(apiEndPoints.deleteAddress, formData);

    if (response.status === 401) {
      toast.error("Something Went Wrong");
      return false;
    }

    return response.data; // Assuming response.data contains deletion result
  } catch (error) {
    console.error("Error in DeleteAddress:", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

const getAddress = async () => {
  try {
    const response = await api.post(apiEndPoints.getAddress);

    if (response.status === 401) {
      toast.error("Something Went Wrong");
      return false;
    }

    return response.data; // Assuming response.data contains address data
  } catch (error) {
    console.error("Error in getAddress:", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

const update_user = async ({
  contact = "",
  Myname = "",
  email = "",
  profileImage = null,
}) => {
  try {
    const formData = new FormData();
    formData.append("mobile", contact);
    formData.append("username", Myname);
    formData.append("email", email);

    if (profileImage !== null) {
      formData.append("image", profileImage);
    }

    const response = await api.post(apiEndPoints.updateUser, formData);

    if (response.status === 401) {
      toast.error("Something Went Wrong");
      return false;
    }

    return response.data; // Assuming response.data contains user update result
  } catch (error) {
    console.error("Error in update_user:", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

const getSubCategory = async ({
  latitude = "",
  longitude = "",
  category_id = "",
  title = "",
}) => {
  try {
    const formData = new FormData();
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("category_id", category_id);
    formData.append("title", title);

    const response = await api.post(apiEndPoints.getSubCategories, formData);

    if (response.status === 401) {
      toast.error("Something Went Wrong");
      return false;
    }

    return response.data; // Assuming response.data contains subcategories
  } catch (error) {
    console.error("Error in getSubCategory:", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

const deleteUserAccount = async () => {
  try {
    const response = await api.post(apiEndPoints.deleteUserAccount);

    if (response.status === 401) {
      toast.error("Something Went Wrong");
      return false;
    }

    return response.data; // Assuming response.data contains deletion status
  } catch (error) {
    console.error("Error in deleteUserAccount:", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

const logout = async () => {
  try {
    const formData = new FormData();
    formData.append("all_device", "true");

    const response = await api.post(apiEndPoints.logout, formData);

    if (response.status === 401) {
      toast.error("Something Went Wrong");
      return false;
    }

    return response.data; // Assuming response.data contains logout status
  } catch (error) {
    console.error("Error in logout:", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

const getOrders = async ({
  id = "",
  currentPage = 0,
  itemsPerPage = 10,
  status = "",
  order_statuses = "",
}) => {
  try {
    const formData = new FormData();
    if (order_statuses.includes(status)) {
      formData.append("status", status);
    }
    if (id) {
      formData.append("id", id);
    }

    const response = await api.post(
      `${apiEndPoints.getOrders}?offset=${
        currentPage * itemsPerPage
      }&limit=${itemsPerPage}`,
      formData
    );

    return response.data; // Assuming response.data contains order data
  } catch (error) {
    console.error("Error in getOrders:", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

const userNotifications = async ({ limit = 10, offset = 0 }) => {
  try {
    const formData = new FormData();
    formData.append("limit", limit);
    formData.append("offset", offset);

    const response = await api.post(apiEndPoints.getNotifications, formData);

    return response.data; // Assuming response.data contains notifications data
  } catch (error) {
    console.error("Error in userNotifications:", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

const getTransaction = async ({ limit = "10", offset = 0 }) => {
  try {
    const formData = new FormData();
    formData.append("limit", limit);
    formData.append("offset", offset);

    const response = await api.post(apiEndPoints.getTransaction, formData);

    return response.data; // Assuming response.data contains transactions data
  } catch (error) {
    console.error("Error in getTransaction:", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

const removeCart = async ({ itemId = "" }) => {
  try {
    const formData = new FormData();
    formData.append("service_id", itemId);

    const response = await api.post(apiEndPoints.removeFromCart, formData);

    return response.data; // Assuming response.data contains the result of the remove operation
  } catch (error) {
    console.error("Error in removeCart:", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

const getRating = async ({
  partner_id = "",
  service_id = "",
  limit = "",
  offset = "",
}) => {
  try {
    const formData = new FormData();
    formData.append("partner_id", partner_id);
    formData.append("service_id", service_id);
    formData.append("limit", limit);
    formData.append("offset", offset);
    formData.append("order", "desc");

    const response = await api.post(apiEndPoints.getRating, formData);

    return response.data; // Assuming response.data contains the ratings data
  } catch (error) {
    console.error("Error in getRating:", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

const add_transactions = async ({ orderID = "", status = "" }) => {
  try {
    const formData = new FormData();
    formData.append("order_id", orderID);
    formData.append("status", status);

    const response = await api.post(apiEndPoints.addTransaction, formData);

    return response.data;
  } catch (error) {
    console.error("Error in add_transactions:", error);
    throw error;
  }
};

const send_message = async ({
  name = "",
  subject = "",
  message = "",
  email = "",
}) => {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("subject", subject);
    formData.append("message", message);
    formData.append("email", email);

    const response = await api.post(apiEndPoints.contactUsApi, formData);

    return response.data;
  } catch (error) {
    console.error("Error in send_message:", error);
    throw error;
  }
};

const apply_rating = async ({
  id = "",
  rating = "",
  comment = "",
  images = "",
}) => {
  try {
    const formData = new FormData();
    formData.append("service_id", id);
    formData.append("rating", rating);
    formData.append("comment", comment);

    if (Array.isArray(images)) {
      images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });
    }

    const response = await api.post(apiEndPoints.addRating, formData);

    return response.data;
  } catch (error) {
    console.error("Error in apply_rating:", error);
    throw error;
  }
};

const change_order_status = async ({
  order_id = "",
  status = "",
  date = "",
  time = "",
}) => {
  try {
    const formData = new FormData();
    formData.append("order_id", order_id);
    formData.append("status", status);
    formData.append("date", date);
    formData.append("time", time);

    const response = await api.post(apiEndPoints.updateOrderStatus, formData);

    if (response.status === 401) {
      toast.error("Something Went Wrong");
      return false;
    }

    return response.data;
  } catch (error) {
    console.error("Error in change_order_status:", error);
    throw error;
  }
};

const download_invoices = async ({ order_id = "" }) => {
  try {
    const formData = new FormData();
    formData.append("order_id", order_id);

    const response = await api.post(apiEndPoints.downloadInvoices, formData, {
      responseType: "blob", // Important for downloading files
    });

    if (response.status === 401) {
      toast.error("Something Went Wrong");
      return false;
    }

    return response.data; // The blob data
  } catch (error) {
    console.error("Error in download_invoices:", error);
    throw error;
  }
};

const search_services_providers = async ({
  search = "",
  latitude = "",
  longitude = "",
  type = "",
  limit = 10,
  offset = 0,
}) => {
  try {
    const formData = new FormData();
    formData.append("search", search);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("type", type);
    formData.append("limit", limit);
    formData.append("offset", offset);

    const response = await api.post(
      apiEndPoints.searchServicesProviders,
      formData
    );

    if (response.status === 401) {
      toast.error("Something Went Wrong");
      return false;
    }

    return response.data; // Assuming the response is JSON
  } catch (error) {
    console.error("Error in search_services_providers:", error);
    throw error;
  }
};

/*Exporting all Functions for reuseing in differnt components*/
const exp = {
  get_category,
  get_providers,
  get_settings,
  get_home_screen,
  providerAvailable,
  get_cart,
  get_cart_plain,
  AddAddress,
  checkSlots,
  placeOrder,
  createRazorOrder,
  get_available_slot,
  ManageCart,
  allServices,
  Promocode,
  ValidatePromocode,
  VerifyUser,
  registerUser,
  DeleteAddress,
  getAddress,
  bookmark,
  getSubCategory,
  deleteUserAccount,
  logout,
  getOrders,
  userNotifications,
  getTransaction,
  removeCart,
  getRating,
  add_transactions,
  send_message,
  update_user,
  apply_rating,
  change_order_status,
  download_invoices,
  search_services_providers,
};
export default exp;
