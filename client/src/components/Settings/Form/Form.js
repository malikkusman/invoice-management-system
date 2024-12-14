/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { Avatar, Button, Paper, Grid, Container } from "@mui/material";
import Uploader from "./Uploader";
import { getProfilesByUser, updateProfile } from "../../../actions/profile";

import Input from "./Input";
import ProfileDetail from "./Profile";

const Settings = () => {
  const user = JSON.parse(localStorage.getItem("profile"));
  const initialState = {
    name: "",
    email: "",
    phoneNumber: "",
    businessName: "",
    contactAddress: "",
    logo: "",
    paymentDetails: "",
  };

  const [form, setForm] = useState(initialState);
  const location = useLocation();
  const dispatch = useDispatch();
  const { profiles } = useSelector((state) => state.profiles);
  console.log(profiles);
  const [switchEdit, setSwitchEdit] = useState(0);


  useEffect(() => {
    if (switchEdit === 1) {
      setForm(profiles);
    }
  }, [switchEdit]);

  useEffect(() => {
    dispatch(
      getProfilesByUser({ search: user?.result?._id || user?.result.googleId })
    );
  }, [location, switchEdit]);

  localStorage.setItem("profileDetail", JSON.stringify({ ...profiles }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateProfile(profiles?._id, form));
    setSwitchEdit(0);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div>
      {switchEdit === 0 && (
        <Container component="main" maxWidth="sm">
          <Paper
            sx={{
              marginTop: 0, // theme.spacing(0) is equivalent to 0
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start", // 'left' is not a valid value for alignItems, 'flex-start' is correct
              padding: 2, // theme.spacing(2) is equivalent to 2
              border: "solid 1px #bcbcbc",
            }}
            elevation={0}
          >
            <ProfileDetail profiles={profiles} />
            <Button
              variant="outlined"
              style={{ margin: "30px", padding: "15px 30px" }}
              onClick={() => setSwitchEdit(1)}
            >
              Edit Profile
            </Button>
          </Paper>
        </Container>
      )}

      {switchEdit === 1 && (
        <Container component="main" maxWidth="sm">
          <Paper
            sx={{
              marginTop: 0, // theme.spacing(0) is equivalent to 0
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start", // 'left' is not a valid value for alignItems, 'flex-start' is correct
              padding: 2, // theme.spacing(2) is equivalent to 2
              border: "solid 1px #bcbcbc",
            }}
            elevation={1}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderBottom: "solid 1px #dddddd",
                paddingBottom: "20px",
              }}
            >
              <Avatar
                style={{ width: "100px", height: "100px" }}
                src={profiles?.logo}
                alt=""
                sx={{
                  margin: 1, // theme.spacing(1) = 8px, so you can use the value directly
                  backgroundColor: "white",
                }}
              />
            </div>
            <form
              sx={{
                width: "100%", // Fix IE 11 issue.
                marginTop: 3, // Equivalent to theme.spacing(3)
              }}
              onSubmit={handleSubmit}
            >
              <Grid container spacing={2}>
                <Uploader form={form} setForm={setForm} />
                <Input
                  name="email"
                  label="Email Address"
                  handleChange={handleChange}
                  type="email"
                  half
                  value={form?.email}
                />
                <Input
                  name="phoneNumber"
                  label="Phone Number"
                  handleChange={handleChange}
                  type="text"
                  half
                  value={form?.phoneNumber}
                />
                <Input
                  name="businessName"
                  label="Business Name"
                  handleChange={handleChange}
                  type="text"
                  value={form?.businessName}
                />
                <Input
                  name="contactAddress"
                  label="Contact Address"
                  handleChange={handleChange}
                  type="text"
                  value={form?.contactAddress}
                />
                <Input
                  name="paymentDetails"
                  label="Payment Details/Notes"
                  handleChange={handleChange}
                  type="text"
                  multiline
                  rows="4"
                  value={form?.paymentDetails}
                />
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{
                  margin: "24px 0 16px", // theme.spacing(3) = 24px, theme.spacing(0) = 0px, theme.spacing(2) = 16px
                }}
              >
                Update Settings
              </Button>
              <Grid container justifyContent="flex-end"></Grid>
            </form>
          </Paper>
        </Container>
      )}
    </div>
  );
};

export default Settings;
