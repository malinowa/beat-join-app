import { styled } from "@mui/material/styles";
import { IconButton } from "@mui/material";


export const CustomIconButton = styled(IconButton)({
    color: "#FFFFFF",
    padding: 0,
    // backgroundColor: '#FFFFFF',
    // borderColor: '#FFFFFF',
    '&:hover': {
    // backgroundColor: '#8E26DF',
        color: '#8E26DF'
    }
});