import React from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import styled from "styled-components";


const DiagnosisLink = ({ diagnosis, selected, clickHandler }) => {
  if (!diagnosis) {
    return <Error>Error: No diagnosis details</Error>;
  }

  const { _id: id } = diagnosis;

  return (
    <DiagnosisSummaryCard selection={selected} onClick={clickHandler}>
      {selected && <Checkmark size={150}/>}
      <Field>
        <Key>Type: </Key>
        <Value>Skin Lesion Disease Detection</Value>
      </Field>
      <Field>
        <Key>Diagnosis ID</Key>
        <Value>{id}</Value>
      </Field>
      <LinkToPath to={`/dashboard/diagnosis/skin-lesions/${id}`}>
        View diagnosis
      </LinkToPath>
    </DiagnosisSummaryCard>
  );
};

export default DiagnosisLink;

const LinkToPath = styled(Link)`
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--color-secondary);

  &:hover {
    color: var(--color-accent);
  }
`;

const Error = styled.h1`
  color: red;
  font-size: 1.5rem;
  text-align: center;
`;

const DiagnosisSummaryCard = styled.button`
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
  position: relative;

  cursor: pointer;
  opacity: ${(props) => (props.selection ? "0.7" : "1")};
  &:hover {
    box-shadow: 0 0 9px 3px var(--color-accent);
  }
`;

const Checkmark = styled(AiOutlineCheckCircle)`
  position: absolute;
  color: var(--color-accent);
  top: 50%;
  left: 50%;
  transform: translate(-75px, -75px);
`

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
