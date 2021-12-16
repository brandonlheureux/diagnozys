import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import styled from "styled-components";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <Button onClick={() => logout({ returnTo: window.location.origin })}>
      Log Out
    </Button>
  );
};

export default LogoutButton;

const Button = styled.button`
  font-size: large;
  border: none;
  border-radius: 4px;
  padding: 10px 12px;
  font-weight: bold;
  color: var(--color-light);
  margin: auto;
  height: 100%;
  width: 100%;
  background: var(--color-secondary);
  cursor: pointer;

  transition: transform ease-in-out 100ms;
  &:hover{
    transform: scale(104%);
  }
  &:active {
    transform: scale(98%);
  }
`;
