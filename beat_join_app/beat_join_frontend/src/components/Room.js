import { Grid, Typography, Button, responsiveFontSizes, Divider, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { CreateRoomPage } from "./CreateRoomPage";
import { MusicPlayer } from "./MusicPlayer";
import { RegularPageButton } from "./customComponents/RegularPageButton";
import CircularProgress from '@mui/material/CircularProgress';
import { HelperText } from "./customComponents/HelperText";
import { SecondMainText } from "./customComponents/SecondMainText";
import { UsersList } from "./UsersList";
import { MainText } from "./customComponents/MainText";
import { HomePageButton } from "./customComponents/HomePageButton";

export const Room = (props) => {
  const initializeRoomObj = {
    votesToSkip: 2,
    votesToRewind: 2,
    guestCanPause: false,
    isHost: false,
    host_username: ""
  };

  const [roomData, setRoomData] = React.useState(initializeRoomObj);
  const [currentUsers, setCurrentUsers] = React.useState([]);
  const [songData, setSongData] = React.useState(null);
  const [isSpotifyAuthenticated, setIsSpotifyAuthenticated] = React.useState(false);
  const [displayNoSongData, setDisplayNoSongData] = React.useState(true);
  const [spotifyLoading, setSpotifyLoading] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [hostLeftTheRoom, setHostLeftTheRoom] = React.useState(false);

  const { roomCode } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isBiggerThenSmallest = useMediaQuery(theme.breakpoints.up("xs"));
  let roomDataInterval = null;

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
        }, 3000);
        
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
          host_username: host_username
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

  const getCurrentRoom = () => {
    fetch('/api/current-room')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      setCurrentUsers(data.current_users)
      
      if (!data.is_room_active) {
        displayHostLeftRoomInfo();
      }
    })
  }

  const displayHostLeftRoomInfo = () => {
    clearInterval(roomDataInterval);
    setHostLeftTheRoom(true);
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

    roomDataInterval = setInterval(() => {
      getCurrentSong();
      getCurrentRoom();
    }, 1000);

    return () => {
      clearInterval(roomDataInterval);
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

  if (hostLeftTheRoom) {
    return (<div className="homePage">
            <Grid container spacing={10}>
              <Grid item xs={12} align="center">
                <MainText>The host had left the room.</MainText>
              </Grid>
              <Grid item xs={12} align="center">
                <HomePageButton variant="contained" color="secondary" to="/" LinkComponent={Link}>Go To Home Page</HomePageButton>
              </Grid>
            </Grid>
            </div>
          )
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
    {!isSmallScreen 
      ? 
      <Grid container rowSpacing={3} columnSpacing={7}>
        <Grid sx={{borderRight: "solid 1px #FFFFFF"}} item container xs={12} md={5} rowSpacing={1} columnSpacing={1} alignItems="center">
          <Grid item container xs={12} spacing={1} justifyContent="flex-start">
            <Grid item xs={12}>
              <SecondMainText sx={{fontSize: isBiggerThenSmallest ? 40 : 30}}>{roomData.host_username}'s room</SecondMainText>
            </Grid>
            <Grid item xs={12}>
              <SecondMainText sx={{fontSize: 30}}>Room code: <span style={{textDecoration: "underline"}}>{roomCode}</span></SecondMainText>
            </Grid>
          </Grid>
          <Grid item container xs={12} spacing={1} justifyContent="flex-start" alignItems="flex-start" height="70%">
            <Grid item xs={12}>
              <UsersList isSmallScreen={isSmallScreen} users={currentUsers}/>
            </Grid>
          </Grid>
        </Grid>
        <Grid item container xs={12} md={7} rowSpacing={10} columnSpacing={1}>
          <Grid item container xs={12} justifyContent="center" alignItems="flex-end">
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
          <Grid item container spacing={3} alignItems="center">
            {roomData.isHost ? 
            <Grid item xs={12} align="center">
              <RegularPageButton sx={{height: "70px"}} onClick={() => updateShowSettings(true)}>Settings</RegularPageButton>
            </Grid> 
              :
              <Grid item xs={12} align="center">
                <HelperText><span style={{textDecoration: "underline"}}>Note:</span> You {roomData.guestCanPause ? "can" : "cannot"} play/pause data in this room.</HelperText>
              </Grid>}
            <Grid item xs={12} align="center">
              <RegularPageButton sx={{height: "70px"}} onClick={leaveRoomPressed}>Leave Room</RegularPageButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      : 
      <Grid container rowSpacing={6} columnSpacing={7}>
      <Grid item container xs={12} md={7} rowSpacing={5} columnSpacing={1}>
          <Grid item container xs={12} justifyContent="center" alignItems="flex-end">
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
          <Grid item container spacing={3} alignItems="center">
            {roomData.isHost && 
            <Grid item xs={12} align="center">
              <RegularPageButton sx={{height: "70px"}} onClick={() => updateShowSettings(true)}>Settings</RegularPageButton>
            </Grid>}
            <Grid item xs={12} align="center">
              <RegularPageButton sx={{height: "70px"}} onClick={leaveRoomPressed}>Leave Room</RegularPageButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid item container xs={12} md={5} rowSpacing={1} columnSpacing={1} alignItems="center">
          <Grid item container xs={12} spacing={1} justifyContent="flex-start">
            <Grid item xs={12}>
              <SecondMainText sx={{fontSize: !isSmallScreen ? 40 : 30}}>{roomData.host_username}'s room</SecondMainText>
            </Grid>
            <Grid item xs={12}>
              <SecondMainText sx={{fontSize: 30}}>Room code: <span style={{textDecoration: "underline"}}>{roomCode}</span></SecondMainText>
            </Grid>
          </Grid>
          <Grid item container xs={12} spacing={1} justifyContent="flex-start" alignItems="flex-start" height="70%">
            <Grid item xs={12}>
              <UsersList isSmallScreen={isSmallScreen} users={currentUsers}/>
            </Grid>
          </Grid>
        </Grid>
    </Grid>
    } 
    </div>
  );
};
