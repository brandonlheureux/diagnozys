import { BrowserRouter } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";

function App() {
  const { getAccessTokenSilently } = useAuth0();
  const [diagnosisDocument, setDiagnosisDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [medicalReport, setMedicalReport] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [weight, setWeight] = useState(null);
  const [height, setHeight] = useState(null);
  const [race, setRace] = useState("");
  const [sex, setSex] = useState("");

  const handleAuthFetch = async () => {
    const accessToken = await getAccessTokenSilently();
    fetch("http://localhost:5000/api/v1/authRequired", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((res) => console.log(res));
  };

  // uploading images for diagnosis
  const handleImageUpload = async (e) => {
    // dont reload
    e.preventDefault();
    setLoading(true);

    if (!diagnosisDocument?._id) {
      console.log("no diagnosis id");
      return setLoading(false);
    }

    // grab file from form
    const file = e.target.image.files[0];
    if (!file) {
      console.log("no diagnosis image");
      return setLoading(false);
    }

    // run upload

    try {
      // get access token for authorization
      const accessToken = await getAccessTokenSilently();

      // get pre signed upload url to aws s3
      const response = await fetch(
        `http://localhost:5000/api/v1/patient/diagnosis/upload/skin-lesion-upload-url/${diagnosisDocument._id}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = await response.json();
      const { url, method, "content-type": contentType } = data;

      if (url && method && contentType) {
        // upload file (image) to pre signed url
        const response = await fetch(url, {
          method,
          headers: {
            "content-type": contentType,
          },
          body: file,
        });

        // check if upload successfull
        if (response.status !== 200) {
          throw new Error("failed to upload file");
        } else {
          console.log("upload success");
          e.target.reset();
        }
      } else {
        console.log(data);
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const startSkinLesionDiagnosis = async () => {
    setLoading(true);
    // get access token for authorization

    try {
      const accessToken = await getAccessTokenSilently();
      // start new diagnosis
      const response = await fetch(
        `http://localhost:5000/api/v1/patient/diagnosis/skin-lesions/newDiagnosis`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = await response.json();
      if (response.status !== 200) {
        throw new Error("Failed to start new diagnosis");
      } else if (!data?.diagnosisDocument) {
        throw new Error("no diagnosis document found");
      } else {
        setDiagnosisDocument(data.diagnosisDocument);
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const getDiagnosisResult = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      // start new diagnosis
      const response = await fetch(
        `http://localhost:5000/api/v1/patient/diagnosis/skin-lesions/diagnosisResult/${diagnosisDocument._id}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = await response.json();
      if (response.status !== 200) {
        throw new Error("Failed to get diagnosis");
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserProfile = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      // start new diagnosis
      const response = await fetch(
        `http://localhost:5000/api/v1/patient/profile`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = await response.json();
      if (response.status !== 200) {
        throw new Error("Failed to get profile");
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserDiagnosisResults = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      // start new diagnosis
      const response = await fetch(
        `http://localhost:5000/api/v1/patient/diagnosis/skin-lesions/allDiagnosisResults?limit=12&skip=1`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = await response.json();
      if (response.status !== 200) {
        throw new Error("Failed to get diagnosis results");
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDiagnosisTypes = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      // start new diagnosis
      const response = await fetch(
        `http://localhost:5000/api/v1/patient/diagnosis/types`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = await response.json();
      if (response.status !== 200) {
        throw new Error("Failed to get diagnosis types");
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createMedicalReport = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      // start new diagnosis
      const response = await fetch(
        `http://localhost:5000/api/v1/patient/medicalReports/generateReport/${"skin-lesions"}/${
          diagnosisDocument._id
        }`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = await response.json();
      if (response.status !== 200) {
        throw new Error("Failed to create medical report");
      } else {
        setMedicalReport(data.medicalReport);
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMedicalReport = async () => {
    try {
      if (!medicalReport || !medicalReport._id) {
        throw new Error("no report selected");
      }
      const accessToken = await getAccessTokenSilently();
      // start new diagnosis
      const response = await fetch(
        `http://localhost:5000/api/v1/patient/medicalReports/${medicalReport._id}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = await response.json();
      if (response.status !== 200) {
        throw new Error("Failed to get medical report");
      } else {
        console.log(data.medicalReport);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCompleteProfile = async (e) => {
    e.preventDefault();
    try {
      const accessToken = await getAccessTokenSilently();
      // complete profile
      const response = await fetch(
        `http://localhost:5000/api/v1/patient/completeProfile`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "content-type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            firstName,
            lastName,
            dateOfBirth,
            weight,
            height,
            race,
            sex,
          }),
        }
      );
      const data = await response.json();
      if (response.status !== 201) {
        throw new Error("Failed to complete profile");
      } else {
        console.log(data);
        e.target.reset();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <BrowserRouter>
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          <p>Patient dashboard</p>
          <a href={process.env.REACT_APP_MAIN_DOMAIN}>go to main landing </a>
          <LoginButton />
          <LogoutButton />
          <button onClick={handleAuthFetch}>auth request</button>
          <form onSubmit={handleImageUpload} disabled={loading}>
            <input type="file" name="image" />
            <input type="submit" />
          </form>
          <button onClick={startSkinLesionDiagnosis} disabled={loading}>
            start new skin lesion diagnosis
          </button>
          <button onClick={getDiagnosisResult}>get diagnosis result</button>
          <button onClick={getUserProfile}>get user profile</button>
          <button onClick={getUserDiagnosisResults}>
            get user diagnosis results
          </button>
          <button onClick={getDiagnosisTypes}>get diagnosis types</button>
          <button onClick={createMedicalReport}>generate medical report</button>
          <button onClick={getMedicalReport}>get medical report</button>
          <form onSubmit={handleCompleteProfile}>
            <input
              onChange={(e) => setFirstName(e.target.value)}
              type="text"
              name="firstName"
              id=""
            />
            <input
              onChange={(e) => setLastName(e.target.value)}
              type="text"
              name="lastName"
              id=""
            />
            <input
              onChange={(e) => setDateOfBirth(e.target.value)}
              type="date"
              name="dateOfBirth"
              id=""
            />
            <input
              onChange={(e) => setWeight(e.target.value)}
              type="number"
              name="weight"
              id=""
            />
            <input
              onChange={(e) => setHeight(e.target.value)}
              type="number"
              name="height"
              id=""
            />
            <input
              onChange={(e) => setRace(e.target.value)}
              type="text"
              name="race"
              id=""
            />
            <input
              onChange={(e) => setSex(e.target.value)}
              type="text"
              name="sex"
              id=""
            />
            <input type="submit" value="submit" />
          </form>
        </header>
      </BrowserRouter>
    </div>
  );
}

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      onClick={() =>
        loginWithRedirect({
          role: "patient",
        })
      }
    >
      Log In
    </button>
  );
};

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button onClick={() => logout({ returnTo: window.location.origin })}>
      Log Out
    </button>
  );
};

export default App;
