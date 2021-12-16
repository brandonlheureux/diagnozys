import React from "react";
import { useUserContext } from "../../contexts/UserContext";
import CircularModal from "../loading/CircularModal";

const ProtectedRoute = ({ children }) => {
  const { loadingProfile } = useUserContext();
  // set as loading until
  // a: profile is loaded
  // b: redirected to compeleteProfile page (users need to be fully registered)

  if (loadingProfile) {
    return <CircularModal />;
  }

  return children;
};

export default ProtectedRoute;
