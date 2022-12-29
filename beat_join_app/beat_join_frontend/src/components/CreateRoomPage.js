import React from "react";
import { Grid, Button, FormControl, FormControlLabel, TextField, RadioGroup, Radio, Typography, FormHelperText } from "@mui/material"
import { Link, redirect, useNavigate } from "react-router-dom";

export const CreateRoomPage = (props) => {
  const [defaultVotes, setDefaultVotes] = React.useState(4);
  const [guestCanPause, setGuestCanPause] = React.useState(true);
  const navigate = useNavigate();

  const handleVotesChange = (e) => {
    setDefaultVotes(parseInt(e.target.value));

  }

  const handleGuestCanPauseChange = (e) => {
    setGuestCanPause(e.target.value === "true" ? true : false)

  }

  const handleCreateNewRoomButtonPressed = () => {
    const requestOptions = {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        votes_to_skip: defaultVotes,
        guest_can_pause: guestCanPause
      })
    }

    fetch("/api/create-room", requestOptions)
    .then((response) => {return response.json()})
    .then((data) => {
      //console.log(data);
      navigate("/room/" + data.code);
    });
  }

  return (<Grid container spacing={1}>
            <Grid item xs={12} align="center">
              <Typography component={"h4"} variant={"h4"}>Create New Room</Typography>
            </Grid>
            <Grid item xs={12} align="center">
              <FormControl component="fieldset">
                <FormHelperText sx={{
                  textAlign: "center",
                }}>
                    Guest can pause/play music  
                </FormHelperText>
                <RadioGroup row defaultValue="true" onChange={handleGuestCanPauseChange}>
                  <FormControlLabel 
                    value="true"
                    control={<Radio color="primary"/>}
                    label="Play/Pause"
                    labelPlacement="bottom">
                  </FormControlLabel>
                  <FormControlLabel 
                    value="false"
                    control={<Radio color="secondary"/>}
                    label="No interactions"
                    labelPlacement="bottom">
                  </FormControlLabel>
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
              <FormControl>
                  <TextField
                    required={true}
                    type="number"
                    defaultValue={defaultVotes}
                    onChange={handleVotesChange}
                    inputProps={{
                      min: 1,
                      style: {
                        textAlign: "center"
                      }
                    }}/>
                    <FormHelperText sx={{
                      textAlign: "center",
                    }}>
                      Votes required to skip song
                    </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
              <Button color="primary" onClick={handleCreateNewRoomButtonPressed} variant="contained">
                  Create New Room
              </Button>
            </Grid>
            <Grid item xs={12} align="center">
              <Button color="secondary" variant="contained" to="/" component={Link}>
                  Back
              </Button>
            </Grid>
          </Grid>);
};