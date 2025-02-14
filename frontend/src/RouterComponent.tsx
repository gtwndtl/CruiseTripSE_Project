import React, { lazy, StrictMode } from "react";
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { OrderProvider } from "./food_service/context/OrderContext";

import Loadable from "./components/third-party/Loadable";
// import Loader from "./components/third-party/Loader";
// import LDSRing from "./components/third-party/LDSRing";
import CruiseShipLogin from "./authentication/cruise_ship_login";
import DotLoader from "./components/third-party/DotLoader";
import LandingPage from "./landing_page(gtwndtl)/LandingPage";
import CruiseSignInPages from "./authentication/Cruise(gtwndtl)/Login";
import CruiseSignUpPages from "./authentication/Cruise(gtwndtl)/Register";
import PromotionTripPage from "./promotion(gtwndtl)/pages/promotion/promotripcodepage/promotripcode";
import PromotionFoodPage from "./promotion(gtwndtl)/pages/promotion/promofoodcodepage/promofoodcode";
import ReviewForCustomerPage from "./review(gtwndtl)/pages/reviewforcustomer/reviewcustomerpage/reviewcustomerpage";
import AllReviewsTrip from "./review(gtwndtl)/pages/reviews/trip/allreviewstrip";
import AllReviewsFood from "./review(gtwndtl)/pages/reviews/food/allreviewsfood";
import NoPermission from "./unauthorized_access(gtwndtl)/NoPermission";
import RequireAuth from "./authentication/RequireAuth/RequireAuth";
import NavbarAdmin from "./navbar(gtwndtl)/admin_navbar";
import Promotion from "./promotion(gtwndtl)/pages/promotionadmin";
import PromotionCreate from "./promotion(gtwndtl)/pages/promotionadmin/create";
import PromotionEdit from "./promotion(gtwndtl)/pages/promotionadmin/edit";


import Employees from "./employee/page/employee/Home";
import EmployeeCreate from "./employee/page/employee/create";
import EmployeeEdit from "./employee/page/employee/edit";
import RouteShip from "./routeship/page/routeship/home";
import RouteShipCreate from "./routeship/page/routeship/create";
import RouteShipInfo from "./routeship/page/routeship/info";
import Harbor from "./routeship/page/harbor/info";
import HarborCreate from "./routeship/page/harbor/create";

import CustomerSelfEdit from "./review(gtwndtl)/pages/reviewforcustomer/userEdit";
import OnCruiseShipHomePage from "./food_service/page/home/OnCruiseShipHomePage";

// import TripCompletePage from "./payment/page/trip_stripe/TripCompletePage";
// import TripSummary from "./payment/page/trip_summary/TripSummary";

// const SignInPages = Loadable(lazy(() => import("./authentication/Login")));

// Food Service
const SignUpPages = Loadable(lazy(() => import("./authentication/cruise_ship_register")));
const NavbarFoodService = Loadable(lazy(() => import("./food_service/page/navbar/NavbarFoodService")));
const Menu = Loadable(lazy(() => import("./food_service/page/menu/Menu")));
const MenuDetail = Loadable(lazy(() => import("./food_service/page/menu_detail/MenuDetail")));
const OrderSummary = Loadable(lazy(() => import("./food_service/page/order_item/OrderItem")));

// Payment
const FoodStripeCheckout = Loadable(lazy(() => import("./payment/page/food_stripe/FoodStripeCheckout")));
const FoodCompletePage = Loadable(lazy(() => import("./payment/page/food_stripe/FoodCompletePage")));
const TripSummary = Loadable(lazy(() => import("./payment/page/trip_summary/TripSummary")));
const TripCompletePage = Loadable(lazy(() => import("./payment/page/trip_stripe/TripCompletePage")));

const stripePromise = loadStripe("pk_test_51QOxoF4QmAAjQ0QzsimUKy0RcgMxNPvfbmCm6OJurQzEGULD1u2OfTSGfdd0OwpEW0tzpdkQvmQSZKvbq9waUceD00PaT9sjdJ");

const RouterComponent: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Link to={"/home"}>Home</Link><br />
          <Link to={"/login"}>Admin</Link>
        </>
      ),
    },
    {
      path: "/cruise-ship/login",
      element: <CruiseShipLogin />,
    },
    {
      path: "/cruise-ship/signup",
      element: <SignUpPages />,
    },
    {
      path: "/loader",
      element: <DotLoader />,
    },
    {
      path: "/cruise-ship/login/home",
      element: <OrderProvider><NavbarFoodService /></OrderProvider>,
      children: [
        {
          path: "",
          element: <OnCruiseShipHomePage/>, // Default content for Home
        },
        {
          path: "activity",
          element: <div>Activity Content</div>, // Content for Activity
        },
        {
          path: "food-service",
          element: <Menu />, // Content for Food Service
        },
        {
          path: "food-service/menu-detail",
          element: <MenuDetail />,
        },
        {
          path: "food-service/order-summary",
          element: <OrderSummary />,
        },
        {
          path: "food-service/order-summary/checkout",
          element: (    
              <FoodStripeCheckout />
          ),
        },
      ],
    },
    {
      path: "/cruise-ship/login/home/food-service/order-summary/checkout/complete",
      element: (
        <OrderProvider>
        <Elements stripe={stripePromise}>
              <FoodCompletePage />
          </Elements>
        </OrderProvider>
      ),
    },
    {
      path: "/trip-summary",
      element: <TripSummary/>,
    },
    {
      path: "trip-summary/complete",
      element: (
        <OrderProvider>
        <Elements stripe={stripePromise}>
              <TripCompletePage />
          </Elements>
        </OrderProvider>
      ),
    },



     ///////////////ชั่วคราว///////////////////////////
     {
      path: "/home",
      element: <LandingPage />,
    },
    {
      path: "/login",
      element: <CruiseSignInPages />,
    },
    {
      path: "/signup",
      element: <CruiseSignUpPages />,
    },
        //Promotion Show
        {
          path: "/promotion/trip",
          element: <PromotionTripPage />,
        },
        {
          path: "/promotion/food",
          element: <OrderProvider><NavbarFoodService /></OrderProvider>,
          children: [
    
            {
    
              path: "/promotion/food",
    
              element: <PromotionFoodPage />,
    
            },
          ]
        },
    {
      path: "/customer/review",
      element: <ReviewForCustomerPage />,
    },
    {
      path: "/customer/edit/:id",
      element: <CustomerSelfEdit />,
    },
    {
      path: "/reviews/trip",
      element: <AllReviewsTrip />,
    },
    {
      path: "/reviews/food-service",
      element: <OrderProvider><NavbarFoodService /></OrderProvider>,
      children: [

        {

          path: "/reviews/food-service",

          element: <AllReviewsFood />,

        },
      ]
    },
    {
      path: "/unauthorized",
      element: <NoPermission />,
    },
    //Admin//
    {
      path: "/admin/promotion",
      element: <RequireAuth allowedRoles={['Admin']}><NavbarAdmin /></RequireAuth>,
      children: [
        {
          path: "/admin/promotion",
          element: <Promotion />,
        },
        {
          path: "/admin/promotion/create",
          element: <PromotionCreate />,
        },
        {
          path: "/admin/promotion/edit/:id",
          element: <PromotionEdit />,
        },
      ],
    },
    {
      path: "/admin/employee",
      element: <RequireAuth allowedRoles={['Admin']}><NavbarAdmin /></RequireAuth>,
      children: [
        {
          path: "/admin/employee",
          element: <Employees />,
        },
        {
          path: "/admin/employee/create",
          element: <EmployeeCreate />,
        },
        {
          path: "/admin/employee/edit/:id",
          element: <EmployeeEdit />,
        },
      ]
    },
    {
      path: "/admin/routeship",
      element: <RequireAuth allowedRoles={['Admin']}><NavbarAdmin /></RequireAuth>,
      children: [
        {
          path: "/admin/routeship",
          element: <RouteShip />,
        },
        {
          path: "/admin/routeship/create",
          element: <RouteShipCreate />,
        },
        {
          path: "/admin/routeship/info/:id",
          element: <RouteShipInfo />,
        },
      ]
    },
    {
      path: "/admin/harbor",
      element: <RequireAuth allowedRoles={['Admin']}><NavbarAdmin /></RequireAuth>,
      children: [
        {
          path: "/admin/harbor",
          element: <Harbor />,
        },
        {
          path: "/admin/harbor/create",
          element: <HarborCreate />,
        },
      ]
    },

    
  ]);

  return (
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
  );
};

export default RouterComponent;
