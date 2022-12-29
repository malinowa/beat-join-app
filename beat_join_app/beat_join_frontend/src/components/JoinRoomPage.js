import React from "react";
import { Grid, TextField, Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export const JoinRoomPage = (props) => {

  const [roomCode, setRoomCode] = React.useState(""); 
  const [error, setError] = React.useState(""); 
  const navigate = useNavigate();

  const handleRoomCodeChange = (e) => {
    setRoomCode(e.target.value);
  }

  const joinRoom = () => {
    const requestOptions = {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        code: roomCode
      })
    }

    fetch("/api/join-room", requestOptions)
    .then((response) => {
      if (response.ok) {
        navigate("/room/" + roomCode);
      } else {
        setError("Room not found");
        setRoomCode("");
      }
    })
  }

  return <Grid container spacing={1}>
          <Grid item xs={12} align="center">
            <Typography variant="h4">Join Room by Code</Typography>
          </Grid>
          <Grid item xs={12} align="center">
            <TextField
            value={roomCode}
            error={error === "" ? false : true}
            label="Code"
            helperText={error}
            variant="outlined"
            placeholder="Enter Room Code"
            onChange={handleRoomCodeChange}
            />
          </Grid>
          <Grid item xs={12} align="center">
            <Button variant="contained" color="primary" onClick={joinRoom}>Join Room</Button>
          </Grid>
          <Grid item xs={12} align="center">
            <Button variant="contained" color="secondary" to="/" component={Link}>Back</Button>
          </Grid>
        </Grid>;
};