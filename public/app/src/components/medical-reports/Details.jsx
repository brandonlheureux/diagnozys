import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PDFViewer } from "@react-pdf/renderer";
import { Page, Text, View, Document, Image } from "@react-pdf/renderer";
import styled from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";
import CenterCirculareProgress from "../loading/CenterCirculareProgress";
import { UserContext } from "../../contexts/UserContext";

const Diseases = {
  akiec:
    "Actinic keratoses and intraepithelial carcinoma / Bowen's disease (akiec)",
  bcc: "basal cell carcinoma (bcc)",
  bkl: "benign keratosis-like lesions (solar lentigines / seborrheic keratoses and lichen-planus like keratoses, bkl)",
  df: "dermatofibroma (df)",
  mel: "melanoma (mel)",
  nv: "melanocytic nevi (nv)",
  vasc: "vascular lesions (angiomas, angiokeratomas, pyogenic granulomas and hemorrhage, vasc)",
};

const Details = () => {
  const { reportId } = useParams();
  const { profile } = useContext(UserContext);
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [medicalReport, setMedicalReport] = useState(null);
  const [secureUrl, setSecureUrl] = useState(null);

  const getMedicalReport = async () => {
    setLoading(true);
    try {
      const accessToken = await getAccessTokenSilently();
      // start new diagnosis
      const response = await fetch(
        `${
          process.env.REACT_APP_MAIN_DOMAIN || "http://localhost:5000"
        }/api/v1/patient/medicalReports/${reportId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = await response.json();
      if (response.status !== 200) {
        throw new Error("Failed to get medical report");
      } else {
        setMedicalReport(data.medicalReport);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getSecureUrl = async () => {
    setLoading(true);
    try {
      // get access token for authorization
      const accessToken = await getAccessTokenSilently();
      // get pre signed upload url to aws s3
      const response = await fetch(
        `${process.env.REACT_APP_API_DOMAIN}/api/v1/patient/diagnosis/download/skin-lesion-image-url/${medicalReport.diagnosisId}`,
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
    if (medicalReport?.diagnosisResult?.resourceInfo?.imagePath) {
      getSecureUrl();
    }
    // eslint-disable-next-line
  }, [medicalReport]);

  useEffect(() => {
    getMedicalReport();
    // eslint-disable-next-line
  }, [reportId]);

  if (loading) {
    return <CenterCirculareProgress />;
  }

  if (
    !medicalReport ||
    (medicalReport && medicalReport.userProfile._id !== profile._id)
  ) {
    return (
      <DetailsErrorWrapper>
        <Title>No report found with provided id</Title>
      </DetailsErrorWrapper>
    );
  }

  const {
    _id: id,
    userId,
    diagnosisId,
    diagnosisType,
    createdAt,
    diagnosisResult: {
      createdAt: diagnosisRequestMade,
      completedAt: diagnosisRequestProcessed,
      diseaseId,
      confidence,
    },
    userProfile: {
      email,
      role,
      dateOfBirth,
      firstName,
      lastName,
      height,
      weight,
      race,
      sex,
    },
  } = medicalReport;

  return (
    <PDF showToolbar>
      <Document>
        <Page size="A4">
          <View style={{ fontSize: "26pt", padding: "10pt" }}>
            <Text>Diagnozys</Text>
          </View>
          <View style={{ padding: "10pt" }}>
            <Text>MEDICAL REPORT</Text>
          </View>
          <View
            style={{
              display: "flex",
              flexFlow: "column",
              alignItems: "center",
            }}
          >
            <Section>
              <Field>
                <Key>Report ID</Key>
                <Value>{id}</Value>
              </Field>
              <Field>
                <Key>Generated on</Key>
                <Value>{new Date(createdAt).toString()}</Value>
              </Field>
              <Field>
                <Key>User ID</Key>
                <Value>{userId}</Value>
              </Field>
              <Field>
                <Key>Diagnosis ID</Key>
                <Value>{diagnosisId}</Value>
              </Field>
              <Field>
                <Key>Diagnosis type</Key>
                <Value>{diagnosisType}</Value>
              </Field>
              <Field>
                <Key>Requested by</Key>
                <Value>{role}</Value>
              </Field>
            </Section>
            <Section>
              <Text>Profile</Text>
              <Field>
                <Key>Name</Key>
                <Value>{firstName + " " + lastName}</Value>
              </Field>
              <Field>
                <Key>Date of birth</Key>
                <Value>{dateOfBirth}</Value>
              </Field>
              <Field>
                <Key>Sex</Key>
                <Value>{sex}</Value>
              </Field>
              <Field>
                <Key>race</Key>
                <Value>{race}</Value>
              </Field>
              <Field>
                <Key>Weight (kg)</Key>
                <Value>{weight}</Value>
              </Field>
              <Field>
                <Key>Height (cm)</Key>
                <Value>{height}</Value>
              </Field>
              <Field>
                <Key>email</Key>
                <Value>{email}</Value>
              </Field>
            </Section>
          </View>
        </Page>
        <Page>
          <Section>
            <View style={{ padding: "10pt" }}>
              <Text>Diagnosis Results</Text>
            </View>
            <Field>
              <Key>Disease</Key>
              <Value>{Diseases[diseaseId]}</Value>
            </Field>
            <Field>
              <Key>Confidence</Key>
              <Value>{confidence.toFixed(2)}</Value>
            </Field>
            <Field>
              <Key>Date requested</Key>
              <Value>{new Date(diagnosisRequestMade).toString()}</Value>
            </Field>
            <Field>
              <Key>Date processed</Key>
              <Value>{new Date(diagnosisRequestProcessed).toString()}</Value>
            </Field>
          </Section>
        </Page>
        <Page>
          <View style={{ padding: "10pt" }}>
            <Text>Source image</Text>
          </View>
          <Section>
            <Image src={secureUrl} />
          </Section>
        </Page>
      </Document>
    </PDF>
  );
};

export default Details;

const PDF = styled(PDFViewer)`
  width: 100%;
  height: 100%;
`;

// did not work with styled components for some reason
const Section = ({ children }) => (
  <View style={{ border: "solid 3pt gray", width: "100%", padding: "30pt" }}>
    {children}
  </View>
);
const Field = ({ children }) => (
  <View
    style={{
      padding: "6pt",
      width: "100%",
      display: "flex",
      flexFlow: "row wrap",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      flexWrap: "nowrap",
    }}
  >
    {children}
  </View>
);
const Key = ({ children }) => (
  <Text
    style={{
      backgroundColor: "lightblue",
      borderBottom: "2pt solid black",
      fontSize: "12pt",
    }}
  >
    {children}
  </Text>
);
const Value = ({ children }) => (
  <Text style={{ fontSize: "12pt" }}>{children}</Text>
);

const DetailsErrorWrapper = styled.div`
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 1.6rem;
`;
