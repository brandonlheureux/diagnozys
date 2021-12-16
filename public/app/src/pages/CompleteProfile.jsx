import { useAuth0 } from "@auth0/auth0-react";
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import styled from "styled-components";
import { useUserContext } from "../contexts/UserContext";
import CircularModal from "../components/loading/CircularModal";
import LogoutButton from "../components/auth/LogoutButton";

const CompleteProfile = () => {
  const { getAccessTokenSilently } = useAuth0();
  const { fetchProfile, profile } = useUserContext();
  const [input, setInput] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    weight: null,
    height: null,
    geneticAncestry: "",
    sex: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleCompleteProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const accessToken = await getAccessTokenSilently();
      const result = await fetch(
        `${process.env.REACT_APP_MAIN_DOMAIN}/api/v1/patient/completeProfile`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "content-type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(input),
        }
      );
      const data = await result.json();
      if (result.status !== 201) {
        throw new Error(data?.error.toString());
      } else {
        fetchProfile();
      }
    } catch (error) {
      console.log(error);
    } finally {
      fetchProfile();
    }
    setIsLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((input) => ({ ...input, [name]: value }));
  };

  if (profile) {
    return <Navigate to="/" />;
  }

  return (
    <CompleteProfileWrapper>
      {isLoading && <CircularModal />}
      <Welcome>Welcome to diagnozys!</Welcome>
      <Instructions>
        Please complete your registration in order to use our services
      </Instructions>
      <Form onSubmit={handleCompleteProfile}>
        <FormElement>
          <Label htmlFor="firstName">First Name: </Label>
          <Input
            required
            onChange={handleChange}
            type="text"
            name="firstName"
            id="firstName"
            placeholder="John"
          />
        </FormElement>

        <FormElement>
          <Label htmlFor="lastName">Last Name: </Label>
          <Input
            required
            onChange={handleChange}
            type="text"
            name="lastName"
            id="lastName"
            placeholder="Not Doe"
          />
        </FormElement>

        <FormElement>
          <Label htmlFor="dateOfBirth">Date Of Birth: </Label>
          <Input
            required
            onChange={handleChange}
            type="date"
            name="dateOfBirth"
            id="dateOfBirth"
            max={Date.now()}
          />
        </FormElement>

        <FormElement>
          <Label htmlFor="weight">Weight (Kg): </Label>
          <Input
            required
            onChange={handleChange}
            type="number"
            name="weight"
            id="weight"
            placeholder="65"
            min={0}
            max={300}
          />
        </FormElement>

        <FormElement>
          <Label htmlFor="height">Height (cm): </Label>
          <Input
            required
            onChange={handleChange}
            type="number"
            name="height"
            id="height"
            placeholder="170"
            min={0}
            max={300}
          />
        </FormElement>
        <FormElement>
          <Label htmlFor="geneticAncestry">
            genetic ancestry (answer however you like):{" "}
          </Label>
          <Input
            required
            onChange={handleChange}
            type="text"
            name="geneticAncestry"
            id="geneticAncestry"
            placeholder="anything"
          />
        </FormElement>
        <FormElement>
          <Label htmlFor="sex">Sex:</Label>
          <Select
            onChange={handleChange}
            name="sex"
            id="sex"
            required
            defaultValue={""}
          >
            <option value="" disabled hidden>
              Choose Here
            </option>
            <option value="genetically ambiguous">genetically ambiguous</option>
            <option value="male">male</option>
            <option value="female">female</option>
          </Select>
        </FormElement>
        <Row>
          <ButtonSize>
            <Submit type="submit" disabled={isLoading} />
          </ButtonSize>
          <ButtonSize>
            <LogoutButton />
          </ButtonSize>
        </Row>
      </Form>
    </CompleteProfileWrapper>
  );
};

export default CompleteProfile;

const CompleteProfileWrapper = styled.div`
  height: 100%;
  width: 100%;
  max-width: var(--page-max-width);
  margin: auto;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  /* overflow-x: hidden; */
`;

const Welcome = styled.h1`
  text-align: center;
  font-size: 3rem;
  padding: 1rem;
  color: var(--color-light);
`;

const Instructions = styled.h2`
  text-align: center;
  font-size: larger;
  padding: 1rem;
  color: var(--color-accent);
`;

const Form = styled.form`
  display: flex;
  flex-flow: column;
  gap: 16 px;
  margin: auto;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  background-color: var(--color-light);
  border-radius: 6px;
`;

const FormElement = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 10px;
  padding: 6px;
`;

const Label = styled.label`
  color: var(--color-dark);
`;

const Input = styled.input`
  padding: 5px 7px;
  border-radius: 4px;
  outline-color: var(--color-primary);
  transition: transform ease-in-out 100ms;

  &:focus {
    transform: scale(102%);
  }
`;

const Select = styled.select`
  padding: 7px;
`;

const Submit = styled.input`
  padding: 8px;
  background-color: var(--color-dark);
  color: var(--color-light);
  font-size: large;
  font-weight: bold;
  cursor: pointer;
  border: none;
  outline-color: var(--color-primary);
  border-radius: 3px;
  width: 100%;
  height: 100%;
  transition: transform ease-in-out 100ms;
  &:hover {
    transform: scale(104%);
  }
  &:active {
    transform: scale(98%);
  }
`;

const ButtonSize = styled.div`
  padding: 0;
  margin: 0;
  width: auto;
  height: auto;
`;

const Row = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  gap: 2rem;
`;
