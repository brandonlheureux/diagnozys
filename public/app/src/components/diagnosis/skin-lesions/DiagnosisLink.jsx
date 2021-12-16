import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const DiagnosisLink = ({ diagnosis }) => {
  if (!diagnosis) {
    return <Error>Error: No diagnosis details</Error>;
  }

  const { createdAt, _id: id, completed, uploaded } = diagnosis;

  return (
    <DiagnosisSummaryCard
      to={`/dashboard/diagnosis/skin-lesions/${diagnosis._id}`}
    >
      <Field>
        <Key>Type: </Key>
        <Value>Skin Lesion Disease Detection</Value>
      </Field>
      <Field>
        <Key>Diagnosis ID</Key>
        <Value>{id}</Value>
      </Field>
      <Field>
        <Key>requested on: </Key>
        <Value>{new Date(createdAt).toString()}</Value>
      </Field>
      <Field>
        <Tag>
          {completed
            ? "Result available"
            : uploaded
            ? "Currently processing"
            : "Awaiting image upload"}
        </Tag>
      </Field>
    </DiagnosisSummaryCard>
  );
};

export default DiagnosisLink;

const Error = styled.h1`
  color: red;
  font-size: 1.5rem;
  text-align: center;
`;

const DiagnosisSummaryCard = styled(Link)`
  max-width: 300px;
  max-height: fit-content;
  border-radius: 16px;
  border: 2px solid var(--color-secondary);
  color: var(--color-dark);
  padding: 16px;
  background-color: var(--color-light);
  font-size: 1.2rem;
  display: flex;
  flex-flow: column;
  gap: 1.5rem;

  text-decoration: none;
`;
const Field = styled.div`
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

const Tag = styled.span`
  background-color: var(--color-accent);
  color: var(--color--light);
  font-weight: bold;
  padding: 4px;
  margin: 4px auto;
  border-radius: 7px;
`;
