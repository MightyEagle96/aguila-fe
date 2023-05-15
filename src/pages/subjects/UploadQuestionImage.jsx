import React, { useState, useContext } from "react";
import { AlertContext } from "../../contexts/AlertContext";
import { Modal } from "react-bootstrap";
import { LoadingButton } from "@mui/lab";
import { Button, IconButton, Typography } from "@mui/material";
import { UploadFile, AddAPhoto } from "@mui/icons-material";
import { httpService } from "../../httpService";
import { storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export default function UploadQuestionImage({ subject, questionId }) {
  const [show, setShow] = useState(false);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const { setAlertData } = useContext(AlertContext);

  const toggle = () => setShow(!show);

  const handleChange = (e) => {
    if (e.target.files[0].size > 1_000_000)
      return setAlertData({
        message: "Please select an image less than or equal to 1MB.",
        open: true,
        severity: "error",
      });
    setFile(e.target.files[0]);

    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const clearImage = () => {
    setFile(null);
    setImage(null);
  };

  const uploadImage = async (e) => {
    e.preventDefault();

    if (!file) return;
    setLoading(true);

    const storageRef = ref(storage, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        setProgress(prog);
      },
      (err) => {
        setAlertData({ open: true, message: err.message, severity: "error" });
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
          const fileExt = file.name.split(".").pop();

          const image = `${questionId}.${fileExt}`;

          const imageURL = url;

          const { data, error } = await httpService.post(
            "aguila/subject/questionbank/uploadimage",
            { image, imageURL, questionId, subject }
          );

          if (data) {
            setAlertData({ open: true, message: data, severity: "success" });
          }

          if (error) {
            setAlertData({
              open: true,
              message: error,
              severity: "error",
            });
          }
        });
      }
    );

    setLoading(false);
  };
  return (
    <>
      <IconButton onClick={toggle}>
        <AddAPhoto />
      </IconButton>

      <Modal centered size="xl" backdrop="static" show={show} onHide={toggle}>
        <Modal.Header closeButton>Insert Image</Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-lg-6">
              <div class="mb-3">
                <label for="formFile" class="form-label">
                  Select an image file
                </label>
                <input
                  class="form-control"
                  type="file"
                  id="formFile"
                  accept="image/png, image/gif, image/jpeg"
                  onChange={handleChange}
                />
              </div>
              {progress > 0 && <Typography>Uploading {progress}%</Typography>}
            </div>
            <div className="col-lg-6">
              {image && (
                <div>
                  <img src={image} alt="question" className="img-fluid" />
                  <div className="mt-3">
                    <LoadingButton
                      endIcon={<UploadFile />}
                      color="success"
                      onClick={uploadImage}
                      variant="contained"
                      loading={loading}
                      loadingPosition="end"
                    >
                      Upload image
                    </LoadingButton>
                    <Button color="error" onClick={clearImage}>
                      clear
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
