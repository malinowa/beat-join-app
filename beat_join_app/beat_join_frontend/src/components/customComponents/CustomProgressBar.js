import { LinearProgress } from "@mui/material";
import { styled } from "@mui/material/styles";


export const CustomProgressBar = styled(LinearProgress)({
    "& .MuiLinearProgress-colorPrimary": {
        backgroundColor: "#FFFFFF",
    },
    "& .MuiLinearProgress-barColorPrimary": {
        backgroundColor: "#8E26DF",
    },
    width: "60%"
})