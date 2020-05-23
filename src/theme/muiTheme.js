import colors from './colors';
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    common: {
      black: colors.black,
    },
    primary: {
      main: colors.primary,
    },
    secondary: {
      main: colors.secondary,
    },
    white: {
      main: colors.white,
    },
    text: {
      primary: colors.black,
      secondary: colors.gray,
    },
    action: {
      disabled: colors.grayLight3,
      disabledBackground: colors.grayLight4,
    },
  },
  typography: {
    fontSize: 12,
    htmlFontSize: 10,
  },
  overrides: {
    MuiTableCell: {
      root: {
        fontSize: 12,
      },
      head: {
        fontWeight: 700,
        fontSize: 12,
      },
      body: {
        fontSize: 12,
      },
    },
    MuiTableBody: {
      root: {
        fontSize: 12,
      },
    },
    MuiTooltip: {
      tooltip: {
        fontSize: 11,
        backgroundColor: colors.black,
      },
    },
    MuiButton: {
      root: {
        textTransform: 'uppercase',
        fontSize: 16,
        fontWeight: 500,
      },
      containedSecondary: {
        color: '#fff',
      },
    },
    MuiFormHelperText: {
      contained: {
        lineHeight: '12px',
        margin: '8px 0',
      },
    },
    MuiAppBar: {
      root: {
        'box-shadow': '0px 0px 3px 0px #888888',
      },
    },
  },
});
export default theme;
