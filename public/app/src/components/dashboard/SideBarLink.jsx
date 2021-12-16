import React, { useEffect, useState } from "react";
import { NavLink, useMatch } from "react-router-dom";
import styled from "styled-components";
import { BsArrowDownShort } from "react-icons/bs";

const SideBarLink = ({ item }) => {
  const [subNavOpen, setSubNavOpen] = useState(false);
  const match = useMatch(item.path);
  useEffect(() => {
    if (match) {
      setSubNavOpen(true);
    }
  }, [match]);
  return (
    <SideBarLinkWrapper>
      <Label>
        {item?.icon && item.icon}
        <SideBarNavLink end to={item.path}>
          {item.title}
        </SideBarNavLink>
        {item?.subNav && (
          <DropDownArrow
            size={20}
            open={subNavOpen}
            onClick={() => setSubNavOpen((subNavOpen) => !subNavOpen)}
          />
        )}
      </Label>
      {item?.subNav && subNavOpen && (
        <DropDown>
          {item.subNav.map((subItem) => (
            <SideBarLink
              key={item.path + subItem.path}
              item={{ ...subItem, path: item.path + subItem.path }}
            />
          ))}
        </DropDown>
      )}
    </SideBarLinkWrapper>
  );
};

export default SideBarLink;

const SideBarLinkWrapper = styled.div`
  width: 100%;
`;

const Label = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: left;
  align-items: center;
  gap: 1rem;
`;

const DropDown = styled.div`
  margin-left: 20px;
  display: flex;
  flex-flow: column nowrap;
  gap: 12px;
  padding: 12px;
`;

const DropDownArrow = styled(BsArrowDownShort)`
  width: 40px;
  cursor: pointer;
  transition: all ease-out 200ms;
  ${(props) => (props.open ? "transform: rotate(-180deg)" : "")}
`;

const SideBarNavLink = styled(NavLink)`
  text-decoration: none;
  color: var(--color-dark);
  padding: 8px;
  &.active {
    color: var(--color-secondary);
    font-weight: bold;
  }

  &:hover {
    color: var(--color-accent);
  }
`;
