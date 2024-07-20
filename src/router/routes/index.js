// ** React Imports
import { Suspense } from "react";

import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import allRoutes from "./allRoutes";
import Loader from "../../Components/Loader";

const Routes = [...allRoutes];

const PrivateRoute = ({ children, route }) => {
  const logged = useSelector((state) => state.authentication).isLoggedIn;
  const providerAvailable = useSelector(
    (state) => state.Provider
  ).providerAvailable;
  if (route) {
    let restrictedRoute = false;
    let needProvider = false;
    if (route.meta) {
      restrictedRoute = route.meta.restricted;
      needProvider = route.meta.needProvider;
    }

    if (providerAvailable && route.path === "/home") {
      return <Navigate to="/" />;
    }
    if (needProvider && !providerAvailable) {
      return <Navigate to="/home" />;
    }

    if (!logged && restrictedRoute) {
      return <Navigate to="/" />;
    }

  }

  return <Suspense fallback={<Loader />}>{children}</Suspense>;
};

const TemplateTitle = `%s - ${process.env.REACT_APP_NAME}`;

const DefaultRoute = "/";

const MergeLayoutRoutes = (layout, defaultLayout) => {
  let settings = useSelector((state) => state.Settings)?.settings;
  settings = settings?.web_settings;

  const LayoutRoutes = [];

  if (Routes) {
    Routes.filter((route) => {
      if (
        (route.meta && route.meta.layout && route.meta.layout === layout) ||
        ((route.meta === undefined || route.meta.layout === undefined) &&
          defaultLayout === layout)
      ) {
        if (route.element) {
          route.element = (
            <>
              <Helmet>
                <title>
                  {route.title
                    ? TemplateTitle.replace("%s", route.title)
                    : process.env.REACT_APP_NAME}
                </title>
                <link rel="shortcut icon" href={settings?.web_favicon} />
                <link rel="apple-touch-icon" href={settings?.web_favicon} />
                <link rel="icon" href={settings?.web_favicon} />
              </Helmet>
              <PrivateRoute route={route}>{route.element}</PrivateRoute>
            </>
          );
        }
        LayoutRoutes.push(route);
      }
      return LayoutRoutes;
    });
  }
  return LayoutRoutes;
};

const getRoutes = () => {
  const LayoutRoutes = MergeLayoutRoutes();
  return LayoutRoutes;
};

export { DefaultRoute, TemplateTitle, Routes, getRoutes };
