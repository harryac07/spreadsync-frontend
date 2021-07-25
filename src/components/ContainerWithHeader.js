import React from 'react';
import { Paper, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const ContainerWithHeader = ({
  headerLeftContent = null,
  headerRightContent = null,
  children = null,
  elevation = 0,
  square = false,
  padding = null,
  showHeader = true,
}) => {
  const classes = useStyles({ bodyPadding: padding });

  return (
    <Paper elevation={elevation} square={square}>
      {showHeader && (
        <div className={classes.headerText}>
          <div>{headerLeftContent}</div>
          <div>{headerRightContent}</div>
        </div>
      )}

      {children && (
        <>
          <Divider light />
          <div className={classes.content}>
            <div>{children}</div>
          </div>
        </>
      )}
    </Paper>
  );
};

const useStyles = makeStyles((theme) => {
  return {
    projectWrapper: {
      border: 0,
      borderRadius: 3,
      color: '#000',
      margin: '0 auto',
      position: 'relative',
      marginBottom: 0,
    },
    headerText: {
      fontWeight: 'bold',
      fontSize: 18,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      textTransform: 'none',
      padding: (props) => props.bodyPadding,
    },
    content: {
      padding: (props) => props.bodyPadding,
    },
  };
});

export default ContainerWithHeader;
