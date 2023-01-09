import React from "react";
import { Grid, Typography, ListItemAvatar, Avatar, List, ListItemText, ListItem } from "@mui/material";
import FolderIcon from '@mui/icons-material/Folder';
import { SecondMainText } from "./customComponents/SecondMainText";
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';


const CustomAvatar = () => {
    return (
        <Avatar sx={{color: "#FFFFFF", backgroundColor: "#F577F0", width :"50px", height: "50px"}}>
            <PersonRoundedIcon fontSize="large"/>
        </Avatar>
    )
}

export const UsersList = (props) => {
    return (<Grid item xs={12}>
                <SecondMainText sx={{fontSize: 30}}>
                    Users list:
                </SecondMainText>
                <List style={{maxHeight: props.isSmallScreen ? 300 : 500, overflow: 'auto'}}>
                    {props.users.map((item) => 
                    (<ListItem key={item.id}>
                        <ListItemAvatar sx={{minWidth: "70px"}}>
                            <CustomAvatar/>
                        </ListItemAvatar>
                        <ListItemText
                        sx={{color: "#FFFFFF"}}
                        primary={item.username}/>
                    </ListItem>),
                    )}
                </List>
            </Grid>)

}