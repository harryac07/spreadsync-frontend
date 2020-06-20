import React, { useState } from 'react';
import { startCase, toLower } from 'lodash';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Field from 'components/common/Field';
import Select from 'components/common/Select';

const CronGenerator = (props) => {
  const { onChange, defaultUnit = '', defaultValue = 0 } = props;
  const classes = useStyles();
  const [inputObj, handleInputChange] = useState({
    unit: defaultUnit, // 'hours',
    value: Number(defaultValue),
  });
  const [error, handleError] = useState({});
  const [frequencyOption, setFrequencyOption] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setFrequencyOption(newValue);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    handleInputChange({
      ...inputObj,
      [name]: value,
    });
    handleError({
      ...error,
      [name]: !value ? `${startCase(toLower(name))} is required` : null,
    });
    onChange(e);
  };
  const renderFixedRateForm = () => {
    return (
      <div className={classes.formWrapper}>
        <form>
          <Grid>
            <GridItem>
              <p className={classes.text}>Run every</p>
            </GridItem>

            <GridItem>
              <Field
                required={true}
                extrasmall={true}
                placeholder="Frequency amount"
                name="value"
                error={!!error.value || Number(inputObj.value) === 0}
                onChange={handleChange}
                style={{ display: 'inline-block' }}
                type={'number'}
                defaultValue={Number(inputObj.value)}
              />
            </GridItem>
            <GridItem>
              <Select
                required={true}
                name="unit"
                extrasmall={true}
                error={!!error.unit}
                placeholder="Unit"
                options={[
                  { key: 'Minutes', value: 'minutes', label: 'Minutes' },
                  { key: 'Hours', value: 'hours', label: 'Hours' },
                  { key: 'Days', value: 'days', label: 'Days' },
                  { key: 'Months', value: 'months', label: 'Months' },
                ]}
                onChange={handleChange}
                size="small"
                fullWidth={true}
                value={inputObj.unit}
              />
            </GridItem>
          </Grid>
        </form>
      </div>
    );
  };

  return (
    <div>
      <p className={classes.label}>Run frequency</p>
      <div className={classes.frequencyWrapper}>
        <Tabs value={frequencyOption} textColor="inherit" indicatorColor="primary" onChange={handleTabChange}>
          <Tab classes={{ wrapper: classes.tabTitle, textColorInherit: classes.tabTitleButton }} label="Fixed rate" />
          {/* <Tab
            disabled
            classes={{ wrapper: classes.tabTitle, textColorInherit: classes.tabTitleButton }}
            label="Schedule"
          /> */}
        </Tabs>
        {frequencyOption === 0 ? renderFixedRateForm() : renderFixedRateForm()}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  formWrapper: {
    margin: '10px auto',
  },
  text: {
    position: 'relative',
    top: 5,
  },
  label: {
    margin: '0px 0px 5px 0px',
    padding: 0,
    fontSize: 16,
  },
  frequencyWrapper: {
    border: '1px solid #bbb',
    padding: 20,
  },
  tabTitle: {
    display: 'block !important',
    '& span': {
      display: 'block !important',
      fontSize: 16,
    },
  },
  tabTitleButton: {
    paddingLeft: '0px',
    paddingRight: '0px',
    textAlign: 'left',
    textTransform: 'none',
    marginRight: 10,
  },
}));

CronGenerator.propTypes = {
  onChange: PropTypes.func.isRequired,
  defaultUnit: PropTypes.string,
  defaultValue: PropTypes.any,
};

export default CronGenerator;
// Every 30 mins - */30 * * * *
// Every hour at min 0 - 0 * * * *
// Daily  at 0:0 - 0 0 * * *
// Every mondays at 0: 0 - 0 0 * * 1
// At 0:0 on Sunday - 0 0 * * 0

const Grid = styled.div`
  display: inline-block;
  justify-content: space-around;
  align-center: center;
  width: 100%;
`;

const GridItem = styled.div`
  display: inline-block;
  margin-right: 30px;
  min-width: 100px;
`;
