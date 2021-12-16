import React, { useContext } from "react";
import styled from "styled-components";
import { UserContext } from "../../../contexts/UserContext";
import LogoutButton from "../../auth/LogoutButton";
import SideBarLink from "../SideBarLink";
import { SideBarData } from "./SideBarData";

const SideBar = () => {
  const { profile } = useContext(UserContext);
  return (
    <SideBarWrapper>
      <Title>Diagnozys</Title>
      <Nav>
        {SideBarData.map((item) => (
          <SideBarLink item={item} key={item.title} />
        ))}
      </Nav>
      <Auth>
        <User>{`${profile.firstName} ${profile.lastName}`}</User>
        <LogoutButton />
      </Auth>
    </SideBarWrapper>
  );
};

export default SideBar;

const SideBarWrapper = styled.div`
  /* width: 300px; */
  background-color: var(--color-light);
  color: var(--color-dark);
  display: flex;
  flex-flow: column nowrap;
  gap: 2rem;
  padding: 2rem;
  height: 100%;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: var(--color-secondary);
`;

const Auth = styled.div`
  margin: auto;
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
`;

const Nav = styled.div`
  height: auto;
  overflow-x: hidden;
  overflow-y: scroll; ;
`;

const User = styled.p`
  color: var(--color-accent);
  padding: 10px 10px;
  background-color: var(--color-dark);
  border-radius: 4px;
  box-shadow: 0 0 1px 1px var(--color-dark);
`;
