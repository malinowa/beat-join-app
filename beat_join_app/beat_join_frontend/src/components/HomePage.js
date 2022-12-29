import React from "react";
import { Grid, Button, ButtonGroup, Typography } from "@mui/material";
import { Link, Navigate, Outlet } from "react-router-dom";

export const HomePage = (props) => {
  const [roomCode, setRoomCode] = React.useState("");

  React.useEffect(() => {
    (async () => {
      const data = await fetch("/api/user-in-room").then((response) => response.json());
      setRoomCode(data.code);
    })();
  
    return () => {
      // cleanup func
    };
  }, []);



  if (roomCode) {
    return <Navigate to={`/room/${roomCode}`}/>
  }

  return (<Grid container spacing={3}>
            <Grid item xs={12} align="center">
              <Typography variant="h4">Welcome to BeatJoin!</Typography>
            </Grid>
            <Grid item xs={12} align="center">
              <ButtonGroup variant="contained">
                <Button variant="contained" color="primary" to="/join" LinkComponent={Link}>Join Room</Button>
                <Button variant="contained" color="secondary" to="/create" LinkComponent={Link}>Create Room</Button>
              </ButtonGroup>
            </Grid>
          </Grid>);
};
