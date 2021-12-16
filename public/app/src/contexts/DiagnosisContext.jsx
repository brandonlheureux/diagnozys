import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState, createContext, useContext } from "react";

export const DiagnosisContext = createContext(null);

export const DiagnosisContextProvider = ({ children }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [currentDiagnosisRequest, setCurrentDiagnosisRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch latest on mount
  const fetchCurrentDiagnosis = async () => {
    setLoading(true);
    try {
      const accessToken = await getAccessTokenSilently();
      // start new diagnosis
      const response = await fetch(
        `${process.env.REACT_APP_API_DOMAIN}/api/v1/patient/diagnosis/skin-lesions/latestRequest`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = await response.json();
      if (response.status !== 200) {
        if (data.error) {
          throw new Error(data.error.toString());
        }
        throw new Error("Failed to get diagnosis results");
      } else {
        setCurrentDiagnosisRequest(data.latestDiagnosisRequest);
      }
    } catch (error) {
      setCurrentDiagnosisRequest(null);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // dont let users use our app without completing their profile
  useEffect(() => {
    fetchCurrentDiagnosis();
    // eslint-disable-next-line
  }, []);

  return (
    <DiagnosisContext.Provider
      value={{
        currentDiagnosisRequest,
        setCurrentDiagnosisRequest,
        fetchCurrentDiagnosis,
        loading,
      }}
    >
      {children}
    </DiagnosisContext.Provider>
  );
};

export const useDiagnosisContext = () => useContext(DiagnosisContext);
