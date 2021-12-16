import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import CenterCirculareProgress from "../loading/CenterCirculareProgress";

const Reports = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [page, setPage] = useState(0);
  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState(true);

  const getMedicalReports = async () => {
    setLoading(true);
    try {
      const accessToken = await getAccessTokenSilently();
      // get reports
      const response = await fetch(
        `${
          process.env.REACT_APP_API_DOMAIN
        }/api/v1/patient/medicalReports?limit=${15}&skip=${10 * page}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = await response.json();
      if (response.status !== 200) {
        throw new Error("Failed to get medical report");
      } else {
        setReports((reports) => ({ ...reports, [page]: data.medicalReports }));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMedicalReports();
    // eslint-disable-next-line
  }, [page]);

  return (
    <OverviewWrapper>
      <h1>overview</h1>
      <PageControls>
        <Button onClick={() => !loading && setPage(0)}>Reset</Button>
        <Button
          onClick={() =>
            !loading && setPage((page) => (page > 0 ? page - 1 : page))
          }
        >
          Previous
        </Button>
        <Current>Current page: {page + 1}</Current>
        <Button
          onClick={() =>
            setPage(
              (page) =>
                !loading && (reports[page].length === 10 ? page + 1 : page)
            )
          }
        >
          Next
        </Button>
      </PageControls>

      <ResultListContainer>
        {loading && !reports[page]?.length && <CenterCirculareProgress />}
        <ResultList>
          {reports[page]?.map((report) => {
            return (
              <Card key={report._id}>
                <ReportLink
                  to={`/dashboard/medical-reports/view/${report._id}`}
                >
                  {report._id}
                </ReportLink>
                <ReportItemSection>
                  created: {new Date(report.createdAt).toString()}
                </ReportItemSection>
              </Card>
            );
          })}
        </ResultList>
      </ResultListContainer>
    </OverviewWrapper>
  );
};

export default Reports;

const OverviewWrapper = styled.div`
  padding: 2rem;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ResultList = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  padding: 2rem;
  gap: 2rem;
`;

const ResultListContainer = styled.div`
  height: auto;
  border: 1px solid white;

  flex-grow: 1;
  width: 100%;
`;

const PageControls = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  width: 100%;
`;

const Button = styled.button`
  background-color: var(--color-dark);
  border: 2px solid var(--color-accent);
  color: var(--color-accent);
  padding: 4px 6px;
  cursor: pointer;
  transition: transform ease-in-out 100ms;

  &:active {
    transform: scale(95%);
  }
`;

const Current = styled.h2`
  font-size: 1.5rem;
`;

const Card = styled.div`
  background-color: var(--color-light);
  color: var(--color-dark);
  max-width: 300px;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  padding: 6px;
`;

const ReportItemSection = styled.div`
  padding: 8px;
  overflow-wrap: anywhere;
`;

const ReportLink = styled(Link)`
  background-color: var(--color-light);
  color: var(--color-dark);
  font-weight: bold;
  text-decoration: none;
  cursor: pointer;
  padding: 8px;
  &:hover {
    color: var(--color-secondary);
  }
`;
