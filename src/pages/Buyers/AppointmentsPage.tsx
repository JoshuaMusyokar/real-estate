/* eslint-disable @typescript-eslint/no-unused-vars */
import { type FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import { useAuth } from "../../hooks/useAuth";
import { PropertyDetailBuyer } from "../../features/Buyers/PropertyDetailBuyer";
import AppointmentsPage from "../../features/Buyers/Appointments/BuyerAppointments";
import { Footer } from "../../layout/Footer";
import { PublicHeader } from "../../layout/PublicHeader";

const BuyerAppointmentsPage: FC = () => {
  return (
    <>
      <PageMeta
        title={`My Appointments`}
        description="Track Your Appointments."
      />

      <div className="mx-auto px-4 py-6">
        <AppointmentsPage />
      </div>

      <Footer />
    </>
  );
};

export default BuyerAppointmentsPage;
