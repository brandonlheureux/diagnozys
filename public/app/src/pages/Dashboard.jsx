import React from "react";
import { Route, Routes, useLocation, Link } from "react-router-dom";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";

// dashboard components
import SideBar from "../components/dashboard/sidebar";

// dashboard panes
import Diagnosis from "../components/diagnosis";
import SkinLesions from "../components/diagnosis/skin-lesions";
import MedicalReports from "../components/medical-reports";
import Profile from "../components/profile";

// embed 404 page as a pane
import { NotFound } from ".";
import ViewImage from "../components/diagnosis/skin-lesions/ViewImage";

const Dashboard = () => {
  let location = useLocation();
  return (
    <DashboardWrapper>
      <SidebarWrapper>
        <SideBar />
      </SidebarWrapper>
      <Panes>
        <AnimatePresence exitBeforeEnter>
          {/* need location and key to let AnimatePresence know when route chnages */}
          <Routes location={location} key={location.pathname}>
            <Route
              exact
              path={`/`}
              element={
                <Animated>
                  <DashboardHome>
                    <Welcome>dashboard home</Welcome>
                    <QuickLinks>
                      <PaneLinkContainer to="/dashboard/diagnosis">
                        <PaneLinkText>Diagnosis</PaneLinkText>
                      </PaneLinkContainer>
                      <PaneLinkContainer to="/dashboard/medical-reports">
                        <PaneLinkText>Medical Reports</PaneLinkText>
                      </PaneLinkContainer>
                      <PaneLinkContainer to="/dashboard/profile">
                        <PaneLinkText>Profile</PaneLinkText>
                      </PaneLinkContainer>
                    </QuickLinks>
                  </DashboardHome>
                </Animated>
              }
            />
            <Route path="/diagnosis">
              <Route
                exact
                path=""
                element={
                  <Animated>
                    <Diagnosis />
                  </Animated>
                }
              />
              <Route path="skin-lesions">
                <Route path="view-image">
                  <Route
                    path=":diagnosisId"
                    element={
                      <Animated>
                        <ViewImage />
                      </Animated>
                    }
                  />
                </Route>
                <Route
                  exact
                  path=""
                  element={
                    <Animated>
                      <SkinLesions.Overview />
                    </Animated>
                  }
                />
                <Route
                  path="new"
                  element={
                    <Animated>
                      <SkinLesions.New />
                    </Animated>
                  }
                />
                <Route
                  path="current"
                  element={
                    <Animated>
                      <SkinLesions.Current />
                    </Animated>
                  }
                />
                <Route
                  path="reports"
                  element={
                    <Animated>
                      <SkinLesions.Results />
                    </Animated>
                  }
                />
                <Route
                  path=":diagnosisId"
                  element={
                    <Animated>
                      <SkinLesions.Details />
                    </Animated>
                  }
                />
              </Route>
            </Route>
            <Route path="/medical-reports">
              <Route
                exact
                path=""
                element={
                  <Animated>
                    <MedicalReports.Home />
                  </Animated>
                }
              />
              <Route path="view">
                <Route
                  path=":reportId"
                  element={
                    <Animated>
                      <MedicalReports.Details />
                    </Animated>
                  }
                />
              </Route>
              <Route path="new">
                <Route
                  path=":diagnosisId"
                  element={
                    <Animated>
                      <MedicalReports.New />
                    </Animated>
                  }
                />
                <Route
                  path=""
                  element={
                    <Animated>
                      <MedicalReports.New />
                    </Animated>
                  }
                />
              </Route>
              <Route
                exact
                path="latest"
                element={
                  <Animated>
                    <MedicalReports.Latest />
                  </Animated>
                }
              />
              <Route
                exact
                path="reports"
                element={
                  <Animated>
                    <MedicalReports.Reports />
                  </Animated>
                }
              />
            </Route>
            <Route
              path="/profile"
              element={
                <Animated>
                  <Profile />
                </Animated>
              }
            />
            <Route path={`/*`} element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Panes>
    </DashboardWrapper>
  );
};

export default Dashboard;

const DashboardWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-flow: row nowrap;
  /* position: relative; */
`;

const SidebarWrapper = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
  width: 300px;
`;

const Panes = styled.div`
  width: 100%;
  color: var(--color-light);
`;

// wrapper for animating page transition with "AnimatePresence"
const Animated = ({ children }) => (
  <motion.div
    // define animation here
    initial={{ opacity: 0, transform: "scale(95%)" }}
    animate={{ opacity: 1, transform: "scale(100%)" }}
    exit={{ opacity: 0, transform: "scale(95%)" }}
    transition={{ duration: 0.2 }}
    // make sure we take full height otherwise children will have a 100% of this element's minimum
    style={{ height: "100%", width: "100%" }}
  >
    {children}
  </motion.div>
);

const DashboardHome = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 4rem;
`;

const Welcome = styled.h1`
  font-size: 3rem;
  padding: 1rem;
`;

const QuickLinks = styled.div`
  display: flex;
  max-width: 900px;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  gap: 3rem;
`;

const PaneLinkContainer = styled(Link)`
  padding: 1rem;
  border: 2px solid var(--color-accent);
  max-width: 200px;
  text-decoration: none;
  transition: transform ease-in-out 100ms;

  &:hover {
    transform: scale(103%);
  }
  &:active {
    transform: scale(98%);
  }
`;

const PaneLinkText = styled.p`
  color: var(--color-light);
  font-size: 1.2rem;
  font-weight: bold;
`;
