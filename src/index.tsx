import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import "./i18n";
import { BrowserRouter } from "react-router-dom";
import Loader from "./Components/Loader";
import PushNotificationLayout from "./Components/firebaseNotification/PushNotificationLayout";
import { Toaster } from "react-hot-toast";
import "./CSS/bootstrap.min.css";
import "./CSS/style.css";
import "./CSS/darkmode.css";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PushNotificationLayout>
          <Suspense fallback={<Loader />}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </Suspense>
        </PushNotificationLayout>
      </PersistGate>
    </Provider>
    <Toaster />
  </>
);
