import React, { useContext } from "react";
import styled from "styled-components";
import { UserContext } from "../../../contexts/UserContext";
import UploadImage from "./UploadImage";
import { Link } from "react-router-dom";

const Diseases = {
  akiec:
    "Actinic keratoses and intraepithelial carcinoma / Bowen's disease (akiec)",
  bcc: "basal cell carcinoma (bcc)",
  bkl: "benign keratosis-like lesions (solar lentigines / seborrheic keratoses and lichen-planus like keratoses, bkl)",
  df: "dermatofibroma (df)",
  mel: "melanoma (mel)",
  nv: "melanocytic nevi (nv)",
  vasc: "vascular lesions (angiomas, angiokeratomas, pyogenic granulomas and hemorrhage, vasc)",
};

const DiagnosisSummary = ({ diagnosisDetails, refresh }) => {
  const { profile } = useContext(UserContext);
  if (!diagnosisDetails) {
    return <Error>Error: No diagnosis details</Error>;
  }

  const { _id: id, completed, uploaded, createdAt } = diagnosisDetails;

  return (
    <DiagnosisSummaryCard>
      <Field>
        <Key>Diagnosis ID</Key>
        <Value>{id}</Value>
      </Field>
      <Field>
        <Key>Type: </Key>
        <Value>Skin Lesion Disease Detection</Value>
      </Field>
      <Field>
        <Key>requested by: </Key>
        <Value>{`${profile.firstName} ${profile.lastName}`}</Value>
      </Field>
      <Field>
        <Key>uploaded? </Key>
        <Value>
          {uploaded ? "yes" : "no, please upload an image to process"}
        </Value>
      </Field>
      <Field>
        <Key>completed? </Key>
        <Value>{completed ? "yes" : "no"}</Value>
      </Field>
      <Field>
        <Key>requested on: </Key>
        <Value>{new Date(createdAt).toString()}</Value>
      </Field>
      {/* uploaded image but non complete diagnosis requires modification in the aws architecture to add the resource fields in mongo */}
      {/* it was impossible to do unless refactoring a bunch of stuff */}
      {/* {diagnosisDetails.uploaded && <img>image</img>}  */}
      {diagnosisDetails.completed ? (
        <>
          <Field>
            <Key>Completed at:</Key>
            <Value>{new Date(diagnosisDetails.completedAt).toString()}</Value>
          </Field>
          <Field>
            <Key>Disease detection target</Key>
            <Value>{Diseases[diagnosisDetails.diseaseId]}</Value>
          </Field>
          <Field>
            <Key>Confidence / certainty </Key>
            <Value>{diagnosisDetails.confidence.toFixed(2)}%</Value>
          </Field>
          <Field>
            <Key>Image</Key>
            <Value>
              <LinkToPath
                to={`/dashboard/diagnosis/skin-lesions/view-image/${id}`}
              >
                Click here access securely
              </LinkToPath>
            </Value>
          </Field>
          <Field>
            <Key>Image</Key>
            <Value>
              <LinkToPath to={`/dashboard/medical-reports/new/${id}`}>
                Click here to generate a medical report
              </LinkToPath>
            </Value>
          </Field>
        </>
      ) : diagnosisDetails.uploaded ? (
        <>
          <Field>
            <Key>Results:</Key>
            <Value>
              ...awaiting results. Typically takes up to 4 days to process
            </Value>
          </Field>
          <Refresh onClick={() => refresh()}>refresh</Refresh>
        </>
      ) : (
        <>
          <UploadImage diagnosisId={id} refresh={refresh} />
          <Refresh onClick={() => refresh()}>refresh</Refresh>
        </>
      )}
    </DiagnosisSummaryCard>
  );
};

export default DiagnosisSummary;

const Error = styled.h1`
  color: red;
  font-size: 1.5rem;
  text-align: center;
`;
const LinkToPath = styled(Link)`
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--color-secondary);
`;

const DiagnosisSummaryCard = styled.div`
  margin: auto;
  width: 100%;
  max-width: 950px;

  border-radius: 16px;
  border: 2px solid var(--color-secondary);
  color: var(--color-dark);
  padding: 16px;
  background-color: var(--color-light);
  font-size: 1.2rem;
  display: flex;
  flex-flow: column;
  gap: 1.5rem;
`;

const Field = styled.div`
  /* border: 3px solid var(--color-dark); */
  display: flex;
  flex-flow: row wrap;
`;

const Key = styled.span`
  padding: 6px;
  background-color: var(--color-primary);
  color: var(--color--light);
  width: 150px;
  font-weight: bold;
  border-bottom: 1px solid var(--color-secondary);
`;

const Value = styled.span`
  padding: 8px 0;
  padding-left: 10px;
  border-bottom: 1px solid var(--color-secondary);
  border-left: 1px solid var(--color-secondary);
  flex-grow: 1;
  overflow-wrap: anywhere;
`;

const Refresh = styled.button`
  width: fit-content;
  padding: 6px;
  background-color: var(--color-dark);
  color: var(--color-light);
  border: none;
  border-radius: 4px;
  font-size: 1.2rem;
  margin: auto;
  cursor: pointer;
  transition: transform ease-in-out 100ms;
  &:active {
    transform: scale(98%);
  }
  &:hover {
    transform: scale(103%);
  }
`;
