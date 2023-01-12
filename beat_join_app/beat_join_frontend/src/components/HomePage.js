import React from "react";
import { Grid, Button, ButtonGroup, Typography } from "@mui/material";
import { Link, Navigate, Outlet } from "react-router-dom";
import { HomePageButton } from "./customComponents/HomePageButton";
import { MainText } from "./customComponents/MainText";

import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export const HomePage = (props) => {
  const [roomCode, setRoomCode] = React.useState("");

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

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

  return (<div className="homePage">
            <Grid container spacing={4}>
                    <Grid item xs={12} align="center">
                      <MainText sx={{fontSize: isSmallScreen ? 35 : 50}}>Welcome to BeatJoin!</MainText>
                    </Grid>
                    <Grid item xs={12} align="center">
                      <Typography color="white" fontSize={18} fontWeight={500} fontStyle="italic">Choose your action:</Typography>
                    </Grid>
                    <Grid item xs={12} align="center">
                      <HomePageButton sx={{fontSize: isSmallScreen ? 16 : 20}} variant="contained" color="secondary" to="/create" LinkComponent={Link}>Create New Room</HomePageButton>
                    </Grid>
                    <Grid item xs={12} align="center">
                      <HomePageButton sx={{fontSize: isSmallScreen ? 16 : 20}} variant="contained" color="primary" to="/join" LinkComponent={Link}>Join Room With Code</HomePageButton>
                    </Grid>
                  </Grid>
          </div>);
};
