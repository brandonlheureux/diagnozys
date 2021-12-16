import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useDiagnosisContext } from "../../../contexts/DiagnosisContext";
import CenterCirculareProgress from "../../loading/CenterCirculareProgress";

const New = () => {
  const { getAccessTokenSilently } = useAuth0();
  const { currentDiagnosisRequest, setCurrentDiagnosisRequest } =
    useDiagnosisContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const startSkinLesionDiagnosis = async () => {
    setLoading(true);
    // get access token for authorization
    try {
      const accessToken = await getAccessTokenSilently();
      // start new diagnosis
      const response = await fetch(
        `${process.env.REACT_APP_API_DOMAIN}/api/v1/patient/diagnosis/skin-lesions/newDiagnosis`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = await response.json();
      if (response.status !== 200) {
        if (data.error) {
          throw new Error(data.error.toString());
        }
        throw new Error("Failed to start new diagnosis");
      } else if (!data?.diagnosisDocument) {
        throw new Error("no diagnosis document found");
      } else {
        setCurrentDiagnosisRequest(data.diagnosisDocument);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // if the current diagnosis is still being processed, dont allow new requests
  useEffect(() => {
    if (currentDiagnosisRequest && !currentDiagnosisRequest.completed) {
      navigate("/dashboard/diagnosis/skin-lesions/current");
    }
    // eslint-disable-next-line
  }, [currentDiagnosisRequest]);

  if (
    loading ||
    (currentDiagnosisRequest && !currentDiagnosisRequest.completed)
  ) {
    return (
      <NewLesionWrapper>
        <CenterCirculareProgress />
      </NewLesionWrapper>
    );
  }

  return (
    <NewLesionWrapper>
      <Title>No active diagnosis found, you can create a new one here</Title>
      <Card>
        <Title>New skin lesion diagnosis request</Title>
        <Description>
          <Text>Hello & thanks for using our services!</Text>
          <Text>You may request a new skin-lesion diagnosis.</Text>
          <Text>Only one open request is allowed at a time.</Text>
          <Text>
            You can find the status of your requests in the{" "}
            <LinkToPath to="/dashboard/diagnosis/skin-lesions/reports">
              reports
            </LinkToPath>{" "}
            page.
          </Text>
        </Description>
        <Button
          onClick={startSkinLesionDiagnosis}
          // disabled={!currentDiagnosisRequest.completed}
        >
          Start new diagnosis
        </Button>
      </Card>
    </NewLesionWrapper>
  );
};

export default New;

const NewLesionWrapper = styled.div`
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  gap: 3rem;
`;

const Card = styled.div`
  width: max-content;
  height: max-content;
  background-color: var(--color-light);
  color: var(--color-dark);
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-content: center;
  gap: 1rem;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 0 6px 1px var(--color-primary);
`;

const Title = styled.h1`
  font-size: 1.5rem;
`;

const Description = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Text = styled.li``;

const LinkToPath = styled(Link)`
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--color-secondary);
`;

const Button = styled.button`
  border: 2px solid var(--color-dark);
  background: var(--color-light);
  width: fit-content;
  margin: auto;
  border-radius: 4px;
  font-size: 1.2rem;
  font-weight: bold;
  padding: 8px 12px;
  transition: transform ease-in-out 100ms;
  cursor: pointer;

  &:hover {
    transform: scale(103%);
  }
  &:active {
    transform: scale(100%);
  }
`;
