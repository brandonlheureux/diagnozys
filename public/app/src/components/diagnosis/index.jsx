import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const index = () => {
  return (
    <DiagnosisHomeWrapper>
      <Title>Welcome to our diagnosis service</Title>
      <Description>
        <Text>Currently available: </Text>
        <LinkToPath to="/dashboard/diagnosis/skin-lesions">
          Skin Lesion Diagnosis
        </LinkToPath>
      </Description>
    </DiagnosisHomeWrapper>
  );
};

export default index;

const LinkToPath = styled(Link)`
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--color-secondary);
`;

const DiagnosisHomeWrapper = styled.div`
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  text-align: center;
  padding: 20px;
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
