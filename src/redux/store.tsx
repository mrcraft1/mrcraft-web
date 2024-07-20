// ** Redux Imports
import { combineReducers, configureStore, Middleware } from "@reduxjs/toolkit";
import { persistStore, persistReducer, PersistConfig } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import cart from "./cart";
import Settings from "./Settings";
import Pages from "./Pages";
import Location from "./Location";
import Bookmark from "./Bookmark";
import Promocode from "./Promocode";
import UserData from "./UserData";
import authentication from "./authentication";
import Provider from "./Provider";
import UserAddress from "./UserAddress";
import Categories from "./Categories";
import Login from "./Login";
import DeliveryAddress from "./DeliveryAddress";
import OrderCartDetails from "./orderCartDetails";
import Theme from "./Theme";
import language from "./language";

// Define the root state type
export type RootState = ReturnType<typeof rootReducer>;

const persistConfig: PersistConfig<RootState> = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  authentication,
  cart,
  Settings,
  Pages,
  Location,
  Bookmark,
  Promocode,
  UserData,
  Provider,
  UserAddress,
  Categories,
  Login,
  DeliveryAddress,
  OrderCartDetails,
  Theme,
  language,
});

export const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }) as Middleware[],
});

export const persistor = persistStore(store);