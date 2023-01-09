import React from "react";
import {
  Grid,
  IconButton,
  Typography,
  Card,
  LinearProgress,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PauseIcon from "@mui/icons-material/Pause";
import { SecondMainText } from "./customComponents/SecondMainText";

import PlayCircleFilledRoundedIcon from '@mui/icons-material/PlayCircleFilledRounded';
import PauseCircleRoundedIcon from '@mui/icons-material/PauseCircleRounded';
import FastForwardRoundedIcon from '@mui/icons-material/FastForwardRounded';
import FastRewindRoundedIcon from '@mui/icons-material/FastRewindRounded';
import { HelperText } from "./customComponents/HelperText";
import { CustomIconButton } from "./customComponents/CustomIconButton";
import { CustomProgressBar } from "./customComponents/CustomProgressBar";

export const  MusicPlayer = (props) => {
  const songProgress = (props.time / props.duration) * 100;

  const playSong = () => {
    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'}
    }

    fetch("/spotify/play", requestOptions);
  }

  const pauseSong = () => {
    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'}
    }

    fetch("/spotify/pause", requestOptions);
  }

  const skipSong = () => {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
    }

    fetch("/spotify/skip", requestOptions);
  }

  const rewindSong = () => {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
    }

    fetch("/spotify/rewind", requestOptions);
  }

  return (
    <Grid item container rowSpacing={3} columnSpacing={0}>
      <Grid item container justifyContent="center" alignItems="center" xs={12}>
         <img style={{borderRadius: "20%"}} src={props.image_url} width={props.isSmallScreen ? "30%" : "20%"}/>
      </Grid>
      <Grid item container justifyContent="center" xs={12}>
         <SecondMainText sx={{fontSize: props.isSmallScreen ? 20 : 30, textAlign: "center"}}>{props.title} ({props.artist})</SecondMainText>
      </Grid>
      <Grid item xs={12} align="center">
        <CustomProgressBar sx={{backgroundColor: "#FFFFFF"}} variant="determinate" value={songProgress} />
      </Grid>
      <Grid item container justifyContent="center" alignItems="center" xs={12}>
        <SecondMainText sx={{fontSize: props.isSmallScreen ? 20 : 40}}>{props.votes_to_rewind}/{props.votes_required_to_rewind}</SecondMainText>

       <div style={{paddingLeft: props.isSmallScreen ? "10px" : "20px", paddingRight:  props.isSmallScreen ? "8px" : "15px"}}> 
          <CustomIconButton onClick={rewindSong} disableRipple>
            <FastRewindRoundedIcon sx={{fontSize: props.isSmallScreen ? "50px" : "60px"}}/>
          </CustomIconButton>

          <CustomIconButton onClick={props.is_playing ? pauseSong : playSong} disableRipple>
            {props.is_playing ? <PauseCircleRoundedIcon sx={{fontSize: props.isSmallScreen ? "50px" : "60px"}}/> : <PlayCircleFilledRoundedIcon sx={{fontSize: props.isSmallScreen ? "50px" : "60px"}}/>}
          </CustomIconButton>

          <CustomIconButton onClick={skipSong} disableRipple>
            <FastForwardRoundedIcon sx={{fontSize: props.isSmallScreen ? "50px" : "60px"}}/> 
          </CustomIconButton>
        </div>

        <SecondMainText sx={{fontSize: props.isSmallScreen ? 20 : 40}}>{props.votes_to_skip}/{props.votes_required_to_skip}</SecondMainText>
      </Grid>
    </Grid>
  );
};
