import { lazy } from "react";
import { SpecificProvider } from "../../Components/Reusable/Sections/Provider";
import Cancel from "../../PaymentGateways/Cancel";
import PaymentSuccess from "../../Pages/PaymentSuccess";

const About = lazy(() => import("../../Pages/About"));
const Contact = lazy(() => import("../../Pages/Contact"));
const Providers = lazy(() => import("../../Pages/Provider"));
const Category = lazy(() => import("../../Pages/Category"));
const SearchAndProvider = lazy(() => import("../../Pages/SearchAndProvider"));
const Reviews = lazy(() =>
  import("../../Components/Reusable/Sections/Reviews")
);
const ProfileNavigation = lazy(() =>
  import("../../Components/Reusable/Profile/ProfileNavigation")
);
const ProfilePayment = lazy(() =>
  import("../../Components/Reusable/Profile/ProfilePayment")
);
const NavigateCategorys = lazy(() =>
  import("../../Components/Reusable/Profile/NavigateCategorys")
);
const StartPage = lazy(() => import("../../Pages/StartPage"));
const PrivacyPolicy = lazy(() =>
  import("../../Components/Reusable/Sections/Privacy_Policy")
);
const Terms = lazy(() => import("../../Components/Reusable/Sections/Terms"));
const SpecificService = lazy(() =>
  import("../../Components/Reusable/Profile/Bookings/SpecificService")
);
const ProfileBooking = lazy(() =>
  import("../../Components/Reusable/Profile/ProfileBooking")
);
const ProfileAddress = lazy(() =>
  import("../../Components/Reusable/Profile/ProfileAddress")
);
const ProfileBookmark = lazy(() =>
  import("../../Components/Reusable/Profile/ProfileBookmark")
);
const ProfileNotification = lazy(() =>
  import("../../Components/Reusable/Profile/ProfileNotification")
);
const ProviderServices = lazy(() =>
  import("../../Components/Reusable/Sections/ProviderServices")
);
// const Test = lazy(() => import("../../view/Test"));

const Home = lazy(() => import("../../Pages/Home"));

const elementRoutes = [
  {
    element: <StartPage />,
    path: "/home",
    title: "Home",
  },
  {
    element: <Home />,
    path: "/",
    title: "Home",
    meta: {
      needProvider: true,
    },
  },
  {
    path: "/about",
    element: <About />,
    title: "About",
    meta: {
      needProvider: false,
    },
  },

  {
    path: "/categories",
    element: <Category />,
    title: "Categories",
    meta: {
      needProvider: true,
    },
  },
  {
    path: "/providers",
    element: <Providers />,
    title: "Providers",
    meta: {
      needProvider: true,
    },
  },
  {
    path: "/providers/services/reviews/:partner_id/:company_name",
    element: <Reviews />,
    title: "Reviews",
    meta: {
      needProvider: true,
    },
  },
  {
    path: "/contact",
    element: <Contact />,
    title: "Contacts",
    meta: {
      needProvider: false,
    },
  },
  {
    path: "/providers/services/:partner_id/:company_name",
    element: <ProviderServices />,
    title: "Services",
    meta: {
      needProvider: true,
    },
  },
  {
    path: "/sub-categories/:id/:name",
    element: <NavigateCategorys />,
    title: "Sub Categories",
    meta: {
      needProvider: true,
    },
  },
  {
    path: "/categories/:id/:name",
    element: <NavigateCategorys />,
    title: "Categories",
    meta: {
      needProvider: true,
    },
  },
  {
    path: "/privacy-policies",
    element: <PrivacyPolicy />,
    title: "Privacy Policy",
    meta: {
      needProvider: false,
    },
  },
  {
    path: "/terms-and-conditions",
    element: <Terms />,
    title: "Terms and Condition",
    meta: {
      needProvider: false,
    },
  },
  {
    path: "/categories/:id/providers/:name",
    element: <SpecificProvider />,
    title: "Provider",
    meta: {
      needProvider: true,
    },
  },
  {
    path: "/profile/address",
    element: <ProfileAddress />,
    title: "Address",
    meta: {
      restricted: true,
    },
  },
  {
    path: "/profile/payment",
    element: <ProfilePayment />,
    title: "Payment",
    meta: {
      restricted: true,
    },
  },
  {
    path: "/profile/booking/:status?",
    element: <ProfileBooking />,
    title: "Booking",
    meta: {
      restricted: true,
    },
  },
  {
    path: "/profile/booking/services/:id",
    element: <SpecificService />,
    title: "Service",
    meta: {
      restricted: true,
    },
  },
  {
    path: "/profile/bookmark",
    element: <ProfileBookmark />,
    title: "Bookmarks",
    meta: {
      restricted: true,
    },
  },
  {
    path: "/profile/notifications",
    element: <ProfileNotification />,
    title: "Notification",
    meta: {
      restricted: true,
    },
  },
  {
    path: "/profile",
    element: <ProfileBookmark />,
    title: "Profile",
    meta: {
      restricted: true,
    },
  },
  {
    path: "/search-and-provider/:slug",
    element: <SearchAndProvider />,
    title: "SearchAndProvider",
    meta: {
      needProvider: true,
    },
  },
  {
    path: "success",
    element: <PaymentSuccess />,
    title: "success",
  },
  {
    path: "cancel",
    element: <Cancel />,
    title: "cancel",
  },
];

export default elementRoutes;
