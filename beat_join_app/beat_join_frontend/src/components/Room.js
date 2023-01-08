import { Grid, Typography, Button, responsiveFontSizes, Divider, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CreateRoomPage } from "./CreateRoomPage";
import { MusicPlayer } from "./MusicPlayer";
import { RegularPageButton } from "./customComponents/RegularPageButton";
import CircularProgress from '@mui/material/CircularProgress';
import { HelperText } from "./customComponents/HelperText";
import { SecondMainText } from "./customComponents/SecondMainText";

export const Room = (props) => {
  const initializeRoomObj = {
    votesToSkip: 2,
    votesToRewind: 2,
    guestCanPause: false,
    isHost: false,
    currentUsers: []
  };

  const [roomData, setRoomData] = React.useState(initializeRoomObj);
  const [songData, setSongData] = React.useState(null);
  const [isSpotifyAuthenticated, setIsSpotifyAuthenticated] = React.useState(false);
  const [displayNoSongData, setDisplayNoSongData] = React.useState(true);
  const [spotifyLoading, setSpotifyLoading] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);

  const { roomCode } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isBiggerThenSmallest = useMediaQuery(theme.breakpoints.up("xs"));

  const authenticateSpotify = () => {
    fetch('/spotify/is-authenticated')
    .then((response) => response.json())
    .then((data) => {
      setIsSpotifyAuthenticated(data.status)
      
      if (!data.status) {
        setSpotifyLoading(true);

        setTimeout(() => {
          fetch('/spotify/get-auth-url')
          .then((response) => response.json())
          .then((data) => {
            window.location.replace(data.url);
          })
        }, 2000);
        
      }
    })
  }
 
  const getRoomData = () => {
    fetch("/api/get-room" + "?code=" + roomCode)
      .then((response) => {
        if (!response.ok) {
            navigate("/");
        }
        return response.json();
      })
      .then((data) => {
        const host_username = data.current_users.filter((item) => item.session_key === data.host)[0].username

        setRoomData({
          votesToSkip: data.votes_to_skip,
          votesToRewind: data.votes_to_rewind,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
          host_username: host_username,
          currentUsers: data.current_users
        });
        if (data.is_host) {
          authenticateSpotify();
        }
      });
  };

  const getCurrentSong = () => {
    fetch('/spotify/current-song')
    .then((response) => {
      if (!response.ok) {
        setDisplayNoSongData(true);
      } else {
        setDisplayNoSongData(false);
        return response.json();
      }
    }).then((data) => {
      setSongData(data);
    })
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

    const songDataInterval = setInterval(getCurrentSong, 1000);

    return () => {
      clearInterval(songDataInterval);
    };

  }, []);

  const renderSettings = () => {
    return (<Grid container spacing={3}>
            <Grid item xs={12} align="center">
              <CreateRoomPage 
                update={true}
                votesToSkip={roomData.votesToSkip}
                guestCanPause={roomData.guestCanPause}
                votesToRewind={roomData.votesToRewind}
                roomCode={roomCode}
                updateCallback={getRoomData}
                />
              </Grid>
              <Grid item xs={12} align="center">
              <Typography sx={{width: "80%", textDecoration: "underline", color: "#FFFFFF"}}><Button disableFocusRipple disableRipple sx={{color: "#FFFFFF"}} onClick={() => updateShowSettings(false)}>Back</Button></Typography>
              </Grid>
            </Grid>)
  }

  const updateShowSettings = (value) => {
    setShowSettings(value);
  } 

  if (showSettings) {
    return renderSettings();
  }

  if (spotifyLoading) {
    return (
      <Grid container spacing={10}>
        <Grid item xs={12} align="center">
          <CircularProgress sx={{color: "#FFFFFF"}} color="primary" thickness={5} size="5rem"></CircularProgress>
        </Grid>
        <Grid container item spacing={1}>
          <Grid item xs={12} align="center">
            <HelperText sx={{fontStyle: "italic"}}><span style={{textDecoration: "underline"}}>Note:</span>  You will be redirected to Spotify login page.</HelperText>
          </Grid>
          <Grid item xs={12} align="center">
            <HelperText sx={{fontStyle: "italic"}}>You need to have a valid Spotify Premium account to host music.</HelperText>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  return (
    <div className="roomPage">
      {/* <Grid container spacing={3}>
      <Grid item xs={12} align="center">
        <Typography><b>Current users:</b></Typography>
        <ul>
        {roomData.currentUsers.map((item, id) => <li key={id}>{item.username}</li>)}
        </ul>
      </Grid>

      {(displayNoSongData || !songData)
          ? 
      <p>No song connected</p> 
          : 
      <MusicPlayer
        time={songData.time}
        duration={songData.duration}
        artist={songData.artist}
        image_url={songData.image_url}
        is_playing={songData.is_playing}
        title={songData.title}
        votes_required_to_rewind={songData.votes_required_to_rewind}
        votes_required_to_skip={songData.votes_required_to_skip}
        votes_to_rewind={songData.votes_to_rewind_len}
        votes_to_skip={songData.votes_to_skip_len}
        />}

      {roomData.isHost && 
        <Grid item xs={12} align="center">
          <RegularPageButton onClick={() => updateShowSettings(true)}>Settings</RegularPageButton>
        </Grid>}

      <Grid item xs={12} align="center">
        <RegularPageButton onClick={leaveRoomPressed}>Leave Room</RegularPageButton>
      </Grid>

    </Grid> */}

    {!isSmallScreen 
      ? 
      <Grid container rowSpacing={3} columnSpacing={7}>
      <Grid item container xs={12} md={5} rowSpacing={1} columnSpacing={1}>
        <Grid item container xs={12} spacing={1} justifyContent="flex-start" height="30%">
          <Grid item xs={12}>
            <SecondMainText sx={{fontSize: isBiggerThenSmallest ? 40 : 30}}>{roomData.host_username}'s room</SecondMainText>
          </Grid>
          <Grid item xs={12}>
            <SecondMainText sx={{fontSize: 30}}>Room code: <span style={{textDecoration: "underline"}}>{roomCode}</span></SecondMainText>
          </Grid>
        </Grid>
        <Grid item container xs={12} spacing={1} justifyContent="flex-start" alignItems="flex-start" height="70%">
          {/* <UsersList users={roomData.currentUsers}/> */}
          <Grid item xs={12}>
            <HelperText>UsersList</HelperText>
          </Grid>
        </Grid>
      </Grid>
      <Grid item container xs={12} md={7} rowSpacing={5} columnSpacing={1}>
        <Grid item container xs={12} justifyContent="center">
          <SecondMainText>Now playing:</SecondMainText>
        </Grid>
        <Grid item container xs={12} justifyContent="center">
            {!(displayNoSongData || !songData)
                ?
              <MusicPlayer
                isSmallScreen={isSmallScreen}
                time={songData.time}
                duration={songData.duration}
                artist={songData.artist}
                image_url={songData.image_url}
                is_playing={songData.is_playing}
                title={songData.title}
                votes_required_to_rewind={songData.votes_required_to_rewind}
                votes_required_to_skip={songData.votes_required_to_skip}
                votes_to_rewind={songData.votes_to_rewind_len}
                votes_to_skip={songData.votes_to_skip_len}
              />
                :
              <>        
                <HelperText>No current song chosen.</HelperText>
                <HelperText sx={{textAlign: "center"}}>Please press play button or change song in Spotify account to reload data about song.</HelperText>
              </>
            }
        </Grid>
        <Grid item container spacing={2}>
          {roomData.isHost && 
          <Grid item xs={12} align="center">
            <RegularPageButton sx={{height: "65%"}} onClick={() => updateShowSettings(true)}>Settings</RegularPageButton>
          </Grid>}
          <Grid item xs={12} align="center">
            <RegularPageButton sx={{height: "65%"}} onClick={leaveRoomPressed}>Leave Room</RegularPageButton>
          </Grid>
        </Grid>
      </Grid>
      </Grid>
      : 
      <Grid container rowSpacing={3} columnSpacing={7}>
      <Grid item container xs={12} md={7} rowSpacing={5} columnSpacing={1}>
        <Grid item container xs={12} justifyContent="center">
          <SecondMainText>Now playing:</SecondMainText>
        </Grid>
        {(displayNoSongData || !songData)
            ? 
          <Grid item container spacing={3} alignItems="center" justifyContent="center">
              <Grid item xs={12}>
                <HelperText>No current song chosen.</HelperText>
              </Grid>
              <Grid item xs={12}>
                <HelperText>Please press play button or change song in Spotify account to reload data about song.</HelperText>
              </Grid>
          </Grid>
            : 
          <MusicPlayer
            isSmallScreen={isSmallScreen}
            time={songData.time}
            duration={songData.duration}
            artist={songData.artist}
            image_url={songData.image_url}
            is_playing={songData.is_playing}
            title={songData.title}
            votes_required_to_rewind={songData.votes_required_to_rewind}
            votes_required_to_skip={songData.votes_required_to_skip}
            votes_to_rewind={songData.votes_to_rewind_len}
            votes_to_skip={songData.votes_to_skip_len}
            />}
      </Grid>
      <Grid item container xs={12} md={5} rowSpacing={1} columnSpacing={1}>
        <Grid item container xs={12} justifyContent="flex-start">
          <SecondMainText>{roomData.host_username}'s room</SecondMainText>
        </Grid>
        <Grid item container xs={12} justifyContent="flex-start" alignItems="flex-start">
          <SecondMainText sx={{fontSize: 30}}>Room code: <span style={{textDecoration: "underline"}}>{roomCode}</span></SecondMainText>
        </Grid>
        <Grid item container xs={12} justifyContent="flex-start">
          {/* <UsersList users={roomData.currentUsers}/> */}<HelperText>UsersList</HelperText>
        </Grid>
      </Grid>
    </Grid>
    } 
    </div>
  );
};
