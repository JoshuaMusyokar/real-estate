/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { AppointmentsCalendar } from "./pages/Calendar";
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
import PropertyDetailBuyerPage from "./pages/Buyers/PropertyDetailBuyerPage";
import PipelineViewPage from "./pages/Lead/PipelineView";
import LeadDetailPage from "./pages/Lead/LeadDetailPage";
import AllLeadsPage from "./pages/Lead/AllLeadPage";
import { SavedPropertiesPage } from "./features/Buyers/SavedProperties/SavedProperties";
import BuyerAppointmentsPage from "./pages/Buyers/AppointmentsPage";
import UserManagementPage from "./pages/UserPage/UserPage";
import AgentsPage from "./pages/Agents/AgentsPage";
import AmenityPage from "./pages/Amenity/AmenityPage";
import LandingPagesAdmin from "./features/Settings/Landing/LandingAmin";
import RBACPage from "./pages/rbac/RBACPage";
import LocalityPage from "./pages/Location/CitiesPage";
import CitiesPage from "./pages/Location/LocalityPage";
import { PropertySearchResults } from "./features/PropertyResult/PropertyResults";
import PropertyTypesManagementPage from "./pages/PropertyType/PropertyTypeManagementPage";
// import {Role } from "./types";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<MainLanding />} />
          <Route path="/listings/buy" element={<PropertySearchResults />} />
          <Route path="/:template" element={<MainLanding />} />

          {/* Auth Routes - Only accessible when not authenticated */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/saved-properties"
            element={
              <ProtectedRoute>
                <SavedPropertiesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-appointments"
            element={
              <ProtectedRoute>
                <BuyerAppointmentsPage />
              </ProtectedRoute>
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
            <Route index path="/dashboard" element={<Home />} />

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
                    "BUILDER",
                    "BUILDER_STAFF",
                    "OWNER",
                    "OWNER_STAFF",
                    "AGENT",
                    "AGENT_STAFF",

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
                    "BUILDER",
                    "BUILDER_STAFF",
                    "OWNER",
                    "OWNER_STAFF",
                    "AGENT",
                    "AGENT_STAFF",
                  ]}
                >
                  <PropertyUpdatePage />
                </RoleBasedRoute>
              }
            />
            {/* Properties - Different access levels */}
            <Route path="/crm/leads" element={<AllLeadsPage />} />
            <Route path="/crm/pipeline" element={<PipelineViewPage />} />
            <Route path="/crm/leads/:id" element={<LeadDetailPage />} />

            {/* Agents  */}
            <Route path="/agents" element={<AgentsPage />} />
            {/* Amenity  */}
            <Route path="/amenities" element={<AmenityPage />} />

            {/* User Profile - All authenticated users */}
            <Route path="/profile" element={<UserProfiles />} />
            {/* User Profile - All authenticated users */}
            <Route path="/users" element={<UserManagementPage />} />
            {/* RBAC - Roles and permissions */}
            <Route path="/rbac" element={<RBACPage />} />
            {/* Cities -  */}
            <Route path="/cities" element={<CitiesPage />} />
            {/* Property types and sub types -  */}
            <Route
              path="/property-types"
              element={<PropertyTypesManagementPage />}
            />
            {/* User Profile - All authenticated users */}
            <Route path="/localities" element={<LocalityPage />} />
            {/* User Profile - All authenticated users */}
            <Route path="/landing" element={<LandingPagesAdmin />} />

            {/* Admin Only Routes */}
            <Route
              path="/calendar"
              element={
                <RoleBasedRoute
                  allowedRoles={["ADMIN", "SUPER_ADMIN", "SALES_MANAGER"]}
                >
                  <AppointmentsCalendar />
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
          <Route
            path="/property-detail/:id"
            element={<PropertyDetailBuyerPage />}
          />

          {/* Unauthorized Page */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
