import { Grid, Typography, Button, responsiveFontSizes } from "@mui/material";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export const Room = (props) => {
  const initializeRoomObj = {
    votesToSkip: 2,
    guestCanPause: false,
    isHost: false,
    currentUsers: []
  };

  const [roomData, setRoomData] = React.useState(initializeRoomObj);
  const [songData, setSongData] = React.useState(null);

  const { roomCode } = useParams();
  const navigate = useNavigate();

  const getRoomData = () => {
    fetch("/api/get-room" + "?code=" + roomCode)
      .then((response) => {
        if (!response.ok) {
            navigate("/");
        }
        return response.json();
      })
      .then((data) => {
        setRoomData({
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
          currentUsers: data.current_users
        });
      });
  };

  const getCurrentSong = () => {
    
  }

  const leaveRoomPressed = () => {
    const requestOptions = {
        method: 'POST',
        headers: {"Content-Type": "application/json"}
    }

    fetch("/api/leave-room", requestOptions)
    .then((response) => response.json())
    .then((data) => {
        if (data?.room_not_found) {
          alert("Host had left the room. Please reload page.")
        } else {
          navigate("/");
        }
    });
  }

  React.useEffect(() => {
    getRoomData();
  }, []);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography><b>Current users:</b></Typography>
        <ul>
        {roomData.currentUsers.map((item, id) => <li key={id}>{item.username}</li>)}
        </ul>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography><b>Code:</b> {roomCode}</Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Button variant="contained" color="secondary" onClick={leaveRoomPressed}>Leave Room</Button>
      </Grid>
    </Grid>
  );
};
