import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import CenterCirculareProgress from "../../loading/CenterCirculareProgress";
import DiagnosisSummary from "./DiagnosisSummary";

const Details = () => {
  const { diagnosisId } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDiagnosisById = async () => {
    setLoading(true);
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(
        `${process.env.REACT_APP_API_DOMAIN}/api/v1/patient/diagnosis/skin-lesions/diagnosisResult/${diagnosisId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = await response.json();
      if (response.status !== 200) {
        throw new Error("Failed to get diagnosis");
      } else {
        setDiagnosis(data.diagnosisResult);
      }
    } catch (error) {
      setDiagnosis(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnosisById();
    // eslint-disable-next-line
  }, [diagnosisId]);

  if (loading) {
    return (
      <DetailsPaneWrapper>
        <CenterCirculareProgress />
      </DetailsPaneWrapper>
    );
  }

  if (!diagnosis) {
    return (
      <DetailsPaneWrapper>
        <Title>Could not find diagnosis</Title>
        <p>id: {diagnosisId}</p>
      </DetailsPaneWrapper>
    );
  }

  return (
    <DetailsPaneWrapper>
      <DiagnosisSummary
        diagnosisDetails={diagnosis}
        refresh={fetchDiagnosisById}
      />
    </DetailsPaneWrapper>
  );
};

export default Details;

const DetailsPaneWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 4rem;
`;

const Title = styled.div``;
