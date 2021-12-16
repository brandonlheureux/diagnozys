import React from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";

const NotFound = (props) => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  console.log(props);

  return (
    <NotFoundWrapper>
      <Error404>ERROR 404 - NOT FOUND</Error404>
      <Description>{`"${window.location.pathname}" does not exist`}</Description>
      <NavOptions>
        <Back onClick={handleBack}>Back to previous page</Back>
        <Dashboard to="/dashboard">Back to dashboard</Dashboard>
      </NavOptions>
    </NotFoundWrapper>
  );
};

export default NotFound;

const NotFoundWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4rem;
  padding: 3rem
`;

const Error404 = styled.h1`
  font-size: 3rem;
  color: var(--color-accent);
`;

const Description = styled.h2`
  font-size: 2rem;
  overflow-wrap: anywhere;
  color: var(--color-light);
`;

const NavOptions = styled.div`
  display: flex;
  gap: 6rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const Back = styled.button`
  border: 2px solid var(--color-secondary);
  color: var(--color-light);
  background: none;
  padding: 7px 14px;
  font-size: large;
  cursor: pointer;
  font-weight: bold;
  border-radius: 3px;
  background-color: var(--color-dark);
  transition: transform ease-in-out 100ms;
  &:hover {
    color: var(--color-light);
    transform: scale(103%);
  }
`;

const Dashboard = styled(Link)`
  color: var(--color-dark);
  text-decoration: none;
  padding: 10px 14px;
  font-size: large;
  cursor: pointer;
  font-weight: bold;
  border-radius: 3px;
  background-color: var(--color-light);
  transition: transform ease-in-out 100ms;
  &:hover {
    transform: scale(103%);
  }
`;
