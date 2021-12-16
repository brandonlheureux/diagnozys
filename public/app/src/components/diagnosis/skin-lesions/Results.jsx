import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CenterCirculareProgress from "../../loading/CenterCirculareProgress";
import DiagnosisLink from "./DiagnosisLink";

const Results = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  const getUserDiagnosisResults = async () => {
    if (!results[page]) {
      setLoading(true);
    }
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(
        `${
          process.env.REACT_APP_API_DOMAIN
        }/api/v1/patient/diagnosis/skin-lesions/allDiagnosisResults?limit=10&skip=${
          page * 10
        }`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = await response.json();
      if (response.status !== 200) {
        throw new Error("Failed to get diagnosis results");
      } else {
        setResults((results) => ({
          ...results,
          [page]: data.diagnosisResults,
        }));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserDiagnosisResults();
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
                !loading && (results[page].length === 10 ? page + 1 : page)
            )
          }
        >
          Next
        </Button>
      </PageControls>

      <ResultListContainer>
        {loading && !results[page]?.length && <CenterCirculareProgress />}
        <ResultList>
          {results[page]?.map((diagnosis) => {
            return <DiagnosisLink diagnosis={diagnosis} key={diagnosis._id} />;
          })}
        </ResultList>
      </ResultListContainer>
    </OverviewWrapper>
  );
};

export default Results;

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
