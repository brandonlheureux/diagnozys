import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import styled from "styled-components";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button
      onClick={() =>
        loginWithRedirect({
          role: "patient",
        })
      }
    >
      Log In
    </Button>
  );
};

export default LoginButton;

const Button = styled.button`
  font-size: large;
  border: none;
  color: var(--color-dark);
  background: transparent;
`;
