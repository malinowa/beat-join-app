import React from "react";
import { Grid, TextField, Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { MainText } from "./customComponents/MainText";
import { HelperText } from "./customComponents/HelperText";
import { CustomTextField } from "./customComponents/CustomTextField";
import { RegularPageButton } from "./customComponents/RegularPageButton";

export const JoinRoomPage = (props) => {

  const [roomCode, setRoomCode] = React.useState(""); 
  const [errorCode, setErrorCode] = React.useState(""); 
  const [errorUsername, setErrorUsername] = React.useState(""); 
  const [username, setUsername] = React.useState(""); 
  const navigate = useNavigate();

  const handleRoomCodeChange = (e) => {
    setRoomCode(e.target.value);
  }

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  }

  const joinRoom = () => {
    const requestOptions = {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        code: roomCode,
        username: username
      })
    }

    fetch("/api/join-room", requestOptions)
    .then((response) => {
      if (response.ok) {
        navigate("/room/" + roomCode);
      } else if (response.status === 404) {
        return response.json();
      }
    })
    .then((data) => {
      if (data?.room_not_found) {
        setErrorCode("Room not found");
        setRoomCode("");
      } else if (data?.username_exists) {
        setErrorUsername(`Username already used in room ${roomCode}`);
        setUsername("");
      }
    })
  }

  return <Grid container rowSpacing={3} columnSpacing={1}>
          <Grid item xs={12} align="center">
            <MainText>Join Room With Code</MainText>
          </Grid>

          <Grid item xs={12} md={6}>
            <Grid height="100%" container direction="row" justifyContent="center" alignItems="center">
              <HelperText>Room Code:</HelperText>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <Grid height="100%" container direction="row" justifyContent="center" alignItems="center">
              <CustomTextField
                  value={roomCode}
                  error={errorCode === "" ? false : true}
                  helperText={errorCode}
                  variant="outlined"
                  placeholder="Write here your code..."
                  onChange={handleRoomCodeChange}
                  inputProps={{
                    maxLength: 6
                  }}
                />
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <Grid height="100%" container direction="row" justifyContent="center" alignItems="center">
              <HelperText>Username:</HelperText>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <Grid height="100%" container direction="row" justifyContent="center" alignItems="center">
              <CustomTextField
                  value={username}
                  error={errorUsername === "" ? false : true}
                  helperText={errorUsername}
                  variant="outlined"
                  placeholder="Enter username"
                  onChange={handleUsernameChange}
                  inputProps={{
                    maxLength: 12
                  }}
                />
            </Grid>
          </Grid>

          <Grid item xs={12} align="center">
            <RegularPageButton variant="contained" color="primary" onClick={joinRoom}>Join Room</RegularPageButton>
          </Grid>
          <Grid item xs={12} align="center">
            <RegularPageButton variant="contained" color="secondary" to="/" component={Link}>Back</RegularPageButton>
          </Grid>
        </Grid>;
};