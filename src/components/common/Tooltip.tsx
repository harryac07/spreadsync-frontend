import React from 'react';
import { Tooltip, TooltipProps } from '@material-ui/core';
import colors from 'theme/colors';
import { makeStyles } from '@material-ui/styles';

export type Props = {
  title: React.ReactNode;
  color?: 'primary' | 'secondary';
  arrow?: boolean;
  placement: TooltipProps['placement'];
  children: any;
};

const StyledTooltip: React.FC<Props> = ({ title, color = 'primary', arrow = true, placement = 'top', children }) => {
  const classes = useStyles({
    color: getColor(color),
  });
  return (
    <Tooltip
      title={title}
      placement={placement}
      arrow={arrow}
      classes={{ tooltip: classes.tooltip, arrow: classes.arrow }}
    >
      {children}
    </Tooltip>
  );
};

export default StyledTooltip;

const getColor = (color: Props['color']) => {
  if (color === 'secondary') {
    return colors.secondary;
  }
  return colors.primary;
};

const useStyles = makeStyles(() => ({
  tooltip: {
    fontSize: 12,
    color: '#fff !important',
    background: (props: any) => props.color,
    padding: '8px',
    boxShadow: '0px 1px 2px rgba(10, 10, 10, 0.1), 0px 4px 12px rgba(10, 10, 10, 0.15)',
    borderRadius: 4,
  },
  arrow: {
    color: (props: any) => props.color,
  },
}));
