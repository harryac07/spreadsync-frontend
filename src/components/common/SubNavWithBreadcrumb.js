import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const SubNavWithBreadcrumb = ({ mainTitle, onTitleClick, subPage, subPageName }) => {
  const classes = useStyles();
  return (
    <div className={classes.headerWrapper}>
      <div>
        <div className={classes.jobNavHeader} display="inline-block">
          <span className={classes.projectClickable} onClick={onTitleClick}>
            {mainTitle}
          </span>
          <span style={{ fontSize: 20 }}>
            {' '}
            {'>'} {subPage} {'>'} {subPageName}
          </span>
        </div>
      </div>
    </div>
  );
};
export default SubNavWithBreadcrumb;

const useStyles = makeStyles(() => ({
  jobNavHeader: {
    fontSize: 22,
  },
  projectClickable: {
    fontWeight: 'bold',
    cursor: 'pointer',
    '&:hover': {
      color: '#3A3C67',
      textDecoration: 'underline',
    },
  },

  headerWrapper: {
    backgroundColor: '#fff',
    padding: '5px 32px 5px 32px',
    boxShadow: '0px 0px 1px 0px #888888',
  },
}));
