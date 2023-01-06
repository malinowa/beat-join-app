import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

export const CustomTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        color: "#FFFFFF",
        '& fieldset': {
            borderColor: 'white',
        },
        '&:hover fieldset': {
            borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'white',
        },
    },
    '& .MuiFormHelperText-root.Mui-error': {
        color: "#9E0000",
    },
    '& .MuiOutlinedInput-root.Mui-error': {
        '& fieldset': {
            borderColor: '#9E0000',
        },
        '&:hover fieldset': {
            borderColor: '#9E0000',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#9E0000',
        },
    },
  });