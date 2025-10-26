// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import Unauthorized from "./pages/OtherPage/Unauthorized";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Property from "./pages/Property/Property";
import MainLanding from "./pages/Landing/MainLanding";
import PropertyDetailPage from "./pages/Property/PropertyDetailPage";
import PropertyCreatePage from "./pages/Property/PropertyCreatePage";
import PropertyUpdatePage from "./pages/Property/PropertyUpdatePage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";
import RoleBasedRoute from "./components/auth/RoleBasedRoute";
// import {Role } from "./types";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Landing Page */}
          <Route path="/home" element={<MainLanding />} />

          {/* Auth Routes - Only accessible when not authenticated */}
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />

          {/* Protected Dashboard Layout */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard - Accessible to all authenticated users */}
            <Route index path="/" element={<Home />} />

            {/* Properties - Different access levels */}
            <Route path="/property" element={<Property />} />
            <Route path="/properties/:slug" element={<PropertyDetailPage />} />

            {/* Property Creation - Property owners, agents, and admins */}
            <Route
              path="/properties/new"
              element={
                <RoleBasedRoute
                  allowedRoles={[
                    "PROPERTY_OWNER",

                    "SALES_AGENT",

                    "SALES_MANAGER",

                    "ADMIN",

                    "SUPER_ADMIN",
                  ]}
                >
                  <PropertyCreatePage />
                </RoleBasedRoute>
              }
            />

            {/* Property Editing - Property owners, agents, and admins */}
            <Route
              path="/properties/:id/edit"
              element={
                <RoleBasedRoute
                  allowedRoles={[
                    "PROPERTY_OWNER",
                    "SALES_AGENT",
                    "SALES_MANAGER",
                    "ADMIN",
                    "SUPER_ADMIN",
                  ]}
                >
                  <PropertyUpdatePage />
                </RoleBasedRoute>
              }
            />

            {/* User Profile - All authenticated users */}
            <Route path="/profile" element={<UserProfiles />} />

            {/* Admin Only Routes */}
            <Route
              path="/calendar"
              element={
                <RoleBasedRoute
                  allowedRoles={["ADMIN", "SUPER_ADMIN", "SALES_MANAGER"]}
                >
                  <Calendar />
                </RoleBasedRoute>
              }
            />

            {/* Demo/UI Routes - Accessible to all authenticated users */}
            <Route path="/blank" element={<Blank />} />
            <Route path="/form-elements" element={<FormElements />} />
            <Route path="/basic-tables" element={<BasicTables />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Unauthorized Page */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
