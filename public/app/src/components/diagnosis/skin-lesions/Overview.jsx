import React from "react";
import styled from "styled-components";
import { useDiagnosisContext } from "../../../contexts/DiagnosisContext";
import DiagnosisLink from "./DiagnosisLink";
import CenterCirculareProgress from "../../loading/CenterCirculareProgress";
import { Link } from "react-router-dom";

const Overview = () => {
  const {
    currentDiagnosisRequest,
    fetchCurrentDiagnosis,
    loading,
  } = useDiagnosisContext();

  return (
    <OverviewWrapper>
      <Title>overview - skin lesion diagnosis</Title>
      <Description>
        <Text>
          Using this diagnosis tool does not guarantee accurate diagnosis.
        </Text>
        <Text>For any proper diagnosis, please consult your doctor.</Text>
        <Text>
          You may submit your diagnozys™️ result when visiting your doctor, it
          may help with your diagnosis. If you choose to do so, please create a{" "}
          <LinkToPath to="/dashboard/medical-reports/new">
            medical report
          </LinkToPath>
          .
        </Text>
        <Text></Text>
        <Text>This service uses machine learning.</Text>
        <Text>
          A specially crafted model will attempt to detect skin diseases.
        </Text>
        <Text>Please note that this service is not accurate on dark skin</Text>
        <Text></Text>
        <List>
          <Item>Currently, we support detection of the following:</Item>
          <Item>
            Actinic keratoses and intraepithelial carcinoma / Bowen's disease
            (akiec)
          </Item>
          <Item>basal cell carcinoma (bcc)</Item>
          <Item>
            benign keratosis-like lesions (solar lentigines / seborrheic
            keratoses and lichen-planus like keratoses, bkl)
          </Item>
          <Item>dermatofibroma (df)</Item>
          <Item>melanoma (mel)</Item>
          <Item>melanocytic nevi (nv)</Item>
          <Item>
            vascular lesions (angiomas, angiokeratomas, pyogenic granulomas and
            hemorrhage, vasc)
          </Item>
        </List>
      </Description>
      {loading ? (
        <CenterCirculareProgress />
      ) : (
        <LatestRequest>
          <Heading>Latest open diagnosis request: </Heading>
          {currentDiagnosisRequest ? (
            <DiagnosisLink diagnosis={currentDiagnosisRequest} />
          ) : (
            <>
              <SubHeading>No open request</SubHeading>
              <CreateNew end to="/dashboard/diagnosis/skin-lesions/new">
                Create new request
              </CreateNew>
            </>
          )}
          <Refresh onClick={fetchCurrentDiagnosis}>Update status</Refresh>
        </LatestRequest>
      )}
    </OverviewWrapper>
  );
};

export default Overview;

const OverviewWrapper = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  text-align: center;
  padding: 20px;
`;

const Heading = styled.h2`
  font-size: 1.3rem;
  text-align: center;
  padding: 20px;
`;
const SubHeading = styled.h3`
  font-size: 1.15rem;
  text-align: center;
  padding: 20px;
  color: var(--color-accent);
`;

const Description = styled.div`
  padding: 2rem;
  display: flex;
  align-items: center;
  flex-flow: column;
  gap: 0.5rem;
  justify-content: center;
`;
const Text = styled.p`
  text-align: center;
`;

const LatestRequest = styled.div`
  display: flex;
  flex-direction: column;
  border: solid white 1px;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  width: fit-content;
  padding: 3rem;
  margin: auto;
`;

const Button = styled.button`
  color: var(--color-dark);
  background-color: var(--color-light);
  padding: 6px;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;

  transition: transform ease-in-out 100ms;

  &:hover {
    transform: scale(104%);
  }
  &:active {
    transform: scale(100%);
  }
`;

const LinkToPath = styled(Link)`
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--color-secondary);
`;

const Refresh = styled(Button)``;
const CreateNew = styled(Link)`
  color: var(--color-dark);
  background-color: var(--color-light);
  padding: 10px;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
  text-decoration: none;

  transition: transform ease-in-out 100ms;

  &:hover {
    transform: scale(104%);
  }
  &:active {
    transform: scale(100%);
  }
`;

const List = styled.ul`
  list-style: circle;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Item = styled.li`
  list-style: circle;
`;
