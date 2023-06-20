import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#161616',
    },
    secondary: {
      main: '#EEFD53',
    },
    error: {
      main: '#DA1E28',
    },
  },
  typography: {
    fontFamily: [
      'Noto Sans KR',
      'sans-serif',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      'Fira Sans',
      'Droid Sans',
      'Helvetica Neue',
    ].join(','),
  },
});

export default theme;
