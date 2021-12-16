import { CircularProgress } from "@material-ui/core";
import React from "react";
import styled from "styled-components";

const CenterCirculareProgress = ({ size = 100, ...props }) => {
  return (
    <Center>
      <CircularProgress size={size} {...props} />
    </Center>
  );
};

export default CenterCirculareProgress;

const Center = styled.div`
  height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
