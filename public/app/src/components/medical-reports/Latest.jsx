import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useMedicalReportContext } from "../../contexts/MedicalReportContext";
import CenterCirculareProgress from "../loading/CenterCirculareProgress";

const Latest = () => {
  const { latestMedicalReport, fetchLatestMedicalReport, loading } =
    useMedicalReportContext();

  useEffect(() => {
    fetchLatestMedicalReport();
       // eslint-disable-next-line
  }, []);

  if (loading) {
    return <CenterCirculareProgress />;
  }

  if (!latestMedicalReport) {
    return <Navigate to="/dashboard/medical-reports/new" />;
  }

  return (
    <Navigate
      to={`/dashboard/medical-reports/view/${latestMedicalReport._id}`}
    />
  );
};

export default Latest;
