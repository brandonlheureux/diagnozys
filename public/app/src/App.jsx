import { useAuth0 } from "@auth0/auth0-react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import styled from "styled-components";
// contexts
import { UserContextProvider } from "./contexts/UserContext";
import { DiagnosisContextProvider } from "./contexts/DiagnosisContext";
// routing
import ProtectedRoute from "./components/auth/ProtectedRoute";
import CircularModal from "./components/loading/CircularModal";
import GlobalStyles from "./GlobalStyles";
// pages
import { CompleteProfile, Dashboard, NotFound } from "./pages/";
import { MedicalReportContextProvider } from "./contexts/MedicalReportContext";

function App() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  // loads authentication state
  if (isLoading) {
    return (
      <AppWrapper>
        <GlobalStyles />
        <CircularModal />
      </AppWrapper>
    );
  }

  // if not auth after load, redirect to login / sign up
  if (!isAuthenticated) {
    return loginWithRedirect({ role: "patient" });
  }

  // otherwise, grant app access
  // UserContextProvider will check for complete profile
  return (
    <AppWrapper>
      <GlobalStyles />
      <BrowserRouter>
        <UserContextProvider>
          <DiagnosisContextProvider>
            <MedicalReportContextProvider>
              <Routes>
                <Route
                  path="/dashboard/*"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/completeProfile" element={<CompleteProfile />} />

                <Route exact path="/" element={<Navigate to="/dashboard" />} />
                <Route
                  path="/:url"
                  element={
                    <ProtectedRoute>
                      <NotFound />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </MedicalReportContextProvider>
          </DiagnosisContextProvider>
        </UserContextProvider>
      </BrowserRouter>
    </AppWrapper>
  );
}

export default App;

const AppWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-width: 100%;
  min-height: 100%;
`;
