import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useRef } from "react";
import styled from "styled-components";
import CenterCircularProgress from "../../loading/CenterCirculareProgress";

import Resizer from "react-image-file-resizer";

import Webcam from "react-webcam";
import { Dialog, DialogActions } from "@material-ui/core";

// utility to resize
const resizeFile = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      600,
      450,
      "JPEG",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "file",
      600,
      450
    );
  });

const UploadImage = ({ diagnosisId, refresh }) => {
  const [loading, setLoading] = useState(null);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");
  const [openCamera, setOpenCamera] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const webcamRef = useRef(null);
  const imageInputRef = useRef(null);
  const imagePreviewRef = useRef(null);

  const [imgSrc, setImgSrc] = React.useState(null);

  // for resize and sending to server
  const [imgData, setImgData] = useState(null);

  // because our image resize function ONLY accepts files...
  function srcToFile(src, fileName, mimeType) {
    return fetch(src)
      .then(function (res) {
        return res.arrayBuffer();
      })
      .then(function (buf) {
        return new File([buf], fileName, { type: mimeType });
      });
  }

  // webcam
  const capture = React.useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();

    const file = await srcToFile(imageSrc, "someName", "image/jpeg");
    setImgData(file);
    // const test = await resizeFile(blob)
    setImgSrc(imageSrc);

    imageInputRef.current.value = "";
  }, [webcamRef, setImgSrc]);

  //  Local files
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("run");
    const file = e.target.files[0];
    if (!file) return setError("No file selected");
    const url = URL.createObjectURL(file);
    // const image = await resizeFile(e.target.value)
    setImgSrc(url);
    setImgData(file);
    setError("");
    setStatus(null);
  };

  //  U P L O A D
  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!diagnosisId) {
        throw new Error("no diagnosis id provided for upload");
      }

      if (!imgData) {
        throw new Error("no image file provided for upload");
      }

      const resized = await resizeFile(imgData);
      // run upload
      // get access token for authorization
      const accessToken = await getAccessTokenSilently();
      // get pre signed upload url to aws s3
      const response = await fetch(
        `${process.env.REACT_APP_API_DOMAIN}/api/v1/patient/diagnosis/upload/skin-lesion-upload-url/${diagnosisId}`,
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
          body: resized,
        });

        // check if upload successfull
        if (response.status !== 200) {
          throw new Error("failed to upload file");
        } else {
          setStatus("success");
          refresh();
          e.target.reset();
        }
      } else {
        if (data?.error) {
          throw new Error(data?.error?.toString());
        }
        throw new Error("failed to  upload, right format?  ");
      }
    } catch (e) {
      setStatus("failed");
      setError(e);
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  if (status === "success") {
    // relaod
  }

  if (loading) {
    return <CenterCircularProgress />;
  }

  return (
    <UploadWrapper>
      <Title>Upload Image</Title>
      {status === "success" ? (
        <Success>Uploaded succesfully</Success>
      ) : (
        <Row>
          <Dialog open={openCamera}>
            <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />

            <DialogActions>
              <Row>
                <TakeScreenshot onClick={capture}>
                  Take Screenshot
                </TakeScreenshot>
                <CloseCamera onClick={() => setOpenCamera(false)}>
                  Close
                </CloseCamera>
              </Row>
            </DialogActions>
          </Dialog>

          <InputImage
            type="file"
            name="image"
            onInput={handleSubmit}
            accept="image/*"
            capture="camera"
            ref={imageInputRef}
          />
          <StartCamera onClick={() => setOpenCamera(true)}>
            Take a picture
          </StartCamera>
          <Upload onClick={handleUpload}>upload</Upload>
          {/* <Refresh onClick={refresh}>Reload request status</Refresh> */}
        </Row>
      )}
      {status === "failed" && (
        <Failed>Failed to upload: {error.toString()}</Failed>
      )}
      <Image src={imgSrc} ref={imagePreviewRef}></Image>
    </UploadWrapper>
  );
};

export default UploadImage;

const UploadWrapper = styled.div`
  width: 100%;
  padding: 2rem 1rem;
  border: solid 1px var(--color-dark);
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  gap: 1rem;
`;

const Title = styled.h2`
  font-size: 1.3rem;
`;

const Row = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
  align-items: center;
  gap: 20px;
  width: 100%;
`;

const InputImage = styled.input`
  color: var(--color-accent);
  background-color: var(--color-dark);
  padding: 6px;
  border-radius: 5px;
  font-size: 1.1rem;
`;

const Button = styled.button`
  color: var(--color-accent);
  background-color: var(--color-dark);
  padding: 6px;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;

  transition: transform ease-in-out 100ms;

  &:hover {
    transform: scale(104%);
  }
  &:active {
    transform: scale(100%);
  }
`;

const Success = styled.p``;
const Failed = styled.p``;
const StartCamera = styled(Button)``;
const CloseCamera = styled(Button)``;
const TakeScreenshot = styled(Button)``;
const Upload = styled(Button)``;
const Image = styled.img`
  width: 100%;
  height: auto;
`;
