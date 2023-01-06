import React from "react";
import {
  Grid,
  Button,
  FormControl,
  FormControlLabel,
  TextField,
  RadioGroup,
  Radio,
  Typography,
  FormHelperText,
} from "@mui/material";
import { Link, redirect, useNavigate } from "react-router-dom";
import { MainText } from "./customComponents/MainText";
import { RegularPageButton } from "./customComponents/RegularPageButton";
import { HelperText } from "./customComponents/HelperText";
import { CustomTextField } from "./customComponents/CustomTextField";
import { borderColor } from "@mui/system";

export const CreateRoomPage = (props) => {
  const [skipVotes, setSkipVotes] = React.useState(2);
  const [rewindVotes, setRewindVotes] = React.useState(2);
  const [guestCanPause, setGuestCanPause] = React.useState(true);
  const [username, setUsername] = React.useState("");
  const navigate = useNavigate();

  const handleVotesChange = (e, option) => {
    let value;

    value = (parseInt(e.target.value) === NaN || parseInt(e.target.value) === null) ? 1 : parseInt(e.target.value);

    if (!value || value < 1) {
      value = 1;
    }

    if (option === "skip") {
      setSkipVotes(value);
    } else {
      setRewindVotes(value);
    } 
  };

  const handleGuestCanPauseChange = (e) => {
    setGuestCanPause(e.target.value === "true" ? true : false);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleCreateNewRoomButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: skipVotes,
        votes_to_rewind: rewindVotes,
        guest_can_pause: guestCanPause,
        username: username,
      }),
    };

    fetch("/api/create-room", requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        //console.log(data);
        navigate("/room/" + data.code);
      });
  };

  return (
    <Grid container rowSpacing={3} columnSpacing={{ xs: 1, md: 4 }}>
      <Grid item xs={12} align="center">
        <MainText>Create New Room</MainText>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid height="100%" container direction="row" justifyContent="center" alignItems="center">
          <HelperText>Guest can pause/play music:</HelperText>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid height="100%" container direction="row" justifyContent="center" alignItems="center">
          <RadioGroup
            row
            defaultValue="true"
            onChange={handleGuestCanPauseChange}
          >
            <FormControlLabel
              value="true"
              control={<Radio sx={{
                color: "#FFFFFF",
                '&.Mui-checked': {
                  color: "#8E26DF",
                },
              }}/>}
              label="Play/Pause"
              labelPlacement="bottom"
              sx={{
                mx: 1,
                color: "#FFFFFF"
              }}
            ></FormControlLabel>
            <FormControlLabel
              value="false"
              control={<Radio sx={{
                color: "#FFFFFF",
                '&.Mui-checked': {
                  color: "#8E26DF",
                },
              }} />}
              label="No control"
              labelPlacement="bottom"
              sx={{
                mx: 1,
                color: "#FFFFFF"
              }}
            ></FormControlLabel>
          </RadioGroup>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid height="100%" container direction="row" justifyContent="center" alignItems="center">
          <HelperText>Votes required to skip song:</HelperText>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid height="100%" container direction="row" justifyContent="center" alignItems="center">
          <CustomTextField
              required={true}
              type="number"
              value={skipVotes}
              onChange={(e) => handleVotesChange(e, "skip")}
              inputProps={{
                min: 1,
                style: {
                  textAlign: "center",
                  color: "#FFFFFF"
                }
              }}
              variant="outlined"
            />
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid height="100%" container direction="row" justifyContent="center" alignItems="center">
          <HelperText>Votes required to rewind song:</HelperText>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid height="100%" container direction="row" justifyContent="center" alignItems="center">
          <CustomTextField
              required={true}
              type="number"
              value={rewindVotes}
              onChange={(e) => handleVotesChange(e, "rewind")}
              inputProps={{
                min: 1,
                style: {
                  textAlign: "center",
                  color: "#FFFFFF"
                }
              }}
              variant="outlined"
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
                required={true}
                type="text"
                placeholder="Enter username..."
                onChange={handleUsernameChange}
                inputProps={{
                  maxLength: 12
                }}
              />
        </Grid>
      </Grid>
      <Grid item xs={12} align="center">
        <RegularPageButton
          color="primary"
          onClick={handleCreateNewRoomButtonPressed}
          variant="contained"
        >
          Create New Room
        </RegularPageButton>
      </Grid>
      <Grid item xs={12} align="center">
        <Button color="secondary" variant="contained" to="/" component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
  );
};
