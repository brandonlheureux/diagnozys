import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import styled from "styled-components";
import CenterCirculareProgress from "../../loading/CenterCirculareProgress";

const ViewImage = () => {
  const { getAccessTokenSilently } = useAuth0();
  const { diagnosisId } = useParams();
  const [secureUrl, setSecureUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  const getSecureUrl = async () => {
    setLoading(true);
    try {
      if (!diagnosisId) {
        throw new Error("no diagnosis id provided for upload");
      }

      // get access token for authorization
      const accessToken = await getAccessTokenSilently();
      // get pre signed upload url to aws s3
      const response = await fetch(
        `${process.env.REACT_APP_API_DOMAIN}/api/v1/patient/diagnosis/download/skin-lesion-image-url/${diagnosisId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const data = await response.json();

      const { url } = data;
      if (response.status !== 200) {
        throw new Error("Could not generate secure url");
      }
      if (url) {
        setSecureUrl(url);
      } else {
        if (data?.error) {
          throw new Error(data?.error?.toString());
        }
        throw new Error("failed to  upload, right format?  ");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSecureUrl();
    // eslint-disable-next-line
  }, [diagnosisId]);

  if (!diagnosisId) {
    return <Navigate to="dashboard/diagnosis/skin-lesions " />;
  }

  if (loading) {
    return <CenterCirculareProgress />;
  }

  return <Image src={secureUrl}></Image>;
};

export default ViewImage;

const Image = styled.img`
  width: 100%;
  height: 100%;
  background-color: var(--color-secondary);
  object-fit: contain;
`;
