import React from 'react';
import { Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const StyledTooltip = withStyles((theme) => {
  console.log('theme ', theme);
  return {
    tooltip: {
      fontSize: 12,
      color: '#fff !important',
      background: theme.palette.primary.main,
      padding: '8px',
      boxShadow: '0px 1px 2px rgba(10, 10, 10, 0.1), 0px 4px 12px rgba(10, 10, 10, 0.15)',
      borderRadius: 4,
    },
    arrow: {
      color: theme.palette.primary.main,
    },
  };
})(Tooltip);

export default StyledTooltip;
