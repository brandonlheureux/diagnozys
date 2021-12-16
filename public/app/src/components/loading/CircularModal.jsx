import React from "react";
import { Modal, CircularProgress } from "@material-ui/core";
import styled from "styled-components";

const CircularModal = () => {
  return (
    <Modal open={true}>
      <Center>
        <CircularProgress size={150} />
      </Center>
    </Modal>
  );
};

export default CircularModal;

const Center = styled.div`
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;
