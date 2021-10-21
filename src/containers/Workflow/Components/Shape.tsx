import React, { useState } from 'react';
import styled from 'styled-components';
import { Tooltip, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddCircle from '@material-ui/icons/AddCircle';

type Props = {
  type: 'rectangle' | 'oval' | 'circle';
  isDottedBorder?: boolean;
  content?: React.ReactNode;
  onBlockSelect?: (block: 'series' | 'parallel' | 'end') => void;
  isEndBlock?: boolean;
  withPlusIcon?: boolean;
};

const BLOCKS = ['Series', 'Parallel', 'End'];

const Shape: React.FC<Props> = ({
  type,
  isDottedBorder = false,
  content = '',
  onBlockSelect,
  isEndBlock,
  withPlusIcon = true,
}) => {
  return (
    <>
      <Container showStem={!isEndBlock}>
        {type === 'oval' && (
          <Oval isDottedBorder={isDottedBorder}>
            <div>{content}</div>
          </Oval>
        )}
        {type === 'rectangle' && (
          <Rectangle isDottedBorder={isDottedBorder}>
            <div>{content}</div>
            {/* <Stem isDottedBorder={isDottedBorder}>
            {withPlusIcon && <ActionWithTooltip onBlockSelect={onBlockSelect} />}
          </Stem> */}
          </Rectangle>
        )}
        {!isEndBlock && (
          <Stem isDottedBorder={isDottedBorder}>
            {withPlusIcon && <ActionWithTooltip onBlockSelect={onBlockSelect} />}
          </Stem>
        )}
      </Container>
    </>
  );
};

export default Shape;

const ActionWithTooltip = ({ onBlockSelect }) => {
  const classes = useStyles();
  const [showDialog, setShowDialog] = useState(false);
  return (
    <Tooltip
      interactive
      open={showDialog}
      disableHoverListener
      enterNextDelay={200}
      title={
        <div className={classes.tooltipTitle}>
          <div>Add block</div>
          {BLOCKS.map((each) => {
            return (
              <Button
                size="small"
                key={each}
                variant="outlined"
                className={classes.button}
                onClick={(e) => {
                  e.preventDefault();
                  onBlockSelect(each?.toLowerCase());
                  setShowDialog(false);
                }}
              >
                {each}
              </Button>
            );
          })}
        </div>
      }
      placement={'top'}
      classes={{ tooltip: classes.tooltip, arrow: classes.arrow }}
      color="#fff"
      arrow
    >
      <StyledAddCircle fontSize="small" onClick={() => setShowDialog(true)} />
    </Tooltip>
  );
};

const useStyles = makeStyles(() => ({
  tooltip: {
    fontSize: 12,
    color: '#000 !important',
    background: '#fff',
    padding: '0px 8px',
    marginTop: '8px',
    boxShadow: '0px 1px 2px rgba(10, 10, 10, 0.1), 0px 4px 12px rgba(10, 10, 10, 0.15)',
    borderRadius: 4,
  },
  arrow: {
    color: '#fff',
  },
  tooltipTitle: {
    textAlign: 'center',
    padding: '8px 0px 8px 0px',
    '& div': {
      borderBottom: '1px solid #eee',
      marginBottom: 8,
      paddingBottom: 8,
      fontWeight: 'bold',
    },
  },
  button: {
    margin: 4,
    height: 20,
    textTransform: 'none',
    zIndex: 1,
  },
}));

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  &:after {
    content: '';
    width: 2px;
    height: 50px;
    background: #000;
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -2px;
    display: ${(props) => (props.showStem ? 'block' : 'none')};
  }
`;

const Stem = styled.div`
  position: absolute;
  bottom: calc(0px - 50px);
  margin-left: 20px;
  z-index: 1;
`;

const Default = styled.div`
  background: transparent;
  text-align: center;
  border-style: ${(props) => (props.isDottedBorder ? 'dashed' : 'solid')};
  border-width: 1px;
  display: flex;
  align-items: center;
  min-height: 50px;
  justify-content: center;
`;
const Oval = styled(Default)`
  width: 100px;
  background: transparent;
  -moz-border-radius: 100px / 50px;
  -webkit-border-radius: 100px / 50px;
  border-radius: 100px / 50px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Rectangle = styled(Default)`
  min-width: 100px;
  padding: 12px;
  background-color: transparent;
`;
const StyledAddCircle = styled(AddCircle)`
  color: #fff;
  background: #0a0a0a;
  border-radius: 25px;
  cursor: pointer;
  margin: -22px;
`;
