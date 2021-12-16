import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState, createContext, useContext } from "react";

export const MedicalReportContext = createContext(null);

export const MedicalReportContextProvider = ({ children }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [latestMedicalReport, setLatestMedicalReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch latest on mount
  const fetchLatestMedicalReport = async () => {
    setLoading(true);
    try {
      const accessToken = await getAccessTokenSilently();
      // start new diagnosis
      const response = await fetch(
        `${process.env.REACT_APP_API_DOMAIN}/api/v1/patient/medicalReports/latest`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = await response.json();
      if (response.status !== 200) {
        if (data.error) {
          throw new Error(data.error.toString());
        }
        throw new Error("Failed to get  report");
      } else {
        setLatestMedicalReport(data.medicalReport);
      }
    } catch (error) {
      setLatestMedicalReport(null);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // dont let users use our app without completing their profile
  useEffect(() => {
    fetchLatestMedicalReport();
    // eslint-disable-next-line
  }, []);

  return (
    <MedicalReportContext.Provider
      value={{
        latestMedicalReport,
        setLatestMedicalReport,
        fetchLatestMedicalReport,
        loading,
      }}
    >
      {children}
    </MedicalReportContext.Provider>
  );
};

export const useMedicalReportContext = () => useContext(MedicalReportContext);
