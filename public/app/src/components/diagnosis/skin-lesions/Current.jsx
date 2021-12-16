import React, { useEffect } from "react";
import styled from "styled-components";
import { useDiagnosisContext } from "../../../contexts/DiagnosisContext";
import DiagnosisSummary from "./DiagnosisSummary";
import CenterCirculareProgress from "../../loading/CenterCirculareProgress";
import { Navigate } from "react-router-dom";

const Current = () => {
  const {
    currentDiagnosisRequest,
    fetchCurrentDiagnosis,
    loading,
  } = useDiagnosisContext();

  useEffect(() => {
    fetchCurrentDiagnosis();
    // eslint-disable-next-line
  }, []);

  if (!currentDiagnosisRequest) {
    return (
      <LatestPaneWrapper>
        <Navigate to="/dashboard/diagnosis/skin-lesions/new" />
      </LatestPaneWrapper>
    );
  }

  return (
    <LatestPaneWrapper>
      <Title>Current (or latest) skin lesion disease detection request</Title>
      <LesionReport>
        {loading ? (
          <CenterCirculareProgress />
        ) : (
          <DiagnosisSummary
            diagnosisDetails={currentDiagnosisRequest}
            refresh={fetchCurrentDiagnosis}
          />
        )}
      </LesionReport>
    </LatestPaneWrapper>
  );
};

export default Current;

const LatestPaneWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  text-align: center;
  padding: 20px;
`;

const LesionReport = styled.div`
  height: 100%;
  width: 100%;
  padding: 2rem;
`;
