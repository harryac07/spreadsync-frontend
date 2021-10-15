import colors from './colors';
import { createMuiTheme } from '@material-ui/core/styles';

const breakpointValues = {
  xs: 300,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1700,
};

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
    error: {
      main: colors.error,
    },
    action: {
      disabled: colors.grayLight3,
      disabledBackground: colors.grayLight4,
    },
  },
  typography: {
    fontSize: 14,
    htmlFontSize: 14,
  },
  overrides: {
    MuiTableCell: {
      root: {
        fontSize: 14,
      },
      head: {
        fontWeight: 700,
        fontSize: 14,
      },
      body: {
        fontSize: 14,
      },
    },
    MuiTableBody: {
      root: {
        fontSize: 14,
      },
    },
    MuiTooltip: {
      tooltip: {
        fontSize: 12,
        backgroundColor: colors.black,
      },
    },
    MuiButton: {
      root: {
        textTransform: 'uppercase',
        fontSize: 16,
        fontWeight: 500,
        borderRadius: 'none',
        '&.MuiButton-outlinedError': {
          color: colors.error,
        },
      },
      containedSecondary: {
        color: '#fff',
      },
      outlinedPrimary: {
        color: colors.primary,
      },
      outlinedSecondary: {
        color: colors.secondary,
      },
      outlinedError: {
        color: colors.error,
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
        'box-shadow': '0px 0px 2px 0px #888888',
      },
    },
  },
  breakpoints: { values: breakpointValues },
});
export default theme;
