import React, { useContext } from "react";
import styled from "styled-components";
import { UserContext } from "../../contexts/UserContext";

const Profile = () => {
  const { profile } = useContext(UserContext);

  if (!profile) {
    return <h1>no profile</h1>;
  }

  const { firstName, lastName, dateOfBirth, sex, race, weight, height, email } =
    profile;
  return (
    <ProfileWrapper>
      <Title>Profile</Title>
      <ProfileDetails>
        <Field>
          <Key>Name</Key>
          <Value>{firstName + " " + lastName}</Value>
        </Field>
        <Field>
          <Key>Date of birth</Key>
          <Value>{dateOfBirth}</Value>
        </Field>
        <Field>
          <Key>Sex</Key>
          <Value>{sex}</Value>
        </Field>
        <Field>
          <Key>race</Key>
          <Value>{race}</Value>
        </Field>
        <Field>
          <Key>Weight (kg)</Key>
          <Value>{weight}</Value>
        </Field>
        <Field>
          <Key>Height (cm)</Key>
          <Value>{height}</Value>
        </Field>
        <Field>
          <Key>email</Key>
          <Value>{email}</Value>
        </Field>
      </ProfileDetails>
    </ProfileWrapper>
  );
};

export default Profile;

const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  gap: 2rem;
`;

const ProfileDetails = styled.div`
  max-width: 500px;
`;

const Title = styled.h1`
  padding: 2rem;
  font-size: 1.5rem;
`;

const Field = styled.div`
  /* border: 3px solid var(--color-dark); */
  display: flex;
  flex-flow: row wrap;
`;

const Key = styled.span`
  padding: 6px;
  background-color: var(--color-dark);
  color: var(--color--dark);
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
