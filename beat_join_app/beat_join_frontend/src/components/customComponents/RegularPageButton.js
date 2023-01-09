import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

export const RegularPageButton = styled(Button)({
    fontSize: 24,
    fontWeight: 500,
    color: "#263238",
    width: "60%",
    textTransform: "none",
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
    borderRadius: 6,
    '&:hover': {
    backgroundColor: '#8E26DF',
    borderColor: '#8E26DF',
    color: '#FFFFFF'
    }
});