import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { useMedicalReportContext } from "../../contexts/MedicalReportContext";
import CenterCirculareProgress from "../loading/CenterCirculareProgress";
import DiagnosisItem from "./DiagnosisItem";

const New = () => {
  const { getAccessTokenSilently } = useAuth0();
  const { diagnosisId } = useParams();
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const { setLatestMedicalReport } = useMedicalReportContext();
  const navigate = useNavigate();

  const getUserDiagnosisResults = async () => {
    if (!results[page]) {
      setLoading(true);
    }
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(
        `${
          process.env.REACT_APP_MAIN_DOMAIN || "http://localhost:5000"
        }/api/v1/patient/diagnosis/skin-lesions/allDiagnosisResults?limit=10&skip=${
          page * 10
        }&complete=true`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = await response.json();
      if (response.status !== 200) {
        throw new Error("Failed to get diagnosis results");
      } else {
        setResults((results) => ({
          ...results,
          [page]: data.diagnosisResults,
        }));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const createMedicalReport = async () => {
    setLoading(true);
    try {
      const accessToken = await getAccessTokenSilently();
      // start new diagnosis
      const response = await fetch(
        `${
          process.env.REACT_APP_API_DOMAIN
        }/api/v1/patient/medicalReports/generateReport/${"skin-lesions"}/${selectedDiagnosis}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = await response.json();
      if (response.status !== 200) {
        throw new Error("Failed to create medical report");
      } else {
        setLatestMedicalReport(data.medicalReport);
        navigate(`/dashboard/medical-reports/view/${data.medicalReport._id}`);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserDiagnosisResults();
    // eslint-disable-next-line
  }, [page]);

  useEffect(() => {
    setSelectedDiagnosis(diagnosisId);
  }, [diagnosisId]);

  if (loading) {
    return (
      <NewMedicalReportWrapper>
        <CenterCirculareProgress />
      </NewMedicalReportWrapper>
    );
  }

  return (
    <NewMedicalReportWrapper>
      <Title>Select a diagnosis to create a medical report</Title>

      <ReportCreationContainer>
        <Selected>{selectedDiagnosis || "No diagnosis selected"}</Selected>
        <CreateReport
          onClick={() => !loading && selectedDiagnosis && createMedicalReport()}
        >
          Generate medical report
        </CreateReport>
      </ReportCreationContainer>
      <PageControls>
        <Button onClick={() => !loading && setPage(0)}>Reset</Button>
        <Button
          onClick={() =>
            !loading && setPage((page) => (page > 0 ? page - 1 : page))
          }
        >
          Previous
        </Button>
        <Current>Current page: {page + 1}</Current>
        <Button
          onClick={() =>
            setPage(
              (page) =>
                !loading && (results[page].length === 10 ? page + 1 : page)
            )
          }
        >
          Next
        </Button>
      </PageControls>

      <ResultListContainer>
        {loading && !results[page]?.length && <CenterCirculareProgress />}
        <ResultList>
          {results[page]?.map((diagnosis) => {
            return (
              <DiagnosisItem
                selected={selectedDiagnosis === diagnosis._id}
                diagnosis={diagnosis}
                key={diagnosis._id}
                clickHandler={() => setSelectedDiagnosis(diagnosis._id)}
              />
            );
          })}
        </ResultList>
      </ResultListContainer>
    </NewMedicalReportWrapper>
  );
};

export default New;

const NewMedicalReportWrapper = styled.div`
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  padding: 2rem;
`;

const ReportCreationContainer = styled.div`
  display: flex;
  flex-flow: column;
  gap: 2rem;
  justify-content: center;
  align-items: center;
`;

const Selected = styled.h2`
  width: 100%;
  max-width: 400px;
  background-color: var(--color-light);
  color: var(--color-dark);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 0 6px 1px var(--color-primary);
`;

const Title = styled.h1`
  font-size: 1.5rem;
`;

const Button = styled.button`
  background-color: var(--color-dark);
  border: 2px solid var(--color-accent);
  color: var(--color-accent);
  padding: 4px 6px;
  cursor: pointer;
  transition: transform ease-in-out 100ms;
  width: fit-content;

  &:active {
    transform: scale(95%);
  }
`;

const ResultList = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  padding: 2rem;
  gap: 2rem;
`;

const ResultListContainer = styled.div`
  height: auto;
  border: 1px solid white;

  flex-grow: 1;
  width: 100%;
`;

const PageControls = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  width: 100%;
`;

const Current = styled.h2`
  font-size: 1.5rem;
`;

const CreateReport = styled(Button)``;
