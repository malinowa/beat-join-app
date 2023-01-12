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
  Collapse
} from "@mui/material";
import Alert from "@mui/material/Alert";
import { Link, useNavigate } from "react-router-dom";
import { MainText } from "./customComponents/MainText";
import { RegularPageButton } from "./customComponents/RegularPageButton";
import { HelperText } from "./customComponents/HelperText";
import { CustomTextField } from "./customComponents/CustomTextField";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";


export const CreateRoomPage = ({update = false, guestCanPause = true, votesToSkip = 2, votesToRewind = 2, updateCallback = () => {}, ...props}) => {
  const [skipVotes, setSkipVotes] = React.useState(votesToSkip);
  const [rewindVotes, setRewindVotes] = React.useState(votesToRewind);
  const [guestCanPauseVal, setGuestCanPause] = React.useState(guestCanPause);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  const [username, setUsername] = React.useState("");

  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

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
        guest_can_pause: guestCanPauseVal,
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

  const handleUpdateRoomButtonPressed = () => {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: skipVotes,
        votes_to_rewind: rewindVotes,
        guest_can_pause: guestCanPauseVal,
        code: props.roomCode,
      }),
    };

    fetch("/api/update-room", requestOptions)
      .then((response) => {
        if (response.ok) {
          setSuccessMessage("Room updated successfully!")
          updateCallback();
        } else {
          setErrorMessage("Error updating room.")
        }
      });
  }

  const renderCreateButtons = () => {
    return (<>
            <Grid item xs={12} align="center">
              <RegularPageButton
                sx={{fontSize: isSmallScreen ? 16 : 24}}
                color="primary"
                onClick={handleCreateNewRoomButtonPressed}
                variant="contained"
              >
                Create New Room
              </RegularPageButton>
            </Grid>
            <Grid item xs={12} align="center">
              <RegularPageButton sx={{fontSize: isSmallScreen ? 16 : 24}} color="secondary" variant="contained" to="/" component={Link}>
                Back
              </RegularPageButton>
            </Grid>
      </>)
  }

  const renderUpdateButtons = () => {
     return (<Grid item xs={12} align="center">
                <RegularPageButton sx={{fontSize: isSmallScreen ? 16 : 24}} onClick={handleUpdateRoomButtonPressed}>
                  Update Room
                </RegularPageButton>
              </Grid>)
  }


  let title = update ? "Room settings" : "Create New Room";

  return (
    <div className="createPage">
    <Grid container rowSpacing={3} columnSpacing={{ xs: 1, md: 4 }}>
      <Grid item xs={12} align="center">
        <Collapse in={successMessage != "" || errorMessage != ""} >
          {successMessage != "" ? <Alert severity="success" onClose={() => setSuccessMessage("")}>{successMessage}</Alert> : <Alert severity="error" onClose={() => setErrorMessage("")}>{errorMessage}</Alert>}
        </Collapse>
      </Grid>
      <Grid item xs={12} align="center">
        <MainText sx={{fontSize: isSmallScreen ? 35 : 50}}>{title}</MainText>
      </Grid>
      <Grid item container xs={12} align="center" rowSpacing={3} columnSpacing={5}>
        <Grid container item xs={12} md={6}>
          <Grid height="100%" container direction="row" justifyContent={isSmallScreen ? "center" : "flex-end"} alignItems="center">
            <HelperText>Guest can pause/play music:</HelperText>
          </Grid>
        </Grid>
        <Grid container item xs={12} md={6}>
          <Grid height="100%" container direction="row" justifyContent={isSmallScreen ? "center" : "flex-start"} alignItems="center">
            <RadioGroup
              row
              value={guestCanPauseVal}
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
                label="Play/Stop"
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
        <Grid container item xs={12} md={6}>
          <Grid height="100%" container direction="row" justifyContent={isSmallScreen ? "center" : "flex-end"} alignItems="center">
            <HelperText>Votes required to skip song:</HelperText>
          </Grid>
        </Grid>
        <Grid container item xs={12} md={6}>
          <Grid height="100%" container direction="row" justifyContent={isSmallScreen ? "center" : "flex-start"} alignItems="center">
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
        <Grid container item xs={12} md={6}>
          <Grid height="100%" container direction="row" justifyContent={isSmallScreen ? "center" : "flex-end"} alignItems="center">
            <HelperText>Votes required to rewind song:</HelperText>
          </Grid>
        </Grid>
        <Grid container item xs={12} md={6}>
          <Grid height="100%" container direction="row" justifyContent={isSmallScreen ? "center" : "flex-start"} alignItems="center">
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
        {!update && <>
          <Grid container item xs={12} md={6}>
            <Grid height="100%" container direction="row" justifyContent={isSmallScreen ? "center" : "flex-end"} alignItems="center">
              <HelperText>Username:</HelperText>
            </Grid>
          </Grid>
          <Grid container item xs={12} md={6}>
            <Grid height="100%" container direction="row" justifyContent={isSmallScreen ? "center" : "flex-start"} alignItems="center">
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
        </>}
      </Grid>
      {update ? renderUpdateButtons() : renderCreateButtons()}
    </Grid>
    </div>
  );
};
